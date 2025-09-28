
import React, { useState, useCallback, useRef } from 'react';
import { InputMethod, Todo } from '../types';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { processTextPrompt, processImagePrompt, getGrandmaWisdom } from '../services/geminiService';
import { TextIcon, MicIcon, UploadIcon, SendIcon } from './Icons';
import Loader from './Loader';

interface InputAreaProps {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setGrandmaMessage: React.Dispatch<React.SetStateAction<string>>;
}

const InputArea: React.FC<InputAreaProps> = ({ setTodos, setGrandmaMessage }) => {
  const [activeInput, setActiveInput] = useState<InputMethod>('text');
  const [textPrompt, setTextPrompt] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isListening, transcript, startListening, stopListening, hasRecognitionSupport } = useSpeechToText();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = useCallback(async () => {
    let prompt = '';
    let newTodos: Todo[] = [];
    setIsLoading(true);
    setGrandmaMessage('');

    try {
      if (activeInput === 'text') {
        prompt = textPrompt;
        if (prompt.trim()) {
          newTodos = await processTextPrompt(prompt);
        }
      } else if (activeInput === 'voice') {
        prompt = transcript;
        if (prompt.trim()) {
          newTodos = await processTextPrompt(prompt);
        }
      } else if (activeInput === 'image' && imageFile && imagePreview) {
        prompt = "An event poster or image was uploaded.";
        const base64Data = imagePreview.split(',')[1];
        newTodos = await processImagePrompt(base64Data, imageFile.type);
      }
      
      if (newTodos.length > 0) {
        setTodos(prev => [...prev, ...newTodos]);
        const wisdom = await getGrandmaWisdom(prompt);
        setGrandmaMessage(wisdom);
      } else if (prompt.trim()) {
         setGrandmaMessage("I looked, and I looked, but I couldn't make heads or tails of that. Try again, dear.");
      }
    } catch (error) {
        console.error("Submission failed:", error);
        setGrandmaMessage("Oh dear, the wires are crossed somewhere. Maybe try that again later.");
    } finally {
        setIsLoading(false);
        setTextPrompt('');
        setImageFile(null);
        setImagePreview(null);
    }
  }, [activeInput, textPrompt, transcript, imageFile, imagePreview, setTodos, setGrandmaMessage]);

  const handleTabClick = (method: InputMethod) => {
    setActiveInput(method);
    if (method === 'voice') {
      isListening ? stopListening() : startListening();
    } else if (method === 'image') {
      fileInputRef.current?.click();
    }
  }
  
  const tabs: { id: InputMethod; icon: JSX.Element; label: string }[] = [
    { id: 'text', icon: <TextIcon />, label: 'Text' },
    { id: 'voice', icon: <MicIcon />, label: 'Voice' },
    { id: 'image', icon: <UploadIcon />, label: 'Upload' },
  ];

  const getPlaceholder = () => {
    if (activeInput === 'voice') {
      if (isListening) return 'Listening...';
      if (transcript) return '';
      return "Click 'Voice' to start dictating...";
    }
    if (activeInput === 'image') {
      if (imageFile) return `Ready to process ${imageFile.name}`;
      return "Click 'Upload' to select an image...";
    }
    return "Go on, tell Grandma what you've got on your plate...";
  };

  const isSubmitDisabled = isLoading || (activeInput === 'text' && !textPrompt.trim()) || (activeInput === 'voice' && !transcript.trim()) || (activeInput === 'image' && !imageFile);

  return (
    <div className="p-8">
      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              disabled={isLoading}
              className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-colors duration-200 font-semibold text-sm disabled:opacity-50 ${
                activeInput === tab.id ? 'bg-violet-100 text-violet-800' : 'text-gray-600 hover:bg-gray-100'
              } ${isListening && tab.id === 'voice' ? 'bg-red-100 text-red-700 animate-pulse' : ''}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <hr className="my-4" />
        
        {hasRecognitionSupport === false && activeInput === 'voice' &&
            <p className="text-red-500 text-sm mb-2 -mt-2">Sorry, your browser doesn't support voice recognition.</p>
        }

        {imagePreview && activeInput === 'image' && (
          <div className="mb-4 p-2 border border-dashed border-gray-300 rounded-lg bg-gray-50">
              <img src={imagePreview} alt="Preview" className="max-h-32 w-auto mx-auto rounded-md" />
          </div>
        )}
        
        <div className="relative">
          <textarea
            value={activeInput === 'text' ? textPrompt : (activeInput === 'voice' ? transcript : '')}
            onChange={(e) => activeInput === 'text' && setTextPrompt(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full p-3 pr-16 text-base text-gray-800 bg-gray-50 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition resize-none placeholder:text-gray-500"
            rows={2}
            disabled={isLoading || activeInput !== 'text'}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!isSubmitDisabled) handleSubmit();
              }
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-slate-700 disabled:bg-gray-400 disabled:scale-100 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
            aria-label="Submit"
          >
            <SendIcon />
          </button>
        </div>
        
        <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="hidden" disabled={isLoading} />
        
        {isLoading && <div className="mt-4"><Loader /></div>}
      </div>
    </div>
  );
};

export default InputArea;

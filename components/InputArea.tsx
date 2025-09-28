

import React, { useState, useCallback, useRef } from 'react';
import { InputMethod, Todo } from '../types';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { processTextPrompt, processImagePrompt, getGrandmaWisdom } from '../services/geminiService';
import { TextIcon, MicIcon, UploadIcon, SendIcon } from './Icons';
import Loader from './Loader';

interface InputAreaProps {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setGrandmaMessage: React.Dispatch<React.SetStateAction<string>>;
}

const InputArea: React.FC<InputAreaProps> = ({ todos, setTodos, setGrandmaMessage }) => {
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
        const existingTexts = new Set(todos.map(t => t.text.trim().toLowerCase()));
        const uniqueNewTodos = newTodos.filter(
          newTodo => !existingTexts.has(newTodo.text.trim().toLowerCase())
        );

        if (uniqueNewTodos.length > 0) {
            setTodos(prev => [...prev, ...uniqueNewTodos]);
            const wisdom = await getGrandmaWisdom(prompt);
            setGrandmaMessage(wisdom);
        } else {
            setGrandmaMessage("Looks like you've already got that on your list, sweetie. Are you trying to pull a fast one on your old grandma?");
        }
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
  }, [activeInput, textPrompt, transcript, imageFile, imagePreview, todos, setTodos, setGrandmaMessage]);

  const handleTabClick = (method: InputMethod) => {
    setActiveInput(method);
    if (method === 'voice') {
      isListening ? stopListening() : startListening();
    } else if (method === 'image') {
      fileInputRef.current?.click();
    }
  }
  
  // Fix: Use React.ReactElement instead of JSX.Element to resolve namespace issue.
  const tabs: { id: InputMethod; icon: React.ReactElement; label: string }[] = [
    { id: 'text', icon: <TextIcon />, label: 'Text' },
    { id: 'voice', icon: <MicIcon />, label: 'Voice' },
    { id: 'image', icon: <UploadIcon />, label: 'Upload' },
  ];

  const getPlaceholder = () => {
    if (activeInput === 'voice') {
      if (isListening) return 'Go on, I\'m listening...';
      if (transcript) return '';
      return "Click 'Voice' again to start dictating...";
    }
    if (activeInput === 'image') {
      if (imageFile) return `Ready to process ${imageFile.name}`;
      return "Click 'Upload' to select an image...";
    }
    return "Go on, tell Grandma what you've got on your plate...";
  };

  const isSubmitDisabled = isLoading || (activeInput === 'text' && !textPrompt.trim()) || (activeInput === 'voice' && !transcript.trim()) || (activeInput === 'image' && !imageFile);

  return (
    <div className="px-8 pt-4 pb-8">
      <div className="bg-[#f4e9d8] p-4 rounded-lg border border-[#dcd3c4] shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="flex items-center border-b border-[#dcd3c4] pb-3 mb-4 gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              disabled={isLoading}
              className={`flex items-center gap-2 py-1 px-2 transition-all duration-200 font-semibold text-base disabled:opacity-50 border-b-4 ${
                activeInput === tab.id ? 'border-[var(--color-primary)] text-[var(--color-text-base)]' : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-base)]'
              } ${isListening && tab.id === 'voice' ? 'text-[var(--color-accent-red)] animate-pulse border-[var(--color-accent-red)]' : ''}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {hasRecognitionSupport === false && activeInput === 'voice' &&
            <p className="text-red-500 text-sm mb-2">Sorry, your browser doesn't support voice recognition.</p>
        }

        {imagePreview && activeInput === 'image' && (
          <div className="mb-4 p-2 border border-dashed border-[#dcd3c4] rounded-lg bg-[#efe8da]">
              <img src={imagePreview} alt="Preview" className="max-h-32 w-auto mx-auto rounded-md" />
          </div>
        )}
        
        <div className="relative">
          <textarea
            value={activeInput === 'text' ? textPrompt : (activeInput === 'voice' ? transcript : '')}
            onChange={(e) => activeInput === 'text' && setTextPrompt(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full p-3 pr-16 text-2xl font-handwritten text-[var(--color-text-base)] bg-transparent rounded-lg border-none focus:ring-0 transition resize-none placeholder:text-[var(--color-text-muted)] placeholder:font-sans placeholder:text-base"
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
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-[var(--color-primary)] text-[var(--color-surface)] rounded-full w-10 h-10 flex items-center justify-center hover:bg-[var(--color-primary-dark)] disabled:bg-gray-400 disabled:scale-100 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
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
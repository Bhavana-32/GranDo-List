import React, { useEffect } from 'react';
import { QuoteIcon } from './Icons';

interface GrandmaWisdomProps {
  message: string;
}

const GrandmaWisdom: React.FC<GrandmaWisdomProps> = ({ message }) => {
  useEffect(() => {
    if (message && 'speechSynthesis' in window) {
      // Cancel any previous speech to prevent overlap
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(message);

      const setVoiceAndSpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        // A list of preferred voice names that might sound more mature or fitting
        const preferredVoices = [
          'Google UK English Female',
          'Microsoft Zira Desktop - English (United States)',
          'Samantha',
          'Karen'
        ];
        
        let selectedVoice = voices.find(voice => preferredVoices.includes(voice.name));
        
        // Fallback to the first available English female voice if preferred ones aren't found
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang.startsWith('en-') && voice.name.includes('Female'));
        }
        
        // Final fallback to any English voice
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang.startsWith('en-'));
        }

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
        
        // Adjust speech properties to sound more like a "warning reminder"
        utterance.pitch = 0.9; // Slightly lower pitch
        utterance.rate = 0.95; // Slightly slower speech rate
        window.speechSynthesis.speak(utterance);
      };

      // Voices are often loaded asynchronously.
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
      } else {
        setVoiceAndSpeak();
      }
    }
    
    // Cleanup function to cancel speech if the component unmounts while speaking
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [message]);

  if (!message) return null;

  return (
    <div className="px-8 my-4">
        <div className="bg-[#fde4e4] text-[#5c2a2a] p-4 shadow-lg animate-slideInLeft transform -rotate-2 w-full max-w-md mx-auto">
          <div className="flex items-start">
            <div className="pt-1 text-[#e5b3b3]">
              <QuoteIcon />
            </div>
            <div className="ml-4">
              <p className="font-bold font-serif text-lg">A "helpful" reminder:</p>
              <p className="text-md italic font-serif mt-1">"{message}"</p>
            </div>
          </div>
        </div>
    </div>
  );
};

export default GrandmaWisdom;

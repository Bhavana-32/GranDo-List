import React from 'react';
import { QuoteIcon } from './Icons';

interface GrandmaWisdomProps {
  message: string;
}

const GrandmaWisdom: React.FC<GrandmaWisdomProps> = ({ message }) => {
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
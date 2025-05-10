import React from 'react';
import { Sparkles, Save } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const StrategyControls = () => {
  const { generateAIStrategy, saveStrategy } = useAppContext();
  
  return (
    <div className="flex flex-row gap-4">
      <button
        onClick={generateAIStrategy}
        className="flex-1 py-3 px-6 bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold rounded-lg flex items-center justify-center transition-colors duration-200 border border-amber-300"
      >
        <Sparkles className="w-5 h-5 mr-2 text-amber-500" />
        AI generated automatically
      </button>
      
      <button
        onClick={saveStrategy}
        className="w-1/3 py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg flex items-center justify-center transition-colors duration-200"
      >
        <Save className="w-5 h-5 mr-2" />
        Save
      </button>
    </div>
  );
};
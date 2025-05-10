import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const CurrentPrice = () => {
  const { poolData } = useAppContext();
  
  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <TrendingUp className="w-5 h-5 text-blue-500 mr-2" />
        <h2 className="text-lg font-semibold">Current Price</h2>
      </div>
      
      <div className="text-3xl font-bold text-center py-4 border-2 border-blue-100 bg-blue-50 rounded-lg">
        {poolData.currentPrice.toFixed(4)} <span className="text-gray-500 text-xl">TRUMP per SOL</span>
      </div>
    </div>
  );
};
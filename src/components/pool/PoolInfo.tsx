import React from 'react';
import { CircleDollarSign, BarChart, Percent } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const PoolInfo = () => {
  const { poolData } = useAppContext();
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="grid grid-cols-1 divide-y divide-gray-200">
        <div className="p-3 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <CircleDollarSign className="w-4 h-4 text-blue-500 mr-2" />
              <span className="text-sm">Liquidity</span>
            </div>
            <span className="font-semibold">{formatNumber(poolData.liquidity)}</span>
          </div>
        </div>
        
        <div className="p-3 bg-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <BarChart className="w-4 h-4 text-purple-500 mr-2" />
              <span className="text-sm">Volume 24H</span>
            </div>
            <span className="font-semibold">{formatNumber(poolData.volume24h)}</span>
          </div>
        </div>
        
        <div className="p-3 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Percent className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-sm">Fees 24H</span>
            </div>
            <span className="font-semibold">{formatNumber(poolData.fees24h)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
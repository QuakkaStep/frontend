import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const CurrentPrice = () => {
  const { poolData, strategy } = useAppContext();
  const minPrice = strategy.minPrice;
  const maxPrice = strategy.maxPrice;
  const currentPrice = poolData.currentPrice;

  // 计算bar上各价格的百分比
  let minPercent = 0, maxPercent = 100, pricePercent = 0;
  if (minPrice > 0 && maxPrice > 0 && maxPrice > minPrice) {
    minPercent = 0;
    maxPercent = 100;
    pricePercent = ((currentPrice - minPrice) / (maxPrice - minPrice)) * 100;
    pricePercent = Math.max(0, Math.min(100, pricePercent));
  } else {
    // fallback: 以当前价格为中心，±10%
    const min = currentPrice * 0.9;
    const max = currentPrice * 1.1;
    minPercent = 0;
    maxPercent = 100;
    pricePercent = ((currentPrice - min) / (max - min)) * 100;
    pricePercent = Math.max(0, Math.min(100, pricePercent));
  }

  return (
    <div className="w-full flex flex-row items-center gap-6 min-h-[80px]">
      {/* 左侧价格信息 */}
      <div className="flex flex-col items-end justify-between h-full min-w-[120px] gap-2">
        {minPrice > 0 && (
          <div className="text-xs text-red-600 font-semibold">Min<br />{minPrice.toFixed(4)}</div>
        )}
        <div className="flex items-center gap-1">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          <span className="text-base font-bold text-blue-700">{currentPrice.toFixed(4)}</span>
        </div>
        {maxPrice > 0 && (
          <div className="text-xs text-green-600 font-semibold">Max<br />{maxPrice.toFixed(4)}</div>
        )}
      </div>
      {/* 黄色bar */}
      <div className="relative flex-1 h-8 bg-yellow-100 rounded-lg border border-yellow-300 flex items-center">
        {/* 当前价格点 */}
        <div
          className="absolute z-20 flex flex-col items-center"
          style={{ left: `calc(${pricePercent}% - 12px)` }}
        >
          <div className="w-3 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-md" />
          <span className="text-xs font-bold text-blue-700 mt-1 whitespace-nowrap">{currentPrice.toFixed(4)}</span>
        </div>
        {/* min/max 标记（可选，已在左侧显示） */}
      </div>
    </div>
  );
};
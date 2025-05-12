import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { BarChart3 } from 'lucide-react';
import { fetchWithHeaders } from '../../utils/api';

const RAYDIUM_API = import.meta.env.VITE_RAYDIUM_API;
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const POOL_MONITOR_API = `/pool-monitoring/info`;
const POOL_ID = import.meta.env.VITE_POOL_ID;

interface Tick {
  price: string | number;
  liquidity: string;
  tick: number;
}

export const PriceRange = () => {
  const [ticks, setTicks] = useState<Tick[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { strategy } = useAppContext();

  useEffect(() => {

    fetch(`${RAYDIUM_API}?id=${POOL_ID}`)
      .then(res => {
        if (!res.ok) throw new Error('Raydium API request failed');
        return res.json();
      })
      .then(data => {
        if (data?.success && Array.isArray(data.data.line)) {
          setTicks(data.data.line.sort((a: Tick, b: Tick) => Number(a.price) - Number(b.price)));
        } else {
          setErrorMsg('Raydium API: No data returned');
        }
      })
      .catch(() => setErrorMsg('Raydium API: Failed to fetch data'));


    fetchWithHeaders(`${POOL_MONITOR_API}?poolId=${POOL_ID}`)
      .then(data => {
        if (data?.statusCode === 200) {
          setCurrentPrice(data.data.price);
        } else {
          setErrorMsg('Pool monitor API: No data returned');
        }
      })
      .catch(() => setErrorMsg('Pool monitor API: Failed to fetch data'));

  }, []);

  // min/max price from context
  const minPrice = strategy.minPrice;
  const maxPrice = strategy.maxPrice;

  // 计算价格条的显示范围，确保minPrice/maxPrice都能展示
  let barMin = 0, barMax = 1;
  if (currentPrice && ticks.length > 0) {
    // 默认用当前价格±30%
    let min = currentPrice * 0.7;
    let max = currentPrice * 1.3;
    // 如果minPrice/maxPrice超出默认范围，则扩展
    if (minPrice > 0 && minPrice < min) min = minPrice * 0.98;
    if (maxPrice > 0 && maxPrice > max) max = maxPrice * 1.02;
    // 取ticks中最接近的边界
    const tickMin = Math.min(...ticks.map(t => Number(t.price)));
    const tickMax = Math.max(...ticks.map(t => Number(t.price)));
    barMin = Math.max(tickMin, min);
    barMax = Math.min(tickMax, max);
    // 但如果minPrice/maxPrice还在外面，直接用minPrice/maxPrice
    if (minPrice > 0 && minPrice < barMin) barMin = minPrice * 0.98;
    if (maxPrice > 0 && maxPrice > barMax) barMax = maxPrice * 1.02;
  }

  // 生成刻度
  let displayTicks: number[] = [];
  if (barMax > barMin) {
    const tickCount = 12;
    const step = (barMax - barMin) / (tickCount - 1);
    displayTicks = Array.from({ length: tickCount }, (_, i) => barMin + i * step);
  }

  // 当前价格在bar上的百分比
  let pricePercent = 0;
  if (currentPrice && barMax > barMin) {
    pricePercent = ((currentPrice - barMin) / (barMax - barMin)) * 100;
    pricePercent = Math.max(0, Math.min(100, pricePercent));
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* 标题和描述 */}
      <div className="w-full mb-4 flex items-center">
        <BarChart3 size={22} className="mr-2 text-blue-600" />
        <h3 className="text-lg font-semibold">Price Range Configuration</h3>
      </div>
      {errorMsg ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {errorMsg}
        </div>
      ) : (
        <div className="flex flex-col items-center w-full h-full select-none relative">
          {/* 横向bar */}
          <div className="relative w-full h-12 bg-yellow-100 rounded-lg border border-yellow-300 flex items-center mt-4 mb-2" style={{ minWidth: 0 }}>
            {/* 当前价格点 */}
            {currentPrice && barMax > barMin && (
              <div
                className="absolute z-20 flex flex-col items-center"
                style={{ left: `calc(${pricePercent}% - 18px)` }}
              >
                <div className="w-5 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-md" />
                <span className="text-base font-extrabold text-blue-700 mt-1 whitespace-nowrap drop-shadow">{currentPrice.toFixed(4)}</span>
              </div>
            )}
            {/* min/max price 标记 */}
            {minPrice > 0 && barMax > barMin && (
              <div
                className="absolute flex flex-col items-center"
                style={{ left: `${((minPrice - barMin) / (barMax - barMin)) * 100}%` }}
              >
                <span className="px-2 py-1 rounded-lg bg-red-100 text-red-700 font-bold text-xs shadow min-w-[56px] text-center mb-1">Min</span>
                <span className="text-xs font-mono text-red-600 bg-white rounded px-1 shadow-sm border border-red-100">{minPrice.toFixed(4)}</span>
              </div>
            )}
            {maxPrice > 0 && barMax > barMin && (
              <div
                className="absolute flex flex-col items-center"
                style={{ left: `${((maxPrice - barMin) / (barMax - barMin)) * 100}%` }}
              >
                <span className="px-2 py-1 rounded-lg bg-green-100 text-green-700 font-bold text-xs shadow min-w-[56px] text-center mb-1">Max</span>
                <span className="text-xs font-mono text-green-600 bg-white rounded px-1 shadow-sm border border-green-100">{maxPrice.toFixed(4)}</span>
              </div>
            )}
          </div>
          {/* 横向价格刻度 */}
          <div className="flex flex-row justify-between w-full mt-2">
            {displayTicks.map((tick, i) => (
              <div key={i} className="flex flex-col items-center w-1/12">
                <span className="text-xs text-gray-500">{tick.toFixed(3)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
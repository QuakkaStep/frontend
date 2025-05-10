import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const RAYDIUM_API = 'https://api-v3.raydium.io/pools/line/position?id=GQsPr4RJk9AZkkfWHud7v4MtotcxhaYzZHdsPCg9vNvW';
const POOL_MONITOR_API = 'http://localhost:3002/pool-monitoring/info?poolId=GQsPr4RJk9AZkkfWHud7v4MtotcxhaYzZHdsPCg9vNvW';

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

  useEffect(() => {
    fetch(RAYDIUM_API)
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
    fetch(POOL_MONITOR_API)
      .then(res => {
        if (!res.ok) throw new Error('Pool monitor API request failed');
        return res.json();
      })
      .then(data => {
        if (data?.statusCode === 200) {
          setCurrentPrice(data.data.price);
        } else {
          setErrorMsg('Pool monitor API: No data returned');
        }
      })
      .catch(() => setErrorMsg('Pool monitor API: Failed to fetch data'));
  }, []);

  // 只显示当前价格前后20%的价格范围内的刻度
  let filteredTicks: Tick[] = [];
  if (currentPrice && ticks.length > 0) {
    const min = currentPrice * 0.8;
    const max = currentPrice * 1.2;
    filteredTicks = ticks.filter((t: Tick) => Number(t.price) >= min && Number(t.price) <= max);
  }
  // 只显示部分刻度，避免太密集
  const displayTicks: Tick[] = filteredTicks.length > 0 ? filteredTicks.filter((_, i) => i % Math.ceil(filteredTicks.length / 20) === 0) : [];

  // 竖直方向的bar高度由父容器撑开
  let minPercent = 0, maxPercent = 100, pricePercent = 0;
  let minPrice: number | null = null, maxPrice: number | null = null;
  if (currentPrice && filteredTicks.length > 1) {
    minPrice = currentPrice * 0.95;
    maxPrice = currentPrice * 1.05;
    const minBar = Number(filteredTicks[0].price);
    const maxBar = Number(filteredTicks[filteredTicks.length - 1].price);
    minPercent = ((minPrice - minBar) / (maxBar - minBar)) * 100;
    maxPercent = ((maxPrice - minBar) / (maxBar - minBar)) * 100;
    pricePercent = ((currentPrice - minBar) / (maxBar - minBar)) * 100;
    minPercent = Math.max(0, Math.min(100, minPercent));
    maxPercent = Math.max(0, Math.min(100, maxPercent));
    pricePercent = Math.max(0, Math.min(100, pricePercent));
  }

  return (
    <div className="mt-8 flex flex-col h-[calc(100vh-220px)] min-h-64">
      <h3 className="text-lg font-semibold mb-4">Price Range Configuration</h3>
      {errorMsg ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {errorMsg}
        </div>
      ) : (
        <div className="flex-1 flex flex-row items-stretch w-full h-full select-none relative">
          {/* 横向箭头（min） */}
          {minPrice && filteredTicks.length > 1 && (
            <div className="absolute flex flex-row items-center" style={{ left: '100%', top: `calc(${100 - minPercent}% - 18px)` }}>
              <ArrowLeft className="w-7 h-7 text-red-600" />
              <span className="text-xs text-red-600 ml-1">Min<br/>${minPrice.toFixed(4)}</span>
            </div>
          )}
          {/* 横向箭头（max） */}
          {maxPrice && filteredTicks.length > 1 && (
            <div className="absolute flex flex-row items-center" style={{ left: '100%', top: `calc(${100 - maxPercent}% - 18px)` }}>
              <ArrowLeft className="w-7 h-7 text-green-600" />
              <span className="text-xs text-green-600 ml-1">Max<br/>${maxPrice.toFixed(4)}</span>
            </div>
          )}
          {/* 横向箭头（当前价格） */}
          {currentPrice && filteredTicks.length > 1 && (
            <div className="absolute flex flex-row items-center z-20" style={{ left: '100%', top: `calc(${100 - pricePercent}% - 22px)` }}>
              <ArrowLeft className="w-10 h-10 text-blue-600" />
              <span className="text-base text-blue-600 font-bold ml-1">Current<br/>${currentPrice.toFixed(4)}</span>
            </div>
          )}
          {/* 竖直刻度条，靠左且高度100%填满 */}
          <div className="relative flex-1 min-w-[90px] max-w-[120px] bg-yellow-100 rounded-lg border border-yellow-300 flex flex-col items-center self-stretch h-full" style={{alignItems:'flex-start'}}>
            {/* 刻度线 */}
            {displayTicks.map((tick, i) => {
              const percent = ((Number(tick.price) - Number(filteredTicks[0]?.price)) / (Number(filteredTicks[filteredTicks.length - 1]?.price) - Number(filteredTicks[0]?.price))) * 100;
              return (
                <div
                  key={i}
                  className="absolute left-0 w-full h-0.5 bg-yellow-300"
                  style={{ bottom: `${percent}%` }}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* tooltip */}
                  {hoveredIdx === i && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-white border border-gray-300 rounded px-2 py-1 text-xs shadow z-10 whitespace-nowrap">
                      Price: {Number(tick.price).toPrecision(6)}<br />
                      Liquidity: {tick.liquidity}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* 价格值列表（竖直方向右侧） */}
          <div className="flex flex-col justify-between h-full ml-6 py-2 w-24">
            {displayTicks.slice().reverse().map((tick, i) => (
              <span key={i} className="text-xs text-gray-500">${Number(tick.price).toPrecision(4)}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
import React, { useMemo, useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../../context/AppContext';
import { BarChart3 } from 'lucide-react';
import BreathingLight from '../BreathingLight';

const TRUMP_PRICE_API = import.meta.env.VITE_TRUMP_PRICE_API;

export const StrategyChart = () => {
  const { strategy, poolData } = useAppContext();
  const [trumpUsd, setTrumpUsd] = useState<number>(0);

  useEffect(() => {
    fetch(`${TRUMP_PRICE_API}?mints=6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN`)
      .then(res => res.json())
      .then(data => {
        const price = Number(data?.data?.['6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN']);
        if (!isNaN(price)) setTrumpUsd(price);
      });
  }, []);

  // 生成30次投入，每次价格为上一个价格*（1+step%+波动），Y轴为TRUMP价格，tooltip显示本次投入
  const chartData = useMemo(() => {
    if (!strategy.amountPerStep || !strategy.step || !poolData.currentPrice) return [];
    let lastPrice = poolData.currentPrice;
    const stepRatio = strategy.step / 100;
    return Array.from({ length: 30 }, (_, i) => {
      // 每次投入数量上下浮动20%
      const investFluctuation = 1 + (Math.random() * 0.4 - 0.2); // 0.8~1.2
      const thisInvest = strategy.amountPerStep * investFluctuation;
      if (i > 0) {
        lastPrice = lastPrice * (1 + stepRatio);
        const fluctuation = 1 + (Math.random() * 0.1 - 0.05); // 0.95~1.05
        lastPrice = lastPrice * fluctuation;
      }
      return {
        step: i + 1,
        price: lastPrice,
        trumpInvested: thisInvest,
      };
    });
  }, [strategy, poolData.currentPrice]);

  return (
    <div className="h-64 md:h-80 flex flex-col">
      <div className="flex items-center mb-4">
        <BreathingLight size={20} />
        <BarChart3 size={24} className="mx-2 text-blue-600" />
        <h2 className="text-lg font-semibold">AI automatically adds liquidity in a step-by-step manner</h2>
      </div>
      <div className="flex flex-row h-full w-full">
        {/* 左侧参数卡片 */}
        <div className="flex flex-col gap-4 justify-center items-stretch w-36 min-w-[120px]">
          <div className="bg-gradient-to-b from-blue-50 to-white p-4 rounded-xl border border-blue-200 shadow flex flex-col items-center">
            <span className="uppercase text-[11px] tracking-wider text-blue-700 font-bold mb-1 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-1"></span>Step
            </span>
            <span className="text-3xl font-extrabold text-blue-700 drop-shadow-sm leading-tight mb-1">{strategy.step || 0}<span className="text-base font-bold align-top">%</span></span>
          </div>
          <div className="bg-gradient-to-b from-amber-50 to-white p-4 rounded-xl border border-amber-200 shadow flex flex-col items-center">
            <span className="uppercase text-[11px] tracking-wider text-amber-700 font-bold mb-1 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1"></span>Amount per step
            </span>
            <span className="text-3xl font-extrabold text-amber-600 drop-shadow-sm leading-tight mb-1">{strategy.amountPerStep || 0} <span className="text-base font-bold">TRUMP</span></span>
          </div>
        </div>
        {/* 右侧折线图 */}
        <div className="flex-1 h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 20,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="step"
                label={{
                  value: 'Times',
                  position: 'insideBottomRight',
                  offset: -5
                }}
              />
              <YAxis
                label={{
                  value: 'TRUMP Price',
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }}
                tickFormatter={v => `$${v.toFixed(4)}`}
              />
              <Tooltip
                formatter={(_value, _name, props) => {
                  const { payload } = props;
                  return [
                    `$${payload?.price?.toFixed(4)}`,
                    `TRUMP Price`
                  ];
                }}
                labelFormatter={(_label, props) => {
                  const { payload } = props[0] || {};
                  return `Step ${payload?.step || ''} | Invested: ${(payload?.trumpInvested || 0).toFixed(4)} TRUMP`;
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3, fill: '#3b82f6' }}
                activeDot={{ r: 5, stroke: '#1e40af', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
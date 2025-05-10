import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../../context/AppContext';

export const StrategyChart = () => {
  const { strategy } = useAppContext();
  
  // Generate chart data based on the strategy settings
  const chartData = useMemo(() => {
    const steps = Math.ceil((strategy.maxPrice - strategy.minPrice) / (strategy.minPrice * (strategy.step / 100)));
    let cumulativeTrump = 0;
    
    return Array.from({ length: steps + 1 }, (_, i) => {
      cumulativeTrump += strategy.amountPerStep;
      return {
        step: i,
        cumulativeTrump,
        price: strategy.minPrice + (i * strategy.minPrice * (strategy.step / 100)),
      };
    });
  }, [strategy]);
  
  return (
    <div className="h-64 md:h-80">
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
              value: 'step', 
              position: 'insideBottomRight', 
              offset: -5 
            }}
          />
          <YAxis 
            label={{ 
              value: 'position', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            }}
          />
          <Tooltip 
            formatter={(value, name) => [
              name === 'cumulativeTrump' 
                ? `${Number(value).toFixed(4)} TRUMP` 
                : `${Number(value).toFixed(4)}`,
              name === 'cumulativeTrump' ? 'Trump Amount' : name
            ]}
            labelFormatter={(value) => `Step ${value}`}
          />
          <Line 
            type="monotone" 
            dataKey="cumulativeTrump" 
            stroke="#3b82f6" 
            strokeWidth={2} 
            dot={{ r: 3, fill: '#3b82f6' }} 
            activeDot={{ r: 5, stroke: '#1e40af', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-gray-100 p-3 rounded-lg text-center">
          <p className="text-sm text-gray-600">Step</p>
          <p className="font-semibold">{strategy.step}%</p>
        </div>
        <div className="bg-gray-100 p-3 rounded-lg text-center">
          <p className="text-sm text-gray-600">Amount per step</p>
          <p className="font-semibold">{strategy.amountPerStep} TRUMP</p>
        </div>
      </div>
    </div>
  );
};
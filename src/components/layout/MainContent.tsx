import React from 'react';
import { CurrentPrice } from '../strategy/CurrentPrice';
import { PriceRange } from '../strategy/PriceRange';
import { StrategyChart } from '../strategy/StrategyChart';
import { StrategyControls } from '../strategy/StrategyControls';

export const MainContent = () => {
  return (
    <div className="flex-1 p-6 overflow-y-auto h-screen">
      <div className="w-full h-full flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 flex-1">
          <div className="bg-white rounded-lg shadow p-6 h-full">
            <CurrentPrice />
            <PriceRange />
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 h-full">
            <h2 className="text-lg font-semibold mb-4">Strategy Chart</h2>
            <StrategyChart />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <StrategyControls />
        </div>
      </div>
    </div>
  );
};
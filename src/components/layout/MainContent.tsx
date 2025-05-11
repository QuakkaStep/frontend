import React from 'react';
import { CurrentPrice } from '../strategy/CurrentPrice';
import { StrategyChart } from '../strategy/StrategyChart';
import { StrategyControls } from '../strategy/StrategyControls';
import { LiquidityHistory } from '../wallet/LiquidityHistory';
import { PriceRange } from '../strategy/PriceRange';

export const MainContent = () => {
  return (
    <div className="flex-1 p-6 w-full h-full flex flex-row gap-6">
      {/* Left: (empty, or for future use) */}
      <div className="hidden md:block w-0" />
      {/* Right: main modules */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        <div className="flex flex-col gap-6 flex-1 h-full min-h-0">
          <div className="bg-white rounded-lg shadow p-6 flex flex-col min-w-0 h-fit">
            <LiquidityHistory />
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col min-w-0 h-fit">
            <PriceRange />
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col min-w-0 flex-1 h-0">
            <StrategyChart />
          </div>
        </div>
        <div className="mt-8 flex justify-center w-full">
          <div className="w-full">
            <StrategyControls />
          </div>
        </div>
      </div>
    </div>
  );
};
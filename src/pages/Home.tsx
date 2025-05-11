import React from 'react';
import { useAppContext } from '../context/AppContext';
import BreathingLight from '../components/BreathingLight';
import PriceChart from '../components/PriceChart';

const Home: React.FC = () => {
  const { poolData, strategy } = useAppContext();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <BreathingLight size={24} />
          <span className="ml-2">xAIcxp automatically adds liquidity in a step-by-step manner</span>
        </h2>
        <div className="bg-white rounded-lg shadow p-6">
          <PriceChart
            currentPrice={poolData.currentPrice}
            minPrice={strategy.minPrice}
            maxPrice={strategy.maxPrice}
            step={strategy.step}
            amountPerStep={strategy.amountPerStep}
          />
        </div>
      </div>
      {/* 其他内容 */}
    </div>
  );
};

export default Home; 
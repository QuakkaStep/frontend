import React from 'react';
import { DollarSign, TrendingUp, Coins, History, ArrowRight, Plus } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const Portfolio = () => {
  const { portfolio, wallet, liquidityHistory } = useAppContext();

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const TokenAmount = ({ amount, symbol }: { amount: string; symbol: string }) => (
    <div className="flex items-center space-x-2">
      <div className="font-mono text-sm">{parseFloat(amount).toFixed(4)}</div>
      <div className="text-xs font-medium px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
        {symbol}
      </div>
    </div>
  );

  if (!wallet) {
    return (
      <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
        Connect a wallet to view portfolio
      </div>
    );
  }

  if (portfolio.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
        No portfolio data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="flex items-center mb-1">
            <DollarSign className="w-4 h-4 text-blue-500 mr-1" />
            <span className="text-xs text-gray-500">Total Value</span>
          </div>
          <p className="font-semibold">{formatNumber(portfolio[0].userTotalValueUSD)}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="flex items-center mb-1">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-xs text-gray-500">APR</span>
          </div>
          <p className="font-semibold">{portfolio[0].userApr.toFixed(2)}%</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="flex items-center mb-1">
            <Coins className="w-4 h-4 text-amber-500 mr-1" />
            <span className="text-xs text-gray-500">Daily Fee</span>
          </div>
          <p className="font-semibold">{formatNumber(portfolio[0].expectedDailyFee)}</p>
        </div>
      </div>
    </div>
  );
};
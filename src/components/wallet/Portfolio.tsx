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
      
      <div className="mt-6">
        <div className="flex items-center space-x-2 mb-4">
          <History className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Liquidity History</h3>
        </div>
        
        {liquidityHistory.length > 0 ? (
          <div className="space-y-4">
            {liquidityHistory.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500 mb-3">
                  {formatDate(item.createdAt)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                        1
                      </div>
                      <ArrowRight className="w-4 h-4 text-blue-500" />
                      <div className="text-sm font-medium text-blue-700">Swap</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <TokenAmount amount={item.swapTokenAmount} symbol="TRUMP" />
                        <ArrowRight className="w-4 h-4 text-blue-400" />
                        <TokenAmount amount={item.swapSolAmount} symbol="SOL" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 text-sm font-medium">
                        2
                      </div>
                      <Plus className="w-4 h-4 text-green-500" />
                      <div className="text-sm font-medium text-green-700">Add Liquidity</div>
                    </div>
                    <div className="space-y-2">
                      <TokenAmount amount={item.addLiquidityTokenAmount} symbol="TRUMP" />
                      <TokenAmount amount={item.addLiquiditySolAmount} symbol="SOL" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
            No liquidity history available
          </div>
        )}
      </div>
    </div>
  );
};
import React from 'react';
import { History, ArrowRight, Plus } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const TokenAmount = ({ amount, symbol, color }: { amount: string; symbol: string; color: string }) => (
  <div className={`flex flex-col items-center px-3 py-2 rounded-xl bg-${color}-50`}>
    <div className={`text-2xl font-extrabold text-${color}-700 font-mono`}>{parseFloat(amount).toFixed(4)}</div>
    <div className={`text-xs font-semibold text-${color}-600 mt-1`}>{symbol}</div>
  </div>
);

export const LiquidityHistory = () => {
  const { liquidityHistory, wallet } = useAppContext();

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <History className="text-blue-500" size={22} />
        <h3 className="text-xl font-bold tracking-wide">Liquidity History</h3>
      </div>
      {(!wallet || liquidityHistory.length === 0) ? (
        <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-2xl border border-gray-100">
          No liquidity history available
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {liquidityHistory.map((item, idx) => (
            <div key={item.id} className="relative flex gap-5 bg-white rounded-2xl shadow-lg border border-gray-50 p-6 hover:shadow-2xl transition group">
              {/* Timeline/steps */}
              <div className="flex flex-col items-center mr-2">
                <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-base mb-2 shadow">1</div>
                <div className="flex-1 w-1 bg-gradient-to-b from-blue-200 to-green-200" />
                <div className="w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-base mt-2 shadow">2</div>
              </div>
              {/* Main content: two steps */}
              <div className="flex-1 flex flex-col gap-6">
                {/* Step 1: Swap */}
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 shadow-sm">Swap</span>
                    <span className="text-xs text-gray-400 font-mono">{formatDate(item.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <TokenAmount amount={item.swapTokenAmount} symbol="TRUMP" color="blue" />
                    <ArrowRight className="w-5 h-5 text-blue-400 mx-2" />
                    <TokenAmount amount={item.swapSolAmount} symbol="SOL" color="amber" />
                  </div>
                </div>
                {/* Step 2: Add Liquidity */}
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 shadow-sm">Add Liquidity</span>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <TokenAmount amount={item.addLiquidityTokenAmount} symbol="TRUMP" color="green" />
                    <Plus className="w-5 h-5 text-green-400 mx-2" />
                    <TokenAmount amount={item.addLiquiditySolAmount} symbol="SOL" color="amber" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

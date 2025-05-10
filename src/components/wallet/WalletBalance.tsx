import React from 'react';
import { Coins } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const WalletBalance = () => {
  const { wallet, tokenBalances } = useAppContext();
  
  const getTokenSymbol = (tokenMint: string) => {
    switch (tokenMint) {
      case 'So11111111111111111111111111111111111111112':
        return 'SOL';
      case '6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN':
        return 'TRUMP';
      default:
        return 'Unknown';
    }
  };

  if (!wallet) {
    return null;
  }
  
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 mb-2">
        <Coins className="w-5 h-5 text-amber-500" />
        <h2 className="text-lg font-semibold">Wallet Balance</h2>
      </div>
      
      {tokenBalances.length > 0 ? (
        <div className="space-y-2">
          {tokenBalances.map((token) => (
            <div key={token.id} className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{getTokenSymbol(token.tokenMint)}</span>
                <span className="font-mono text-sm font-semibold">
                  {parseFloat(token.balance).toFixed(4)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
          No token balances available
        </div>
      )}
    </div>
  );
};
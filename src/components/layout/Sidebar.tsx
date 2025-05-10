import React from 'react';
import { Wallet, BarChart3, Info } from 'lucide-react';
import { WalletManagement } from '../wallet/WalletManagement';
import { Portfolio } from '../wallet/Portfolio';
import { PoolInfo } from '../pool/PoolInfo';
import { WalletBalance } from '../wallet/WalletBalance';

export const Sidebar = () => {
  return (
    <div className="w-full md:w-80 lg:w-96 min-h-screen border-r border-gray-200 bg-gradient-to-b from-indigo-50 via-white to-blue-50 p-6 flex flex-col shadow-xl rounded-r-3xl">
      {/* Logo & Project Name */}
      <div className="flex flex-col items-center mb-6">
        <img src="/quakka-logo.png" alt="QuakkaStep Logo" className="w-20 h-20 rounded-full shadow-lg border-4 border-white mb-2" />
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent tracking-tight mb-1">QuakkaStep</h1>
        <div className="text-xs text-gray-500 font-semibold tracking-wide mb-2">Raydium Single-Sided Liquidity</div>
      </div>
      {/* Project Description */}
      <div className="bg-white/80 rounded-xl p-4 mb-6 shadow border border-blue-100 text-center">
        <div className="text-base font-semibold text-blue-700 mb-1">What is QuakkaStep?</div>
        <div className="text-xs text-gray-600">
          <span className="font-bold text-pink-500">Quakka</span> is a cute, happy animal that helps you get optimal yield.<br/>
          <span className="font-bold text-blue-500">Step</span> stands for automated ladder stepping for maximum yield, built on <span className="font-bold text-purple-600">Raydium</span> & <span className="font-bold text-green-600">Solana</span>.
        </div>
      </div>
      <div className="space-y-4 flex-1">
        <div className="flex items-center space-x-2 mb-2">
          <Wallet className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold">Wallet</h2>
        </div>
        <WalletManagement />
        <div className="mt-6 flex items-center space-x-2 mb-2">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold">Portfolio</h2>
        </div>
        <Portfolio />
        <div className="mt-6 flex items-center space-x-2 mb-2">
          <Info className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold">Pool Info</h2>
        </div>
        <PoolInfo />
        <div className="mt-6">
          <WalletBalance />
        </div>
      </div>
      {/* Footer or extra info if needed */}
    </div>
  );
};
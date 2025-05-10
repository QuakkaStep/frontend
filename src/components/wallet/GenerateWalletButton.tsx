import React from 'react';
import { Wallet } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const GenerateWalletButton = () => {
  const { generateWallet } = useAppContext();

  const handleClick = async () => {
    await generateWallet();
  };

  return (
    <button
      onClick={handleClick}
      className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center transition-colors duration-200"
    >
      <Wallet className="w-5 h-5 mr-2" />
      Generate Wallet
    </button>
  );
};
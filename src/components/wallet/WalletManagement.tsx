import React, { useState } from 'react';
import { Wallet, LogOut } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const WalletManagement = () => {
  const { wallet, generateWallet, addWallet, disconnectWallet } = useAppContext();
  const [publicKey, setPublicKey] = useState('');
  const [showAddWallet, setShowAddWallet] = useState(false);

  const handleAddWallet = () => {
    if (publicKey.trim()) {
      addWallet(publicKey.trim());
      setPublicKey('');
      setShowAddWallet(false);
    }
  };

  if (wallet) {
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Current Wallet</p>
          <p className="font-mono text-sm break-all">{wallet.address}</p>
        </div>
        <button
          onClick={disconnectWallet}
          className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg flex items-center justify-center transition-colors duration-200"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Disconnect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => generateWallet()}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center transition-colors duration-200"
      >
        <Wallet className="w-5 h-5 mr-2" />
        Generate Wallet
      </button>

      {!showAddWallet ? (
        <button
          onClick={() => setShowAddWallet(true)}
          className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg flex items-center justify-center transition-colors duration-200"
        >
          <Wallet className="w-5 h-5 mr-2" />
          Add Existing Wallet
        </button>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            placeholder="Enter wallet public key"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleAddWallet}
              className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowAddWallet(false);
                setPublicKey('');
              }}
              className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 
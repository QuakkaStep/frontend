import React from 'react';
import { X, Copy, ExternalLink } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const WalletModal = () => {
  const { wallet, setShowWalletModal } = useAppContext();
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  
  if (!wallet) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Wallet Generated</h3>
          <button 
            onClick={() => setShowWalletModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Wallet Address</p>
            <div className="flex items-center bg-gray-100 p-3 rounded-lg break-all">
              <p className="flex-1 font-mono text-sm">{wallet.address}</p>
              <button 
                onClick={() => copyToClipboard(wallet.address)}
                className="ml-2 text-blue-500 hover:text-blue-700"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1">Private Key</p>
            <div className="flex items-center bg-gray-100 p-3 rounded-lg break-all">
              <p className="flex-1 font-mono text-sm">{wallet.privateKey}</p>
              <button 
                onClick={() => copyToClipboard(wallet.privateKey)}
                className="ml-2 text-blue-500 hover:text-blue-700"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="bg-yellow-100 border border-yellow-300 p-3 rounded-lg">
            <p className="text-sm text-yellow-800">
              This is a temporary wallet for testing purposes only. Store your private key securely and never share it with anyone.
            </p>
          </div>
        </div>
        
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setShowWalletModal(false)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            Close
          </button>
          
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition-colors">
            <ExternalLink className="w-4 h-4 mr-1" />
            View on Explorer
          </button>
        </div>
      </div>
    </div>
  );
};
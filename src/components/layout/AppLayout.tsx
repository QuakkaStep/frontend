import React from 'react';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { WalletModal } from '../modals/WalletModal';
import { SaveSuccessToast } from '../ui/SaveSuccessToast';
import { useAppContext } from '../../context/AppContext';

export const AppLayout = () => {
  const { showWalletModal, saveSuccess } = useAppContext();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col md:flex-row">
      <Sidebar />
      <MainContent />
      {showWalletModal && <WalletModal />}
      {saveSuccess && <SaveSuccessToast />}
    </div>
  );
};
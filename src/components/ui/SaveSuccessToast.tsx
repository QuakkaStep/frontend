import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const SaveSuccessToast = () => {
  const { setSaveSuccess } = useAppContext();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [setSaveSuccess]);
  
  return (
    <div className="fixed bottom-4 right-4 bg-green-100 border border-green-300 text-green-800 p-4 rounded-lg shadow-lg flex items-center z-50 animate-fadeIn">
      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
      <p className="font-medium">Strategy saved successfully!</p>
    </div>
  );
};
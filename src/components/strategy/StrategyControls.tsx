import React, { useState } from 'react';
import { Sparkles, Save } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const AI_CONFIG_API = 'http://localhost:3002/liquidity/ai-config-generation';
const TOKEN_ADDRESS = '6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN';
const INIT_CONFIG_API = 'http://localhost:3002/user/init-config';
const POOL_ID = 'GQsPr4RJk9AZkkfWHud7v4MtotcxhaYzZHdsPCg9vNvW';

export const StrategyControls = () => {
  const { updateStrategy, setSaveSuccess, wallet, strategy, hasUserConfig } = useAppContext();
  const walletExists = !!wallet?.address;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAIGenerate = async () => {
    if (!walletExists) return;
    setLoading(true);
    try {
      const res = await fetch(`${AI_CONFIG_API}?publicKey=${wallet.address}&tokenAddress=${TOKEN_ADDRESS}`);
      const data = await res.json();
      if (data.statusCode === 200 && data.data) {
        updateStrategy({
          step: data.data.stepPercentage,
          amountPerStep: data.data.addLiquidityAmount,
          minPrice: data.data.minPrice,
          maxPrice: data.data.maxPrice,
        });
      }
    } catch (e) {
      // 可加toast
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!walletExists) return;
    setSaving(true);
    try {
      const res = await fetch(INIT_CONFIG_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicKey: wallet.address,
          poolId: POOL_ID,
          stepPercentage: strategy.step,
          perAddedLiquidity: strategy.amountPerStep,
          minPrice: strategy.minPrice,
          maxPrice: strategy.maxPrice,
        })
      });
      const data = await res.json();
      if (data.statusCode === 200) {
        setSaveSuccess(true);
      } else {
        alert(data.message || 'Save failed');
      }
    } catch (e: any) {
      alert(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (hasUserConfig) return null;

  return (
    <div className="flex flex-row gap-4">
      <button
        onClick={handleAIGenerate}
        disabled={!walletExists || loading}
        className={`flex-1 py-3 px-6 font-semibold rounded-lg flex items-center justify-center transition-colors duration-200 border border-amber-300 ${walletExists && !loading ? 'bg-amber-100 hover:bg-amber-200 text-amber-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
      >
        <Sparkles className="w-5 h-5 mr-2 text-amber-500" />
        {loading ? 'Generating...' : 'AI generated automatically'}
      </button>
      <button
        onClick={handleSave}
        disabled={!walletExists || saving}
        className={`w-1/3 py-3 px-6 font-semibold rounded-lg flex items-center justify-center transition-colors duration-200 ${walletExists && !saving ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
      >
        <Save className="w-5 h-5 mr-2" />
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
};
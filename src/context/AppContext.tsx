import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Wallet {
  address: string;
  privateKey: string;
  trumpBalance: number;
  solBalance: number;
}

interface PoolData {
  liquidity: number;
  volume24h: number;
  fees24h: number;
  currentPrice: number;
}

interface LiquidityPosition {
  timestamp: string;
  price: number;
  trumpAmount: number;
  solAmount: number;
  ratio: string;
  actualTrump: number;
  actualSol: number;
}

interface StrategyConfig {
  maxPrice: number;
  minPrice: number;
  step: number;
  amountPerStep: number;
}

interface PortfolioData {
  poolId: string;
  userApr: number;
  expectedDailyFee: number;
  userTotalValueUSD: number;
}

interface LiquidityHistoryItem {
  id: number;
  publicKey: string;
  poolId: string;
  price: string;
  addLiquiditySolAmount: string;
  addLiquidityTokenAmount: string;
  swapTokenAmount: string;
  swapSolAmount: string;
  minPrice: string;
  maxPrice: string;
  createdAt: string;
}

interface TokenBalance {
  id: number;
  owner: string;
  tokenMint: string;
  balance: string;
}

interface AppContextType {
  wallet: Wallet | null;
  poolData: PoolData;
  portfolio: PortfolioData[];
  liquidityHistory: LiquidityHistoryItem[];
  tokenBalances: TokenBalance[];
  strategy: StrategyConfig;
  generateWallet: () => void;
  addWallet: (publicKey: string) => void;
  disconnectWallet: () => void;
  updateStrategy: (newStrategy: Partial<StrategyConfig>) => void;
  generateAIStrategy: () => void;
  saveStrategy: () => void;
  showWalletModal: boolean;
  setShowWalletModal: (show: boolean) => void;
  saveSuccess: boolean;
  setSaveSuccess: (success: boolean) => void;
}

const defaultPoolData: PoolData = {
  liquidity: 2.71,
  volume24h: 0,
  fees24h: 0,
  currentPrice: 11.8049,
};

const samplePositions: LiquidityPosition[] = [
  {
    timestamp: '2024-03-10 14:30',
    price: 11.8049,
    trumpAmount: 100,
    solAmount: 8.47,
    ratio: '100:8.47',
    actualTrump: 100,
    actualSol: 8.47
  },
  {
    timestamp: '2024-03-09 16:45',
    price: 11.5234,
    trumpAmount: 150,
    solAmount: 13.02,
    ratio: '150:13.02',
    actualTrump: 150,
    actualSol: 13.02
  }
];

const defaultPortfolio = {
  totalInvestmentUsd: 1234.56,
  apr: 12.5,
  dailyFee: 3.45,
  positions: samplePositions,
};

const defaultStrategy: StrategyConfig = {
  maxPrice: 15,
  minPrice: 9,
  step: 5,
  amountPerStep: 0.01,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [poolData, setPoolData] = useState<PoolData>(defaultPoolData);
  const [portfolio, setPortfolio] = useState<PortfolioData[]>([]);
  const [liquidityHistory, setLiquidityHistory] = useState<LiquidityHistoryItem[]>([]);
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [strategy, setStrategy] = useState<StrategyConfig>(defaultStrategy);
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const fetchPoolInfo = async () => {
    try {
      const response = await fetch('http://localhost:3002/pool-monitoring/info?poolId=GQsPr4RJk9AZkkfWHud7v4MtotcxhaYzZHdsPCg9vNvW');
      const result = await response.json();
      
      if (result.statusCode === 200) {
        setPoolData({
          liquidity: result.data.tvl,
          volume24h: result.data.volume24h,
          fees24h: result.data.volumeFee24h,
          currentPrice: result.data.price,
        });
      } else {
        console.error('Failed to fetch pool info:', result.message);
      }
    } catch (error) {
      console.error('Error fetching pool info:', error);
    }
  };

  const fetchPortfolio = async (publicKey: string) => {
    try {
      const response = await fetch(`http://localhost:3002/user/portfolio?publicKey=${publicKey}`);
      const result = await response.json();
      
      if (result.statusCode === 200) {
        setPortfolio(result.data);
      } else {
        console.error('Failed to fetch portfolio:', result.message);
        setPortfolio([]);
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      setPortfolio([]);
    }
  };

  const fetchLiquidityHistory = async (publicKey: string) => {
    try {
      const response = await fetch(`http://localhost:3002/liquidity/history?publicKey=${publicKey}`);
      const result = await response.json();
      
      if (result.statusCode === 200) {
        setLiquidityHistory(result.data);
      } else {
        console.error('Failed to fetch liquidity history:', result.message);
        setLiquidityHistory([]);
      }
    } catch (error) {
      console.error('Error fetching liquidity history:', error);
      setLiquidityHistory([]);
    }
  };

  const fetchTokenBalances = async (publicKey: string) => {
    try {
      const response = await fetch(`http://localhost:3002/user/token-balance?publicKey=${publicKey}`);
      const result = await response.json();
      
      if (result.statusCode === 200) {
        setTokenBalances(result.data);
      } else {
        console.error('Failed to fetch token balances:', result.message);
        setTokenBalances([]);
      }
    } catch (error) {
      console.error('Error fetching token balances:', error);
      setTokenBalances([]);
    }
  };

  // Fetch pool info when component mounts
  React.useEffect(() => {
    fetchPoolInfo();
    // Set up polling every 30 seconds
    const interval = setInterval(fetchPoolInfo, 30000);
    return () => clearInterval(interval);
  }, []);

  const generateWallet = async () => {
    try {
      const response = await fetch('http://localhost:3002/user/generate-wallet');
      const result = await response.json();

      console.log(`generateWallet, ${result}`);
      
      
      if (result.statusCode === 200) {
        const newWallet = {
          address: result.data.publicKey,
          privateKey: result.data.secretKey,
          trumpBalance: 0,
          solBalance: 0,
        };
        setWallet(newWallet);
        setShowWalletModal(true);
      } else {
        console.error('Failed to generate wallet:', result.message);
      }
    } catch (error) {
      console.error('Error generating wallet:', error);
    }
  };

  const addWallet = (publicKey: string) => {
    const newWallet = {
      address: publicKey,
      privateKey: '', // We don't store private key for imported wallets
      trumpBalance: 0,
      solBalance: 0,
    };
    setWallet(newWallet);
    fetchPortfolio(publicKey);
    fetchLiquidityHistory(publicKey);
    fetchTokenBalances(publicKey);
  };

  const disconnectWallet = () => {
    setWallet(null);
    setPortfolio([]);
    setLiquidityHistory([]);
    setTokenBalances([]);
  };

  const updateStrategy = (newStrategyValues: Partial<StrategyConfig>) => {
    setStrategy((prev) => ({ ...prev, ...newStrategyValues }));
  };

  const generateAIStrategy = () => {
    const currentPrice = poolData.currentPrice;
    setStrategy({
      maxPrice: parseFloat((currentPrice * 1.3).toFixed(2)),
      minPrice: parseFloat((currentPrice * 0.7).toFixed(2)),
      step: 5,
      amountPerStep: 0.01,
    });
  };

  const saveStrategy = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const value = {
    wallet,
    poolData,
    portfolio,
    liquidityHistory,
    tokenBalances,
    strategy,
    generateWallet,
    addWallet,
    disconnectWallet,
    updateStrategy,
    generateAIStrategy,
    saveStrategy,
    showWalletModal,
    setShowWalletModal,
    saveSuccess,
    setSaveSuccess,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
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
  hasUserConfig: boolean;
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
  maxPrice: 0,
  minPrice: 0,
  step: 0,
  amountPerStep: 0,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const RAYDIUM_API = import.meta.env.VITE_RAYDIUM_API;
const TRUMP_PRICE_API = import.meta.env.VITE_TRUMP_PRICE_API;
const POOL_ID = import.meta.env.VITE_POOL_ID;
const TOKEN_ADDRESS = import.meta.env.VITE_TOKEN_ADDRESS;

// 添加环境变量检查日志
console.log('Environment Variables Check:');
console.log('API_BASE:', API_BASE);
console.log('RAYDIUM_API:', RAYDIUM_API);
console.log('TRUMP_PRICE_API:', TRUMP_PRICE_API);
console.log('POOL_ID:', POOL_ID);
console.log('TOKEN_ADDRESS:', TOKEN_ADDRESS);

// 业务API统一拼接
const POOL_MONITOR_API = `${API_BASE}/pool-monitoring/info`;
const AI_CONFIG_API = `${API_BASE}/liquidity/ai-config-generation`;
const INIT_CONFIG_API = `${API_BASE}/user/init-config`;
const USER_CONFIG_API = `${API_BASE}/user/configs`;
const PORTFOLIO_API = `${API_BASE}/user/portfolio`;
const LIQUIDITY_HISTORY_API = `${API_BASE}/liquidity/history`;
const TOKEN_BALANCE_API = `${API_BASE}/user/token-balance`;

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [poolData, setPoolData] = useState<PoolData>(defaultPoolData);
  const [portfolio, setPortfolio] = useState<PortfolioData[]>([]);
  const [liquidityHistory, setLiquidityHistory] = useState<LiquidityHistoryItem[]>([]);
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [strategy, setStrategy] = useState<StrategyConfig>(defaultStrategy);
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [hasUserConfig, setHasUserConfig] = useState<boolean>(false);

  const fetchPoolInfo = async () => {
    try {
      const response = await fetch(`${POOL_MONITOR_API}?poolId=${POOL_ID}`);
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
      const response = await fetch(`${PORTFOLIO_API}?publicKey=${publicKey}`);
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
      const response = await fetch(`${LIQUIDITY_HISTORY_API}?publicKey=${publicKey}`);
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
      const response = await fetch(`${TOKEN_BALANCE_API}?publicKey=${publicKey}`);
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

  const fetchUserConfig = async (publicKey: string) => {
    try {
      const response = await fetch(`${USER_CONFIG_API}?publicKey=${publicKey}&tokenAddress=${TOKEN_ADDRESS}`);
      const result = await response.json();
      if (result.statusCode === 200 && result.data) {
        setStrategy(prev => ({
          ...prev,
          step: parseFloat(result.data.stepPercentage),
          amountPerStep: parseFloat(result.data.perAddedLiquidity),
          minPrice: parseFloat(result.data.minPrice),
          maxPrice: parseFloat(result.data.maxPrice),
        }));
        setHasUserConfig(true);
      } else {
        setHasUserConfig(false);
      }
    } catch (error) {
      setHasUserConfig(false);
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
      const response = await fetch(`${API_BASE}/user/generate-wallet`);
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
    fetchUserConfig(publicKey);
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
      step: 0,
      amountPerStep: 0,
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
    hasUserConfig,
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
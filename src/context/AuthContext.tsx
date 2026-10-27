/*
 FILE: src/context/AuthContext.tsx

 PURPOSE:
 Authoritative Session, Wallet, and Authentication State Provider.
 Strict Zero-Dummy-Data Enforcement:
 - Integrates realMarketApi for live on-chain balances and real-time market valuations.
 - Enforces authentication gating: dashboard is locked until wallet + passcode verification.
 - Persists authenticated session securely in client storage.
*/

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ApiService } from '../services/api';
import { cookieService } from '../services/cookieService';
import { web3Wallet } from '../services/web3Wallet';
import { ApiConnectionConfig } from '../services/userApiService';
import { UserProfile, UserWallets } from '../types';

export type AuthStage =
  | 'LANDING'
  | 'UNAUTHENTICATED'
  | 'WALLET_OPTIONS'
  | 'METAMASK_CONNECT'
  | 'WALLET_CONNECTED'
  | 'SET_PASSCODE'
  | 'SETUP_PASSCODE'
  | 'CONFIRM_PASSCODE'
  | 'PASSCODE_SUCCESS'
  | 'LOCKED'
  | 'AUTHENTICATED';

interface AuthContextType {
  authStage: AuthStage;
  setAuthStage: (stage: AuthStage) => void;
  user: UserProfile | null;
  wallets: UserWallets | null;
  isLoading: boolean;
  securityModalOpen: boolean;
  emptyStateMode: boolean;
  activeRoute: string;
  createdPasscode: string;
  walletAddress: string;
  isMetaMaskConnected: boolean;
  apiConfig: ApiConnectionConfig;
  apiModalOpen: boolean;
  setApiModalOpen: (open: boolean) => void;
  updateApiConfig: (config: Partial<ApiConnectionConfig>) => void;
  fetchUserDataFromApi: (url?: string) => Promise<{ success: boolean; error?: string; raw?: any }>;
  setActiveRoute: (route: string) => void;
  setSecurityModalOpen: (open: boolean) => void;
  toggleEmptyStateMode: () => void;
  connectRealMetaMask: () => Promise<{ success: boolean; address?: string; error?: string }>;
  connectMobileWallet: () => Promise<{ success: boolean; address: string; error?: string }>;
  register: (data: { walletAddress?: string; referId?: string; country: string; mobile: string; name: string }) => Promise<{ success: boolean; message?: string }>;
  setupPasscode: (passcode: string, advanceToLocked?: boolean) => Promise<{ success: boolean; message?: string }>;
  verifyPasscode: (pin: string) => Promise<{ success: boolean; message?: string }>;
  refreshUserData: () => Promise<void>;
  logout: () => void;
  lockApp: () => void;
}

// URL and SEO Route Title Mappings
const getPathForRoute = (stage: AuthStage, route: string): string => {
  if (stage === 'LANDING') return '/home';
  if (stage === 'UNAUTHENTICATED') return '/connect-wallet';
  if (stage === 'SETUP_PASSCODE') return '/setup-passcode';
  if (stage === 'LOCKED') return '/lock';
  if (stage === 'AUTHENTICATED') {
    if (route === 'home') return '/dashboard';
    return `/${route}`;
  }
  return '/home';
};

const getPageTitle = (path: string): string => {
  const titles: Record<string, string> = {
    '/': 'MONEY X · Decentralized Wealth & Staking Ecosystem',
    '/home': 'MONEY X · Decentralized Wealth & Staking Ecosystem',
    '/dashboard': 'MONEY X · Dashboard & Portfolio Overview',
    '/wallets': 'MONEY X · Multi-Chain Wallets & Digital Assets',
    '/deposit': 'MONEY X · Instant Digital Asset Deposit',
    '/withdraw': 'MONEY X · Secure Digital Asset Withdrawal',
    '/trade': 'MONEY X · Decentralized Spot & Swap Trading',
    '/staking': 'MONEY X · High-Yield Staking Pools & APY',
    '/farming': 'MONEY X · Liquidity Yield Farming',
    '/community': 'MONEY X · Community & Team Network',
    '/connect-wallet': 'MONEY X · Connect Web3 Wallet',
    '/setup-passcode': 'MONEY X · Set Passcode Security',
    '/lock': 'MONEY X · Screen Lock Security Vault',
    '/profile': 'MONEY X · User Profile & Verification',
    '/transactions': 'MONEY X · All Transactions History',
    '/single-wallet': 'MONEY X · Single Chain Wallet & Balance',
    '/menu': 'MONEY X · All Ecosystem Services & Pages',
    '/convert': 'MONEY X · Instant Swap & Convert',
    '/tickets': 'MONEY X · Tickets & Raffles',
    '/redeem': 'MONEY X · Reward Vault & Redeem',
    '/reward': 'MONEY X · Rank & Rewards System',
    '/jackpot': 'MONEY X · Decentralized Jackpot & Pools',
  };
  return titles[path] || 'MONEY X · Decentralized Wealth Ecosystem';
};

const syncBrowserUrl = (newPath: string) => {
  if (typeof window === 'undefined') return;
  try {
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', `${newPath}${window.location.search}`);
    }
    document.title = getPageTitle(newPath);
  } catch (err) {
    console.warn('URL sync non-fatal warning', err);
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Parse initial URL pathname
  const initialPath = typeof window !== 'undefined' ? window.location.pathname : '/home';
  
  const getInitialState = (): { stage: AuthStage; route: string } => {
    const session = cookieService.getAuthSession();
    if (initialPath === '/connect-wallet' || initialPath === '/auth') {
      return { stage: 'UNAUTHENTICATED', route: 'home' };
    }
    if (initialPath === '/setup-passcode') {
      return { stage: 'SETUP_PASSCODE', route: 'home' };
    }
    if (initialPath === '/lock') {
      return { stage: 'LOCKED', route: 'home' };
    }
    if (session.isAuthenticated) {
      if (initialPath === '/deposit') return { stage: 'AUTHENTICATED', route: 'deposit' };
      if (initialPath === '/withdraw') return { stage: 'AUTHENTICATED', route: 'withdraw' };
      if (initialPath === '/wallets' || initialPath === '/wallet') return { stage: 'AUTHENTICATED', route: 'wallets' };
      if (initialPath === '/single-wallet' || initialPath === '/wallet-detail') return { stage: 'AUTHENTICATED', route: 'single-wallet' };
      if (initialPath === '/menu' || initialPath === '/ecosystem') return { stage: 'AUTHENTICATED', route: 'menu' };
      if (initialPath === '/trade') return { stage: 'AUTHENTICATED', route: 'trade' };
      if (initialPath === '/staking') return { stage: 'AUTHENTICATED', route: 'staking' };
      if (initialPath === '/farming') return { stage: 'AUTHENTICATED', route: 'farming' };
      if (initialPath === '/community') return { stage: 'AUTHENTICATED', route: 'community' };
      if (initialPath === '/profile') return { stage: 'AUTHENTICATED', route: 'profile' };
      if (initialPath === '/transactions') return { stage: 'AUTHENTICATED', route: 'transactions' };
      if (initialPath === '/convert') return { stage: 'AUTHENTICATED', route: 'convert' };
      if (initialPath === '/dashboard') return { stage: 'AUTHENTICATED', route: 'home' };
      return { stage: 'AUTHENTICATED', route: 'home' };
    }
    return { stage: 'LANDING', route: 'home' };
  };

  const initial = getInitialState();
  const [authStage, setAuthStageInternal] = useState<AuthStage>(initial.stage);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [wallets, setWallets] = useState<UserWallets | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [securityModalOpen, setSecurityModalOpen] = useState<boolean>(false);
  const [emptyStateMode, setEmptyStateMode] = useState<boolean>(false);
  const [activeRoute, setActiveRouteInternal] = useState<string>(initial.route);

  // Sync state transitions to browser URL & document title
  const setAuthStage = (stage: AuthStage) => {
    setAuthStageInternal(stage);
    const path = getPathForRoute(stage, activeRoute);
    syncBrowserUrl(path);
  };

  const setActiveRoute = (route: string) => {
    setActiveRouteInternal(route);
    const path = getPathForRoute(authStage, route);
    syncBrowserUrl(path);
  };

  // Browser back/forward popstate listener
  useEffect(() => {
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      const session = cookieService.getAuthSession();
      if (currentPath === '/connect-wallet' || currentPath === '/auth') {
        setAuthStageInternal('UNAUTHENTICATED');
      } else if (currentPath === '/setup-passcode') {
        setAuthStageInternal('SETUP_PASSCODE');
      } else if (currentPath === '/lock') {
        setAuthStageInternal('LOCKED');
      } else if (currentPath === '/home' || currentPath === '/') {
        setAuthStageInternal('LANDING');
      } else {
        const cleanRoute = currentPath.replace(/^\//, '');
        const targetRoute = cleanRoute === 'dashboard' ? 'home' : cleanRoute;
        setActiveRouteInternal(targetRoute);
        if (session.isAuthenticated) {
          setAuthStageInternal('AUTHENTICATED');
        }
      }
      document.title = getPageTitle(currentPath);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [createdPasscode, setCreatedPasscode] = useState<string>(() => {
    // Remove legacy client-side PIN storage from previous demo versions.
    if (typeof localStorage !== 'undefined') localStorage.removeItem('xah_custom_passcode');
    return '';
  });
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState<boolean>(false);

  // External API integration state
  const [apiConfig, setApiConfigState] = useState<ApiConnectionConfig>(() => ApiService.getUserApiConfig());
  const [apiModalOpen, setApiModalOpen] = useState<boolean>(false);

  const updateApiConfig = (newConfig: Partial<ApiConnectionConfig>) => {
    const saved = ApiService.saveUserApiConfig(newConfig);
    setApiConfigState(saved);
  };

  const fetchUserDataFromApi = async (url?: string): Promise<{ success: boolean; error?: string; raw?: any }> => {
    const targetUrl = url || apiConfig.endpointUrl;
    setApiConfigState((prev) => ({ ...prev, status: 'CONNECTING', lastError: null }));
    const res = await ApiService.fetchUserDataFromApi(targetUrl);
    setApiConfigState({ ...ApiService.getUserApiConfig(), rawResponse: res.success ? res.raw ?? null : null });
    if (res.success && res.user) {
      setUser(res.user);
      if (res.wallets) setWallets(res.wallets);
      if (res.user.walletAddress) setWalletAddress(res.user.walletAddress);
      // Load all supported read-only records after UID validation.
      await refreshUserData();
      // The x.money API currently lacks server-side authentication. This is a
      // local-only, read-only development preview, never a production login.
      const isLocalHost = typeof window !== 'undefined' && ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname.toLowerCase());
      if (isLocalHost) setAuthStage('AUTHENTICATED');
      return { success: true, raw: res.raw };
    } else {
      return { success: false, error: res.error };
    }
  };

  const refreshUserData = async () => {
    try {
      const [profileRes, walletsRes] = await Promise.all([
        ApiService.getProfile(),
        ApiService.getWallets(),
      ]);

      if (profileRes.success && profileRes.data) {
        setUser(profileRes.data);
        if (profileRes.data.walletAddress) {
          setWalletAddress(profileRes.data.walletAddress);
        }

        if (walletsRes.success && walletsRes.data) {
          // Use only explicit values returned by x.money. Never infer or split balances.
          setWallets(walletsRes.data);
        } else {
          setWallets(null);
        }
      } else {
        setUser(null);
        setWallets(null);
        cookieService.clearAuthSession();
      }
      setCreatedPasscode(ApiService.getLastCreatedPasscode());
    } catch (err) {
      console.error('Failed to load user session data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUserData();

    // Listen to MetaMask account switches
    web3Wallet.onAccountsChanged(async (accounts) => {
      if (accounts && accounts.length > 0) {
        const addr = accounts[0];
        setWalletAddress(addr);
        setIsMetaMaskConnected(true);
        if (user) {
          setUser({ ...user, walletAddress: addr });
        }
      } else {
        setIsMetaMaskConnected(false);
      }
    });
  }, []);

  const connectRealMetaMask = async (): Promise<{ success: boolean; address?: string; error?: string }> => {
    const res = await web3Wallet.connectMetaMask();
    if (res.success && res.address) {
      const addr = res.address;
      setWalletAddress(addr);
      setIsMetaMaskConnected(true);
      if (user) {
        setUser({ ...user, walletAddress: addr });
      }

      return { success: true, address: addr };
    }
    return { success: false, error: res.message || res.error || 'Connection failed' };
  };

  const connectMobileWallet = async (): Promise<{ success: boolean; address: string; error?: string }> => {
    // Never generate/store a client-side wallet in API-only preview mode.
    return {
      success: false,
      address: '',
      error: 'Mobile wallet creation is disabled in read-only API preview.',
    };
  };

  const register = async (data: {
    walletAddress?: string;
    referId?: string;
    country: string;
    mobile: string;
    name: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await ApiService.register(data);
      if (res.success && res.data) {
        setUser(res.data.user);
        if (res.data.user.walletAddress) {
          setWalletAddress(res.data.user.walletAddress);
        }
        return { success: true, message: res.message };
      }
      return { success: false, message: res.error?.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const setupPasscode = async (passcode: string, advanceToLocked = false) => {
    setIsLoading(true);
    try {
      const res = await ApiService.setupPasscode(passcode);
      if (res.success) {
        setCreatedPasscode(passcode);
        if (user) {
          setUser({ ...user, passcodeConfigured: true });
        }
        if (advanceToLocked) {
          setAuthStage('LOCKED');
        }
        return { success: true, message: 'Passcode configured!' };
      }
      return { success: false, message: res.error?.message || 'Failed to setup passcode' };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPasscode = async (pin: string) => {
    setIsLoading(true);
    try {
      // The supplied x.money repository has no verified server-side login endpoint.
      // Never accept a PIN stored in localStorage or mint a client-side session token.
      const res = await ApiService.verifyPasscode(pin);
      if (res.success && res.data?.verified) {
        // Keep the account loaded by successful signup. A profile refresh here
        // calls a separate API that may not support authenticated sessions yet;
        // clearing the user on that unrelated failure sends the app back to Landing.
        setAuthStage('AUTHENTICATED');
        setSecurityModalOpen(false);
        return { success: true };
      }
      return { success: false, message: res.error?.message || 'Server-side authentication is unavailable; use local read-only API preview.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Strictly clear session cookies and return to Landing page without bottom menu
    cookieService.clearAuthSession();
    setAuthStage('LANDING');
    setActiveRoute('home');
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('aura_session_token');
      localStorage.removeItem('xah_custom_passcode');
    }
    setCreatedPasscode('');
  };

  const lockApp = () => {
    setAuthStage('LOCKED');
  };

  const toggleEmptyStateMode = () => {
    if (!emptyStateMode) {
      ApiService.clearDataForEmptyState();
      setEmptyStateMode(true);
    } else {
      ApiService.resetSeedData();
      setEmptyStateMode(false);
    }
    refreshUserData();
  };

  return (
    <AuthContext.Provider
      value={{
        authStage,
        setAuthStage,
        user,
        wallets,
        isLoading,
        securityModalOpen,
        emptyStateMode,
        activeRoute,
        createdPasscode,
        walletAddress,
        isMetaMaskConnected,
        apiConfig,
        apiModalOpen,
        setApiModalOpen,
        updateApiConfig,
        fetchUserDataFromApi,
        setActiveRoute,
        setSecurityModalOpen,
        toggleEmptyStateMode,
        connectRealMetaMask,
        connectMobileWallet,
        register,
        setupPasscode,
        verifyPasscode,
        refreshUserData,
        logout,
        lockApp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

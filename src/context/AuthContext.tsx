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
import { SecureAuthApi } from '../services/secureAuthApi';
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
  loginWithWallet: (walletAddress: string) => Promise<{ success: boolean; message?: string }>;
  setupPasscode: (passcode: string, advanceToLocked?: boolean) => Promise<{ success: boolean; message?: string }>;
  verifyPasscode: (pin: string) => Promise<{ success: boolean; message?: string }>;
  refreshUserData: () => Promise<boolean>;
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
      // Read-only API preview can populate diagnostics but must never authenticate
      // a user or unlock the dashboard without the server wallet + passcode flow.
      return { success: true, raw: res.raw };
    } else {
      return { success: false, error: res.error };
    }
  };

  const refreshUserData = async (): Promise<boolean> => {
    try {
      // The backend PHP session is authoritative. A stale client cookie must not
      // determine whether the dashboard is accessible.
      const session = await SecureAuthApi.getSession();
      if (!session.authenticated) {
        setUser(null);
        setWallets(null);
        if (session.locked && !session.passcodeConfigured) setAuthStage('SETUP_PASSCODE');
        else if (session.locked) setAuthStage('LOCKED');
        else if (authStage === 'AUTHENTICATED') setAuthStage('UNAUTHENTICATED');
        return false;
      }

      const connectedAccount = await web3Wallet.getConnectedAccount();
      if (connectedAccount) {
        setWalletAddress(connectedAccount);
        setIsMetaMaskConnected(true);
      }

      const [profileRes, walletsRes] = await Promise.all([
        ApiService.getProfile(),
        ApiService.getWallets(),
      ]);

      let profile: UserProfile | null = profileRes.success && profileRes.data ? profileRes.data : null;
      // The authenticated Session endpoint is the source of truth for identity.
      // The legacy User API can return an incomplete profile (especially wallet
      // address field aliases); prefer its data only when it includes a real wallet.
      const sessionRow = session.user;
      const sessionWallet = String(sessionRow?.wallet_address ?? '');
      if (sessionRow && (!profile || !profile.id || !profile.walletAddress) && sessionWallet) {
        const row = sessionRow;
        const id = String(row.id ?? row.userid ?? '');
        const firstName = String(row.fname ?? '');
        const lastName = String(row.lname ?? '');
        const displayName = String(row.name ?? [firstName, lastName].filter(Boolean).join(' ')).trim();
        profile = {
          id,
          username: String(row.username ?? row.userid ?? id),
          name: displayName,
          firstName,
          lastName,
          email: '',
          mobile: String(row.mobile ?? ''),
          country: String(row.country ?? ''),
          walletAddress: sessionWallet,
          referId: '',
          referBy: String(row.refer_by ?? ''),
          createdAt: String(row.user_registered ?? ''),
          passcodeConfigured: session.passcodeConfigured,
          kycStatus: 'UNVERIFIED',
        };
      }

      if (!profile || !profile.id || !profile.walletAddress) {
        setUser(null);
        setWallets(null);
        return false;
      }

      // A wallet can remain authenticated by the server session even if the
      // extension temporarily hides eth_accounts after the signature step.
      setIsMetaMaskConnected(true);
      setUser(profile);
      setWalletAddress(profile.walletAddress);
      if (walletsRes.success && walletsRes.data) {
        setWallets(walletsRes.data);
      } else {
        setWallets(null);
      }
      setCreatedPasscode('');
      return true;
    } catch (err) {
      console.error('Failed to load user session data', err);
      return false;
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
        // A wallet account switch must not silently keep the previous account's
        // authenticated dashboard open. Require a fresh signature for the new address.
        if (user && user.walletAddress.toLowerCase() !== addr.toLowerCase()) {
          setUser(null);
          setWallets(null);
          cookieService.clearAuthSession();
          setAuthStage('UNAUTHENTICATED');
        } else if (user) {
          setUser({ ...user, walletAddress: addr });
        }
      } else {
        setIsMetaMaskConnected(false);
        setWalletAddress('');
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

  const loginWithWallet = async (address: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const wallet = address.trim().toLowerCase();
      if (!/^0x[a-f0-9]{40}$/.test(wallet)) throw new Error('Connect a valid wallet first.');
      const challenge = await SecureAuthApi.getNonce(wallet);
      const signed = await web3Wallet.signMessage(address, challenge);
      if (!signed.success || !signed.signature) throw new Error(signed.error || 'Wallet signature was not approved.');
      const verified = await SecureAuthApi.verifySignature(wallet, signed.signature);
      if (!verified.registered) throw new Error('This wallet is not registered yet. Complete Sign Up first.');
      ApiService.saveUserApiConfig({ userId: wallet });
      setWalletAddress(address);
      setIsMetaMaskConnected(true);
      setUser(null);
      setWallets(null);
      setAuthStage(verified.passcodeConfigured ? 'LOCKED' : 'SETUP_PASSCODE');
      return { success: true, message: verified.passcodeConfigured ? 'Wallet verified. Enter your passcode.' : 'Wallet verified. Create your passcode.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Wallet sign in failed.' };
    } finally {
      setIsLoading(false);
    }
  };

  const setupPasscode = async (passcode: string, advanceToLocked = false) => {
    setIsLoading(true);
    try {
      const res = await ApiService.setupPasscode(passcode);
      if (!res.success) {
        return { success: false, message: res.error?.message || 'Failed to setup passcode' };
      }

      // A newly registered user should not have to re-enter a PIN immediately:
      // verify the just-created PIN with the server, load the real DB profile,
      // then enter the authenticated dashboard. Returning users still use LOCKED.
      if (advanceToLocked) {
        setCreatedPasscode('');
        setAuthStage('LOCKED');
        return { success: true, message: 'Passcode configured. Your account is locked securely.' };
      }

      const verified = await ApiService.verifyPasscode(passcode);
      if (!verified.success || !verified.data?.verified) {
        return { success: false, message: verified.error?.message || 'Passcode was saved but the backend could not unlock the session. Please sign in again.' };
      }
      const profileLoaded = await refreshUserData();
      if (!profileLoaded) {
        return { success: false, message: 'Passcode was saved and verified, but your account profile could not be loaded. Check the backend Session/User API response.' };
      }
      setCreatedPasscode('');
      setAuthStage('AUTHENTICATED');
      return { success: true, message: 'Passcode verified. Opening your dashboard.' };
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
        const profileLoaded = await refreshUserData();
        if (!profileLoaded) {
          return { success: false, message: 'Passcode is correct, but the backend account profile could not be loaded.' };
        }
        setAuthStage('AUTHENTICATED');
        setSecurityModalOpen(false);
        return { success: true };
      }
      return { success: false, message: res.error?.message || 'The backend did not verify this passcode.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Revoke the server-side PHP session as well as local UI state.
    void SecureAuthApi.sessionAction('logout').catch((err) => console.warn('Server logout failed', err));
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
    void SecureAuthApi.sessionAction('lock').catch((err) => console.warn('Server lock request failed', err));
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
        loginWithWallet,
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

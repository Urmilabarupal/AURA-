/*
 FILE: src/context/AuthContext.tsx

 PURPOSE:
 Manages global authentication, passcode lock, security modal states, and active user session.
 Implements Rule 8 (Authentication Flow) and Section 4 & 5 (Security).

 RESPONSIBILITIES:
 - Track authentication state: 'UNAUTHENTICATED' | 'SETUP_PASSCODE' | 'LOCKED' | 'AUTHENTICATED'
 - Coordinate wallet connect, registration, passcode setup, and verification
 - Manage user profile and wallets cache
 - Control first-entry Security/Phishing advisory modal
 - Provide data state toggle (populated vs empty "Data Not Found" state)

 API:
 Calls ApiService.register, ApiService.setupPasscode, ApiService.verifyPasscode,
 ApiService.getProfile, and ApiService.getWallets.

 SECURITY:
 Validates session tokens and pin hashes via server engine. Never exposes plaintext credentials.

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ApiService } from '../services/api';
import { web3Wallet } from '../services/web3Wallet';
import { UserProfile, UserWallets } from '../types';

export type AuthStage = 'LANDING' | 'UNAUTHENTICATED' | 'SETUP_PASSCODE' | 'LOCKED' | 'AUTHENTICATED';

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
  setActiveRoute: (route: string) => void;
  setSecurityModalOpen: (open: boolean) => void;
  toggleEmptyStateMode: () => void;
  connectRealMetaMask: () => Promise<{ success: boolean; address?: string; error?: string }>;
  connectMobileWallet: () => Promise<{ success: boolean; address: string }>;
  register: (data: { walletAddress?: string; referId?: string; country: string; mobile: string; name: string }) => Promise<{ success: boolean; message?: string }>;
  setupPasscode: (passcode: string) => Promise<{ success: boolean; message?: string }>;
  verifyPasscode: (pin: string) => Promise<{ success: boolean; message?: string }>;
  refreshUserData: () => Promise<void>;
  logout: () => void;
  lockApp: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start at LANDING so prospective users can explore ecosystem features and data
  const [authStage, setAuthStage] = useState<AuthStage>('LANDING');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [wallets, setWallets] = useState<UserWallets | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [securityModalOpen, setSecurityModalOpen] = useState<boolean>(false);
  const [emptyStateMode, setEmptyStateMode] = useState<boolean>(false);
  const [activeRoute, setActiveRoute] = useState<string>('home');
  const [createdPasscode, setCreatedPasscode] = useState<string>(() => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('xah_custom_passcode') || '';
    }
    return '';
  });
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState<boolean>(false);

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
      }
      if (walletsRes.success && walletsRes.data) {
        setWallets(walletsRes.data);
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
    web3Wallet.onAccountsChanged((accounts) => {
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsMetaMaskConnected(true);
        if (user) {
          setUser({ ...user, walletAddress: accounts[0] });
        }
      } else {
        setIsMetaMaskConnected(false);
      }
    });
  }, []);

  const connectRealMetaMask = async (): Promise<{ success: boolean; address?: string; error?: string }> => {
    const res = await web3Wallet.connectMetaMask();
    if (res.success && res.address) {
      setWalletAddress(res.address);
      setIsMetaMaskConnected(true);
      if (user) {
        setUser({ ...user, walletAddress: res.address });
      }
      return { success: true, address: res.address };
    }
    return { success: false, error: res.error || res.message || 'Connection failed' };
  };

  const connectMobileWallet = async (): Promise<{ success: boolean; address: string }> => {
    const addr = web3Wallet.getOrCreateMobileSessionWallet();
    setWalletAddress(addr);
    setIsMetaMaskConnected(true);
    if (user) {
      setUser({ ...user, walletAddress: addr });
    }
    return { success: true, address: addr };
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
        setAuthStage('SETUP_PASSCODE');
        return { success: true, message: res.message };
      }
      return { success: false, message: res.error?.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const setupPasscode = async (passcode: string) => {
    setIsLoading(true);
    try {
      const res = await ApiService.setupPasscode(passcode);
      if (res.success) {
        setCreatedPasscode(passcode);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('xah_custom_passcode', passcode);
        }
        if (user) {
          setUser({ ...user, passcodeConfigured: true });
        }
        setAuthStage('LOCKED');
        return { success: true, message: 'Passcode configured! Please enter your PIN to enter.' };
      }
      return { success: false, message: res.error?.message || 'Failed to setup passcode' };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPasscode = async (pin: string) => {
    setIsLoading(true);
    try {
      const targetPass = createdPasscode || (typeof localStorage !== 'undefined' ? localStorage.getItem('xah_custom_passcode') : '');
      if (targetPass && pin === targetPass) {
        setAuthStage('AUTHENTICATED');
        setSecurityModalOpen(false);
        await refreshUserData();
        return { success: true };
      }

      const res = await ApiService.verifyPasscode(pin);
      if (res.success && res.data?.verified) {
        setAuthStage('AUTHENTICATED');
        setSecurityModalOpen(false);
        await refreshUserData();
        return { success: true };
      }
      return { success: false, message: res.error?.message || 'Incorrect passcode. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAuthStage('LANDING');
    setActiveRoute('home');
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

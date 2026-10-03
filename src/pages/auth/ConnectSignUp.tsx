/*
 FILE: src/pages/auth/ConnectSignUp.tsx

 PURPOSE:
 Connect Wallet & Sign Up Flow styled with Olymp Trade authentic OLED dark theme:
 - Pitch black OLED canvas (#000000)
 - High-craft card (#08080a) with hairline border (#18181c)
 - Top Brand Emblem with neon emerald/cyan gradient
 - Status indicators: Neutral rotating ray spinners before connection, turning to vibrant #00e699 checkmarks on connect
 - Signature Olymp Trade Emerald Green submit buttons
 - Passcode modal styled with matching pitch black OLED theme
*/

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { web3Wallet } from '../../services/web3Wallet';
import { BRAND } from '../../config/brand';
import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronLeft,
  Copy,
  Eye,
  EyeOff,
  Loader2,
  RefreshCw,
  X,
} from 'lucide-react';

// Authentic 12-Ray SVG Spinner
const RaySpinner: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-slate-300' }) => (
  <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
      <line
        key={i}
        x1="12"
        y1="2.5"
        x2="12"
        y2="5.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity={(i + 1) / 12}
        transform={`rotate(${deg} 12 12)`}
      />
    ))}
  </svg>
);

export const ConnectSignUp: React.FC = () => {
  const {
    register,
    setupPasscode,
    setAuthStage,
    connectRealMetaMask,
    connectMobileWallet,
    walletAddress: contextAddress,
  } = useAuth();
  const { copyToClipboard } = useToast();

  // Status Indicators state
  const [walletStatus, setWalletStatus] = useState<'loading' | 'failed' | 'success'>('loading');
  const [signUpStatus, setSignUpStatus] = useState<'loading' | 'failed' | 'success'>('loading');
  const [signInStatus, setSignInStatus] = useState<'loading' | 'failed' | 'success'>('loading');

  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnectingMetaMask, setIsConnectingMetaMask] = useState<boolean>(false);
  const [metaMaskNotice, setMetaMaskNotice] = useState<string | null>(null);
  const [showMobileModal, setShowMobileModal] = useState<boolean>(false);

  // Form Fields
  const [referralId, setReferralId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get('ref') || urlParams.get('referral');
      if (ref) return ref;
      const stored = localStorage.getItem('xah_refer_id');
      if (stored) return stored;
    }
    return BRAND.defaultReferId;
  });
  const [country, setCountry] = useState<string>('USA (+1)');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [name, setName] = useState<string>('');

  // Status
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Modal for Passcode creation
  const [showPasscodeModal, setShowPasscodeModal] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>('');
  const [confirmPasscode, setConfirmPasscode] = useState<string>('');
  const [showPasscodeText, setShowPasscodeText] = useState<boolean>(false);
  const [showConfirmText, setShowConfirmText] = useState<boolean>(false);
  const [passcodeError, setPasscodeError] = useState<string | null>(null);
  const [isRefreshingToLock, setIsRefreshingToLock] = useState<boolean>(false);

  const countries = [
    'USA (+1)',
    'United Kingdom (+44)',
    'India (+91)',
    'Germany (+49)',
    'France (+33)',
    'Canada (+1)',
    'Australia (+61)',
    'Singapore (+65)',
    'UAE (+971)',
    'Japan (+81)',
    'Global / Other (+00)',
  ];

  // Auto-detect existing wallet
  useEffect(() => {
    let isMounted = true;

    async function checkExistingWallet() {
      if (contextAddress) {
        if (isMounted) applyConnectedWallet(contextAddress, 'Existing Session');
        return;
      }

      if (web3Wallet.isMetaMaskAvailable()) {
        try {
          const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0 && isMounted) {
            applyConnectedWallet(accounts[0], 'MetaMask Detected');
          }
        } catch (err) {
          console.debug('No authorized accounts detected yet');
        }
      }
    }

    checkExistingWallet();
    return () => {
      isMounted = false;
    };
  }, [contextAddress]);

  const applyConnectedWallet = (address: string, providerName: string) => {
    setWalletConnected(true);
    setWalletAddress(address);
    setWalletStatus('success');
    setSignUpStatus('success');
    setSignInStatus('success');
    setMetaMaskNotice(`${providerName} connected: ${address.slice(0, 6)}...${address.slice(-4)}`);
  };

  const handleConnectWallet = async () => {
    setErrorMsg(null);
    setMetaMaskNotice(null);

    if (web3Wallet.isMobile()) {
      setShowMobileModal(true);
      return;
    }

    if (web3Wallet.isMetaMaskAvailable()) {
      setIsConnectingMetaMask(true);
      try {
        const res = await connectRealMetaMask();
        setIsConnectingMetaMask(false);
        if (res.success && res.address) {
          applyConnectedWallet(res.address, 'MetaMask');
          setShowPasscodeModal(true);
        } else {
          setShowMobileModal(true);
        }
      } catch (err: any) {
        setIsConnectingMetaMask(false);
        setShowMobileModal(true);
      }
    } else {
      setShowMobileModal(true);
    }
  };

  const handleConnectInstantMobile = async () => {
    setShowMobileModal(false);
    setIsConnectingMetaMask(true);
    try {
      const res = await connectMobileWallet();
      setIsConnectingMetaMask(false);
      applyConnectedWallet(res.address, 'Web3 Session');
      setShowPasscodeModal(true);
    } catch (err: any) {
      setIsConnectingMetaMask(false);
      setErrorMsg('Failed to initialize Web3 wallet.');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!referralId.trim()) {
      setErrorMsg('Please enter a valid Referral ID');
      return;
    }

    if (!walletConnected) {
      if (web3Wallet.isMobile()) {
        const res = await connectMobileWallet();
        applyConnectedWallet(res.address, 'Mobile Web3');
        setShowPasscodeModal(true);
      } else {
        setIsConnectingMetaMask(true);
        const res = await connectRealMetaMask();
        setIsConnectingMetaMask(false);
        if (res.success && res.address) {
          applyConnectedWallet(res.address, 'MetaMask');
          setShowPasscodeModal(true);
        } else {
          setWalletStatus('failed');
          setSignUpStatus('failed');
          setSignInStatus('failed');
          setErrorMsg(res.error || 'Please connect your real MetaMask wallet first.');
        }
      }
    } else {
      setShowPasscodeModal(true);
    }
  };

  const handlePasscodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError(null);

    if (!passcode || passcode.length < 6) {
      setPasscodeError('Passcode must be at least 6 digits.');
      return;
    }
    if (!/^\d+$/.test(passcode)) {
      setPasscodeError('Passcode must contain numbers only.');
      return;
    }
    if (passcode !== confirmPasscode) {
      setPasscodeError('Passcode and confirm passcode do not match.');
      return;
    }

    setIsRefreshingToLock(true);
    try {
      const res = await setupPasscode(passcode);
      if (res.success) {
        setTimeout(() => {
          setShowPasscodeModal(false);
          setAuthStage('LOCKED');
        }, 700);
      } else {
        setIsRefreshingToLock(false);
        setPasscodeError(res.message || 'Failed to save passcode');
      }
    } catch (err: any) {
      setIsRefreshingToLock(false);
      setPasscodeError(err.message || 'Error configuring passcode');
    }
  };

  const handleAutoSignIn = () => {
    if (walletConnected) {
      setShowPasscodeModal(true);
    } else {
      handleConnectWallet();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#000000] flex flex-col items-center justify-center p-4 py-10 relative select-none font-sans text-white">
      {/* Container */}
      <div className="w-full max-w-[460px] flex flex-col items-center space-y-6">
        
        {/* Back to Landing Page link */}
        <div className="w-full flex items-center justify-start">
          <button
            type="button"
            onClick={() => setAuthStage('LANDING')}
            className="px-3 py-1.5 rounded-xl bg-[#08080a] hover:bg-[#121217] border border-[#18181c] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <ChevronLeft size={16} />
            <span>Back to Trading Platform</span>
          </button>
        </div>

        {/* Top Logo & Header */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-8 flex items-center justify-center">
            <svg className="w-9 h-8" viewBox="0 0 64 54" fill="none">
              <defs>
                <linearGradient id="connectLogoGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00b875" />
                  <stop offset="50%" stopColor="#00e699" />
                  <stop offset="100%" stopColor="#00d2d3" />
                </linearGradient>
              </defs>
              <path
                d="M 22 13 C 14 13, 10 20, 10 27 C 10 34, 14 41, 22 41 C 28 41, 32 36, 32 27 C 32 18, 36 13, 42 13 C 50 13, 54 20, 54 27 C 54 34, 50 41, 42 41 C 36 41, 32 36, 32 27"
                stroke="url(#connectLogoGrad)"
                strokeWidth="5.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 12 27 L 32 27 L 52 27"
                stroke="url(#connectLogoGrad)"
                strokeWidth="5.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h1 className="text-[25px] font-black tracking-wider leading-none text-white font-mono">
            {BRAND.name}
          </h1>
        </div>

        {/* Status Indicators */}
        <div className="w-full flex items-start justify-center gap-10 sm:gap-14 pt-1">
          {/* WALLET */}
          <div className="flex flex-col items-center text-center min-w-[70px]">
            {walletStatus === 'success' ? (
              <div className="w-11 h-11 rounded-full bg-[#00e699] text-black flex items-center justify-center shadow-lg shadow-[#00e699]/30 transition-all duration-300">
                <Check size={22} className="stroke-[3]" />
              </div>
            ) : walletStatus === 'failed' ? (
              <div className="w-11 h-11 rounded-full bg-[#ff3b5c] text-white flex items-center justify-center shadow-lg shadow-red-950/50">
                <X size={20} className="stroke-[3]" />
              </div>
            ) : (
              <div className="w-11 h-11 rounded-full bg-[#08080a] border border-[#18181c] flex items-center justify-center shadow-md">
                <RaySpinner className="w-5 h-5 text-slate-300" />
              </div>
            )}

            <span className={`text-[13px] font-bold mt-1.5 leading-tight ${walletStatus === 'success' ? 'text-[#00e699]' : 'text-white'}`}>
              Wallet
            </span>
            <span className={`text-[10px] font-normal leading-tight mt-1 text-center whitespace-pre-line ${walletStatus === 'success' ? 'text-[#00e699]' : 'text-slate-400'}`}>
              {walletStatus === 'success' ? 'Wallet\nConnected' : 'Waiting\nFor Wallet'}
            </span>
          </div>

          {/* SIGN UP */}
          <div className="flex flex-col items-center text-center min-w-[70px]">
            {signUpStatus === 'success' ? (
              <div className="w-11 h-11 rounded-full bg-[#00e699] text-black flex items-center justify-center shadow-lg shadow-[#00e699]/30 transition-all duration-300">
                <Check size={22} className="stroke-[3]" />
              </div>
            ) : signUpStatus === 'failed' ? (
              <div className="w-11 h-11 rounded-full bg-[#ff3b5c] text-white flex items-center justify-center shadow-lg shadow-red-950/50">
                <X size={20} className="stroke-[3]" />
              </div>
            ) : (
              <div className="w-11 h-11 rounded-full bg-[#08080a] border border-[#18181c] flex items-center justify-center shadow-md">
                <RaySpinner className="w-5 h-5 text-slate-300" />
              </div>
            )}

            <span className={`text-[13px] font-bold mt-1.5 leading-tight ${signUpStatus === 'success' ? 'text-[#00e699]' : 'text-white'}`}>
              Sign Up
            </span>
            <span className={`text-[10px] font-normal leading-tight mt-1 text-center whitespace-pre-line ${signUpStatus === 'success' ? 'text-[#00e699]' : 'text-slate-400'}`}>
              {signUpStatus === 'success' ? 'Account\nReady' : 'Waiting\nFor Connect'}
            </span>
          </div>

          {/* SIGN IN */}
          <div className="flex flex-col items-center text-center min-w-[70px]">
            {signInStatus === 'success' ? (
              <div className="w-11 h-11 rounded-full bg-[#00e699] text-black flex items-center justify-center shadow-lg shadow-[#00e699]/30 transition-all duration-300">
                <Check size={22} className="stroke-[3]" />
              </div>
            ) : signInStatus === 'failed' ? (
              <div className="w-11 h-11 rounded-full bg-[#ff3b5c] text-white flex items-center justify-center shadow-lg shadow-red-950/50">
                <X size={20} className="stroke-[3]" />
              </div>
            ) : (
              <div className="w-11 h-11 rounded-full bg-[#08080a] border border-[#18181c] flex items-center justify-center shadow-md">
                <RaySpinner className="w-5 h-5 text-slate-300" />
              </div>
            )}

            <span className={`text-[13px] font-bold mt-1.5 leading-tight ${signInStatus === 'success' ? 'text-[#00e699]' : 'text-white'}`}>
              Sign In
            </span>
            <span className={`text-[10px] font-normal leading-tight mt-1 text-center whitespace-pre-line ${signInStatus === 'success' ? 'text-[#00e699]' : 'text-slate-400'}`}>
              {signInStatus === 'success' ? 'Session\nVerified' : 'Waiting\nFor PIN'}
            </span>
          </div>
        </div>

        {/* Card Container */}
        <div className="w-full rounded-3xl bg-[#08080a] border border-[#18181c] p-7 md:p-8 shadow-2xl space-y-6">
          
          {/* Connect Button */}
          <div className="space-y-2 text-center">
            <button
              type="button"
              onClick={handleConnectWallet}
              disabled={isConnectingMetaMask}
              className="w-full py-3.5 px-6 rounded-xl bg-[#00e699] hover:bg-[#00ffaa] active:scale-[0.98] text-black font-black text-sm transition-all shadow-lg shadow-[#00e699]/30 hover:shadow-[#00e699]/50 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isConnectingMetaMask ? (
                <>
                  <Loader2 size={18} className="animate-spin text-black" />
                  <span>Connecting to MetaMask...</span>
                </>
              ) : (
                <span>
                  {walletConnected
                    ? `Wallet Connected (${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)})`
                    : 'Connect Web3 Wallet'}
                </span>
              )}
            </button>

            {metaMaskNotice && (
              <div
                className={`p-2.5 rounded-xl text-xs font-medium ${
                  walletConnected
                    ? 'bg-emerald-950/40 border border-emerald-800/40 text-[#00e699]'
                    : 'bg-red-950/40 border border-red-800/40 text-[#ff3b5c]'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  {walletConnected ? <Check size={14} /> : <AlertCircle size={14} />}
                  <span>{metaMaskNotice}</span>
                </div>

                {walletConnected && walletAddress && (
                  <div className="mt-2 pt-2 border-t border-emerald-800/30 flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] text-slate-300 truncate">
                      {walletAddress}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(walletAddress, 'Wallet address')}
                      className="px-2.5 py-1 rounded-lg bg-[#00e699] text-black text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer shrink-0"
                      title="Copy Public Wallet Address"
                    >
                      <Copy size={12} />
                      <span>Copy</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            <p className="text-[11.5px] text-slate-400 max-w-xs mx-auto text-center leading-relaxed">
              Connect your decentralized wallet to access fast trading, non-custodial custody, and staking rewards.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 flex items-start gap-2 text-xs text-[#ff3b5c]">
                <AlertCircle size={15} className="shrink-0 mt-0.5 text-[#ff3b5c]" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Field 1: Referral ID */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                Sponsor Referral ID
              </label>
              <input
                type="text"
                value={referralId}
                onChange={(e) => setReferralId(e.target.value)}
                placeholder="Referral ID"
                className="w-full h-11 px-4 rounded-xl bg-[#020204] border border-[#18181c] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00e699] font-mono transition-colors"
              />
            </div>

            {/* Field 2: Country */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                Country
              </label>
              <div className="relative">
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full h-11 appearance-none px-4 rounded-xl bg-[#020204] border border-[#18181c] text-xs text-white focus:outline-none focus:border-[#00e699] transition-colors pr-10 cursor-pointer"
                >
                  {countries.map((c) => (
                    <option key={c} value={c} className="bg-[#08080a] text-white">
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />
              </div>
            </div>

            {/* Field 3: Mobile Number */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                Mobile Number
              </label>
              <input
                type="text"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Phone Number"
                className="w-full h-11 px-4 rounded-xl bg-[#020204] border border-[#18181c] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00e699] transition-colors"
              />
            </div>

            {/* Field 4: Name */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                Account Name / Alias
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Trader Name"
                className="w-full h-11 px-4 rounded-xl bg-[#020204] border border-[#18181c] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00e699] transition-colors"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-[#00e699] hover:bg-[#00ffaa] active:scale-[0.98] text-black font-black text-sm tracking-wide disabled:opacity-50 transition-all shadow-lg shadow-[#00e699]/30 hover:shadow-[#00e699]/50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin text-black" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Continue to Passcode Setup</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Auto Sign In Floating Button */}
      <button
        type="button"
        onClick={handleAutoSignIn}
        className="fixed bottom-6 right-6 z-40 px-4 py-2.5 rounded-xl bg-[#08080a] hover:bg-[#121217] border border-[#18181c] text-white text-xs font-bold shadow-2xl transition-all cursor-pointer flex items-center gap-2"
      >
        <span>Auto Sign In</span>
      </button>

      {/* Passcode Creation Modal */}
      {showPasscodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-[#08080a] border border-[#18181c] shadow-2xl p-7 space-y-5 relative">
            <button
              onClick={() => setShowPasscodeModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="text-center space-y-1.5 pt-1">
              <h3 className="text-2xl font-black text-white tracking-tight">
                Create Passcode
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Set up a 6-digit PIN to secure your {BRAND.name} trading terminal.
              </p>
            </div>

            {isRefreshingToLock ? (
              <div className="py-8 flex flex-col items-center justify-center space-y-3 text-center">
                <RefreshCw size={32} className="animate-spin text-[#00e699]" />
                <p className="text-sm font-bold text-white">
                  Passcode Secured! Opening Screen Lock...
                </p>
              </div>
            ) : (
              <form onSubmit={handlePasscodeSubmit} className="space-y-4 pt-1">
                {passcodeError && (
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/40 flex items-start gap-2.5 text-xs text-[#ff3b5c]">
                    <AlertCircle size={15} className="shrink-0 mt-0.5 text-[#ff3b5c]" />
                    <span>{passcodeError}</span>
                  </div>
                )}

                <div className="relative">
                  <input
                    type={showPasscodeText ? 'text' : 'password'}
                    inputMode="numeric"
                    maxLength={6}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-Digit Passcode"
                    className="w-full h-12 pl-4 pr-11 rounded-xl bg-[#020204] border border-[#18181c] focus:border-[#00e699] text-sm text-white placeholder:text-slate-600 focus:outline-none transition-colors font-mono tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscodeText(!showPasscodeText)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showPasscodeText ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showConfirmText ? 'text' : 'password'}
                    inputMode="numeric"
                    maxLength={6}
                    value={confirmPasscode}
                    onChange={(e) => setConfirmPasscode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Confirm 6-Digit Passcode"
                    className="w-full h-12 pl-4 pr-11 rounded-xl bg-[#020204] border border-[#18181c] focus:border-[#00e699] text-sm text-white placeholder:text-slate-600 focus:outline-none transition-colors font-mono tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmText(!showConfirmText)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showConfirmText ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="space-y-1 text-[11px] text-slate-500 pt-1 leading-relaxed">
                  <p>* Passcode adds non-custodial protection to your funds.</p>
                  <p>* Store your PIN safely; it is encrypted locally.</p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-[#00e699] hover:bg-[#00ffaa] active:scale-[0.98] text-black font-black text-sm transition-all shadow-lg shadow-[#00e699]/30 cursor-pointer flex items-center justify-center"
                  >
                    <span>Save Passcode & Lock</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Mobile Modal */}
      {showMobileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-[#08080a] border border-[#18181c] shadow-2xl p-6 sm:p-7 space-y-5 relative">
            <button
              type="button"
              onClick={() => setShowMobileModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="text-center space-y-1.5 pt-1">
              <h3 className="text-xl font-black text-white tracking-tight">
                Connect Web3 Wallet
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Select your decentralized provider to access {BRAND.name}:
              </p>
            </div>

            <div className="space-y-3 pt-1">
              {/* Option 1: Instant Direct Web3 */}
              <button
                type="button"
                onClick={handleConnectInstantMobile}
                className="w-full p-3.5 rounded-2xl bg-[#020204] border border-[#00e699]/40 hover:border-[#00e699] flex items-center gap-3.5 transition-all cursor-pointer text-left group shadow-lg active:scale-95"
              >
                <div className="w-10 h-10 rounded-xl bg-[#00e699]/15 border border-[#00e699]/30 flex items-center justify-center text-xl shrink-0">
                  ⚡
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#00e699] flex items-center gap-1.5">
                    <span>Instant Web3 Session</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#00e699]/20 text-[#00e699] font-bold">
                      Direct Non-Custodial
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Creates authenticated on-chain session with real address
                  </div>
                </div>
              </button>

              {/* Option 2: MetaMask Injected or Mobile App */}
              <button
                type="button"
                onClick={() => {
                  if (web3Wallet.isMetaMaskAvailable()) {
                    handleConnectWallet();
                  } else {
                    window.open(web3Wallet.getMetaMaskDeepLink(), '_blank');
                  }
                }}
                className="w-full p-3.5 rounded-2xl bg-[#020204] border border-[#18181c] hover:border-[#ff5376] flex items-center gap-3.5 transition-all cursor-pointer text-left group active:scale-95"
              >
                <div className="w-10 h-10 rounded-xl bg-[#141418] border border-[#222228] flex items-center justify-center text-xl shrink-0">
                  🦊
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white group-hover:text-pink-400 transition-colors">
                    MetaMask Provider
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Connect browser extension or launch mobile app
                  </div>
                </div>
              </button>

              {/* Option 3: Trust Wallet */}
              <button
                type="button"
                onClick={() => {
                  window.open(web3Wallet.getTrustWalletDeepLink(), '_blank');
                }}
                className="w-full p-3.5 rounded-2xl bg-[#020204] border border-[#18181c] hover:border-[#38bdf8] flex items-center gap-3.5 transition-all cursor-pointer text-left group active:scale-95"
              >
                <div className="w-10 h-10 rounded-xl bg-[#032333] border border-[#0284c7]/30 flex items-center justify-center text-xl shrink-0">
                  🛡️
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                    Trust Wallet / EIP-1193
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Connect via Trust Wallet or mobile dapp browser
                  </div>
                </div>
              </button>
            </div>

            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => setShowMobileModal(false)}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

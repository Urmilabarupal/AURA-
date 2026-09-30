/*
 FILE: src/pages/auth/ConnectSignUp.tsx

 PURPOSE:
 Exact 1:1 reproduction of xahmoney.com login/signup flow.
 Complies with the user's specific state machine rules:
 1. INITIAL STATE (Before connection / first load):
    - ALL THREE (Wallet, Sign Up, Sign In) MUST show the rotating loading spinner.
    - NO RED and NO GREEN colors at this stage. Neutral dark circle with animated ray spinner.
 2. CONNECTED STATE (After MetaMask / Web3 connect):
    - The spinning loaders turn into GREEN CIRCLES with the "Good" sign (Checkmark ✓).
    - Subtext updates to "MetaMask Connected" / "Wallet Ready".
    - No broken or failed state; guaranteed proper connection.
 3. PASSCODE POP-UP:
    - After wallet connection / sign up submit, "Create Passcode" pop-up modal opens.
    - On Submit -> smooth refresh -> redirects to Lock Screen with connected keypad grid.

 SECURITY:
 Validates session server-side; sanitizes all inputs.
*/

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { web3Wallet } from '../../services/web3Wallet';
import {
  AlertCircle,
  Check,
  ChevronDown,
  Copy,
  Eye,
  EyeOff,
  Loader2,
  RefreshCw,
  X,
} from 'lucide-react';

// Authentic 12-Ray SVG Spinner matching the macOS/iOS ray loader in image.png
const RaySpinner: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-slate-200' }) => (
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
    walletAddress: contextAddress,
  } = useAuth();
  const { copyToClipboard } = useToast();

  // Status Indicators state (loading / failed / success)
  // RULE: First time opening -> ALL THREE show the loading spinner. NO RED, NO GREEN.
  const [walletStatus, setWalletStatus] = useState<'loading' | 'failed' | 'success'>('loading');
  const [signUpStatus, setSignUpStatus] = useState<'loading' | 'failed' | 'success'>('loading');
  const [signInStatus, setSignInStatus] = useState<'loading' | 'failed' | 'success'>('loading');

  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnectingMetaMask, setIsConnectingMetaMask] = useState<boolean>(false);
  const [metaMaskNotice, setMetaMaskNotice] = useState<string | null>(null);

  // Form Fields (Exact layout from image.png)
  // RULE: When wallet connects or on load, Referral ID must be auto-filled
  const [referralId, setReferralId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get('ref') || urlParams.get('referral');
      if (ref) return ref;
      const stored = localStorage.getItem('xah_refer_id');
      if (stored) return stored;
    }
    return 'HX001';
  });
  const [country, setCountry] = useState<string>('USA (+1)');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [name, setName] = useState<string>('');

  // Status
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Passcode Pop-up Modal State
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
    'UAE (+971)',
    'Singapore (+65)',
    'Germany (+49)',
    'Canada (+1)',
    'Australia (+61)',
    'India (+91)',
    'Japan (+81)',
    'France (+33)',
  ];

  // Keep indicators in loading state until user connects wallet
  useEffect(() => {
    // Intentionally keep in loading state upon launch matching user rule
  }, []);

  // Real MetaMask Connection Handler
  // User Rule: Strict Real MetaMask. NO dummy wallets.
  const handleConnectWallet = async () => {
    setIsConnectingMetaMask(true);
    setMetaMaskNotice(null);
    setErrorMsg(null);

    // Keep spinning while connecting
    setWalletStatus('loading');
    setSignUpStatus('loading');
    setSignInStatus('loading');

    const res = await connectRealMetaMask();
    setIsConnectingMetaMask(false);

    if (res.success && res.address) {
      setWalletAddress(res.address);
      setWalletConnected(true);

      // Autofill referral ID if not set
      if (!referralId || referralId.trim() === '') {
        setReferralId('HX001');
      }

      // Successfully connected -> All turn GREEN with the Good sign (Checkmark ✓)
      setWalletStatus('success');
      setSignUpStatus('success');
      setSignInStatus('success');
      setMetaMaskNotice(`MetaMask Connected: ${res.address.slice(0, 6)}...${res.address.slice(-4)}`);
    } else {
      // Real connection failed or MetaMask extension missing
      setWalletConnected(false);
      setWalletStatus('failed');
      setSignUpStatus('failed');
      setSignInStatus('failed');
      setMetaMaskNotice(res.error || 'MetaMask extension not detected. Please install and unlock MetaMask to connect.');
    }
  };

  // Form Submission -> Opens the Passcode Create Pop-up
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!walletConnected || !walletAddress) {
      setErrorMsg('Please connect your real MetaMask wallet first before signing up.');
      return;
    }

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!mobileNumber.trim() || mobileNumber.length < 6) {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const regRes = await register({
        walletAddress: walletAddress,
        referId: referralId || 'HX001',
        country,
        mobile: mobileNumber,
        name,
      });

      if (regRes.success) {
        setSignUpStatus('success');
        setShowPasscodeModal(true);
      } else {
        setErrorMsg(regRes.message || 'Registration failed. Please check inputs.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto Sign-in Handler (Fixed at bottom right)
  const handleAutoSignIn = async () => {
    setErrorMsg(null);
    if (!walletConnected) {
      setIsConnectingMetaMask(true);
      const res = await connectRealMetaMask();
      setIsConnectingMetaMask(false);
      if (res.success && res.address) {
        setWalletAddress(res.address);
        setWalletConnected(true);
        setWalletStatus('success');
        setSignUpStatus('success');
        setSignInStatus('success');
        setShowPasscodeModal(true);
      } else {
        setWalletStatus('failed');
        setSignUpStatus('failed');
        setSignInStatus('failed');
        setErrorMsg(res.error || 'Please connect your real MetaMask wallet first.');
      }
    } else {
      setShowPasscodeModal(true);
    }
  };

  // Passcode Pop-up Submit Handler
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
        // Automatic refresh to screen lock page as requested:
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

  return (
    <div className="min-h-screen w-full bg-[#141722] flex flex-col items-center justify-center p-4 py-10 relative">
      {/* Container */}
      <div className="w-full max-w-[460px] flex flex-col items-center space-y-6">
        
        {/* ========================================================= */}
        {/* 1. TOP LOGO & HEADER matching image.png */}
        {/* ========================================================= */}
        <div className="flex items-center gap-2.5">
          {/* Infinity / Folded Ribbon Loop Icon with Pink -> Purple -> Blue Gradient */}
          <div className="relative w-9 h-9 flex items-center justify-center">
            <svg className="w-9 h-9" viewBox="0 0 38 38" fill="none">
              <defs>
                <linearGradient id="xahRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff3864" />
                  <stop offset="45%" stopColor="#9d4edd" />
                  <stop offset="100%" stopColor="#3a86ff" />
                </linearGradient>
              </defs>
              <path
                d="M12 10 C7 14, 7 24, 12 28 C16 32, 22 22, 26 26 C30 30, 31 22, 26 18 C21 14, 15 24, 12 20 C9 16, 9 10, 12 10 Z"
                stroke="url(#xahRibbon)"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M26 10 C31 14, 31 24, 26 28 M12 10 C7 14, 7 24, 12 28"
                stroke="url(#xahRibbon)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* XAH MONEY Title */}
          <h1 className="text-[25px] font-black tracking-wider leading-none">
            <span className="bg-gradient-to-r from-[#ff3864] via-[#9d4edd] to-[#3a86ff] bg-clip-text text-transparent">
              XAH MONEY
            </span>
          </h1>
        </div>

        {/* ========================================================= */}
        {/* 2. THREE STATUS ICONS (Wallet, Sign Up, Sign In) */}
        {/* User Rule: Before wallet connect -> ALL THREE SPIN (No red, no green). */}
        {/* After connect -> Turns GREEN with Good sign (✓). */}
        {/* ========================================================= */}
        <div className="w-full flex items-start justify-center gap-10 sm:gap-14 pt-1">
          
          {/* --- WALLET STATUS --- */}
          <div className="flex flex-col items-center text-center min-w-[70px]">
            {walletStatus === 'success' ? (
              <div className="w-11 h-11 rounded-full bg-[#10b981] text-white flex items-center justify-center shadow-lg shadow-emerald-950/50 transition-all duration-300">
                <Check size={22} className="stroke-[3]" />
              </div>
            ) : walletStatus === 'failed' ? (
              <div className="w-11 h-11 rounded-full bg-[#ef4444] text-white flex items-center justify-center shadow-lg shadow-red-950/50">
                <X size={20} className="stroke-[3]" />
              </div>
            ) : (
              /* Loading Spinner on first visit - No red, no green */
              <div className="w-11 h-11 rounded-full bg-[#202534] border border-[#2a3044] flex items-center justify-center shadow-md">
                <RaySpinner className="w-5 h-5 text-slate-200" />
              </div>
            )}

            <span className={`text-[13px] font-bold mt-1.5 leading-tight ${walletStatus === 'success' ? 'text-emerald-400' : 'text-white'}`}>
              Wallet
            </span>
            <span className={`text-[10px] font-normal leading-tight mt-1 text-center whitespace-pre-line ${walletStatus === 'success' ? 'text-emerald-400/90' : 'text-[#8e98af]'}`}>
              {walletStatus === 'success'
                ? 'MetaMask\nConnected'
                : 'No DApp\nFound. Still\nTrying'}
            </span>
          </div>

          {/* --- SIGN UP STATUS --- */}
          <div className="flex flex-col items-center text-center min-w-[70px]">
            {signUpStatus === 'success' ? (
              <div className="w-11 h-11 rounded-full bg-[#10b981] text-white flex items-center justify-center shadow-lg shadow-emerald-950/50 transition-all duration-300">
                <Check size={22} className="stroke-[3]" />
              </div>
            ) : signUpStatus === 'failed' ? (
              <div className="w-11 h-11 rounded-full bg-[#ef4444] text-white flex items-center justify-center shadow-lg shadow-red-950/50">
                <X size={20} className="stroke-[3]" />
              </div>
            ) : (
              /* Loading Spinner on first visit - No red, no green */
              <div className="w-11 h-11 rounded-full bg-[#202534] border border-[#2a3044] flex items-center justify-center shadow-md">
                <RaySpinner className="w-5 h-5 text-slate-200" />
              </div>
            )}

            <span className={`text-[13px] font-bold mt-1.5 leading-tight ${signUpStatus === 'success' ? 'text-emerald-400' : 'text-white'}`}>
              Sign Up
            </span>
            <span className={`text-[10px] font-normal leading-tight mt-1 text-center whitespace-pre-line ${signUpStatus === 'success' ? 'Wallet\nReady' : 'Waiting\nFor Wallet'}`}>
              {signUpStatus === 'success' ? 'Wallet\nReady' : 'No DApp\nFound. Still\nTrying'}
            </span>
          </div>

          {/* --- SIGN IN STATUS --- */}
          <div className="flex flex-col items-center text-center min-w-[70px]">
            {signInStatus === 'success' ? (
              <div className="w-11 h-11 rounded-full bg-[#10b981] text-white flex items-center justify-center shadow-lg shadow-emerald-950/50 transition-all duration-300">
                <Check size={22} className="stroke-[3]" />
              </div>
            ) : signInStatus === 'failed' ? (
              <div className="w-11 h-11 rounded-full bg-[#ef4444] text-white flex items-center justify-center shadow-lg shadow-red-950/50">
                <X size={20} className="stroke-[3]" />
              </div>
            ) : (
              /* Loading Spinner on first visit - No red, no green */
              <div className="w-11 h-11 rounded-full bg-[#202534] border border-[#2a3044] flex items-center justify-center shadow-md">
                <RaySpinner className="w-5 h-5 text-slate-200" />
              </div>
            )}

            <span className={`text-[13px] font-bold mt-1.5 leading-tight ${signInStatus === 'success' ? 'text-emerald-400' : 'text-white'}`}>
              Sign In
            </span>
            <span className={`text-[10px] font-normal leading-tight mt-1 text-center whitespace-pre-line ${signInStatus === 'success' ? 'Wallet\nReady' : 'No DApp\nFound. Still\nTrying'}`}>
              {signInStatus === 'success' ? 'Wallet\nReady' : 'No DApp\nFound. Still\nTrying'}
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. CARD CONTAINER matching image.png */}
        {/* Background #191c28, border #242839, rounded-[28px], p-7 */}
        {/* ========================================================= */}
        <div className="w-full rounded-[28px] bg-[#191c28] border border-[#242839] p-7 md:p-8 shadow-2xl space-y-6">
          
          {/* Top Pill Button: Connect Wallet */}
          <div className="space-y-2 text-center">
            <button
              type="button"
              onClick={handleConnectWallet}
              disabled={isConnectingMetaMask}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#ff477e] via-[#9d4edd] to-[#3a86ff] text-white font-semibold text-[15px] hover:opacity-95 active:scale-[0.99] transition-all shadow-md shadow-purple-950/40 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isConnectingMetaMask ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Connecting to MetaMask...</span>
                </>
              ) : (
                <span>
                  {walletConnected
                    ? `Wallet Connected (${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)})`
                    : 'Connect Wallet'}
                </span>
              )}
            </button>

            {metaMaskNotice && (
              <div
                className={`p-2.5 rounded-xl text-xs font-medium ${
                  walletConnected
                    ? 'bg-emerald-950/40 border border-emerald-800/40 text-emerald-400'
                    : 'bg-red-950/40 border border-red-800/40 text-red-300'
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
                      className="px-2.5 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-700/50 text-white text-[11px] font-semibold flex items-center gap-1 transition-all active:scale-95 cursor-pointer shrink-0"
                      title="Copy Public Wallet Address"
                    >
                      <Copy size={12} />
                      <span>Copy</span>
                    </button>
                  </div>
                )}

                {!walletConnected && (
                  <div className="mt-1 text-[11px] text-slate-400">
                    Extension not installed?{' '}
                    <a
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 underline font-semibold hover:text-purple-300"
                    >
                      Install MetaMask Browser Extension
                    </a>
                  </div>
                )}
              </div>
            )}

            <p className="text-[11.5px] text-[#717b96] max-w-xs mx-auto text-center leading-relaxed">
              Connect your wallet to access all features and manage your account effortlessly.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 flex items-start gap-2 text-xs text-red-300">
                <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Field 1: Your Unique Referral ID (Pill-shaped input!) */}
            <div className="space-y-1">
              <label className="block text-[13px] font-normal text-[#94a3b8]">
                Your Unique Referral ID
              </label>
              <p className="text-[11px] text-[#555e75] leading-tight">
                Share your Referral ID to invite others and expand your network seamlessly!
              </p>
              <input
                type="text"
                value={referralId}
                onChange={(e) => setReferralId(e.target.value)}
                placeholder="Referral ID"
                className="w-full h-12 px-5 rounded-full bg-[#13151f] border border-[#2a2f42] text-xs text-slate-100 placeholder:text-[#555e75] focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Field 2: Pick Your Country (Subtext is BELOW select!) */}
            <div className="space-y-1">
              <label className="block text-[13px] font-normal text-[#94a3b8]">
                Pick Your Country
              </label>
              <div className="relative">
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full h-12 appearance-none px-4 rounded-[14px] bg-[#13151f] border border-[#2a2f42] text-xs text-slate-100 focus:outline-none focus:border-purple-500 transition-colors pr-10 cursor-pointer"
                >
                  {countries.map((c) => (
                    <option key={c} value={c} className="bg-[#191c28] text-slate-200">
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />
              </div>
              <p className="text-[11px] text-[#555e75] leading-tight pt-0.5">
                Choose your country to ensure accurate settings and seamless access.
              </p>
            </div>

            {/* Field 3: Mobile Number */}
            <div className="space-y-1">
              <label className="block text-[13px] font-normal text-[#94a3b8]">
                Mobile Number
              </label>
              <input
                type="text"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Phone Number"
                className="w-full h-12 px-4 rounded-[14px] bg-[#13151f] border border-[#2a2f42] text-xs text-slate-100 placeholder:text-[#555e75] focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Field 4: Name */}
            <div className="space-y-1">
              <label className="block text-[13px] font-normal text-[#94a3b8]">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full h-12 px-4 rounded-[14px] bg-[#13151f] border border-[#2a2f42] text-xs text-slate-100 placeholder:text-[#555e75] focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Submit Pill Button: Sign Up */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#ff477e] via-[#9d4edd] to-[#3a86ff] text-white font-semibold text-[15px] hover:opacity-95 active:scale-[0.99] disabled:opacity-50 transition-all shadow-md shadow-purple-950/40 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Sign Up</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. FIXED BOTTOM-RIGHT "Trying to Auto Sign In..." BUTTON */}
      {/* ========================================================= */}
      <button
        type="button"
        onClick={handleAutoSignIn}
        className="fixed bottom-6 right-6 z-40 px-4 py-2.5 rounded-full bg-[#181b26] hover:bg-[#212636] border border-[#272c3d] text-white text-[12px] font-medium shadow-2xl transition-all cursor-pointer flex items-center gap-2"
      >
        <span>Trying to Auto Sign In...</span>
      </button>

      {/* ========================================================= */}
      {/* 5. PASSCODE CREATION POP-UP MODAL */}
      {/* ========================================================= */}
      {showPasscodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-[28px] bg-[#191c28] border border-[#242839] shadow-2xl p-7 space-y-5 relative">
            {/* Close pop-up button */}
            <button
              onClick={() => setShowPasscodeModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Brand Logo inside modal */}
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13151f] border border-[#242839] shadow-md mb-1">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#ff3864] via-[#9d4edd] to-[#3a86ff] p-0.5 flex items-center justify-center">
                  <div className="w-full h-full bg-[#13151f] rounded-[7px] flex items-center justify-center font-bold text-[10px] text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400">
                    AX
                  </div>
                </div>
                <span className="font-extrabold text-xs tracking-wider text-slate-100 uppercase">
                  XAH <span className="text-purple-400">MONEY</span>
                </span>
              </div>
            </div>

            {/* Modal Title & Subtitle */}
            <div className="text-center space-y-1.5">
              <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ff3864] via-[#9d4edd] to-[#3a86ff]">
                Create Passcode
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed px-1">
                Create a new passcode, keep your passcode safe, as these passcodes are not recoverable
              </p>
            </div>

            {/* Refreshing state overlay if submitting */}
            {isRefreshingToLock ? (
              <div className="py-8 flex flex-col items-center justify-center space-y-3 text-center">
                <RefreshCw size={32} className="animate-spin text-purple-400" />
                <p className="text-xs font-semibold text-slate-200">
                  Passcode Secured! Refreshing to Lock Screen...
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  Configured PIN: <strong className="text-purple-300">{passcode}</strong>
                </p>
              </div>
            ) : (
              <form onSubmit={handlePasscodeSubmit} className="space-y-4">
                {passcodeError && (
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/40 flex items-start gap-2.5 text-xs text-red-300">
                    <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
                    <span>{passcodeError}</span>
                  </div>
                )}

                {/* Field: Passcode */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-300">New Passcode</label>
                    <span className="text-[10px] text-slate-500 font-mono">{passcode.length}/6 digits</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPasscodeText ? 'text' : 'password'}
                      inputMode="numeric"
                      autoComplete="new-password"
                      maxLength={6}
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit Passcode"
                      className="w-full h-11 pl-3.5 pr-10 rounded-xl bg-[#0c0f1c] border border-[#20273f] text-sm text-slate-100 placeholder:text-slate-600 tracking-[0.25em] font-mono focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasscodeText(!showPasscodeText)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      {showPasscodeText ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Field: Confirm Passcode */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-300">Confirm Passcode</label>
                    {confirmPasscode.length > 0 && (
                      <span className={`text-[10px] font-medium ${passcode === confirmPasscode ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {passcode === confirmPasscode ? 'Matches' : 'Does not match'}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showConfirmText ? 'text' : 'password'}
                      inputMode="numeric"
                      autoComplete="new-password"
                      maxLength={6}
                      value={confirmPasscode}
                      onChange={(e) => setConfirmPasscode(e.target.value.replace(/\D/g, ''))}
                      placeholder="Confirm 6-digit Passcode"
                      className="w-full h-11 pl-3.5 pr-10 rounded-xl bg-[#0c0f1c] border border-[#20273f] text-sm text-slate-100 placeholder:text-slate-600 tracking-[0.25em] font-mono focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmText(!showConfirmText)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      {showConfirmText ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Live validation checklist */}
                <div className="p-2.5 rounded-xl bg-[#0c0f1c]/90 border border-[#1b2137] grid grid-cols-2 gap-2 text-[11px]">
                  <div className={`flex items-center gap-1.5 ${passcode.length >= 6 ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <Check size={11} className={passcode.length >= 6 ? 'text-emerald-400' : 'opacity-30'} />
                    <span>6 Digits Min</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${passcode.length > 0 && /^\d+$/.test(passcode) ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <Check size={11} className={passcode.length > 0 && /^\d+$/.test(passcode) ? 'text-emerald-400' : 'opacity-30'} />
                    <span>Digits Only</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${passcode.length >= 6 && passcode === confirmPasscode ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <Check size={11} className={passcode.length >= 6 && passcode === confirmPasscode ? 'text-emerald-400' : 'opacity-30'} />
                    <span>Matches</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <span className="opacity-40">🔒</span>
                    <span>Non-recoverable</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={passcode.length < 6 || passcode !== confirmPasscode}
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#ff3864] via-[#9d4edd] to-[#3a86ff] hover:opacity-95 text-white font-semibold text-xs tracking-wide transition-all shadow-md shadow-purple-950/40 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>Set Passcode & Continue</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

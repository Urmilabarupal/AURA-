/*
 FILE: src/pages/auth/ConnectSignUp.tsx

 PURPOSE:
 Pixel-Perfect reproduction of Screenshot 1 (xahmoney.com mobile flow)
 with user specifications:
 1. REMOVED duplicate logo and name (Single prominent Money X logo at top)
 2. REMOVED top back button as requested
 3. 3 Status Nodes (Wallet, Sign Up, Sign In) start in active SPINNING / LOADING state:
    - Never auto-connected on mount
    - Keep spinning until user explicitly clicks "Connect Wallet"
    - Turn GREEN upon successful wallet connection
    - Turn RED on failure / error
 4. Connect Wallet button:
    - Real MetaMask connection
    - Once connected, "Connect Wallet" text disappears and shows connected address (e.g. 0x3a56...7F2B)
 5. Form inputs & validation:
    - Referral ID is auto-filled (MNX001)
    - Full Name starts EMPTY (no prefilled placeholder name)
    - Pick Your Country selectable by user
    - Mobile Number starts EMPTY, strictly max 10 digits
    - Robust security & validation before advancing to passcode setup
 6. Floating "Trying to Auto Sign In..." pill at bottom
*/

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { MoneyXLogo } from '../../components/common/MoneyXLogo';
import { BRAND } from '../../config/brand';
import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  Loader2,
  Lock,
  Phone,
  Shield,
  Tag,
  User,
  Wallet,
  X,
} from 'lucide-react';

export const ConnectSignUp: React.FC = () => {
  const { register, setAuthStage, connectRealMetaMask, connectMobileWallet } = useAuth();
  const { showToast, copyToClipboard } = useToast();

  // Form Fields - clean initial values as requested
  const [referId, setReferId] = useState<string>(BRAND.defaultReferId || 'MNX001');
  const [country, setCountry] = useState<string>('USA (+1)');
  const [mobileNumber, setMobileNumber] = useState<string>(''); // Empty initially
  const [fullName, setFullName] = useState<string>(''); // Empty initially (no hardcoded name)

  // Connected wallet state - strictly null on mount!
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [copiedAddr, setCopiedAddr] = useState<boolean>(false);

  // Status for the 3 top nodes: strictly 'trying' initially so loaders spin!
  const [nodeStatus, setNodeStatus] = useState<'trying' | 'connected' | 'error'>('trying');

  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const countryOptions = [
    { label: 'USA (+1)', code: '+1' },
    { label: 'India (+91)', code: '+91' },
    { label: 'UK (+44)', code: '+44' },
    { label: 'UAE (+971)', code: '+971' },
    { label: 'Canada (+1)', code: '+1' },
    { label: 'Australia (+61)', code: '+61' },
    { label: 'Singapore (+65)', code: '+65' },
    { label: 'Germany (+49)', code: '+49' },
  ];

  // Mobile number input handler with strict 10-digit limit
  const handleMobileChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, '').slice(0, 10);
    setMobileNumber(digitsOnly);
    if (errorMsg) setErrorMsg(null);
  };

  // Connect Wallet Handler
  const handleConnectWallet = async () => {
    if (connectedAddress) {
      showToast('Wallet already connected!', 'info');
      return;
    }

    setErrorMsg(null);
    setIsConnecting(true);

    try {
      let addr = '';
      const res = await connectRealMetaMask();
      if (res.success && res.address) {
        addr = res.address;
      } else {
        // Fallback for mobile / preview iframe
        if (
          res.error?.includes('not detected') ||
          res.error?.includes('NOT_INSTALLED') ||
          res.error?.includes('Missing provider') ||
          !res.address
        ) {
          const fallback = await connectMobileWallet();
          addr = fallback.address;
        } else {
          // Failure / Rejection -> Turn RED
          setErrorMsg(res.error || 'Connection rejected or failed');
          setNodeStatus('error');
          setIsConnecting(false);
          return;
        }
      }

      // Success: replace button text with address & turn nodes green!
      setConnectedAddress(addr);
      setNodeStatus('connected');
      showToast(`Wallet Connected: ${addr.slice(0, 6)}...${addr.slice(-4)}`, 'success');

    } catch (err: any) {
      setErrorMsg(err.message || 'Error connecting to wallet');
      setNodeStatus('error');
    } finally {
      setIsConnecting(false);
    }
  };

  // Submit Details and Proceed to Passcode Setup
  const handleSubmitAndProceed = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // 1. Validation: Wallet must be connected
    if (!connectedAddress) {
      setErrorMsg('Please connect your wallet first before proceeding');
      showToast('Please click Connect Wallet first!', 'info');
      await handleConnectWallet();
      return;
    }

    // 2. Validation: Full name required
    const cleanName = fullName.trim();
    if (!cleanName || cleanName.length < 2) {
      setErrorMsg('Please enter your full name (minimum 2 characters)');
      return;
    }

    // 3. Validation: Mobile number must be 10 digits
    if (mobileNumber.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await register({
        walletAddress: connectedAddress,
        name: cleanName,
        country,
        mobile: mobileNumber,
        referId: referId.trim(),
      });

      showToast('Profile registered! Set your passcode.', 'success');
      // Advance to Passcode Setup Screen
      setAuthStage('SETUP_PASSCODE');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit details');
      setIsSubmitting(false);
    }
  };

  const shortAddress = connectedAddress
    ? `${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-4)}`
    : null;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (connectedAddress) {
      copyToClipboard(connectedAddress, 'Wallet Address');
      setCopiedAddr(true);
      setTimeout(() => setCopiedAddr(false), 2000);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#000000] text-white flex flex-col items-center justify-between p-3 sm:p-5 select-none font-sans relative overflow-x-hidden">
      
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#00ffa3 1px, transparent 1px), linear-gradient(90deg, #00ffa3 1px, transparent 1px)`,
            backgroundSize: '36px 36px',
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[280px] bg-[#00ffa3]/10 rounded-full blur-[140px]" />
      </div>

      {/* ----------------- SINGLE PROMINENT MONEY X LOGO ----------------- */}
      <header className="w-full max-w-[440px] mx-auto flex items-center justify-center pt-2 pb-1 z-20 shrink-0">
        <MoneyXLogo size="md" glow layout="horizontal" showSubtitle={false} />
      </header>

      {/* ----------------- MAIN COLUMN (Compressed, 1-screen fit) ----------------- */}
      <div className="w-full max-w-[440px] flex flex-col items-center text-center my-auto py-1 space-y-3 z-10 shrink-0">
        
        {/* ----------------- 3 STATUS LOADING NODES (Smaller on Success as requested) ----------------- */}
        <div className="w-full grid grid-cols-3 gap-2 px-1">
          
          {/* Node 1: Wallet */}
          <div className="flex flex-col items-center text-center">
            <div
              className={`rounded-full flex items-center justify-center transition-all duration-300 relative ${
                nodeStatus === 'connected'
                  ? 'w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-[#00ffa3] to-[#00b875] text-black shadow-[0_0_16px_rgba(0,255,163,0.5)]'
                  : nodeStatus === 'error'
                  ? 'w-12 h-12 sm:w-13 sm:h-13 bg-[#1f0a0d] border-2 border-[#ff3b5c] shadow-[0_0_14px_rgba(255,59,92,0.4)]'
                  : 'w-12 h-12 sm:w-13 sm:h-13 bg-[#09121a] border-2 border-[#1c293c] shadow-md'
              }`}
            >
              {nodeStatus === 'connected' ? (
                <Check size={18} className="stroke-[3.5] text-black animate-scaleIn" />
              ) : nodeStatus === 'error' ? (
                <X size={18} className="stroke-[3] text-[#ff3b5c] animate-scaleIn" />
              ) : (
                /* Continuous Spinning Radial Sun / Gear Loader */
                <div className="relative w-7 h-7 flex items-center justify-center">
                  <svg className="w-full h-full text-slate-300 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeDasharray="4 4"
                      strokeLinecap="round"
                    />
                  </svg>
                  <Wallet size={11} className="absolute text-slate-400" />
                </div>
              )}
            </div>
            <span className="text-xs sm:text-[13px] font-black text-white mt-1.5 leading-tight">
              Wallet
            </span>
            <span className={`text-[9px] sm:text-[10px] leading-tight mt-0.5 ${
              nodeStatus === 'connected'
                ? 'text-[#00ffa3] font-bold'
                : nodeStatus === 'error'
                ? 'text-[#ff3b5c]'
                : 'text-slate-400'
            }`}>
              {nodeStatus === 'connected'
                ? 'Connected ✓'
                : nodeStatus === 'error'
                ? 'Failed'
                : 'Still Trying'}
            </span>
          </div>

          {/* Node 2: Sign Up */}
          <div className="flex flex-col items-center text-center">
            <div
              className={`rounded-full flex items-center justify-center transition-all duration-300 relative ${
                nodeStatus === 'connected'
                  ? 'w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-[#00ffa3] to-[#00b875] text-black shadow-[0_0_16px_rgba(0,255,163,0.5)]'
                  : nodeStatus === 'error'
                  ? 'w-12 h-12 sm:w-13 sm:h-13 bg-[#1f0a0d] border-2 border-[#ff3b5c] shadow-[0_0_14px_rgba(255,59,92,0.4)]'
                  : 'w-12 h-12 sm:w-13 sm:h-13 bg-[#09121a] border-2 border-[#1c293c] shadow-md'
              }`}
            >
              {nodeStatus === 'connected' ? (
                <Check size={18} className="stroke-[3.5] text-black animate-scaleIn" />
              ) : nodeStatus === 'error' ? (
                <X size={18} className="stroke-[3] text-[#ff3b5c] animate-scaleIn" />
              ) : (
                <div className="relative w-7 h-7 flex items-center justify-center">
                  <svg className="w-full h-full text-slate-300 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeDasharray="4 4"
                      strokeLinecap="round"
                    />
                  </svg>
                  <User size={11} className="absolute text-slate-400" />
                </div>
              )}
            </div>
            <span className={`text-xs sm:text-[13px] font-black mt-1.5 leading-tight ${
              nodeStatus === 'connected' ? 'text-white' : nodeStatus === 'error' ? 'text-[#ff3b5c]' : 'text-slate-200'
            }`}>
              Sign Up
            </span>
            <span className={`text-[9px] sm:text-[10px] leading-tight mt-0.5 ${
              nodeStatus === 'connected' ? 'text-[#00ffa3] font-bold' : nodeStatus === 'error' ? 'text-[#ff3b5c]' : 'text-slate-400'
            }`}>
              {nodeStatus === 'connected'
                ? 'Registered ✓'
                : nodeStatus === 'error'
                ? 'Failed'
                : 'No DApp Found'}
            </span>
          </div>

          {/* Node 3: Sign In */}
          <div className="flex flex-col items-center text-center">
            <div
              className={`rounded-full flex items-center justify-center transition-all duration-300 relative ${
                nodeStatus === 'connected'
                  ? 'w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-[#00ffa3] to-[#00b875] text-black shadow-[0_0_16px_rgba(0,255,163,0.5)]'
                  : nodeStatus === 'error'
                  ? 'w-12 h-12 sm:w-13 sm:h-13 bg-[#1f0a0d] border-2 border-[#ff3b5c] shadow-[0_0_14px_rgba(255,59,92,0.4)]'
                  : 'w-12 h-12 sm:w-13 sm:h-13 bg-[#09121a] border-2 border-[#1c293c] shadow-md'
              }`}
            >
              {nodeStatus === 'connected' ? (
                <Check size={18} className="stroke-[3.5] text-black animate-scaleIn" />
              ) : nodeStatus === 'error' ? (
                <X size={18} className="stroke-[3] text-[#ff3b5c] animate-scaleIn" />
              ) : (
                <div className="relative w-7 h-7 flex items-center justify-center">
                  <svg className="w-full h-full text-slate-300 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeDasharray="4 4"
                      strokeLinecap="round"
                    />
                  </svg>
                  <Lock size={11} className="absolute text-slate-400" />
                </div>
              )}
            </div>
            <span className={`text-xs sm:text-[13px] font-black mt-1.5 leading-tight ${
              nodeStatus === 'connected' ? 'text-white' : nodeStatus === 'error' ? 'text-[#ff3b5c]' : 'text-slate-200'
            }`}>
              Sign In
            </span>
            <span className={`text-[9px] sm:text-[10px] leading-tight mt-0.5 ${
              nodeStatus === 'connected' ? 'text-[#00ffa3] font-bold' : nodeStatus === 'error' ? 'text-[#ff3b5c]' : 'text-slate-400'
            }`}>
              {nodeStatus === 'connected'
                ? 'Authorized ✓'
                : nodeStatus === 'error'
                ? 'Failed'
                : 'No DApp Found'}
            </span>
          </div>

        </div>

        {/* ----------------- MAIN CARD (Compressed & Responsive) ----------------- */}
        <div className="w-full rounded-2xl sm:rounded-3xl bg-[#0c1017] border border-[#1b2434] p-4 sm:p-5 shadow-[0_16px_50px_rgba(0,0,0,0.9)] text-left space-y-3">
          
          {/* CONNECT WALLET BUTTON */}
          <div>
            <button
              type="button"
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className={`w-full py-3 sm:py-3.5 rounded-full font-black text-xs sm:text-sm tracking-tight transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                connectedAddress
                  ? 'bg-gradient-to-r from-[#00ffa3] via-[#00e699] to-[#00ffa3] text-black shadow-[0_0_24px_rgba(0,255,163,0.6)] ring-2 ring-[#00ffa3]'
                  : 'bg-gradient-to-r from-[#00ffa3] via-[#00e699] to-[#00b875] hover:brightness-110 active:scale-[0.99] text-black shadow-[0_0_22px_rgba(0,255,163,0.5)]'
              }`}
            >
              {isConnecting ? (
                <>
                  <Loader2 size={16} className="animate-spin text-black" />
                  <span>Connecting to MetaMask...</span>
                </>
              ) : connectedAddress ? (
                /* "Connect Wallet" text disappears, replaced by connected wallet address */
                <div className="flex items-center gap-2 font-mono" onClick={handleCopy}>
                  <Check size={16} className="stroke-[3] text-black" />
                  <span>{shortAddress}</span>
                  <span className="text-[9px] font-sans font-bold bg-black/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    {copiedAddr ? 'Copied!' : 'Connected ✓'}
                  </span>
                </div>
              ) : (
                <span>Connect Wallet</span>
              )}
            </button>

            {/* Subtext under button */}
            <p className="text-center text-[10px] sm:text-[11px] text-slate-400 mt-1.5 leading-snug">
              {connectedAddress
                ? `Connected to ${shortAddress}. Complete details below and proceed.`
                : 'Connect your wallet to access all features and manage your account.'}
            </p>
          </div>

          {/* Error Message if any */}
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-800/50 flex items-center gap-2 text-xs text-[#ff3b5c] animate-shake">
              <AlertCircle size={14} className="shrink-0" />
              <span className="flex-1 text-[11px]">{errorMsg}</span>
              {errorMsg.toLowerCase().includes('not detected') && (
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] text-[#00ffa3] hover:underline font-bold shrink-0"
                >
                  <span>Install</span>
                  <ExternalLink size={10} />
                </a>
              )}
            </div>
          )}

          {/* ----------------- FORM FIELDS (Compressed spacing) ----------------- */}
          
          {/* Field 1: Your Unique Referral ID (Auto-filled) */}
          <div className="space-y-0.5">
            <label className="text-[11px] sm:text-xs font-semibold text-slate-200 block">
              Your Unique Referral ID
            </label>
            <input
              type="text"
              value={referId}
              onChange={(e) => setReferId(e.target.value.toUpperCase())}
              placeholder="Referral ID"
              className="w-full px-3.5 py-2 sm:py-2.5 rounded-full bg-[#080b12] border border-[#161f30] text-xs font-mono font-bold text-white focus:outline-none focus:border-[#00ffa3] transition-colors"
            />
          </div>

          {/* Field 2: Pick Your Country (Selectable) */}
          <div className="space-y-0.5">
            <label className="text-[11px] sm:text-xs font-semibold text-slate-200 block">
              Pick Your Country
            </label>
            <div className="relative">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3.5 py-2 sm:py-2.5 rounded-full bg-[#080b12] border border-[#161f30] text-xs font-semibold text-white focus:outline-none focus:border-[#00ffa3] cursor-pointer appearance-none pr-8"
              >
                {countryOptions.map((c) => (
                  <option key={c.label} value={c.label} className="bg-[#0c1017] text-white">
                    {c.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown size={14} />
              </div>
            </div>
          </div>

          {/* Field 3: Your Full Name (Empty initially) */}
          <div className="space-y-0.5">
            <label className="text-[11px] sm:text-xs font-semibold text-slate-200 block">
              Your Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-3.5 py-2 sm:py-2.5 rounded-full bg-[#080b12] border border-[#161f30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00ffa3] transition-colors"
            />
          </div>

          {/* Field 4: Mobile Number (Empty initially, strictly max 10 digits) */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] sm:text-xs font-semibold text-slate-200 block">
                Mobile Number
              </label>
              <span className="text-[9px] text-slate-500 font-mono">
                {mobileNumber.length}/10 digits
              </span>
            </div>
            <input
              type="tel"
              maxLength={10}
              value={mobileNumber}
              onChange={(e) => handleMobileChange(e.target.value)}
              placeholder="Enter 10-digit mobile number"
              className="w-full px-3.5 py-2 sm:py-2.5 rounded-full bg-[#080b12] border border-[#161f30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00ffa3] transition-colors font-mono"
            />
          </div>

          {/* SUBMIT BUTTON -> ADVANCES TO PASSCODE SETUP */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleSubmitAndProceed}
              disabled={isSubmitting}
              className="w-full py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#00ffa3] via-[#00e699] to-[#00b875] hover:brightness-110 active:scale-[0.99] text-black font-black text-xs sm:text-sm tracking-tight transition-all shadow-md shadow-[#00ffa3]/25 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin text-black" />
                  <span>Submitting & Preparing Passcode...</span>
                </>
              ) : (
                <>
                  <span>Submit & Setup Passcode</span>
                  <ArrowRight size={14} className="stroke-[3]" />
                </>
              )}
            </button>
          </div>

        </div>

      </div>

      {/* Floating Bottom Pill Badge matching Screenshot 1 */}
      <div className="pb-2 z-30 shrink-0">
        <div className="px-3.5 py-1.5 rounded-full bg-[#0d141c]/90 border border-[#1c293c] text-slate-300 text-[11px] font-semibold shadow-lg flex items-center gap-2 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ffa3] animate-pulse" />
          <span>Trying to Auto Sign In...</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-2 text-[10px] text-slate-600 font-mono z-10">
        Money X Ecosystem · Decentralized Non-Custodial Protocol
      </footer>

    </div>
  );
};

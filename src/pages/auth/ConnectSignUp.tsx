/*
 FILE: src/pages/auth/ConnectSignUp.tsx

 PURPOSE:
 Compact, Zero-Scroll "Connect Your Wallet" Screen (Pure English):
 - 100% fits on a single display viewport without any vertical scrolling
 - Pure English typography (All Hindi text removed as requested)
 - "Choose Your Wallet" card with 6 providers:
   * 1. MetaMask (Selected state: bright neon emerald border & glow, 3D fox logo)
   * 2. WalletConnect
   * 3. Coinbase Wallet
   * 4. Trust Wallet
   * 5. Binance Wallet
   * 6. More Wallets
 - Compact 2x2 registration fields:
   * Full Name
   * Mobile Number (with country code)
   * Referral ID
   * Country
 - Full-width neon emerald pill button: "Connect Wallet →"
 - Security note & compact bottom stat badges
*/

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { AuthLayoutWrapper } from '../../components/common/AuthLayoutWrapper';
import { BRAND } from '../../config/brand';
import {
  AlertCircle,
  ArrowRight,
  Boxes,
  Check,
  CheckCircle2,
  ExternalLink,
  Globe,
  Loader2,
  Lock,
  Phone,
  Shield,
  ShieldCheck,
  Tag,
  User,
  Users,
  Wallet,
} from 'lucide-react';

export const ConnectSignUp: React.FC = () => {
  const { register, setAuthStage, connectRealMetaMask, connectMobileWallet } = useAuth();
  const { showToast } = useToast();

  const [selectedWallet, setSelectedWallet] = useState<string>('metamask');

  // Form Fields (Pure English)
  const [name, setName] = useState<string>('Alexander Vance');
  const [countryCode, setCountryCode] = useState<string>('+91');
  const [mobileNumber, setMobileNumber] = useState<string>('9876543210');
  const [country, setCountry] = useState<string>('India (+91)');
  const [referId, setReferId] = useState<string>(BRAND.defaultReferId || 'MX99842');

  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const countryOptions = [
    { name: 'India (+91)', code: '+91', flag: '🇮🇳' },
    { name: 'USA (+1)', code: '+1', flag: '🇺🇸' },
    { name: 'UK (+44)', code: '+44', flag: '🇬🇧' },
    { name: 'UAE (+971)', code: '+971', flag: '🇦🇪' },
    { name: 'Canada (+1)', code: '+1', flag: '🇨🇦' },
    { name: 'Australia (+61)', code: '+61', flag: '🇦🇺' },
    { name: 'Singapore (+65)', code: '+65', flag: '🇸🇬' },
  ];

  const handleCountryChange = (cName: string) => {
    setCountry(cName);
    const found = countryOptions.find((c) => c.name === cName);
    if (found) {
      setCountryCode(found.code);
    }
  };

  const wallets = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 318.6 318.6">
          <path fill="#E2761B" stroke="#E2761B" strokeLinecap="round" strokeLinejoin="round" d="m274.1 35.5-99.5 73.9L194 65.4z" />
          <path fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" d="m44.4 35.5 98.7 74.6-18.7-44.7z" />
          <path fill="#D7C1B3" stroke="#D7C1B3" strokeLinecap="round" strokeLinejoin="round" d="m238.3 206.8-30.2 46.1 63.6 17.5 17.6-63.1z" />
          <path fill="#D7C1B3" stroke="#D7C1B3" strokeLinecap="round" strokeLinejoin="round" d="m29.3 207.3 17.6 63.1 63.6-17.5-30.2-46.1z" />
          <path fill="#233447" stroke="#233447" strokeLinecap="round" strokeLinejoin="round" d="m110.3 174.5-30.2-8.9 21.5-9.8z" />
          <path fill="#233447" stroke="#233447" strokeLinecap="round" strokeLinejoin="round" d="m208.3 174.5 8.7-18.7 21.5 9.8z" />
          <path fill="#CD6116" stroke="#CD6116" strokeLinecap="round" strokeLinejoin="round" d="m101.6 252.9 33.6 16.3-2.3-21.4z" />
          <path fill="#CD6116" stroke="#CD6116" strokeLinecap="round" strokeLinejoin="round" d="m183.4 247.8-2.3 21.4 33.6-16.3z" />
          <path fill="#E4751F" stroke="#E4751F" strokeLinecap="round" strokeLinejoin="round" d="m214.7 252.9-33.6 16.3 3.6 28.5 63.9-19.1z" />
          <path fill="#E4751F" stroke="#E4751F" strokeLinecap="round" strokeLinejoin="round" d="m70 278.6 63.9 19.1 3.6-28.5-33.6-16.3z" />
          <path fill="#F6851B" stroke="#F6851B" strokeLinecap="round" strokeLinejoin="round" d="m137.5 297.7-3.6 28.5 25.4 7.4 25.4-7.4-3.6-28.5-21.8 15.3z" />
          <path fill="#C0AD9E" stroke="#C0AD9E" strokeLinecap="round" strokeLinejoin="round" d="m159.3 326.2-25.4-7.4 20.1 21.7 5.3 1.8 5.3-1.8 20.1-21.7z" />
        </svg>
      ),
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: (
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#3b99fc] flex items-center justify-center p-1">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5.5 8.5a9 9 0 0 1 13 0l.5.5a.7.7 0 0 1 0 1l-1.5 1.5a.7.7 0 0 1-1 0l-.7-.7a6 6 0 0 0-8.6 0l-.7.7a.7.7 0 0 1-1 0L4 10a.7.7 0 0 1 0-1l1.5-1.5zm3 3a5 5 0 0 1 7 0l.5.5a.7.7 0 0 1 0 1l-1.5 1.5a.7.7 0 0 1-1 0l-.7-.7a2 2 0 0 0-2.6 0l-.7.7a.7.7 0 0 1-1 0L7 13a.7.7 0 0 1 0-1l1.5-1.5z" />
          </svg>
        </div>
      ),
    },
    {
      id: 'coinbase',
      name: 'Coinbase',
      icon: (
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#0052ff] flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-[2px] bg-white flex items-center justify-center">
            <div className="w-1 h-1 bg-[#0052ff] rounded-[1px]" />
          </div>
        </div>
      ),
    },
    {
      id: 'trust',
      name: 'Trust',
      icon: (
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-tr from-[#0500ff] via-[#0066ff] to-[#00b2ff] flex items-center justify-center p-0.5 shadow-sm">
          <Shield size={12} className="text-white fill-white" />
        </div>
      ),
    },
    {
      id: 'binance',
      name: 'Binance',
      icon: (
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#f3ba2f] flex items-center justify-center p-0.5">
          <div className="w-2.5 h-2.5 rotate-45 border border-black" />
        </div>
      ),
    },
    {
      id: 'more',
      name: 'More',
      icon: (
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#18261e] flex items-center justify-center text-slate-300">
          <div className="flex gap-0.5">
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <div className="w-1 h-1 rounded-full bg-slate-300" />
          </div>
        </div>
      ),
    },
  ];

  const handleConnectWallet = async () => {
    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }

    setErrorMsg(null);
    setIsConnecting(true);

    try {
      let addr = '';

      if (selectedWallet === 'metamask') {
        const res = await connectRealMetaMask();
        if (res.success && res.address) {
          addr = res.address;
        } else {
          // If extension not present, allow mobile web3 fallback session
          if (res.error?.includes('not detected') || res.error?.includes('NOT_INSTALLED')) {
            const fallback = await connectMobileWallet();
            addr = fallback.address;
          } else {
            setErrorMsg(res.error || 'Connection rejected or failed');
            setIsConnecting(false);
            return;
          }
        }
      } else {
        // Other wallets route through web3 session
        const res = await connectMobileWallet();
        addr = res.address;
      }

      showToast(`Wallet Connected: ${addr.slice(0, 6)}...${addr.slice(-4)}`, 'success');

      const fullMobile = `${countryCode} ${mobileNumber}`.trim();
      await register({
        walletAddress: addr,
        name: name.trim(),
        country,
        mobile: fullMobile,
        referId: referId.trim(),
      });

      // Smoothly advance to Screen 2: Create Passcode matching image.png!
      setTimeout(() => {
        setAuthStage('SETUP_PASSCODE');
      }, 350);

    } catch (err: any) {
      setErrorMsg(err.message || 'Error connecting to wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <AuthLayoutWrapper
      activeStep={1}
      stepLabels={{
        step1: { title: 'Wallet', sub: 'Connect Wallet' },
        step2: { title: 'Sign Up', sub: 'Set Details' },
        step3: { title: 'Sign In', sub: 'Access App' },
      }}
    >
      <div className="w-full max-w-[560px] flex flex-col items-center text-center">
        
        {/* Compressed Headline matching image.png */}
        <div className="space-y-0.5 text-center mb-2 shrink-0">
          <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-tight">
            Connect Your <span className="text-[#00ffa3] drop-shadow-[0_0_14px_rgba(0,255,163,0.7)]">Wallet</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400 max-w-sm mx-auto leading-tight">
            Connect your wallet to access all features and manage your account securely.
          </p>
        </div>

        {/* ----------------- COMPRESSED CHOOSE YOUR WALLET CARD ----------------- */}
        <div className="w-full rounded-2xl sm:rounded-3xl bg-[#050f09]/92 backdrop-blur-2xl border border-[#163824] p-3.5 sm:p-5 shadow-[0_16px_45px_rgba(0,0,0,0.85),0_0_35px_rgba(0,255,163,0.06)] text-left space-y-3">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs sm:text-sm font-black text-white tracking-tight">
                Choose Your Wallet
              </h2>
              <p className="text-[10px] text-slate-400">
                Connect with your preferred wallet to continue
              </p>
            </div>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-[#00ffa3]">
              Non-Custodial
            </span>
          </div>

          {/* 6 Wallets Compact Grid */}
          <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
            {wallets.map((w) => {
              const isSelected = selectedWallet === w.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setSelectedWallet(w.id)}
                  className={`p-1.5 sm:p-2 rounded-xl flex flex-col items-center justify-center text-center gap-1 transition-all cursor-pointer group active:scale-95 ${
                    isSelected
                      ? 'border-2 border-[#00ffa3] bg-[#07190f] shadow-[0_0_14px_rgba(0,255,163,0.3)]'
                      : 'border border-[#172b1e] bg-[#030905] hover:border-[#00ffa3]/50 hover:bg-[#07140b]'
                  }`}
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0">
                    {w.icon}
                  </div>
                  <span
                    className={`text-[9px] sm:text-[10px] font-bold tracking-tight truncate max-w-full ${
                      isSelected ? 'text-[#00ffa3]' : 'text-slate-300 group-hover:text-white'
                    }`}
                  >
                    {w.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-2 rounded-xl bg-red-950/40 border border-red-800/50 flex items-center gap-2 text-[11px] text-[#ff3b5c] animate-shake">
              <AlertCircle size={13} className="shrink-0" />
              <span className="flex-1">{errorMsg}</span>
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

          {/* User Details Fields (Pure English, Compact 2x2 Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
            {/* 1. Full Name */}
            <div className="space-y-0.5">
              <label className="text-[10px] sm:text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                <span>Full Name</span>
                <span className="text-[9px] text-slate-500 font-normal">Required</span>
              </label>
              <div className="relative">
                <User size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-[#030905] border border-[#172b1e] text-xs font-semibold text-white focus:outline-none focus:border-[#00ffa3] transition-colors"
                />
              </div>
            </div>

            {/* 2. Mobile Number with Country Dial Code */}
            <div className="space-y-0.5">
              <label className="text-[10px] sm:text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                <span>Mobile Number</span>
                <span className="text-[9px] text-slate-500 font-normal">Required</span>
              </label>
              <div className="flex gap-1.5">
                <div className="w-20 shrink-0">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full px-1.5 py-1.5 rounded-lg bg-[#030905] border border-[#172b1e] text-xs font-bold text-slate-300 focus:outline-none focus:border-[#00ffa3] cursor-pointer"
                  >
                    {countryOptions.map((c) => (
                      <option key={c.name} value={c.code} className="bg-[#050f09] text-white">
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 relative">
                  <Phone size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-[#030905] border border-[#172b1e] text-xs font-semibold text-white focus:outline-none focus:border-[#00ffa3] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 3. Referral ID */}
            <div className="space-y-0.5">
              <label className="text-[10px] sm:text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                <Tag size={11} className="text-[#00ffa3]" />
                <span>Referral ID</span>
              </label>
              <input
                type="text"
                value={referId}
                onChange={(e) => setReferId(e.target.value.toUpperCase())}
                placeholder="MX99842"
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#030905] border border-[#172b1e] text-xs font-mono font-bold text-[#00ffa3] focus:outline-none focus:border-[#00ffa3] transition-colors"
              />
            </div>

            {/* 4. Country */}
            <div className="space-y-0.5">
              <label className="text-[10px] sm:text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                <Globe size={11} className="text-slate-400" />
                <span>Country</span>
              </label>
              <select
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#030905] border border-[#172b1e] text-xs font-semibold text-white focus:outline-none focus:border-[#00ffa3] cursor-pointer"
              >
                {countryOptions.map((c) => (
                  <option key={c.name} value={c.name} className="bg-[#050f09] text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Primary Connect Wallet Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#00ffa3] via-[#00e699] to-[#00ffa3] hover:brightness-110 active:scale-[0.99] text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(0,255,163,0.4)] cursor-pointer transition-all disabled:opacity-50"
            >
              {isConnecting ? (
                <>
                  <Loader2 size={16} className="animate-spin text-black" />
                  <span>Connecting to {selectedWallet === 'metamask' ? 'MetaMask' : 'Wallet'}...</span>
                </>
              ) : (
                <>
                  <Wallet size={16} className="stroke-[2.5]" />
                  <span>Connect Wallet</span>
                  <ArrowRight size={16} className="stroke-[2.5]" />
                </>
              )}
            </button>
          </div>

          {/* Security Note */}
          <div className="flex items-center justify-center gap-1.5 text-center text-[10px] text-slate-400">
            <span className="text-amber-400 text-xs">🔒</span>
            <span>We never store your private keys. Your wallet is always secure and in your control.</span>
          </div>

        </div>

        {/* Compact Single-Row Stats Bar (matching bottom badges without vertical bloating) */}
        <div className="w-full flex items-center justify-center gap-4 sm:gap-8 pt-2 text-[10px] sm:text-[11px] text-slate-400 shrink-0 font-medium">
          <span className="flex items-center gap-1">
            <Users size={12} className="text-[#00ffa3]" />
            <strong className="text-white">2M+</strong> Global Users
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck size={12} className="text-[#00ffa3]" />
            <strong className="text-white">Secure</strong> Decentralized
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1">
            <Boxes size={12} className="text-[#00ffa3]" />
            <strong className="text-white">Easy Access</strong> All Features
          </span>
        </div>

      </div>
    </AuthLayoutWrapper>
  );
};

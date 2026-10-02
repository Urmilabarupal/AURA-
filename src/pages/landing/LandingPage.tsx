/*
 FILE: src/pages/landing/LandingPage.tsx

 PURPOSE:
 High-Craft Web3 & DeFi Landing Page for XAH Money with:
 1. Primary Font Family: Poppins throughout all headings, body, buttons, and UI
 2. Advanced Scroll-Driven Dynamic Effects:
    - Real-time Neon Gradient Top Scroll Progress Bar (0% to 100%)
    - Dynamic Sticky Header with Glass Blur & Scroll State Compression
    - Floating Glass Quick-Jump Dock (appears on scroll with active section tracking)
    - Continuous Smooth Auto-Scrolling Marquee Ticker
    - Parallax Ambient Lighting & 3D Artwork Float Offsets
    - Floating Circular Progress Scroll-To-Top Button
 3. 5 High-Impact 3D Crypto Artworks (Vault, Staking Chest, Lottery Wheel, Dubai Luxury Trips, Staking Plans Chart)
 4. Live Swap & Staking Interactive Terminal
 5. Staking Plans with Real-Time ROI Slider Calculator
 6. 10-Tier Community Royalties & VIP International Trips Showcase
 7. Roadmap 2026 & Live On-Chain Network Activity Ledger
*/

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BRAND } from '../../config/brand';
import heroVaultImg from '../../assets/images/hero_crypto_vault_1790833601335.jpg';
import stakingYieldImg from '../../assets/images/staking_yield_3d_1790833619121.jpg';
import lotteryPrizeImg from '../../assets/images/lottery_prize_3d_1790833633892.jpg';
import globalTripsImg from '../../assets/images/global_trips_3d_1790833765948.jpg';
import stakingPlansImg from '../../assets/images/staking_plans_3d_1790833783539.jpg';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Award,
  CheckCircle2,
  ChevronDown,
  Coins,
  Compass,
  ExternalLink,
  Flame,
  Globe,
  Layers,
  Lock,
  Menu,
  Milestone,
  Plane,
  Radio,
  Repeat,
  ShieldCheck,
  Sparkles,
  Ticket,
  TrendingUp,
  Trophy,
  Users,
  Wallet,
  X,
  Zap,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setAuthStage } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Scroll Effects State
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [scrollY, setScrollY] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Hero Terminal State
  const [terminalTab, setTerminalTab] = useState<'swap' | 'stake'>('swap');
  const [swapPayAmount, setSwapPayAmount] = useState<string>('500');
  const [stakeAmount, setStakeAmount] = useState<string>('1000');
  const [stakePeriod, setStakePeriod] = useState<number>(90);

  // Dedicated Staking Section Calculator State
  const [calcStakeVal, setCalcStakeVal] = useState<number>(2500);
  const [calcSelectedPlan, setCalcSelectedPlan] = useState<'flexible' | 'growth' | 'sovereign'>('growth');

  // Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);

      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const totalScrollable = docHeight - winHeight;
      const progress = totalScrollable > 0 ? (currentScroll / totalScrollable) * 100 : 0;
      setScrollProgress(progress);

      // Active Section Spy
      const sections = ['hero', 'assets', 'staking-plans', 'community-rewards', 'features', 'roadmap', 'faq'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= winHeight * 0.45 && rect.bottom >= winHeight * 0.15) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Synchronize document title dynamically
  useEffect(() => {
    document.title = `${BRAND.name} · ${BRAND.tagline}`;
  }, []);

  // Hero Calculations
  const payVal = parseFloat(swapPayAmount) || 0;
  const receiveToken = (payVal / 1.48).toFixed(2);

  const stakeVal = parseFloat(stakeAmount) || 0;
  const estimatedDaily = (stakeVal * 0.001).toFixed(2);
  const estimatedTotal = (stakeVal * 0.001 * stakePeriod).toFixed(2);

  // Staking Section Calculations
  const planApy = calcSelectedPlan === 'flexible' ? 18.2 : calcSelectedPlan === 'growth' ? 26.5 : 36.5;
  const calcDailyEarning = ((calcStakeVal * (planApy / 100)) / 365).toFixed(2);
  const calcMonthlyEarning = (((calcStakeVal * (planApy / 100)) / 365) * 30).toFixed(2);
  const calcAnnualEarning = (calcStakeVal * (planApy / 100)).toFixed(2);

  const cryptoCoins = [
    {
      symbol: BRAND.tokenSymbol,
      name: `${BRAND.chainName} Native`,
      price: '$1.48',
      change: '+8.74%',
      pos: true,
      vol: '$4.82M',
      color: '#ff3864',
      bgGrad: 'from-pink-500/15 via-purple-500/10 to-blue-500/15',
      borderGlow: 'border-pink-500/40',
      icon: (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff3864] via-[#9d4edd] to-[#3a86ff] flex items-center justify-center p-1 shadow-md shadow-pink-900/40">
          <svg className="w-5 h-5" viewBox="0 0 64 54" fill="none">
            <path
              d="M 22 13 C 14 13, 10 20, 10 27 C 10 34, 14 41, 22 41 C 28 41, 32 36, 32 27 C 32 18, 36 13, 42 13 C 50 13, 54 20, 54 27 C 54 34, 50 41, 42 41 C 36 41, 32 36, 32 27"
              stroke="#ffffff"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ),
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: '$89,450.00',
      change: '+2.15%',
      pos: true,
      vol: '$34.2B',
      color: '#f59e0b',
      bgGrad: 'from-amber-500/15 to-orange-500/10',
      borderGlow: 'border-amber-500/40',
      icon: (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f59e0b] to-[#d97706] flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-amber-900/40 font-['Poppins']">
          ₿
        </div>
      ),
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: '$3,480.20',
      change: '+3.42%',
      pos: true,
      vol: '$18.4B',
      color: '#8b5cf6',
      bgGrad: 'from-purple-500/15 to-indigo-500/10',
      borderGlow: 'border-purple-500/40',
      icon: (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6366f1] via-[#8b5cf6] to-[#ec4899] flex items-center justify-center p-1.5 shadow-md shadow-purple-900/40">
          <svg className="w-4 h-5" viewBox="0 0 784.37 1277.39" fill="none">
            <path d="M392.07 0L383.5 29.11V874.74L392.07 883.29L784.13 651.54L392.07 0Z" fill="#ffffff" />
            <path d="M392.07 0L0 651.54L392.07 883.29V472.33V0Z" fill="#cbd5e1" />
            <path d="M392.07 956.52L387.24 962.41V1258.97L392.07 1277.38L784.37 724.89L392.07 956.52Z" fill="#ffffff" />
            <path d="M392.07 1277.38V956.52L0 724.89L392.07 1277.38Z" fill="#cbd5e1" />
          </svg>
        </div>
      ),
    },
    {
      symbol: 'USDT',
      name: 'Tether USD',
      price: '$1.00',
      change: '0.00%',
      pos: true,
      vol: '$42.1B',
      color: '#00e699',
      bgGrad: 'from-emerald-500/15 to-teal-500/10',
      borderGlow: 'border-emerald-500/40',
      icon: (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#059669] to-[#10b981] flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-emerald-900/40 font-['Poppins']">
          ₮
        </div>
      ),
    },
    {
      symbol: 'BNB',
      name: 'BNB Chain',
      price: '$612.40',
      change: '-1.05%',
      pos: false,
      vol: '$1.45B',
      color: '#eab308',
      bgGrad: 'from-yellow-500/15 to-amber-500/10',
      borderGlow: 'border-yellow-500/40',
      icon: (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ca8a04] to-[#facc15] flex items-center justify-center p-1.5 shadow-md shadow-yellow-900/40">
          <svg className="w-5 h-5" viewBox="0 0 124 124" fill="none">
            <path d="M62 0L86.8 24.8L43.4 68.2L18.6 43.4L62 0Z" fill="#ffffff" />
            <path d="M80.6 62L105.4 37.2L124 55.8L99.2 80.6L80.6 62Z" fill="#ffffff" />
            <path d="M62 86.8L80.6 68.2L99.2 86.8L62 124L24.8 86.8L43.4 68.2L62 86.8Z" fill="#ffffff" />
            <path d="M0 62L18.6 43.4L37.2 62L18.6 80.6L0 62Z" fill="#ffffff" />
          </svg>
        </div>
      ),
    },
    {
      symbol: 'TRX',
      name: 'TRON Network',
      price: '$0.24',
      change: '+4.12%',
      pos: true,
      vol: '$890M',
      color: '#ef4444',
      bgGrad: 'from-red-500/15 to-rose-500/10',
      borderGlow: 'border-red-500/40',
      icon: (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#dc2626] to-[#ef4444] flex items-center justify-center p-1.5 shadow-md shadow-red-900/40">
          <svg className="w-5 h-5" viewBox="0 0 100 100" fill="none">
            <path d="M12 18L88 32L65 88L12 18Z" fill="#ffffff" />
            <path d="M12 18L58 48L65 88L12 18Z" fill="#fecaca" opacity="0.7" />
          </svg>
        </div>
      ),
    },
  ];

  const recentTransactions = [
    { hash: '0x7b1a...8e21', type: 'Stake Deposit', amount: `+5,000 ${BRAND.tokenSymbol}`, user: 'User #8821', time: '14s ago', color: 'text-purple-400' },
    { hash: '0x32c0...44d9', type: 'Lottery Winner', amount: '+340 USDT', user: 'User #1409', time: '42s ago', color: 'text-yellow-400' },
    { hash: '0x91df...fa12', type: `${BRAND.name} Convert`, amount: `1,200 USDT ➔ ${BRAND.tokenSymbol}`, user: 'User #6312', time: '1m ago', color: 'text-cyan-400' },
    { hash: '0x140e...bc99', type: 'Team Dividend', amount: '+18.50 USDT', user: 'User #9201', time: '2m ago', color: 'text-emerald-400' },
    { hash: '0x55aa...3d10', type: 'Stake Compounded', amount: `+12,000 ${BRAND.tokenSymbol}`, user: 'User #7114', time: '3m ago', color: 'text-pink-400' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunch = () => {
    setAuthStage('UNAUTHENTICATED');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignIn = () => {
    const pin = localStorage.getItem('xah_custom_passcode');
    if (pin) {
      setAuthStage('LOCKED');
    } else {
      setAuthStage('UNAUTHENTICATED');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="landing-shell min-h-screen text-[var(--app-text)] font-['Poppins'] antialiased selection:bg-[#31e66b] selection:text-[#031b12] relative overflow-x-hidden">
      
      {/* ========================================================= */}
      {/* SCROLL EFFECT 1: NEON TOP SCROLL PROGRESS BAR */}
      {/* ========================================================= */}
      <div className="fixed top-0 left-0 right-0 h-[3.5px] z-[60] bg-transparent pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#31e66b] via-[#0bbf4b] to-[#31e66b] shadow-[0_0_12px_rgba(49,230,107,0.9)] transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* SCROLL EFFECT 2: PARALLAX MESH GLOWS LINKED TO SCROLL DEPTH */}
      <div
        className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-[#ff3864]/15 via-[#9d4edd]/20 to-transparent rounded-full blur-[160px] pointer-events-none -z-10 transition-transform duration-700 ease-out"
        style={{ transform: `translateY(${scrollY * 0.12}px)` }}
      />
      <div
        className="fixed top-1/3 right-10 w-[550px] h-[550px] bg-gradient-to-bl from-[#3a86ff]/15 via-[#00e699]/15 to-transparent rounded-full blur-[160px] pointer-events-none -z-10 transition-transform duration-700 ease-out"
        style={{ transform: `translateY(-${scrollY * 0.08}px)` }}
      />

      {/* ========================================================= */}
      {/* 1. TOP HEADER WITH SCROLL STATE COMPRESSION & ACTIVE SPY */}
      {/* ========================================================= */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 px-4 sm:px-8 ${
        scrollY > 20
          ? 'bg-[#080b12]/95 backdrop-blur-2xl py-3 border-b border-[#20273d] shadow-2xl'
          : 'bg-[#080b12]/75 backdrop-blur-xl py-4 border-b border-[#181e2e]'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={scrollToTop}>
            <div className="relative w-9 h-8 flex items-center justify-center shrink-0">
              <svg className="w-9 h-8 drop-shadow-[0_0_14px_rgba(255,56,100,0.7)]" viewBox="0 0 64 54" fill="none">
                <defs>
                  <linearGradient id="poppinsNavRibbon" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0bbf4b" />
                    <stop offset="50%" stopColor="#31e66b" />
                    <stop offset="100%" stopColor="#08a88a" />
                  </linearGradient>
                </defs>
                <path
                  d="M 22 13 C 14 13, 10 20, 10 27 C 10 34, 14 41, 22 41 C 28 41, 32 36, 32 27 C 32 18, 36 13, 42 13 C 50 13, 54 20, 54 27 C 54 34, 50 41, 42 41 C 36 41, 32 36, 32 27"
                  stroke="url(#poppinsNavRibbon)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 12 27 L 32 27 L 52 27"
                  stroke="url(#poppinsNavRibbon)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-base tracking-wider bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent block leading-tight">
                {BRAND.name}
              </span>
              <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase block font-semibold">
                {BRAND.ecosystemName}
              </span>
            </div>
          </div>

          {/* Desktop Center Navigation with Scroll-Spy Indicator */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-300">
            {[
              { id: 'hero', label: 'Trade & Swap' },
              { id: 'assets', label: 'Live Assets' },
              { id: 'staking-plans', label: 'Staking Plans' },
              { id: 'community-rewards', label: 'VIP Trips' },
              { id: 'features', label: 'Ecosystem' },
              { id: 'roadmap', label: 'Roadmap' },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`transition-all duration-200 relative py-1 ${
                  activeSection === item.id
                    ? 'text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#ff3864] to-[#00f0ff] rounded-full shadow-sm" />
                )}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              type="button"
              onClick={handleSignIn}
              className="px-4 py-2 rounded-xl bg-[#121624] hover:bg-[#1a2034] border border-[#222c44] text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer shadow-sm"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={handleLaunch}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#ff3864] via-[#9d4edd] to-[#3a86ff] hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-900/50 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              <Zap size={14} className="fill-current text-yellow-300" />
              <span>Connect Wallet</span>
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={handleLaunch}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#ff3864] to-[#9d4edd] text-white font-bold text-xs"
            >
              Connect
            </button>
            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="p-1.5 text-slate-300 hover:text-white"
            >
              {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown */}
        {mobileNavOpen && (
          <div className="lg:hidden pt-4 pb-2 border-t border-[#1f273d] mt-3 space-y-2 text-xs font-semibold text-slate-300">
            <a href="#hero" onClick={() => setMobileNavOpen(false)} className="block py-2 text-cyan-300">Trade & Swap</a>
            <a href="#assets" onClick={() => setMobileNavOpen(false)} className="block py-2 text-pink-300">Live Assets</a>
            <a href="#staking-plans" onClick={() => setMobileNavOpen(false)} className="block py-2 text-emerald-300">Staking Plans</a>
            <a href="#community-rewards" onClick={() => setMobileNavOpen(false)} className="block py-2 text-amber-300">VIP Trips</a>
            <a href="#roadmap" onClick={() => setMobileNavOpen(false)} className="block py-2 text-purple-300">Roadmap</a>
            <div className="pt-2 border-t border-[#1e273d] flex gap-2">
              <button
                type="button"
                onClick={handleSignIn}
                className="flex-1 py-2 rounded-lg bg-[#141824] border border-[#232d44] text-xs font-bold text-center text-white"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={handleLaunch}
                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-[#ff3864] to-[#3a86ff] text-xs font-bold text-center text-white"
              >
                Launch App
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================= */}
      {/* 2. HERO SECTION WITH 3D VAULT & INTERACTIVE TERMINAL */}
      {/* ========================================================= */}
      <section id="hero" className="pt-12 sm:pt-20 pb-16 px-4 sm:px-8 max-w-7xl mx-auto border-b border-[#1b2236]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Bold Poppins Typography */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-cyan-500/20 border border-emerald-500/40 text-xs font-bold text-emerald-300 shadow-md shadow-emerald-950/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{BRAND.chainNetwork} v{BRAND.version} Live</span>
              <span className="text-emerald-500">·</span>
              <span className="text-white font-mono">$42.85M TVL</span>
              <span className="text-emerald-500">·</span>
              <span className="text-cyan-300 font-mono">1.2s Block Time</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
                Build confidence with every single trade{' '}
                <span className="bg-gradient-to-r from-[#31e66b] via-[#0bbf4b] to-[#31e66b] bg-clip-text text-transparent drop-shadow-sm">
                  {BRAND.chainName}
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl font-medium">
                Next-generation non-custodial asset architecture, automated high-yield staking up to <strong className="text-emerald-400 font-mono font-bold">36.5% APY</strong>, and zero-slippage cross-currency liquidity settlement.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleLaunch}
                className="py-3.5 px-7 rounded-2xl bg-gradient-to-r from-[#ff3864] via-[#9d4edd] to-[#3a86ff] hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-purple-950/60 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                <Zap size={16} className="fill-current text-yellow-300" />
                <span>Start trading</span>
                <ArrowRight size={15} />
              </button>

              <button
                type="button"
                onClick={handleSignIn}
                className="py-3.5 px-6 rounded-2xl bg-[#121624] hover:bg-[#1a2032] border border-[#252f48] text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <Lock size={15} className="text-purple-400" />
                <span>Sign In with PIN</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 max-w-xl text-left">
              <div className="p-3.5 rounded-xl bg-gradient-to-b from-[#141828] to-[#0c0f18] border border-cyan-500/30 shadow-md">
                <span className="text-[10px] text-cyan-400 font-bold block uppercase tracking-wider">Total Value Locked</span>
                <span className="text-lg sm:text-xl font-extrabold text-white font-mono tabular-nums mt-0.5 block">$42.85M+</span>
              </div>

              <div className="p-3.5 rounded-xl bg-gradient-to-b from-[#141828] to-[#0c0f18] border border-emerald-500/30 shadow-md">
                <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider">Max Staking APY</span>
                <span className="text-lg sm:text-xl font-extrabold text-emerald-400 font-mono tabular-nums mt-0.5 block">36.5%</span>
              </div>

              <div className="p-3.5 rounded-xl bg-gradient-to-b from-[#141828] to-[#0c0f18] border border-purple-500/30 shadow-md">
                <span className="text-[10px] text-purple-400 font-bold block uppercase tracking-wider">Active Stakers</span>
                <span className="text-lg sm:text-xl font-extrabold text-purple-300 font-mono tabular-nums mt-0.5 block">18,420+</span>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Image Artwork + Interactive Swap Terminal */}
          <div className="lg:col-span-5 relative">
            
            <div className="relative rounded-2xl overflow-hidden border border-purple-500/30 shadow-2xl mb-4 group">
              <img
                src={heroVaultImg}
                alt={`${BRAND.name} Crypto Asset Vault 3D`}
                className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090c14] via-[#090c14]/40 to-transparent flex items-end p-4 justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-500 text-white shadow-sm inline-block mb-1 font-mono">
                    Multi-Chain Vault
                  </span>
                  <div className="text-sm font-bold text-white">
                    Non-Custodial Cold & Hot Asset Storage
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#00e699] block tabular-nums">
                    Zero Gas Transfers
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#0f1320] border border-[#222b42] shadow-2xl p-5 space-y-4">
              
              <div className="flex items-center justify-between border-b border-[#1d253b] pb-3">
                <div className="flex items-center gap-1.5 p-1 bg-[#070910] rounded-xl border border-[#1d253b]">
                  <button
                    type="button"
                    onClick={() => setTerminalTab('swap')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      terminalTab === 'swap'
                        ? 'bg-gradient-to-r from-[#ff3864] to-[#9d4edd] text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Instant Swap
                  </button>
                  <button
                    type="button"
                    onClick={() => setTerminalTab('stake')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      terminalTab === 'stake'
                        ? 'bg-gradient-to-r from-[#059669] to-[#0284c7] text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Quick Stake
                  </button>
                </div>
                
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1 tabular-nums">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Pool
                </span>
              </div>

              {terminalTab === 'swap' ? (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-[#070910] border border-[#1b2234] space-y-1">
                    <div className="flex justify-between text-xs text-slate-400 font-medium">
                      <span>You Pay</span>
                      <span className="text-cyan-400 font-mono tabular-nums">Bal: 1,250.00 USDT</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <input
                        type="number"
                        value={swapPayAmount}
                        onChange={(e) => setSwapPayAmount(e.target.value)}
                        className="bg-transparent text-xl font-bold font-mono text-white outline-none w-full tabular-nums"
                      />
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs font-bold text-emerald-300 shrink-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>USDT</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center -my-1 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff3864] to-[#9d4edd] text-white flex items-center justify-center shadow-md shadow-pink-950/50">
                      <Repeat size={14} />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#070910] border border-[#1b2234] space-y-1">
                    <div className="flex justify-between text-xs text-slate-400 font-medium">
                      <span>You Receive</span>
                      <span className="text-slate-400 font-mono tabular-nums">1 {BRAND.tokenSymbol} = $1.48</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xl font-bold font-mono text-cyan-300 tabular-nums">
                        {receiveToken}
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-pink-950/50 border border-pink-500/40 text-xs font-bold text-pink-300 shrink-0">
                        <span className="w-2 h-2 rounded-full bg-pink-400" />
                        <span>{BRAND.tokenSymbol}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLaunch}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff3864] via-[#9d4edd] to-[#3a86ff] hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-950/40 transition-all cursor-pointer active:scale-95"
                  >
                    <span>Connect Wallet to Swap</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-[#070910] border border-[#1b2234] space-y-1">
                    <div className="flex justify-between text-xs text-slate-400 font-medium">
                      <span>Stake Amount</span>
                      <span className="text-purple-400 font-mono tabular-nums">Available: 5,000 {BRAND.tokenSymbol}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <input
                        type="number"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        className="bg-transparent text-xl font-bold font-mono text-white outline-none w-full tabular-nums"
                      />
                      <div className="px-3 py-1 rounded-xl bg-purple-950/50 border border-purple-500/40 text-xs font-bold text-purple-300 shrink-0">
                        {BRAND.tokenSymbol}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-slate-400">Lockup Plan:</span>
                    <div className="grid grid-cols-3 gap-2 text-xs font-mono font-bold">
                      {[30, 90, 365].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setStakePeriod(d)}
                          className={`py-1.5 rounded-xl border transition-all ${
                            stakePeriod === d
                              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-sm'
                              : 'bg-[#070910] text-slate-400 border-[#1d253b] hover:text-white'
                          }`}
                        >
                          {d} Days
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex justify-between text-xs font-mono tabular-nums">
                    <span className="text-slate-300">Total Profit ({stakePeriod}d):</span>
                    <strong className="text-emerald-400 text-sm">+{estimatedTotal} {BRAND.tokenSymbol}</strong>
                  </div>

                  <button
                    type="button"
                    onClick={handleLaunch}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer active:scale-95"
                  >
                    <span>Connect Wallet to Stake</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SCROLL EFFECT 3: CONTINUOUS AUTO-SCROLLING LIVE MARQUEE */}
      {/* ========================================================= */}
      <section className="border-y border-[#181d2e] bg-[#080b12] py-3 overflow-hidden select-none">
        <div className="animate-marquee flex items-center gap-8">
          {[...cryptoCoins, ...cryptoCoins].map((coin, idx) => (
            <div
              key={`${coin.symbol}-${idx}`}
              className="flex items-center gap-3 px-3 py-1 rounded-xl bg-[#0f121d] border border-[#1e2538] shrink-0"
            >
              {coin.icon}
              <span className="font-bold text-xs text-white">{coin.symbol}</span>
              <span className="font-mono text-xs font-semibold text-slate-300 tabular-nums">{coin.price}</span>
              <span
                className={`text-[11px] font-mono font-bold flex items-center tabular-nums ${
                  coin.pos ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {coin.pos ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {coin.change}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. LIVE CRYPTO ASSETS BOARD */}
      {/* ========================================================= */}
      <section id="assets" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto border-b border-[#1b2236] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-pink-400 uppercase tracking-widest font-mono">
                Live Liquidity
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 tabular-nums">
                24h Volume: $98.2M
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Top Crypto Assets Performance
            </h2>
          </div>

          <button
            type="button"
            onClick={handleLaunch}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span>Explore All 20+ Pairs</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {cryptoCoins.map((coin) => (
            <div
              key={coin.symbol}
              onClick={handleLaunch}
              className={`p-4 rounded-2xl bg-gradient-to-b ${coin.bgGrad} bg-[#0c0f18] border ${coin.borderGlow} hover:scale-[1.03] transition-all cursor-pointer shadow-lg space-y-3`}
            >
              <div className="flex items-center justify-between">
                {coin.icon}
                <span
                  className={`text-[11px] font-bold font-mono tabular-nums flex items-center ${
                    coin.pos ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {coin.pos ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {coin.change}
                </span>
              </div>

              <div>
                <span className="font-bold text-white text-sm block">{coin.symbol}</span>
                <span className="text-[10px] text-slate-400 truncate block">{coin.name}</span>
                <span className="text-sm font-black text-white font-mono tabular-nums block mt-1">{coin.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. STAKING PLANS & INTERACTIVE ROI CALCULATOR */}
      {/* ========================================================= */}
      <section id="staking-plans" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-b border-[#1b2236] space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">
            Staking Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            High-Yield Staking Plans & ROI Simulator
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Choose between flexible instant-unstake or locked compounding pools for maximum APY yields.
          </p>
        </div>

        {/* 3 Staking Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div
            onClick={() => setCalcSelectedPlan('flexible')}
            className={`p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              calcSelectedPlan === 'flexible'
                ? 'bg-gradient-to-b from-[#151f33] to-[#0c111c] border-cyan-400 shadow-xl shadow-cyan-950/40 ring-1 ring-cyan-400/50'
                : 'bg-[#0e121d] border-[#1c2236] hover:border-[#2f3b5c]'
            }`}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Instant Liquidity
                </span>
                <span className="text-xs text-slate-400 font-mono">0 Lock Days</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Starter Flexible</h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">Unstake anytime with zero penalty. Daily earnings credited directly to Spot balance.</p>
              </div>

              <div className="pt-2">
                <span className="text-3xl font-black text-cyan-300 font-mono tabular-nums">18.2%</span>
                <span className="text-xs text-slate-400 ml-1 font-mono">APY</span>
              </div>

              <ul className="space-y-2 text-xs text-slate-300 border-t border-[#1b2236] pt-3 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-cyan-400" />
                  <span>Daily automated payouts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-cyan-400" />
                  <span>Instant principal withdrawal</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-cyan-400" />
                  <span>No minimum staking threshold</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={handleLaunch}
              className="mt-6 w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#090b10] font-bold text-xs transition-colors cursor-pointer"
            >
              Select Flexible Plan
            </button>
          </div>

          <div
            onClick={() => setCalcSelectedPlan('growth')}
            className={`p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              calcSelectedPlan === 'growth'
                ? 'bg-gradient-to-b from-[#1e1732] to-[#0f0c1a] border-purple-400 shadow-xl shadow-purple-950/50 ring-1 ring-purple-400/50'
                : 'bg-[#0e121d] border-[#1c2236] hover:border-[#2f3b5c]'
            }`}
          >
            <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-500 to-pink-500 text-white text-[10px] font-extrabold uppercase px-4 py-1 rounded-bl-xl shadow-md font-mono">
              Most Popular
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  90-Day Compounding
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Growth Vault</h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">Accelerated staking yield with automated daily reinvestment and team tier bonus.</p>
              </div>

              <div className="pt-2">
                <span className="text-3xl font-black text-purple-300 font-mono tabular-nums">26.5%</span>
                <span className="text-xs text-slate-400 ml-1 font-mono">APY</span>
              </div>

              <ul className="space-y-2 text-xs text-slate-300 border-t border-[#1b2236] pt-3 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-purple-400" />
                  <span>Compounding daily yield multiplier</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-purple-400" />
                  <span>1.5x Lottery ticket rewards</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-purple-400" />
                  <span>Team Stake dividend qualification</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={handleLaunch}
              className="mt-6 w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-95 text-white font-bold text-xs transition-opacity cursor-pointer shadow-md"
            >
              Select Growth Vault
            </button>
          </div>

          <div
            onClick={() => setCalcSelectedPlan('sovereign')}
            className={`p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              calcSelectedPlan === 'sovereign'
                ? 'bg-gradient-to-b from-[#241a0e] to-[#0f0c08] border-amber-400 shadow-xl shadow-amber-950/50 ring-1 ring-amber-400/50'
                : 'bg-[#0e121d] border-[#1c2236] hover:border-[#2f3b5c]'
            }`}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  365-Day VIP Pool
                </span>
                <span className="text-xs text-amber-400 font-mono font-bold">Max Return</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Sovereign VIP Vault</h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">Maximum protocol yield with VIP royalty pool distribution and international trip points.</p>
              </div>

              <div className="pt-2">
                <span className="text-3xl font-black text-amber-400 font-mono tabular-nums">36.5%</span>
                <span className="text-xs text-slate-400 ml-1 font-mono">APY</span>
              </div>

              <ul className="space-y-2 text-xs text-slate-300 border-t border-[#1b2236] pt-3 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-amber-400" />
                  <span>Maximum 36.5% annual return</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-amber-400" />
                  <span>Monthly global royalty pool share</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-amber-400" />
                  <span>Automatic entry to VIP luxury trips</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={handleLaunch}
              className="mt-6 w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 text-white font-bold text-xs transition-opacity cursor-pointer shadow-md"
            >
              Select Sovereign Plan
            </button>
          </div>

        </div>

        {/* Interactive Staking ROI Calculator Box */}
        <div className="rounded-3xl bg-gradient-to-r from-[#101422] via-[#0c0f18] to-[#101422] border border-emerald-500/30 p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-4 rounded-2xl overflow-hidden border border-emerald-500/30 shadow-lg relative h-64 sm:h-72">
              <img
                src={stakingPlansImg}
                alt="3D Staking ROI Profit Chart"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090c14] via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                  ● Real-time Smart Contract APY: {planApy}%
                </span>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div>
                <span className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider">
                  Real-Time Yield Simulator
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight mt-1">
                  Calculate Estimated Returns
                </h3>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Deposit Amount (USDT or {BRAND.tokenSymbol})</span>
                  <span className="font-extrabold text-white font-mono text-base tabular-nums">${calcStakeVal.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={20000}
                  step={100}
                  value={calcStakeVal}
                  onChange={(e) => setCalcStakeVal(Number(e.target.value))}
                  className="w-full accent-emerald-400 bg-[#070910] h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono tabular-nums">
                  <span>$100</span>
                  <span>$10,000</span>
                  <span>$20,000</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[#070910] border border-[#1b2234] text-center">
                  <span className="text-[10px] text-slate-400 block font-medium">Daily Earnings</span>
                  <span className="text-sm sm:text-base font-bold text-white font-mono tabular-nums mt-0.5 block">
                    +${calcDailyEarning}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#070910] border border-[#1b2234] text-center">
                  <span className="text-[10px] text-slate-400 block font-medium">Monthly Yield</span>
                  <span className="text-sm sm:text-base font-bold text-cyan-300 font-mono tabular-nums mt-0.5 block">
                    +${calcMonthlyEarning}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#070910] border border-emerald-500/40 text-center bg-emerald-950/20">
                  <span className="text-[10px] text-emerald-400 block font-bold">1-Year Total Return</span>
                  <span className="text-base sm:text-lg font-black text-emerald-300 font-mono tabular-nums mt-0.5 block">
                    +${calcAnnualEarning}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLaunch}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
              >
                <span>Deposit & Start Earning Daily</span>
                <ArrowRight size={14} />
              </button>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================= */}
      {/* 5. GLOBAL COMMUNITY ROYALTY & LUXURY VIP TRIPS */}
      {/* ========================================================= */}
      <section id="community-rewards" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-b border-[#1b2236] space-y-12">
        
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
            Affiliate & Royalty Program
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            10-Tier Community Royalties & All-Expenses-Paid VIP Trips
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Build your decentralized staker community. Earn daily team volume dividends and unlock world-class luxury international retreats.
          </p>
        </div>

        <div className="rounded-3xl bg-gradient-to-b from-[#141828] via-[#0c0f18] to-[#090b12] border border-amber-500/40 p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl relative h-72 sm:h-80">
              <img
                src={globalTripsImg}
                alt="3D Dubai Luxury Travel Passport and Gold Coins"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070910] via-transparent to-transparent flex items-end p-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500 text-black font-mono">
                    All-Inclusive Retreats
                  </span>
                  <div className="text-base font-bold text-white mt-1">
                    Dubai · Singapore · Switzerland
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5">
              
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  Exclusive Reward Tiers
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  Reach Team Milestones & Fly Free
                </h3>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[#070910] border border-[#1d2538] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-sm">
                      🇦🇪
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block">Dubai 5-Star Supercar Summit</span>
                      <span className="text-xs text-slate-400 font-medium">4 Days / 3 Nights · Atlantis The Royal Hotel</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-amber-400 block tabular-nums">$25,000 Volume</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Flight + Stay Paid</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#070910] border border-[#1d2538] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold text-sm">
                      🇸🇬
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block">Singapore Marina Bay Yacht Retreat</span>
                      <span className="text-xs text-slate-400 font-medium">5 Days / 4 Nights · Marina Bay Sands VIP Suite</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-purple-400 block tabular-nums">$60,000 Volume</span>
                    <span className="text-[10px] text-emerald-400 font-mono">+ $2,500 VIP Cash</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#070910] border border-[#1d2538] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-sm">
                      🇨🇭
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block">Switzerland Alpine Sovereign Tour</span>
                      <span className="text-xs text-slate-400 font-medium">7 Days / 6 Nights · Private Chalet in Zermatt</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-cyan-400 block tabular-nums">$150,000 Volume</span>
                    <span className="text-[10px] text-emerald-400 font-mono">1% Lifetime Royalty</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400 font-mono">
                  Current Round Closes: <strong className="text-white">Q3 2026</strong>
                </span>
                <button
                  type="button"
                  onClick={handleLaunch}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>Join Affiliate Network</span>
                  <ArrowRight size={13} />
                </button>
              </div>

            </div>

          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="p-3.5 rounded-2xl bg-[#0c0f18] border border-pink-500/30">
            <span className="text-[10px] text-slate-400 block font-mono">Level 1 (Direct)</span>
            <span className="text-lg font-black text-pink-400 font-mono mt-0.5 block tabular-nums">15.0%</span>
            <span className="text-[10px] text-slate-500">Instant Commission</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0c0f18] border border-purple-500/30">
            <span className="text-[10px] text-slate-400 block font-mono">Level 2</span>
            <span className="text-lg font-black text-purple-400 font-mono mt-0.5 block tabular-nums">8.0%</span>
            <span className="text-[10px] text-slate-500">Team Dividend</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0c0f18] border border-cyan-500/30">
            <span className="text-[10px] text-slate-400 block font-mono">Level 3</span>
            <span className="text-lg font-black text-cyan-400 font-mono mt-0.5 block tabular-nums">5.0%</span>
            <span className="text-[10px] text-slate-500">Team Dividend</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0c0f18] border border-emerald-500/30">
            <span className="text-[10px] text-slate-400 block font-mono">Level 4 - 6</span>
            <span className="text-lg font-black text-emerald-400 font-mono mt-0.5 block tabular-nums">2.0%</span>
            <span className="text-[10px] text-slate-500">Passive Tier</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0c0f18] border border-amber-500/30">
            <span className="text-[10px] text-slate-400 block font-mono">Level 7 - 10</span>
            <span className="text-lg font-black text-amber-400 font-mono mt-0.5 block tabular-nums">1.0%</span>
            <span className="text-[10px] text-slate-500">Global Infinity</span>
          </div>
        </div>

      </section>

      {/* ========================================================= */}
      {/* 6. ECOSYSTEM PILLARS & LOTTERY */}
      {/* ========================================================= */}
      <section id="features" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-12 border-b border-[#1b2236]">
        
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest font-mono">
            Core Protocol Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            High-Yield Staking & Wealth Automation
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Powered by high-throughput on-chain smart contracts with 100% non-custodial ownership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="rounded-3xl bg-gradient-to-b from-[#131726] to-[#090c14] border border-amber-500/30 overflow-hidden shadow-2xl flex flex-col justify-between group">
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-extrabold font-mono flex items-center gap-1.5 tabular-nums">
                  <Flame size={14} className="text-amber-400" />
                  <span>Up to 36.5% APY</span>
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  Daily Payouts
                </span>
              </div>

              <h3 className="text-2xl font-black text-white tracking-tight">
                Smart Staking & Team Dividend Pools
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                Stake {BRAND.tokenSymbol} or USDT in flexible or fixed lockup vaults. Unlock 10 levels of multi-tier affiliate referral income and compounding daily returns.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleLaunch}
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-amber-950/40"
                >
                  <span>Start Staking Vault</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <div className="relative h-60 sm:h-72 overflow-hidden border-t border-amber-500/20">
              <img
                src={stakingYieldImg}
                alt="3D Staking Yield Golden Chest"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090c14] via-transparent to-transparent" />
            </div>
          </div>

          <div id="lottery" className="rounded-3xl bg-gradient-to-b from-[#131726] to-[#090c14] border border-purple-500/30 overflow-hidden shadow-2xl flex flex-col justify-between group">
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-extrabold font-mono flex items-center gap-1.5">
                  <Ticket size={14} className="text-purple-400" />
                  <span>Daily Prize Pool</span>
                </span>
                <span className="text-xs font-mono text-cyan-400 font-bold tabular-nums">
                  $125,400+ USDT Won
                </span>
              </div>

              <h3 className="text-2xl font-black text-white tracking-tight">
                Decentralized On-Chain Lottery & Trips
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                Win transparent lottery jackpots powered by cryptographic random seed generators. Top community builders qualify for luxury all-inclusive international retreats.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleLaunch}
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:opacity-95 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-purple-950/40"
                >
                  <span>Participate in Lottery</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <div className="relative h-60 sm:h-72 overflow-hidden border-t border-purple-500/20">
              <img
                src={lotteryPrizeImg}
                alt="3D Lucky Prize Wheel"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090c14] via-transparent to-transparent" />
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0c0f18] border border-cyan-500/30 space-y-3 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-900/40">
              <Wallet size={22} />
            </div>
            <h4 className="text-base font-bold text-white">Multi-Chain Vaults</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Deposit and withdraw across 5 chains: {BRAND.tokenSymbol}, ETH, USDT, BUSD, TRX. Internal transfers have 0 gas fees.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c0f18] border border-emerald-500/30 space-y-3 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/40">
              <Repeat size={22} />
            </div>
            <h4 className="text-base font-bold text-white">Zero-Slippage {BRAND.name} Swaps</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Convert between {BRAND.tokenSymbol}, USDT, and liquid assets instantly at fair protocol rates with automated liquidity balancing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c0f18] border border-pink-500/30 space-y-3 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-pink-900/40">
              <ShieldCheck size={22} />
            </div>
            <h4 className="text-base font-bold text-white">Dual-Layer PIN Keypad</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              6-digit encrypted PIN vault guards every withdrawal, providing physical and digital anti-theft protection.
            </p>
          </div>
        </div>

      </section>

      {/* ========================================================= */}
      {/* 7. ROADMAP & LIVE ON-CHAIN NETWORK ACTIVITY */}
      {/* ========================================================= */}
      <section id="roadmap" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-b border-[#1b2236] space-y-12">
        
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono">
            Ecosystem Milestones
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Strategic Roadmap & Live Ledger Activity
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Real-time verification of on-chain growth and ongoing milestone delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-6 rounded-2xl bg-[#0c0f18] border border-emerald-500/40 relative space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-emerald-400">Phase 1 (Q1 2026)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                Completed ✓
              </span>
            </div>
            <h4 className="text-base font-bold text-white">Mainnet Launch & Core Vaults</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Deployment of {BRAND.chainName} v{BRAND.version}, Spot/Main/Funding wallet architecture, and instant internal zero-gas transfer ledger.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111626] border border-cyan-500/40 relative space-y-3 shadow-lg ring-1 ring-cyan-500/30">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-cyan-400">Phase 2 (Q2 2026)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 animate-pulse">
                Active Now 🔥
              </span>
            </div>
            <h4 className="text-base font-bold text-white">Cross-Chain Bridge & Mobile</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Direct bridging for ETH, BSC, Tron, and Solana. Launch of Android In-App Web3 mobile client and expanded staking vaults.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c0f18] border border-[#1e2538] relative space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-purple-400">Phase 3 (Q3 2026)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                Upcoming
              </span>
            </div>
            <h4 className="text-base font-bold text-white">AI Liquidity & Dubai Summit</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Algorithmic yield balancing pools, automated jackpot draws expansion, and inaugural Dubai Supercar VIP retreat for top tier leaders.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c0f18] border border-[#1e2538] relative space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-amber-400">Phase 4 (Q4 2026)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                Upcoming
              </span>
            </div>
            <h4 className="text-base font-bold text-white">Sovereign DAO Governance</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Transition to fully autonomous community governance, on-chain voting proposals, and global institutional custody partnerships.
            </p>
          </div>

        </div>

        <div className="rounded-2xl bg-[#090c14] border border-[#1d2538] p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#182030] pb-3">
            <div className="flex items-center gap-2">
              <Radio size={16} className="text-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                Live On-Chain Activity Ledger
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Block: <strong className="text-cyan-400 tabular-nums">#4,928,124</strong> (1.2s avg)
            </span>
          </div>

          <div className="space-y-2">
            {recentTransactions.map((tx, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#0e121e] border border-[#192234] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono hover:bg-[#141a2c] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-cyan-400 font-semibold">{tx.hash}</span>
                  <span className="px-2 py-0.5 rounded bg-black/40 text-slate-300 text-[11px] font-['Poppins']">
                    {tx.type}
                  </span>
                  <span className="text-slate-400">{tx.user}</span>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className={`font-bold tabular-nums ${tx.color}`}>{tx.amount}</span>
                  <span className="text-[11px] text-slate-500 tabular-nums">{tx.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ========================================================= */}
      {/* 8. VIBRANT CTA BANNER */}
      {/* ========================================================= */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-[#ff3864]/20 via-[#9d4edd]/20 to-[#3a86ff]/20 border border-purple-500/40 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Start Staking & Earning Daily on {BRAND.chainName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Connect in 1 tap directly from mobile Chrome, Safari, or desktop MetaMask.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleLaunch}
              className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-[#ff3864] via-[#9d4edd] to-[#3a86ff] hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-purple-950/60 transition-all cursor-pointer active:scale-95"
            >
              Launch App & Connect
            </button>
            <button
              type="button"
              onClick={handleSignIn}
              className="py-3.5 px-7 rounded-2xl bg-[#0e121d] hover:bg-[#161c2d] border border-[#232c44] text-slate-200 font-bold text-sm transition-all cursor-pointer"
            >
              Existing Member Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SCROLL EFFECT 4: FLOATING GLASS QUICK-JUMP DOCK */}
      {/* Appears when scrolling down past 500px */}
      {/* ========================================================= */}
      {scrollY > 500 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center gap-1.5 p-1.5 rounded-full bg-[#0d101a]/90 backdrop-blur-2xl border border-[#242d45] shadow-2xl transition-all duration-300">
          {[
            { id: 'hero', label: 'Swap' },
            { id: 'assets', label: 'Assets' },
            { id: 'staking-plans', label: 'Staking' },
            { id: 'community-rewards', label: 'VIP Trips' },
            { id: 'roadmap', label: 'Roadmap' },
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeSection === item.id
                  ? 'bg-gradient-to-r from-[#ff3864] to-[#00f0ff] text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={handleLaunch}
            className="ml-1 px-3.5 py-1.5 rounded-full bg-white text-black font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Launch
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* SCROLL EFFECT 5: CIRCULAR PROGRESS SCROLL-TO-TOP BUTTON */}
      {/* ========================================================= */}
      {scrollY > 350 && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-[#121624] border border-[#26314c] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer group"
          title="Scroll to Top"
        >
          <div className="relative flex items-center justify-center">
            {/* SVG Circular Progress Ring */}
            <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-pink-500"
                strokeDasharray={`${scrollProgress}, 100`}
                strokeWidth="3"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <ArrowUp size={14} className="absolute text-slate-200 group-hover:text-white" />
          </div>
        </button>
      )}

      {/* ========================================================= */}
      {/* 9. FOOTER */}
      {/* ========================================================= */}
      <footer className="border-t border-[#181f32] bg-[#05070a] py-10 px-4 sm:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#ff3864] via-[#9d4edd] to-[#3a86ff] flex items-center justify-center text-white font-black text-xs">
              {BRAND.name.slice(0, 2).toUpperCase()}
            </div>
            <span className="font-bold text-white text-sm">
              {BRAND.name.toUpperCase()} · {BRAND.chainName.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <span className="hover:text-cyan-400 cursor-pointer" onClick={handleLaunch}>App</span>
            <a href="#hero" className="hover:text-pink-400">Swap</a>
            <a href="#assets" className="hover:text-purple-400">Assets</a>
            <a href="#staking-plans" className="hover:text-emerald-400">Staking</a>
            <a href="#community-rewards" className="hover:text-amber-400">VIP Trips</a>
            <span className="hover:text-white cursor-pointer" onClick={handleSignIn}>Sign In</span>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            {BRAND.copyright}
          </div>
        </div>
      </footer>

    </div>
  );
};

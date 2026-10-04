/*
 FILE: src/pages/landing/LandingPage.tsx

 PURPOSE:
 Pixel-Perfect "Money X" Landing Page with Rich JS Scroll Animation Effects (motion/react):
 - Smooth whileInView scroll-triggered reveals, depth parallax floating, and staggered card entrances
 - Authentic Money X Green Infinity Logo component (∞)
 - Exact replication of file_0000000096d88210ad2767a0c444187f.png
*/

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { MoneyXLogo } from '../../components/common/MoneyXLogo';
import heroWomenImg from '../../assets/images/moneyx_hero_women_1791117275763.jpg';
import ecosystemPhonesImg from '../../assets/images/moneyx_ecosystem_phones_1791117300782.jpg';
import infinitySculptureImg from '../../assets/images/moneyx_infinity_sculpture_1791117317826.jpg';
import globePhoneImg from '../../assets/images/moneyx_globe_phone_1791117332362.jpg';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Gift,
  Globe,
  Grid,
  Headphones,
  Layers,
  LayoutGrid,
  Menu,
  QrCode,
  Send,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sprout,
  Trophy,
  Users,
  Wallet,
  X,
  Zap,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user, setAuthStage, setActiveRoute } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeCommunityIndex, setActiveCommunityIndex] = useState<number>(0);
  const [subscribeEmail, setSubscribeEmail] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);

  // Authentication gatekeeper: ALWAYS routes to real Web3 wallet connect flow
  const handleStartApp = () => {
    if (!user) {
      setAuthStage('UNAUTHENTICATED');
    } else {
      setAuthStage('LOCKED');
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscribeEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setSubscribeEmail('');
    }
  };

  const communityMembers = [
    {
      name: 'Alex R.',
      role: 'Core Contributor',
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Elena K.',
      role: 'VIP Staker',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Marcus Chen',
      role: 'Liquidity Provider',
      img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'David S.',
      role: 'Global Node',
      img: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Sarah M.',
      role: 'Ecosystem Lead',
      img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    },
  ];

  const handlePrevMember = () => {
    setActiveCommunityIndex((prev) => (prev === 0 ? communityMembers.length - 1 : prev - 1));
  };

  const handleNextMember = () => {
    setActiveCommunityIndex((prev) => (prev === communityMembers.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-[#00e699] selection:text-black overflow-x-hidden relative">
      
      {/* 1. TOP NAVBAR */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="sticky top-0 z-50 w-full bg-black/85 backdrop-blur-xl border-b border-[#141418]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <MoneyXLogo size="md" glow />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#hero" className="text-white hover:text-[#00e699] transition-colors">Home</a>
            <a href="#ecosystem" className="hover:text-[#00e699] transition-colors">Ecosystem</a>
            <a href="#rewards" className="hover:text-[#00e699] transition-colors">Rewards</a>
            <a href="#community" className="hover:text-[#00e699] transition-colors">Community</a>
            <a href="#about" className="hover:text-[#00e699] transition-colors">About</a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Globe Language Selector Pill */}
            <button
              type="button"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#08080a] border border-[#18181c] text-slate-300 text-xs font-bold hover:text-white hover:border-[#26262e] transition-colors cursor-pointer"
              aria-label="Language Selector"
            >
              <Globe size={14} className="text-slate-400" />
              <span className="text-[10px] text-slate-500">•</span>
            </button>

            {/* Primary Connect Wallet Button */}
            <button
              type="button"
              onClick={handleStartApp}
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-[#00e699] hover:bg-[#00ffa3] active:scale-[0.98] text-black font-extrabold text-xs sm:text-sm tracking-tight transition-all shadow-lg shadow-[#00e699]/30 flex items-center gap-2 cursor-pointer"
            >
              <CreditCard size={15} className="stroke-[2.5]" />
              <span>Connect Wallet</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-[#08080a] border border-[#18181c] text-slate-300 hover:text-white cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#08080a] border-b border-[#18181c] px-5 py-6 space-y-4 animate-fadeIn">
            <nav className="flex flex-col gap-3 text-sm font-semibold text-slate-300">
              <a
                href="#hero"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-white hover:text-[#00e699]"
              >
                Home
              </a>
              <a
                href="#ecosystem"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#00e699]"
              >
                Ecosystem
              </a>
              <a
                href="#rewards"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#00e699]"
              >
                Rewards
              </a>
              <a
                href="#community"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#00e699]"
              >
                Community
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#00e699]"
              >
                About
              </a>
            </nav>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleStartApp();
              }}
              className="w-full py-3 rounded-xl bg-[#00e699] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              <CreditCard size={15} />
              <span>Connect Wallet</span>
            </button>
          </div>
        )}
      </motion.header>

      {/* 2. HERO SECTION */}
      <section id="hero" className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden">
        {/* Subtle Ambient Emerald Glow */}
        <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-[#00e699]/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 space-y-6 sm:space-y-8 z-10 text-left"
            >
              
              {/* Tag Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#05140c] border border-[#00e699]/30 text-xs font-semibold text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e699] animate-pulse" />
                <span className="text-[11px] sm:text-xs">Next-Gen Crypto Ecosystem</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
                Earn, Grow <br />
                and Be Part of <br />
                <span className="text-[#00e699]">Something Bigger</span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-400 max-w-lg leading-relaxed font-normal">
                Money X is a crypto-based ecosystem designed for everyone. Explore multiple ways to earn — Staking, Farming, Rewards, Jackpot and more.
              </p>

              {/* CTA Button */}
              <div>
                <button
                  type="button"
                  onClick={handleStartApp}
                  className="px-8 py-4 rounded-xl bg-[#00e699] hover:bg-[#00ffa3] active:scale-[0.98] text-black font-extrabold text-sm sm:text-base tracking-tight transition-all shadow-xl shadow-[#00e699]/30 flex items-center gap-2.5 cursor-pointer"
                >
                  <CreditCard size={18} className="stroke-[2.5]" />
                  <span>Connect Wallet</span>
                </button>
              </div>

              {/* Web3 Wallets Row */}
              <div className="pt-2 space-y-2.5">
                <p className="text-xs text-slate-400 font-medium">
                  Connect with your Web3 Wallet
                </p>
                <div className="flex items-center gap-3">
                  
                  {/* MetaMask */}
                  <div
                    onClick={handleStartApp}
                    className="w-9 h-9 rounded-xl bg-[#0d0d10] border border-[#1e1e24] hover:border-[#00e699]/50 flex items-center justify-center p-2 cursor-pointer transition-all hover:scale-110 shadow-md"
                    title="MetaMask"
                  >
                    <svg className="w-full h-full" viewBox="0 0 318.6 318.6">
                      <path fill="#E2761B" d="m274.1 35.5-99.5 73.9L194 65.4z"/>
                      <path fill="#E4761B" d="m44.4 35.5 98.7 74.6-18.7-44.7z"/>
                      <path fill="#E4751F" d="m214.7 252.9-33.6 16.3 3.6 28.5 63.9-19.1z"/>
                      <path fill="#E4751F" d="m70 278.6 63.9 19.1 3.6-28.5-33.6-16.3z"/>
                      <path fill="#F6851B" d="m137.5 297.7-3.6 28.5 25.4 7.4 25.4-7.4-3.6-28.5-21.8 15.3z"/>
                    </svg>
                  </div>

                  {/* WalletConnect */}
                  <div
                    onClick={handleStartApp}
                    className="w-9 h-9 rounded-xl bg-[#0d0d10] border border-[#1e1e24] hover:border-[#00e699]/50 flex items-center justify-center p-2 cursor-pointer transition-all hover:scale-110 shadow-md"
                    title="WalletConnect"
                  >
                    <svg className="w-full h-full" viewBox="0 0 24 24" fill="#3B99FC">
                      <path d="M5.5 8.5C9.1 4.9 14.9 4.9 18.5 8.5L19 9C19.2 9.2 19.2 9.6 19 9.8L17.6 11.2C17.4 11.4 17.1 11.4 16.9 11.2L16.2 10.5C13.9 8.2 10.1 8.2 7.8 10.5L7.1 11.2C6.9 11.4 6.6 11.4 6.4 11.2L5 9.8C4.8 9.6 4.8 9.2 5 9L5.5 8.5ZM21.3 11.3L22.6 12.6C22.8 12.8 22.8 13.2 22.6 13.4L17 19C16.8 19.2 16.4 19.2 16.2 19L12 14.8L7.8 19C7.6 19.2 7.2 19.2 7 19L1.4 13.4C1.2 13.2 1.2 12.8 1.4 12.6L2.7 11.3C2.9 11.1 3.3 11.1 3.5 11.3L7.7 15.5L11.9 11.3C12.1 11.1 12.5 11.1 12.7 11.3L16.3 14.9L20.5 10.7C20.7 10.5 21.1 10.5 21.3 10.7V11.3Z"/>
                    </svg>
                  </div>

                  {/* Trust Wallet */}
                  <div
                    onClick={handleStartApp}
                    className="w-9 h-9 rounded-xl bg-[#0d0d10] border border-[#1e1e24] hover:border-[#00e699]/50 flex items-center justify-center p-2 cursor-pointer transition-all hover:scale-110 shadow-md"
                    title="Trust Wallet"
                  >
                    <Shield size={20} className="stroke-[2.5] text-[#3375BB]" />
                  </div>

                  {/* Binance */}
                  <div
                    onClick={handleStartApp}
                    className="w-9 h-9 rounded-xl bg-[#0d0d10] border border-[#1e1e24] hover:border-[#00e699]/50 flex items-center justify-center p-2 cursor-pointer transition-all hover:scale-110 shadow-md"
                    title="Binance Web3 Wallet"
                  >
                    <div className="w-4 h-4 bg-[#F0B90B] rotate-45 rounded-[2px]" />
                  </div>

                  {/* More Wallets */}
                  <div
                    onClick={handleStartApp}
                    className="w-9 h-9 rounded-xl bg-[#0d0d10] border border-[#1e1e24] hover:border-[#00e699]/50 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-all hover:scale-110 shadow-md font-bold text-xs"
                    title="More Wallets"
                  >
                    •••
                  </div>

                </div>
              </div>

            </motion.div>

            {/* Right Visual Artwork (Matching Reference image) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 relative flex items-center justify-center"
            >
              
              {/* Main Artwork Container */}
              <div className="relative w-full max-w-[540px] aspect-square rounded-3xl overflow-hidden border border-[#1c2e24] bg-black shadow-2xl group">
                <img
                  src={heroWomenImg}
                  alt="Money X Ecosystem Traders with Infinity Logo"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating "Simple Secure Rewarding" Card */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="absolute bottom-5 right-5 sm:bottom-6 sm:right-6 p-4 rounded-2xl bg-[#050807]/90 backdrop-blur-xl border border-[#1b2b20] shadow-2xl text-left max-w-[210px] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white leading-tight">
                      Simple <br />
                      Secure <br />
                      Rewarding
                    </span>
                    <div className="w-6 h-6 rounded-lg bg-[#00e699]/20 border border-[#00e699]/40 flex items-center justify-center text-[#00e699]">
                      <Sparkles size={13} />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#141e18] flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00e699]" />
                    <span>One Ecosystem</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Many Opportunities</p>
                </motion.div>

              </div>

            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. METRICS / STATS BAR */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="rounded-2xl sm:rounded-3xl bg-[#08080a] border border-[#18181c] p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 shadow-2xl">
          
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#00e699]/15 border border-[#00e699]/30 flex items-center justify-center text-[#00e699] shrink-0 shadow-md">
              <Users size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight tabular-nums">
                2M+
              </div>
              <div className="text-xs text-slate-400 font-medium">Global Users</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#00e699]/15 border border-[#00e699]/30 flex items-center justify-center text-[#00e699] shrink-0 shadow-md">
              <BarChart3 size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight tabular-nums">
                150+
              </div>
              <div className="text-xs text-slate-400 font-medium">Countries</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#00e699]/15 border border-[#00e699]/30 flex items-center justify-center text-[#00e699] shrink-0 shadow-md">
              <Layers size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Multiple
              </div>
              <div className="text-xs text-slate-400 font-medium">Earning Options</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#00e699]/15 border border-[#00e699]/30 flex items-center justify-center text-[#00e699] shrink-0 shadow-md">
              <Headphones size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight tabular-nums">
                24/7
              </div>
              <div className="text-xs text-slate-400 font-medium">Community Support</div>
            </div>
          </div>

        </div>
      </motion.section>

      {/* 4. A COMPLETE CRYPTO ECOSYSTEM IN YOUR HANDS */}
      <motion.section
        id="ecosystem"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7 }}
        className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6 text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12]">
              A Complete <br />
              Crypto Ecosystem <br />
              <span className="text-[#00e699]">in Your Hands</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-md">
              Money X brings together multiple earning systems in a single, secure and easy-to-use platform. Connect your wallet and start your journey today.
            </p>

            <div>
              <button
                type="button"
                onClick={handleStartApp}
                className="px-6 py-3.5 rounded-xl bg-[#00e699] hover:bg-[#00ffa3] active:scale-[0.98] text-black font-extrabold text-sm tracking-tight transition-all shadow-lg shadow-[#00e699]/30 inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Ecosystem</span>
                <ArrowUpRight size={18} className="stroke-[2.5]" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 flex justify-center">
            <div className="relative w-full max-w-[560px] aspect-square rounded-3xl overflow-hidden border border-[#18181c] bg-black shadow-2xl group">
              <img
                src={ecosystemPhonesImg}
                alt="Money X Mobile Platform Displaying 1,250 USDT Balance"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

        </div>
      </motion.section>

      {/* 5. 6 CORE FEATURES GRID */}
      <motion.section
        id="rewards"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          
          {/* 1. Staking */}
          <div
            onClick={handleStartApp}
            className="p-5 rounded-2xl bg-[#08080a] border border-[#18181c] hover:border-[#00e699]/50 hover:bg-[#0d0d12] transition-all cursor-pointer space-y-3 group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-[#00e699]/15 border border-[#00e699]/30 flex items-center justify-center text-[#00e699] group-hover:scale-110 transition-transform">
              <Layers size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-[#00e699] transition-colors">
                Staking
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Stake and earn daily rewards
              </p>
            </div>
          </div>

          {/* 2. Farming */}
          <div
            onClick={handleStartApp}
            className="p-5 rounded-2xl bg-[#08080a] border border-[#18181c] hover:border-[#00e699]/50 hover:bg-[#0d0d12] transition-all cursor-pointer space-y-3 group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-[#00e699]/15 border border-[#00e699]/30 flex items-center justify-center text-[#00e699] group-hover:scale-110 transition-transform">
              <Sprout size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-[#00e699] transition-colors">
                Farming
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Participate and earn more
              </p>
            </div>
          </div>

          {/* 3. Jackpot */}
          <div
            onClick={handleStartApp}
            className="p-5 rounded-2xl bg-[#08080a] border border-[#18181c] hover:border-[#00e699]/50 hover:bg-[#0d0d12] transition-all cursor-pointer space-y-3 group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-[#00e699]/15 border border-[#00e699]/30 flex items-center justify-center text-[#00e699] group-hover:scale-110 transition-transform">
              <Sparkles size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-[#00e699] transition-colors">
                Jackpot
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Win big rewards daily
              </p>
            </div>
          </div>

          {/* 4. Community */}
          <div
            onClick={handleStartApp}
            className="p-5 rounded-2xl bg-[#08080a] border border-[#18181c] hover:border-[#00e699]/50 hover:bg-[#0d0d12] transition-all cursor-pointer space-y-3 group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-[#00e699]/15 border border-[#00e699]/30 flex items-center justify-center text-[#00e699] group-hover:scale-110 transition-transform">
              <Users size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-[#00e699] transition-colors">
                Community
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Build your team and grow together
              </p>
            </div>
          </div>

          {/* 5. Rewards */}
          <div
            onClick={handleStartApp}
            className="p-5 rounded-2xl bg-[#08080a] border border-[#18181c] hover:border-[#00e699]/50 hover:bg-[#0d0d12] transition-all cursor-pointer space-y-3 group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-[#00e699]/15 border border-[#00e699]/30 flex items-center justify-center text-[#00e699] group-hover:scale-110 transition-transform">
              <Gift size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-[#00e699] transition-colors">
                Rewards
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Daily, weekly and special rewards
              </p>
            </div>
          </div>

          {/* 6. Multiple Wallets */}
          <div
            onClick={handleStartApp}
            className="p-5 rounded-2xl bg-[#08080a] border border-[#18181c] hover:border-[#00e699]/50 hover:bg-[#0d0d12] transition-all cursor-pointer space-y-3 group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-[#00e699]/15 border border-[#00e699]/30 flex items-center justify-center text-[#00e699] group-hover:scale-110 transition-transform">
              <CreditCard size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-[#00e699] transition-colors">
                Multiple Wallets
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Manage all in one place
              </p>
            </div>
          </div>

        </div>
      </motion.section>

      {/* 6. HOW MONEY X WORKS */}
      <motion.section
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7 }}
        className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12"
      >
        <div className="space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            How <span className="text-[#00e699]">Money X</span> Works
          </h2>
          <p className="text-sm text-slate-400">
            Get started in just a few simple steps and begin your earning journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          
          {/* Step 1 */}
          <div
            onClick={handleStartApp}
            className="p-6 rounded-2xl bg-[#08080a] border border-[#18181c] hover:border-[#00e699]/40 hover:bg-[#0c0c10] transition-all text-left space-y-4 cursor-pointer relative group"
          >
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 rounded-full bg-[#00e699] text-black font-black text-xs flex items-center justify-center">
                1
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#00e699]/15 text-[#00e699] flex items-center justify-center">
                <Wallet size={18} />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-[#00e699] transition-colors">
                Connect Wallet
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Connect your crypto wallet and get secure access.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div
            onClick={handleStartApp}
            className="p-6 rounded-2xl bg-[#08080a] border border-[#18181c] hover:border-[#00e699]/40 hover:bg-[#0c0c10] transition-all text-left space-y-4 cursor-pointer relative group"
          >
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 rounded-full bg-[#00e699] text-black font-black text-xs flex items-center justify-center">
                2
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#00e699]/15 text-[#00e699] flex items-center justify-center">
                <LayoutGrid size={18} />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-[#00e699] transition-colors">
                Explore Ecosystem
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Discover multiple earning features.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div
            onClick={handleStartApp}
            className="p-6 rounded-2xl bg-[#08080a] border border-[#18181c] hover:border-[#00e699]/40 hover:bg-[#0c0c10] transition-all text-left space-y-4 cursor-pointer relative group"
          >
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 rounded-full bg-[#00e699] text-black font-black text-xs flex items-center justify-center">
                3
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#00e699]/15 text-[#00e699] flex items-center justify-center">
                <Zap size={18} />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-[#00e699] transition-colors">
                Participate & Earn
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Join Staking, Farming, Jackpot and more.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div
            onClick={handleStartApp}
            className="p-6 rounded-2xl bg-[#08080a] border border-[#18181c] hover:border-[#00e699]/40 hover:bg-[#0c0c10] transition-all text-left space-y-4 cursor-pointer relative group"
          >
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 rounded-full bg-[#00e699] text-black font-black text-xs flex items-center justify-center">
                4
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#00e699]/15 text-[#00e699] flex items-center justify-center">
                <Users size={18} />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-[#00e699] transition-colors">
                Grow Together
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Invite, build your team and increase your rewards.
              </p>
            </div>
          </div>

        </div>
      </motion.section>

      {/* 7. WHY CHOOSE MONEY X */}
      <motion.section
        id="about"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7 }}
        className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-8 text-left">
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
                Why Choose <br />
                <span className="text-[#00e699]">Money X?</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-md">
                A simple, secure and transparent ecosystem built for everyone.
              </p>
            </div>

            <div className="space-y-3.5">
              {[
                { title: 'Multiple Earning Opportunities', icon: BarChart3 },
                { title: 'Secure & Decentralized', icon: ShieldCheck },
                { title: 'Global Community', icon: Users },
                { title: 'Easy to Use', icon: Sparkles },
                { title: 'Transparent System', icon: CheckCircle2 },
              ].map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3.5 p-3 rounded-xl bg-[#08080a] border border-[#18181c] hover:border-[#00e699]/40 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#00e699]/15 border border-[#00e699]/30 flex items-center justify-center text-[#00e699] shrink-0">
                      <ItemIcon size={16} className="stroke-[2.5]" />
                    </div>
                    <span className="text-sm font-bold text-white">
                      {item.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7 relative flex items-center justify-center">
            
            <div className="relative w-full max-w-[520px] aspect-square rounded-3xl overflow-hidden border border-[#1c2e24] bg-black shadow-2xl">
              <img
                src={infinitySculptureImg}
                alt="Glowing 3D Emerald Infinity Symbol on Obsidian Rock"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {/* 4 Surrounding Badges */}
              <div className="absolute top-5 left-5 p-2.5 sm:p-3 rounded-xl bg-[#050807]/90 backdrop-blur-xl border border-[#18181c] shadow-2xl flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#00e699]/20 text-[#00e699] flex items-center justify-center">
                  <BarChart3 size={13} />
                </div>
                <span className="text-[11px] font-bold text-white whitespace-nowrap">
                  Multiple Earning Options
                </span>
              </div>

              <div className="absolute top-5 right-5 p-2.5 sm:p-3 rounded-xl bg-[#050807]/90 backdrop-blur-xl border border-[#18181c] shadow-2xl flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#00e699]/20 text-[#00e699] flex items-center justify-center">
                  <ShieldCheck size={13} />
                </div>
                <span className="text-[11px] font-bold text-white whitespace-nowrap">
                  Secure & Decentralized
                </span>
              </div>

              <div className="absolute bottom-5 left-5 p-2.5 sm:p-3 rounded-xl bg-[#050807]/90 backdrop-blur-xl border border-[#18181c] shadow-2xl flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#00e699]/20 text-[#00e699] flex items-center justify-center">
                  <Users size={13} />
                </div>
                <span className="text-[11px] font-bold text-white whitespace-nowrap">
                  Global Community
                </span>
              </div>

              <div className="absolute bottom-5 right-5 p-2.5 sm:p-3 rounded-xl bg-[#050807]/90 backdrop-blur-xl border border-[#18181c] shadow-2xl flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#00e699]/20 text-[#00e699] flex items-center justify-center">
                  <CheckCircle2 size={13} />
                </div>
                <span className="text-[11px] font-bold text-white whitespace-nowrap">
                  Transparent & Fair System
                </span>
              </div>

            </div>

          </div>

        </div>
      </motion.section>

      {/* 8. TAKE MONEY X EVERYWHERE */}
      <motion.section
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7 }}
        className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[500px] aspect-square rounded-3xl overflow-hidden border border-[#18181c] bg-black shadow-2xl group">
              <img
                src={globePhoneImg}
                alt="Money X Mobile App with Digital Earth Globe"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-7 text-left">
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12]">
                Take <span className="text-[#00e699]">Money X</span> <br />
                Everywhere
              </h2>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-md">
                Access all features on the go. Manage your wallet, participate in earning programs and stay connected with the community — anytime, anywhere.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleStartApp}
                className="px-4 py-2.5 rounded-xl bg-[#08080a] border border-[#222228] hover:border-[#00e699]/50 transition-all flex items-center gap-3 cursor-pointer shadow-lg group"
              >
                <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.64-.78 1.08-1.86.96-2.94-.93.04-2.06.62-2.72 1.4-.58.67-1.09 1.77-.95 2.83 1.04.08 2.07-.51 2.71-1.29Z"/>
                </svg>
                <div className="text-left leading-tight">
                  <span className="text-[10px] text-slate-400 block">Download on the</span>
                  <span className="text-xs font-bold text-white">App Store</span>
                </div>
              </button>

              <button
                type="button"
                onClick={handleStartApp}
                className="px-4 py-2.5 rounded-xl bg-[#08080a] border border-[#222228] hover:border-[#00e699]/50 transition-all flex items-center gap-3 cursor-pointer shadow-lg group"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M3.6 2.5 13.1 12 3.6 21.5c-.3-.3-.6-.8-.6-1.4V3.9c0-.6.3-1.1.6-1.4z"/>
                  <path fill="#FBBC04" d="m16.5 8.6-3.4 3.4 3.4 3.4 3.8-2.2c1.3-.7 1.3-1.9 0-2.6l-3.8-2z"/>
                  <path fill="#4285F4" d="M13.1 12 3.6 2.5l9.5 9.5z"/>
                  <path fill="#34A853" d="m3.6 21.5 9.5-9.5-9.5 9.5z"/>
                </svg>
                <div className="text-left leading-tight">
                  <span className="text-[10px] text-slate-400 block">GET IT ON</span>
                  <span className="text-xs font-bold text-white">Google Play</span>
                </div>
              </button>
            </div>

            <div
              onClick={handleStartApp}
              className="p-3.5 rounded-2xl bg-[#08080a] border border-[#18181c] hover:border-[#00e699]/40 transition-colors inline-flex items-center gap-4 cursor-pointer shadow-lg"
            >
              <div className="w-12 h-12 bg-white rounded-xl p-1.5 flex items-center justify-center shrink-0">
                <QrCode size={36} className="text-black" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-white block">Scan QR Code</span>
                <span className="text-[11px] text-slate-400">Download App</span>
              </div>
            </div>

          </div>

        </div>
      </motion.section>

      {/* 9. JOIN A GLOBAL COMMUNITY */}
      <motion.section
        id="community"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7 }}
        className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12]">
                Join a Global <br />
                <span className="text-[#00e699]">Community</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-md">
                Be part of a growing community of users from around the world. Share ideas, learn and grow together with Money X.
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={handleStartApp}
                className="px-6 py-3.5 rounded-xl bg-[#00e699] hover:bg-[#00ffa3] active:scale-[0.98] text-black font-extrabold text-sm tracking-tight transition-all shadow-lg shadow-[#00e699]/30 inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Join Community</span>
                <ArrowUpRight size={18} className="stroke-[2.5]" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between gap-3">
              
              <button
                type="button"
                onClick={handlePrevMember}
                className="w-8 h-8 rounded-full bg-[#08080a] border border-[#18181c] text-slate-400 hover:text-white hover:border-[#00e699]/40 flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Previous Member"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center justify-center gap-3 sm:gap-4 overflow-hidden py-2">
                {communityMembers.map((member, idx) => (
                  <div
                    key={idx}
                    className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 w-16 h-20 sm:w-20 sm:h-26 shrink-0 ${
                      activeCommunityIndex === idx
                        ? 'border-[#00e699] scale-105 shadow-[0_0_20px_rgba(0,230,153,0.3)]'
                        : 'border-[#18181c] opacity-75 hover:opacity-100 hover:border-[#00e699]/50'
                    }`}
                  >
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                      <span className="text-[9px] font-bold text-white truncate w-full text-center">
                        {member.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleNextMember}
                className="w-8 h-8 rounded-full bg-[#08080a] border border-[#18181c] text-slate-400 hover:text-white hover:border-[#00e699]/40 flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Next Member"
              >
                <ChevronRight size={16} />
              </button>

            </div>

            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#08080a] border border-[#18181c] shadow-xl">
                <div className="flex -space-x-2 overflow-hidden">
                  {communityMembers.slice(0, 4).map((m, idx) => (
                    <img
                      key={idx}
                      src={m.img}
                      alt={m.name}
                      className="inline-block h-6 w-6 rounded-full ring-2 ring-black object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <span>2M+ Global Users</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e699]" />
                </div>
              </div>
            </div>

          </div>

        </div>
      </motion.section>

      {/* 10. SUPPORTED WALLETS SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7 }}
        className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10"
      >
        <div className="space-y-2.5 max-w-md mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Supported Wallets
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Connect with your preferred Web3 wallet.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          
          {/* 1. MetaMask */}
          <button
            type="button"
            onClick={handleStartApp}
            className="p-5 rounded-2xl bg-[#08080a] border border-[#18181c] hover:border-[#00e699]/50 hover:bg-[#0c0c10] active:scale-95 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group shadow-lg"
          >
            <div className="w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8" viewBox="0 0 318.6 318.6">
                <path fill="#E2761B" d="m274.1 35.5-99.5 73.9L194 65.4z"/>
                <path fill="#E4761B" d="m44.4 35.5 98.7 74.6-18.7-44.7z"/>
                <path fill="#E4751F" d="m214.7 252.9-33.6 16.3 3.6 28.5 63.9-19.1z"/>
                <path fill="#E4751F" d="m70 278.6 63.9 19.1 3.6-28.5-33.6-16.3z"/>
                <path fill="#F6851B" d="m137.5 297.7-3.6 28.5 25.4 7.4 25.4-7.4-3.6-28.5-21.8 15.3z"/>
              </svg>
            </div>
            <span className="text-xs font-bold text-white group-hover:text-[#00e699] transition-colors">
              MetaMask
            </span>
          </button>

          {/* 2. Trust Wallet */}
          <button
            type="button"
            onClick={handleStartApp}
            className="p-5 rounded-2xl bg-[#08080a] border border-[#18181c] hover:border-[#00e699]/50 hover:bg-[#0c0c10] active:scale-95 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group shadow-lg relative"
          >
            <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#00e699]" />
            <div className="w-10 h-10 flex items-center justify-center text-[#3375BB] group-hover:scale-110 transition-transform">
              <Shield size={32} className="stroke-[2.5]" />
            </div>
            <span className="text-xs font-bold text-white group-hover:text-[#00e699] transition-colors">
              Trust Wallet
            </span>
          </button>

          {/* 3. WalletConnect */}
          <button
            type="button"
            onClick={handleStartApp}
            className="p-5 rounded-2xl bg-[#08080a] border border-[#18181c] hover:border-[#00e699]/50 hover:bg-[#0c0c10] active:scale-95 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group shadow-lg"
          >
            <div className="w-10 h-10 flex items-center justify-center text-[#3B99FC] group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#3B99FC">
                <path d="M5.5 8.5C9.1 4.9 14.9 4.9 18.5 8.5L19 9C19.2 9.2 19.2 9.6 19 9.8L17.6 11.2C17.4 11.4 17.1 11.4 16.9 11.2L16.2 10.5C13.9 8.2 10.1 8.2 7.8 10.5L7.1 11.2C6.9 11.4 6.6 11.4 6.4 11.2L5 9.8C4.8 9.6 4.8 9.2 5 9L5.5 8.5ZM21.3 11.3L22.6 12.6C22.8 12.8 22.8 13.2 22.6 13.4L17 19C16.8 19.2 16.4 19.2 16.2 19L12 14.8L7.8 19C7.6 19.2 7.2 19.2 7 19L1.4 13.4C1.2 13.2 1.2 12.8 1.4 12.6L2.7 11.3C2.9 11.1 3.3 11.1 3.5 11.3L7.7 15.5L11.9 11.3C12.1 11.1 12.5 11.1 12.7 11.3L16.3 14.9L20.5 10.7C20.7 10.5 21.1 10.5 21.3 10.7V11.3Z"/>
              </svg>
            </div>
            <span className="text-xs font-bold text-white group-hover:text-[#00e699] transition-colors">
              WalletConnect
            </span>
          </button>

          {/* 4. Binance Wallet */}
          <button
            type="button"
            onClick={handleStartApp}
            className="p-5 rounded-2xl bg-[#08080a] border border-[#18181c] hover:border-[#00e699]/50 hover:bg-[#0c0c10] active:scale-95 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group shadow-lg"
          >
            <div className="w-10 h-10 flex items-center justify-center text-[#F0B90B] group-hover:scale-110 transition-transform">
              <div className="w-6 h-6 bg-[#F0B90B] rotate-45 rounded-[3px]" />
            </div>
            <span className="text-xs font-bold text-white group-hover:text-[#00e699] transition-colors">
              Binance Wallet
            </span>
          </button>

          {/* 5. OKX Wallet */}
          <button
            type="button"
            onClick={handleStartApp}
            className="p-5 rounded-2xl bg-[#08080a] border border-[#18181c] hover:border-[#00e699]/50 hover:bg-[#0c0c10] active:scale-95 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group shadow-lg relative"
          >
            <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#00e699]" />
            <div className="w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <div className="grid grid-cols-2 gap-1 w-6 h-6">
                <div className="bg-white rounded-xs" />
                <div className="bg-white rounded-xs" />
                <div className="bg-white rounded-xs" />
                <div className="bg-white rounded-xs" />
              </div>
            </div>
            <span className="text-xs font-bold text-white group-hover:text-[#00e699] transition-colors">
              OKX Wallet
            </span>
          </button>

          {/* 6. More Wallets */}
          <button
            type="button"
            onClick={handleStartApp}
            className="p-5 rounded-2xl bg-[#08080a] border border-[#18181c] hover:border-[#00e699]/50 hover:bg-[#0c0c10] active:scale-95 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group shadow-lg"
          >
            <div className="w-10 h-10 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform font-bold text-lg">
              •••
            </div>
            <span className="text-xs font-bold text-white group-hover:text-[#00e699] transition-colors">
              More Wallets
            </span>
          </button>

        </div>
      </motion.section>

      {/* 11. REGULATORY FOOTER */}
      <footer className="border-t border-[#141418] bg-[#000000] pt-16 pb-12 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
            
            {/* Col 1: Brand & Socials (4 Cols) */}
            <div className="lg:col-span-4 space-y-4">
              <MoneyXLogo size="md" glow />

              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                A modern crypto ecosystem for everyone. <br />
                Earn • Stake • Farm • Jackpot • Grow Together.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-3 pt-2 text-slate-400">
                <a href="#hero" className="w-8 h-8 rounded-lg bg-[#08080a] border border-[#18181c] flex items-center justify-center hover:text-white hover:border-[#00e699]/40 transition-colors">
                  <span className="text-xs font-bold">𝕏</span>
                </a>
                <a href="#hero" className="w-8 h-8 rounded-lg bg-[#08080a] border border-[#18181c] flex items-center justify-center hover:text-white hover:border-[#00e699]/40 transition-colors">
                  <Send size={13} />
                </a>
                <a href="#hero" className="w-8 h-8 rounded-lg bg-[#08080a] border border-[#18181c] flex items-center justify-center hover:text-white hover:border-[#00e699]/40 transition-colors">
                  <Users size={13} />
                </a>
                <a href="#hero" className="w-8 h-8 rounded-lg bg-[#08080a] border border-[#18181c] flex items-center justify-center hover:text-white hover:border-[#00e699]/40 transition-colors">
                  <Sparkles size={13} />
                </a>
              </div>
            </div>

            {/* Col 2: Ecosystem (2 Cols) */}
            <div className="lg:col-span-2 space-y-3">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                Ecosystem
              </h5>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#rewards" className="hover:text-white transition-colors">Staking</a></li>
                <li><a href="#rewards" className="hover:text-white transition-colors">Farming</a></li>
                <li><a href="#rewards" className="hover:text-white transition-colors">Jackpot</a></li>
                <li><a href="#rewards" className="hover:text-white transition-colors">Rewards</a></li>
                <li><a href="#community" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>

            {/* Col 3: Support (2 Cols) */}
            <div className="lg:col-span-2 space-y-3">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                Support
              </h5>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#about" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">System Status</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">API Documentation</a></li>
              </ul>
            </div>

            {/* Col 4: Company (2 Cols) */}
            <div className="lg:col-span-2 space-y-3">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                Company
              </h5>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            {/* Col 5: Stay Updated Form (2 Cols) */}
            <div className="lg:col-span-2 space-y-3">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                Stay Updated
              </h5>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Subscribe to get the latest news, updates and ecosystem events.
              </p>
              
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative flex items-center">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-[#08080a] border border-[#1e1e24] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00e699]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 w-8 h-8 rounded-lg bg-[#00e699] hover:bg-[#00ffa3] text-black flex items-center justify-center cursor-pointer transition-colors shadow-sm"
                    aria-label="Subscribe"
                  >
                    <ArrowUpRight size={16} className="stroke-[2.5]" />
                  </button>
                </div>
                {subscribed && (
                  <p className="text-[10px] text-[#00e699] font-semibold animate-fadeIn">
                    ✓ Thank you for subscribing!
                  </p>
                )}
              </form>
            </div>

          </div>

          {/* Bottom Copyright & Language row */}
          <div className="pt-8 border-t border-[#141418] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <span>© 2026 Money X. All rights reserved.</span>
            
            <div className="flex items-center gap-2 cursor-pointer hover:text-slate-300 transition-colors">
              <Globe size={14} className="text-slate-400" />
              <span>English</span>
              <span className="text-[10px]">⌄</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

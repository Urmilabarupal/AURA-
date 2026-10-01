/*
 FILE: src/components/layout/Header.tsx

 PURPOSE:
 Enterprise Top Navigation Bar for XAH Money.
 - Mobile: Brand, menu hamburger, notifications, dark mode, avatar (Screenshots 3, 4, 5).
 - Desktop: Glassmorphic top bar with breadcrumb indicator, live network status dot,
   connected wallet snippet, lock screen shortcut, and user avatar.
*/

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import { BRAND } from '../../config/brand';
import {
  Bell,
  Copy,
  Globe,
  Lock,
  Menu,
  Moon,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { user, walletAddress, activeRoute, setActiveRoute, lockApp } = useAuth();
  const { copyToClipboard } = useToast();
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('theme-light', isLight);
  }, [isLight]);

  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : '0x7ACc...d9b8';

  const formatRouteName = (route: string) => {
    if (route === 'home') return 'Dashboard';
    return route
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  return (
    <header className={`sticky top-0 z-40 w-full bg-[#12141f]/90 backdrop-blur-xl border-b border-[#1f2538] px-4 sm:px-6 py-3 select-none ${activeRoute !== 'home' ? 'hidden lg:block' : ''}`}>
      
      {/* ----------------- MOBILE HEADER VIEW (lg:hidden) ----------------- */}
      {/* Rendered only on Home page on mobile; subpages use SubpageHeader */}
      {activeRoute === 'home' && (
        <div className="flex lg:hidden items-center justify-between">
          {/* Left: Hamburger & Brand */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#1c2236] transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            {/* HX Logo */}
            <div className="relative w-7 h-6 flex items-center justify-center">
              <svg className="w-7 h-6" viewBox="0 0 64 54" fill="none">
                <defs>
                  <linearGradient id="hdrRibbonMobile" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff2a6d" />
                    <stop offset="48%" stopColor="#9d4edd" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                </defs>
                <path
                  d="M 22 13 C 14 13, 10 20, 10 27 C 10 34, 14 41, 22 41 C 28 41, 32 36, 32 27 C 32 18, 36 13, 42 13 C 50 13, 54 20, 54 27 C 54 34, 50 41, 42 41 C 36 41, 32 36, 32 27"
                  stroke="url(#hdrRibbonMobile)"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 12 27 L 32 27 L 52 27"
                  stroke="url(#hdrRibbonMobile)"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <span className="font-extrabold text-sm tracking-wider text-white">
              {BRAND.chainName.toUpperCase()}
            </span>
          </div>

          {/* Right: Quick Icons */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsLight((value) => !value)}
              className="text-slate-400 hover:text-[#31e66b] p-1.5 rounded-lg hover:bg-[#1a2034] transition-colors cursor-pointer"
              title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
              aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              <Moon size={16} />
            </button>

            <button
              type="button"
              onClick={lockApp}
              className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-[#1a2034] transition-colors cursor-pointer"
              title="Lock Screen"
            >
              <Lock size={16} />
            </button>

            <button
              type="button"
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-[#1a2034] transition-colors cursor-pointer relative"
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-pink-500 ring-2 ring-[#12141f]" />
            </button>

            <button
              type="button"
              onClick={() => setActiveRoute('profile')}
              className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#1e88e5] to-[#42a5f5] flex items-center justify-center text-xs text-white shadow-sm ring-1 ring-white/20 cursor-pointer"
            >
              <span>👦</span>
            </button>
          </div>
        </div>
      )}

      {/* ----------------- DESKTOP HEADER VIEW (hidden lg:flex) ----------------- */}
      <div className="hidden lg:flex items-center justify-between">
        
        {/* Left: Breadcrumbs / Active Context */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#8e98af] hover:text-white transition-colors cursor-pointer" onClick={() => setActiveRoute('home')}>
              {BRAND.name} Platform
            </span>
            <span className="text-slate-600">/</span>
            <span className="font-semibold text-white tracking-wide">
              {formatRouteName(activeRoute)}
            </span>
          </div>

          {/* Network Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#0c0f18] border border-[#1e2538] text-[11px] font-medium text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-mono">{BRAND.chainNetwork}</span>
          </div>
        </div>

        {/* Right: Wallet Address, Lock Button, Profile Pill */}
        <div className="flex items-center gap-3">
          
          {/* Wallet Address Chip */}
          <button
            type="button"
            onClick={() => copyToClipboard(walletAddress || '0x7ACc9bEC21DCDAE112Eef3C95973F27daC02d9b8', 'Wallet address')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0c0f18] border border-[#1e2538] hover:border-[#384366] text-xs font-mono text-slate-200 transition-colors cursor-pointer group"
            title="Click to copy full address"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{shortAddress}</span>
            <Copy size={12} className="text-slate-500 group-hover:text-slate-200 transition-colors" />
          </button>

          {/* Quick Lock Button */}
          <button
            type="button"
            onClick={lockApp}
            className="px-3 py-1.5 rounded-xl bg-[#171a27] hover:bg-red-950/40 border border-[#242b40] hover:border-red-800/40 text-xs text-slate-300 hover:text-red-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Lock session with passcode"
          >
            <Lock size={13} />
            <span>Lock</span>
          </button>

          {/* Notifications */}
          <button
            type="button"
            className="p-2 rounded-xl bg-[#171a27] hover:bg-[#202638] border border-[#242b40] text-slate-400 hover:text-white transition-colors cursor-pointer relative"
          >
            <Bell size={15} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-pink-500 ring-2 ring-[#12141f]" />
          </button>

          {/* Profile Quick Click */}
          <button
            type="button"
            onClick={() => setActiveRoute('profile')}
            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-xl bg-[#171a27] hover:bg-[#202638] border border-[#242b40] transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#1e88e5] to-[#42a5f5] flex items-center justify-center text-xs text-white shadow-inner">
              <span>👦</span>
            </div>
            <span className="text-xs font-medium text-slate-200 font-mono">
              {user?.id ? user.id.replace(/\D/g, '').slice(0, 6) : BRAND.defaultReferId}
            </span>
          </button>

        </div>

      </div>

    </header>
  );
};

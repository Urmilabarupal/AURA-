/*
 FILE: src/components/layout/Header.tsx

 PURPOSE:
 Enterprise Top Navigation Bar for Money X.
 - Olymp Trade inspired OLED dark & emerald green design.
 - Full Dark & Light Mode toggle support.
 - Mobile: Brand, menu hamburger, theme toggle, notifications, lock, avatar.
 - Desktop: Glassmorphic top bar with breadcrumb indicator, live network status dot,
   connected wallet snippet, theme toggle, lock screen shortcut, and user avatar.
*/

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import { BRAND } from '../../config/brand';
import { ThemeToggle } from '../common/ThemeToggle';
import {
  Bell,
  Copy,
  Lock,
  Menu,
} from 'lucide-react';

interface HeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { user, walletAddress, activeRoute, setActiveRoute, lockApp } = useAuth();
  const { copyToClipboard } = useToast();

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
    <header className={`sticky top-0 z-40 w-full bg-[#000000]/95 dark:bg-[#000000]/95 light:bg-white/95 backdrop-blur-xl border-b border-[#141a24] dark:border-[#141a24] light:border-slate-200 px-4 sm:px-6 py-2.5 select-none transition-colors ${activeRoute !== 'home' ? 'hidden lg:block' : ''}`}>
      
      {/* ----------------- MOBILE HEADER VIEW (lg:hidden) ----------------- */}
      {activeRoute === 'home' && (
        <div className="flex lg:hidden items-center justify-between">
          {/* Left: Hamburger & Brand */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white hover:bg-[#1a2336] dark:hover:bg-[#1a2336] light:hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            {/* Logo */}
            <div className="relative w-7 h-6 flex items-center justify-center">
              <svg className="w-7 h-6" viewBox="0 0 64 54" fill="none">
                <defs>
                  <linearGradient id="hdrRibbonMobile" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00e699" />
                    <stop offset="50%" stopColor="#00d2d3" />
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

            <span className="font-extrabold text-sm tracking-wider text-white dark:text-white light:text-slate-900">
              {BRAND.name.toUpperCase()}
            </span>
          </div>

          {/* Right: Quick Icons + ThemeToggle */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <button
              type="button"
              onClick={lockApp}
              className="text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-red-400 p-1.5 rounded-lg hover:bg-[#1a2336] dark:hover:bg-[#1a2336] light:hover:bg-slate-100 transition-colors cursor-pointer"
              title="Lock Screen"
            >
              <Lock size={16} />
            </button>

            <button
              type="button"
              className="text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white p-1.5 rounded-lg hover:bg-[#1a2336] dark:hover:bg-[#1a2336] light:hover:bg-slate-100 transition-colors cursor-pointer relative"
              title="Notifications"
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#00e699] ring-2 ring-[#0c1017] dark:ring-[#0c1017] light:ring-white" />
            </button>

            <button
              type="button"
              onClick={() => setActiveRoute('profile')}
              className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#00b875] to-[#00e699] flex items-center justify-center text-xs text-white shadow-sm ring-1 ring-white/20 cursor-pointer"
              title="Profile"
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
            <span
              className="text-slate-400 dark:text-slate-400 light:text-slate-500 hover:text-emerald-400 transition-colors cursor-pointer"
              onClick={() => setActiveRoute('home')}
            >
              {BRAND.name} Platform
            </span>
            <span className="text-slate-600 dark:text-slate-600 light:text-slate-300">/</span>
            <span className="font-semibold text-white dark:text-white light:text-slate-900 tracking-wide">
              {formatRouteName(activeRoute)}
            </span>
          </div>

          {/* Network Badge (Olymp Trade pulsing status) */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#070a10] dark:bg-[#070a10] light:bg-slate-100 border border-[#1c2438] dark:border-[#1c2438] light:border-slate-300 text-[11px] font-medium text-slate-300 dark:text-slate-300 light:text-slate-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e699] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00e699]" />
            </span>
            <span className="font-mono">{BRAND.chainNetwork}</span>
          </div>
        </div>

        {/* Right: Wallet Address, Theme Toggle, Lock Button, Profile Pill */}
        <div className="flex items-center gap-3">
          
          {/* Wallet Address Chip */}
          <button
            type="button"
            onClick={() => copyToClipboard(walletAddress || '0x7ACc9bEC21DCDAE112Eef3C95973F27daC02d9b8', 'Wallet address')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#080b12] dark:bg-[#080b12] light:bg-slate-100 border border-[#1c2438] dark:border-[#1c2438] light:border-slate-300 hover:border-emerald-500/50 text-xs font-mono text-slate-200 dark:text-slate-200 light:text-slate-800 transition-colors cursor-pointer group"
            title="Click to copy full address"
          >
            <span className="w-2 h-2 rounded-full bg-[#00e699]" />
            <span>{shortAddress}</span>
            <Copy size={12} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </button>

          {/* Theme Toggle (Dark & White Mode) */}
          <ThemeToggle showLabel />

          {/* Quick Lock Button */}
          <button
            type="button"
            onClick={lockApp}
            className="px-3 py-1.5 rounded-xl bg-[#141a26] dark:bg-[#141a26] light:bg-slate-100 hover:bg-red-950/40 border border-[#212c40] dark:border-[#212c40] light:border-slate-300 hover:border-red-800/40 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-red-400 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Lock Session"
          >
            <Lock size={13} />
            <span className="hidden xl:inline">Lock</span>
          </button>

          {/* Profile Quick Click */}
          <button
            type="button"
            onClick={() => setActiveRoute('profile')}
            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-xl bg-[#141a26] dark:bg-[#141a26] light:bg-slate-100 hover:bg-[#1d273a] dark:hover:bg-[#1d273a] light:hover:bg-slate-200 border border-[#212c40] dark:border-[#212c40] light:border-slate-300 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#00b875] to-[#00e699] flex items-center justify-center text-xs text-white shadow-inner font-bold">
              <span>👦</span>
            </div>
            <span className="text-xs font-medium text-slate-200 dark:text-slate-200 light:text-slate-800 font-mono">
              {user?.id ? user.id.replace(/\D/g, '').slice(0, 6) : BRAND.defaultReferId}
            </span>
          </button>

        </div>

      </div>

    </header>
  );
};

/*
 FILE: src/components/layout/Header.tsx

 PURPOSE:
 Top Header exactly matching the reference design in file_0000000012b082439e9a2fc938785f05.png:
 - Desktop View:
   * Left: "Search anything..." search box with search icon
   * Right: Notification Bell (with red unread dot), Globe icon, Connected Wallet Pill (Avatar + 0x3a56...7F2B + Chevron)
 - Mobile View:
   * Left: Hamburger Menu icon
   * Center: Authentic Green Infinity Logo + "Money X"
   * Right: Notification Bell (with red unread dot) + Connected Wallet Pill
*/

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MoneyXLogo } from '../common/MoneyXLogo';
import {
  Bell,
  Check,
  ChevronDown,
  Copy,
  Globe,
  Lock,
  LogOut,
  Menu,
  Search,
  User,
} from 'lucide-react';

interface HeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { user, lockApp, logout, walletAddress, setActiveRoute, activeRoute } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const isHome = activeRoute === 'home' || activeRoute === '';

  const displayAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : '0x3a56...7F2B';

  const fullAddress = walletAddress || '0x3a56D4869c9b4e1837015E5aE4F4D3C5237F2B';

  const handleCopy = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-[#000000]/90 backdrop-blur-xl border-b border-[#141816] px-4 sm:px-6 py-3.5 select-none font-sans ${
        isHome ? 'block' : 'hidden lg:block'
      }`}
    >
      
      {/* ----------------- MOBILE HEADER VIEW (Only on Home Page for < lg) ----------------- */}
      {isHome && (
        <div className="flex lg:hidden items-center justify-between">
          
          {/* Left: Hamburger menu */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-[#080d0a] border border-[#18261e] text-slate-300 hover:text-white cursor-pointer"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>

          {/* Center: Money X Logo */}
          <div onClick={() => setActiveRoute('home')} className="cursor-pointer">
            <MoneyXLogo size="sm" glow />
          </div>

          {/* Right: Notifications & Wallet Pill */}
          <div className="flex items-center gap-2">
            {/* Bell Icon with Red Dot */}
            <button
              type="button"
              className="p-2 rounded-xl bg-[#080d0a] border border-[#18261e] text-slate-300 hover:text-white cursor-pointer relative"
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-black" />
            </button>

            {/* User Wallet Pill */}
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#080d0a] border border-[#18261e] text-[11px] font-semibold text-white cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold">
                <User size={12} />
              </div>
              <span>{displayAddress}</span>
              <ChevronDown size={12} className="text-slate-400" />
            </button>
          </div>

        </div>
      )}

      {/* ----------------- DESKTOP HEADER VIEW (hidden lg:flex) ----------------- */}
      <div className="hidden lg:flex items-center justify-between">
        
        {/* Left: Search input matching screenshot */}
        <div className="relative w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#080d0a] border border-[#18261e] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00e699] transition-colors"
          />
        </div>

        {/* Right Actions: Notifications, Globe, and Wallet Pill */}
        <div className="flex items-center gap-3">
          
          {/* Notification Bell with red unread dot */}
          <button
            type="button"
            className="p-2 rounded-xl bg-[#080d0a] border border-[#18261e] text-slate-400 hover:text-white cursor-pointer relative transition-colors"
            title="Notifications"
          >
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-black" />
          </button>

          {/* Globe Language Selector */}
          <button
            type="button"
            className="p-2 rounded-xl bg-[#080d0a] border border-[#18261e] text-slate-400 hover:text-white cursor-pointer transition-colors"
            title="Language"
          >
            <Globe size={17} />
          </button>

          {/* User Wallet Pill with Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#080d0a] border border-[#18261e] hover:border-[#00e699]/40 text-xs font-semibold text-white cursor-pointer transition-all shadow-md"
            >
              {/* Blue Circular User Avatar */}
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                <User size={13} />
              </div>
              <span>{displayAddress}</span>
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#08080a] border border-[#18181c] p-3 shadow-2xl z-50 space-y-2 text-left animate-fadeIn">
                <div className="p-2 rounded-xl bg-[#030305] border border-[#18181c]">
                  <p className="text-[10px] text-slate-400">Connected Wallet</p>
                  <div className="flex items-center justify-between text-xs font-mono text-white mt-0.5">
                    <span className="truncate max-w-[170px]">{fullAddress}</span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
                    >
                      {copied ? <Check size={12} className="text-[#00e699]" /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveRoute('profile');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:bg-[#121217] hover:text-white cursor-pointer transition-colors"
                  >
                    <User size={14} />
                    <span>My Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      lockApp();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:bg-[#121217] hover:text-white cursor-pointer transition-colors"
                  >
                    <Lock size={14} />
                    <span>Lock Session</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-950/30 cursor-pointer transition-colors"
                  >
                    <LogOut size={14} />
                    <span>Disconnect Wallet</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </header>
  );
};

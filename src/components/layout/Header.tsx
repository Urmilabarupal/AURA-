/*
 FILE: src/components/layout/Header.tsx

 PURPOSE:
 Top application bar providing network status, active user summary,
 mobile navigation toggles, and state testing controls.

 RESPONSIBILITIES:
 - Display brand logo and connection indicator
 - Render user wallet address and balance overview
 - Provide testing toggles for empty state audit and passcode lock flow
 - Mobile menu button for responsive drawer

 RELATED:
 Embedded in MainLayout.

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import {
  Bell,
  CheckCircle,
  Copy,
  Database,
  Globe,
  Lock,
  LogOut,
  Menu,
  Shield,
  Smartphone,
  User,
  Wallet,
  X,
} from 'lucide-react';

interface HeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { user, wallets, emptyStateMode, toggleEmptyStateMode, lockApp, logout, activeRoute, setAuthStage } = useAuth();
  const { copyToClipboard } = useToast();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0d101d]/95 backdrop-blur-md border-b border-[#1b2238] px-4 lg:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-[#171c30] text-slate-300 hover:text-white border border-[#232b47]"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-600 to-blue-500 p-0.5 shadow-md shadow-purple-900/30 flex items-center justify-center">
              <div className="w-full h-full bg-[#0d101d] rounded-[10px] flex items-center justify-center font-black text-sm text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400">
                AX
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-wider text-slate-100 uppercase">
                  AURA <span className="text-purple-400">MONEY</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Mainnet
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: State audit toggles & User status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Access to the 3 Auth Screens: Wallet Connect, Passcode, Screen Lock */}
          <div className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-[#121626] border border-[#232b45] text-[11px]">
            <button
              onClick={() => setAuthStage('UNAUTHENTICATED')}
              className="px-2 py-1 rounded-lg hover:bg-[#1c223a] text-slate-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              title="View Wallet Connect screen (Screenshot 1)"
            >
              <Wallet size={12} className="text-purple-400" />
              <span>Connect</span>
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => setAuthStage('SETUP_PASSCODE')}
              className="px-2 py-1 rounded-lg hover:bg-[#1c223a] text-slate-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              title="View Create Passcode screen (Screenshot 2)"
            >
              <Shield size={12} className="text-pink-400" />
              <span>Passcode</span>
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => setAuthStage('LOCKED')}
              className="px-2 py-1 rounded-lg hover:bg-[#1c223a] text-slate-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              title="View Screen Lock keypad screen (Screenshot 3)"
            >
              <Lock size={12} className="text-blue-400" />
              <span>Lock</span>
            </button>
          </div>

          {/* Data State Toggle Button (Satisfies Rule 2 & Section 24 audit) */}
          <button
            onClick={toggleEmptyStateMode}
            title="Toggle between Populated Data and Empty 'Data Not Found' state for testing"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all border cursor-pointer ${
              emptyStateMode
                ? 'bg-amber-950/40 border-amber-600/50 text-amber-300'
                : 'bg-[#181e33] border-[#252f52] text-slate-300 hover:text-white'
            }`}
          >
            <Database size={13} className={emptyStateMode ? 'text-amber-400' : 'text-blue-400'} />
            <span className="hidden md:inline">State:</span>
            <span>{emptyStateMode ? 'Empty Mode' : 'Populated'}</span>
          </button>

          {/* Lock Screen Shortcut (Satisfies Rule 8 PIN flow) */}
          <button
            onClick={lockApp}
            title="Lock session with PIN Passcode"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-medium bg-[#181e33] hover:bg-[#202844] border border-[#252f52] text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Lock size={13} className="text-purple-400" />
            <span>Screen Lock</span>
          </button>

          {/* Balance Indicator */}
          {wallets && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141829] border border-[#232b45] text-xs">
              <Wallet size={14} className="text-purple-400" />
              <span className="font-semibold text-slate-200">
                ${wallets.totalBalanceUSDT.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">USDT</span>
            </div>
          )}

          {/* User Address Pill with Copy button */}
          {user && (
            <div className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl bg-[#15192c] border border-[#232a45]">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                {user.name.charAt(0)}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-[11px] font-semibold text-slate-200 leading-tight">{user.username}</p>
                <p className="text-[9px] text-purple-400 font-mono leading-tight">{user.id}</p>
              </div>
              {user.walletAddress && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(user.walletAddress, 'Wallet address')}
                  title={`Copy address: ${user.walletAddress}`}
                  className="p-1 rounded-lg bg-[#1f2640] hover:bg-purple-950/60 hover:text-purple-300 text-slate-400 border border-[#2b3558] transition-all cursor-pointer"
                >
                  <Copy size={12} />
                </button>
              )}
            </div>
          )}

          {/* Quick Logout */}
          <button
            onClick={logout}
            title="Log out"
            className="p-2 rounded-xl bg-[#171c30] text-slate-400 hover:text-red-400 border border-[#232b47] transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

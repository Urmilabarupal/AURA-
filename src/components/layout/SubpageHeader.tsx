/*
 FILE: src/components/layout/SubpageHeader.tsx

 PURPOSE:
 Exact 1:1 reproduction of the Top Bar used across all non-Home pages
 from xahmoney.com (Reference Screenshot).
 Features:
 - Back navigation button (< ChevronLeft) that routes to Home/previous
 - Dynamic centered Page Title corresponding to activeRoute
 - Right-aligned three-dots menu (⋮ MoreVertical) with quick actions
 - Clean, enterprise dark container matching xahmoney.com styling
*/

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import { BRAND } from '../../config/brand';
import { ArrowLeft, ChevronLeft, Home, Lock, MoreVertical, RefreshCw, Share2 } from 'lucide-react';

interface SubpageHeaderProps {
  currentRoute: string;
}

export const SubpageHeader: React.FC<SubpageHeaderProps> = ({ currentRoute }) => {
  const { setActiveRoute, lockApp, refreshUserData } = useAuth();
  const { showToast } = useToast();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  // Dynamic route titles mapping
  const routeTitles: Record<string, string> = {
    menu: 'Ecosystem Menu',
    ecosystem: 'Ecosystem Menu',
    'single-wallet': 'Single Wallet Details',
    'wallet-detail': 'Single Wallet Details',
    home: 'Home',
    trade: 'Trade',
    wallets: 'Wallets',
    deposit: 'Deposit',
    withdraw: 'Withdraw',
    'aura-chain': BRAND.chainName,
    ethereum: 'Ethereum',
    tether: 'Tether',
    'binance-usd': 'Binance USD',
    tron: 'Tron',
    profile: 'Profile',
    'profile-edit': 'Edit Profile',
    'two-factor': 'Two Factor Authentication',
    'international-trip': 'International Trip',
    portfolio: 'Portfolio',
    reward: 'Reward',
    transactions: 'Transactions',
    'royalty-slot': 'Royalty Slot',
    bloging: 'Blogging',
    blogging: 'Blogging',
    'sip-bonus': 'SIP Bonus',
    staking: 'Staking',
    'my-staking': 'My Staking',
    'stake-wallet': 'Stake Wallet',
    convert: 'Convert',
    'hxc-convert': `${BRAND.name} Convert`,
    'xah-convert': `${BRAND.tokenSymbol} Swap`,
    redeem: 'Redeem',
    tickets: 'Tickets',
    community: 'Community',
    'direct-team': 'Direct Team',
    'team-overview': 'Team Overview',
    'level-income': 'Level Income',
    jackpot: 'Jackpot',
    'jackpot-deposit': 'Jackpot Deposit',
    'jackpot-wallet': 'Jackpot Wallet',
    'jackpot-reward': 'Jackpot Reward',
    'jackpot-direct-reward': 'Jackpot Direct Reward',
    winner: 'Jackpot Winners',
    about: 'About Us',
    contact: 'Contact Us',
    legal: 'Legal',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    'sales-policy': 'Sales Policy',
  };

  const getPageTitle = (): string => {
    if (routeTitles[currentRoute]) {
      return routeTitles[currentRoute];
    }
    return currentRoute
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const pageTitle = getPageTitle();

  const handleBack = () => {
    setActiveRoute('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefresh = async () => {
    setMenuOpen(false);
    showToast('Refreshing data...', 'info');
    await refreshUserData();
    showToast('Updated successfully!', 'success');
  };

  const handleCopyLink = () => {
    setMenuOpen(false);
    navigator.clipboard.writeText(window.location.href);
    showToast('Page link copied!', 'success');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#000000]/95 backdrop-blur-xl border-b border-[#141816] px-4 sm:px-6 py-3 flex items-center justify-between select-none transition-colors">
      
      {/* Left: Back Arrow (< ChevronLeft) */}
      <button
        type="button"
        onClick={handleBack}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#0c140f] border border-transparent hover:border-[#1b2b20] transition-colors cursor-pointer"
        aria-label="Back to Home"
      >
        <ChevronLeft size={24} className="stroke-[2.5]" />
      </button>

      {/* Center: Dynamic Page Name */}
      <h1 className="text-base sm:text-lg font-black text-white tracking-tight text-center">
        {pageTitle}
      </h1>

      {/* Right: Three Dots (⋮ MoreVertical) - Strictly NO dark mode icon! */}
      <div className="flex items-center gap-1.5">
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#0c140f] border border-transparent hover:border-[#1b2b20] transition-colors cursor-pointer"
            aria-label="More options"
          >
            <MoreVertical size={20} />
          </button>

          {/* Dropdown Options Menu */}
          {menuOpen && (
            <>
              <div
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 z-30"
              />
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#090d0b] border border-[#1b2b20] shadow-2xl py-1.5 z-50 animate-fadeIn space-y-0.5">
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-300 hover:text-[#00ffa3] hover:bg-[#0f1d13] transition-colors cursor-pointer text-left"
                >
                  <RefreshCw size={14} className="text-[#00ffa3]" />
                  <span>Refresh Data</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setActiveRoute('home');
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-300 hover:text-[#00ffa3] hover:bg-[#0f1d13] transition-colors cursor-pointer text-left"
                >
                  <Home size={14} className="text-cyan-400" />
                  <span>Go to Home</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-300 hover:text-[#00ffa3] hover:bg-[#0f1d13] transition-colors cursor-pointer text-left"
                >
                  <Share2 size={14} className="text-[#00ffa3]" />
                  <span>Share Page Link</span>
                </button>

                <div className="border-t border-[#18261e] my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    lockApp();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-red-300 hover:text-red-200 hover:bg-red-950/40 transition-colors cursor-pointer text-left"
                >
                  <Lock size={14} className="text-red-400" />
                  <span>Lock Screen</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

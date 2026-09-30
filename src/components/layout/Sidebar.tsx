/*
 FILE: src/components/layout/Sidebar.tsx

 PURPOSE:
 Exact 1:1 reproduction of the Left Sidebar from xahmoney.com/Home (Screenshot 1).
 Features:
 - Folded ribbon HX logo with "XAH MONEY" typography & collapse arrow
 - Clean navigation items matching screenshot:
   * Home (with blue vertical active border indicator)
   * Trade
   * Wallets
   * Profile
   * International Trip (star badge)
   * Portfolio
   * Reward
   * Transactions
   * Royalty Slot
   * Blogging
 - Bottom SIP Bonus card with purple ribbon icon
 - Bottom User profile pill with blue cartoon avatar & User ID
*/

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft,
  Award,
  BarChart2,
  BookOpen,
  ChevronLeft,
  Crown,
  History,
  Home,
  PieChart,
  Star,
  TrendingUp,
  User,
  Wallet,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activeRoute, setActiveRoute, user } = useAuth();

  const handleNav = (routeId: string) => {
    setActiveRoute(routeId);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'trade', label: 'Trade', icon: BarChart2 },
    { id: 'wallets', label: 'Wallets', icon: Wallet },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'international-trip', label: 'International Trip', icon: Star },
    { id: 'portfolio', label: 'Portfolio', icon: PieChart },
    { id: 'reward', label: 'Reward', icon: Award },
    { id: 'transactions', label: 'Transactions', icon: History },
    { id: 'royalty-slot', label: 'Royalty Slot', icon: Crown },
    { id: 'bloging', label: 'Blogging', icon: BookOpen },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#141622] border-r border-[#1e2334] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top: Brand Header */}
        <div>
          <div className="p-5 flex items-center justify-between border-b border-[#1b2030]">
            <div className="flex items-center gap-3">
              {/* Folded ribbon HX Logo */}
              <div className="relative w-8 h-7 flex items-center justify-center">
                <svg className="w-8 h-7" viewBox="0 0 64 54" fill="none">
                  <defs>
                    <linearGradient id="sideRibbonGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ff2a6d" />
                      <stop offset="48%" stopColor="#9d4edd" />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 22 13 C 14 13, 10 20, 10 27 C 10 34, 14 41, 22 41 C 28 41, 32 36, 32 27 C 32 18, 36 13, 42 13 C 50 13, 54 20, 54 27 C 54 34, 50 41, 42 41 C 36 41, 32 36, 32 27"
                    stroke="url(#sideRibbonGrad)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 12 27 L 32 27 L 52 27"
                    stroke="url(#sideRibbonGrad)"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* XAH MONEY Text matching Screenshot 1 */}
              <div className="leading-tight">
                <div className="text-sm font-extrabold tracking-[0.25em] text-white">
                  XAH
                </div>
                <div className="text-[11px] font-extrabold tracking-[0.25em] text-slate-300">
                  MONEY
                </div>
              </div>
            </div>

            {/* Collapse Arrow matching Screenshot 1 */}
            <button
              onClick={() => setMobileOpen(false)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Collapse sidebar"
            >
              <ArrowLeft size={18} />
            </button>
          </div>

          {/* Navigation Menu List */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)]">
            {navItems.map((item) => {
              const isActive = activeRoute === item.id || (item.id === 'bloging' && activeRoute === 'blogging');
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left relative cursor-pointer ${
                    isActive
                      ? 'bg-[#1e2538] text-white font-semibold'
                      : 'text-[#8e98af] hover:text-slate-200 hover:bg-[#181c2a]'
                  }`}
                >
                  {/* Active Blue Left Indicator Bar matching Screenshot 1 */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#1d68ff] rounded-r-full" />
                  )}

                  <Icon
                    size={16}
                    className={isActive ? 'text-[#3a86ff]' : 'text-[#8e98af]'}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: SIP Bonus & User Profile */}
        <div className="p-4 space-y-3 border-t border-[#1b2030] bg-[#141622]">
          {/* SIP Bonus Card matching Screenshot 1 */}
          <button
            onClick={() => handleNav('sip-bonus')}
            className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#2a1e47] via-[#20203d] to-[#1e2540] border border-[#3b2d66] hover:border-[#6349a8] transition-all flex items-center gap-2.5 cursor-pointer text-left shadow-md group"
          >
            <div className="w-6 h-6 rounded-lg bg-[#7c3aed]/20 border border-[#8b5cf6]/40 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <span className="text-xs font-bold">$</span>
            </div>
            <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
              SIP Bonus
            </span>
          </button>

          {/* User Profile Pill matching Screenshot 1 */}
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl bg-[#10131e] border border-[#1c2233]">
            {/* Blue circle with cartoon face */}
            <div className="w-8 h-8 rounded-full bg-[#1e88e5] flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-inner">
              <span className="text-sm">👦</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate font-mono">
                {user?.id || 'HX633547863'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

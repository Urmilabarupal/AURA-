/*
 FILE: src/components/layout/Sidebar.tsx

 PURPOSE:
 Comprehensive, enterprise-grade Sidebar containing ALL pages from the initial
 specifications, PDF blueprints, and reference screenshots.
 
 FEATURES:
 - Folded ribbon HX logo with "XAH MONEY" typography & collapse arrow
 - Organized categories:
   1. Main Hub (Home, Trade, Wallets, Deposit, Withdraw, Profile)
   2. Investment & Staking (Staking, Farming, Portfolio, Royalty Slot, International Trip, Reward)
   3. Exchange & Convert (Convert, HXC Convert, XAH Convert, Redeem)
   4. Jackpot & Gaming (Jackpot Spin, Deposit, Wallet, Winners)
   5. Community & Team (Overview, Levels, Team Income, Referral Share)
   6. Audit & Media (Transactions, Tickets, Blogging)
   7. Legal & Support (About Us, Contact, Legal, Privacy, Terms)
 - Sticky Bottom SIP Bonus card & User Profile pill
 - Full mobile responsive drawer support
*/

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BRAND } from '../../config/brand';
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Award,
  BarChart2,
  BookOpen,
  Briefcase,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  Crown,
  FileText,
  Gift,
  Grid,
  Heart,
  HelpCircle,
  History,
  Home,
  Info,
  Layers,
  LineChart,
  Lock,
  Mail,
  PieChart,
  Repeat,
  Share2,
  Shield,
  Sparkles,
  Sprout,
  Star,
  Ticket,
  TrendingUp,
  Trophy,
  User,
  Users,
  Wallet,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activeRoute, setActiveRoute, user } = useAuth();

  // Accordion states for deeper sub-menus
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    main: true,
    invest: true,
    convert: false,
    jackpot: false,
    community: false,
    audit: true,
    info: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNav = (routeId: string) => {
    setActiveRoute(routeId);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Primary Main Menu (Matching Screenshot 1 exactly)
  const primaryNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'trade', label: 'Trade', icon: BarChart2 },
    { id: 'wallets', label: 'Wallets', icon: Wallet },
    { id: 'deposit', label: 'Deposit', icon: ArrowDown },
    { id: 'withdraw', label: 'Withdraw', icon: ArrowUp },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'international-trip', label: 'International Trip', icon: Star },
    { id: 'portfolio', label: 'Portfolio', icon: PieChart },
    { id: 'reward', label: 'Reward', icon: Award },
    { id: 'transactions', label: 'Transactions', icon: History },
    { id: 'royalty-slot', label: 'Royalty Slot', icon: Crown },
    { id: 'blogging', label: 'Blogging', icon: BookOpen },
  ];

  // 2. Investment & Staking Sub-Menu
  const investNavItems = [
    { id: 'staking', label: 'Staking Overview', icon: TrendingUp },
    { id: 'staking-plan', label: 'Staking Plans', icon: Layers },
    { id: 'team-staking', label: 'Team Staking', icon: Users },
    { id: 'farming', label: 'Yield Farming', icon: Sprout },
    { id: 'farming-plan', label: 'Farming Plans', icon: Layers },
  ];

  // 3. Convert & Swap
  const convertNavItems = [
    { id: 'convert', label: 'Direct Convert', icon: Repeat },
    { id: 'hxc-convert', label: `${BRAND.name} Convert`, icon: Briefcase },
    { id: 'xah-convert', label: `${BRAND.tokenSymbol} Swap`, icon: Repeat },
    { id: 'redeem', label: 'Redeem Voucher', icon: Gift },
  ];

  // 4. Jackpot & Rewards
  const jackpotNavItems = [
    { id: 'jackpot', label: 'Jackpot Spin', icon: Sparkles },
    { id: 'jackpot-deposit', label: 'Jackpot Deposit', icon: ArrowDown },
    { id: 'jackpot-wallet', label: 'Jackpot Wallet', icon: Wallet },
    { id: 'jackpot-reward', label: 'Jackpot Reward', icon: Trophy },
    { id: 'winner', label: 'Jackpot Winners', icon: Award },
  ];

  // 5. Community & Team
  const communityNavItems = [
    { id: 'community-overview', label: 'Team Overview', icon: Users },
    { id: 'community-levels', label: 'Level Breakdown', icon: Layers },
    { id: 'community-income', label: 'Community Income', icon: CircleDollarSign },
    { id: 'community-share', label: 'Referral & Share', icon: Share2 },
  ];

  // 6. Tickets & Audit
  const auditNavItems = [
    { id: 'tickets', label: 'Lottery Tickets', icon: Ticket },
  ];

  // 7. Info & Legal
  const infoNavItems = [
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'contact', label: 'Contact Us', icon: Mail },
    { id: 'legal', label: 'Legal & Compliance', icon: Shield },
    { id: 'privacy', label: 'Privacy Policy', icon: FileText },
    { id: 'terms', label: 'Terms of Service', icon: FileText },
    { id: 'sales-policy', label: 'Sales Policy', icon: FileText },
  ];

  const renderNavGroup = (
    title: string,
    key: string,
    items: { id: string; label: string; icon: any }[]
  ) => {
    const isOpen = openSections[key];

    return (
      <div className="pt-2">
        <button
          type="button"
          onClick={() => toggleSection(key)}
          className="w-full px-3.5 py-1.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#636c84] hover:text-slate-200 cursor-pointer transition-colors"
        >
          <span>{title}</span>
          {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        </button>

        {isOpen && (
          <div className="space-y-0.5 mt-1">
            {items.map((item) => {
              const isActive = activeRoute === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all text-left relative cursor-pointer ${
                    isActive
                      ? 'bg-[#1e2538] text-white font-semibold'
                      : 'text-[#8e98af] hover:text-slate-200 hover:bg-[#181c2a]'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#1d68ff] rounded-r-full" />
                  )}
                  <Icon
                    size={15}
                    className={isActive ? 'text-[#7dff32]' : 'text-[#8e98af]'}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#141622] border-r border-[#1e2334] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top: Brand Header matching Screenshot 1 */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-5 flex items-center justify-between border-b border-[#1b2030] shrink-0">
            <div className="flex items-center gap-3">
              {/* Folded ribbon HX Logo */}
              <div className="relative w-8 h-7 flex items-center justify-center">
                <svg className="w-8 h-7" viewBox="0 0 64 54" fill="none">
                  <defs>
                    <linearGradient id="sideRibbonGradAll" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#52d916" />
                      <stop offset="48%" stopColor="#7dff32" />
                      <stop offset="100%" stopColor="#b7ff8b" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 22 13 C 14 13, 10 20, 10 27 C 10 34, 14 41, 22 41 C 28 41, 32 36, 32 27 C 32 18, 36 13, 42 13 C 50 13, 54 20, 54 27 C 54 34, 50 41, 42 41 C 36 41, 32 36, 32 27"
                    stroke="url(#sideRibbonGradAll)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 12 27 L 32 27 L 52 27"
                    stroke="url(#sideRibbonGradAll)"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Dynamic Brand Text */}
              <div className="leading-tight">
                <div className="text-sm font-extrabold tracking-[0.2em] text-white">
                  {BRAND.name.split(' ')[0] || BRAND.name}
                </div>
                <div className="text-[11px] font-extrabold tracking-[0.2em] text-slate-300">
                  {BRAND.name.split(' ').slice(1).join(' ') || ''}
                </div>
              </div>
            </div>

            {/* Collapse Arrow */}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Collapse sidebar"
            >
              <ArrowLeft size={18} />
            </button>
          </div>

          {/* Navigation Menu List (Scrollable) */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
            
            {/* 1. Primary items (always visible on top) */}
            <div className="space-y-0.5">
              {primaryNavItems.map((item) => {
                const isActive =
                  activeRoute === item.id ||
                  (item.id === 'blogging' && activeRoute === 'bloging');
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNav(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left relative cursor-pointer ${
                      isActive
                        ? 'bg-[#1e2538] text-white font-semibold'
                        : 'text-[#8e98af] hover:text-slate-200 hover:bg-[#181c2a]'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#1d68ff] rounded-r-full" />
                    )}

                    <Icon
                      size={16}
                      className={isActive ? 'text-[#7dff32]' : 'text-[#8e98af]'}
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Additional Categorized Sections from Specifications & PDF */}
            <div className="border-t border-[#1b2030] my-2 pt-1">
              {renderNavGroup('Staking & Farming', 'invest', investNavItems)}
              {renderNavGroup('Exchange & Convert', 'convert', convertNavItems)}
              {renderNavGroup('Jackpot & Games', 'jackpot', jackpotNavItems)}
              {renderNavGroup('Community & Team', 'community', communityNavItems)}
              {renderNavGroup('Audit & Lottery', 'audit', auditNavItems)}
              {renderNavGroup('Legal & Info', 'info', infoNavItems)}
            </div>

          </nav>
        </div>

        {/* Bottom Section: SIP Bonus & User Profile matching Screenshot 1 */}
        <div className="p-4 space-y-3 border-t border-[#1b2030] bg-[#141622] shrink-0">
          {/* SIP Bonus Card matching Screenshot 1 */}
          <button
            type="button"
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
          <div
            onClick={() => handleNav('profile')}
            className="flex items-center gap-3 px-2 py-1.5 rounded-xl bg-[#10131e] border border-[#1c2233] hover:border-[#2b354e] transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#1e88e5] flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-inner">
              <span className="text-sm">👦</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate font-mono">
                {user?.id || BRAND.defaultUserId}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

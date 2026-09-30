/*
 FILE: src/components/layout/Sidebar.tsx

 PURPOSE:
 Authoritative navigation drawer and sidebar.
 Implements Rule 1 (No Page Removal) and Section 22 (Sidebar Navigation).

 RESPONSIBILITIES:
 - Host all navigation routes represented in reference screenshots (46 screenshots)
 - Support categorized navigation for Wallets, Trading, Staking, Farming, Community, Jackpot, and Legal
 - Highlight active route and trigger smooth transitions
 - Provide mobile drawer auto-close
 - Render user identity badge, version tag, and authoritative logout

 RELATED:
 Used by MainLayout. Every route links to a fully implemented page component.

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft,
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  CheckSquare,
  Coins,
  Compass,
  CreditCard,
  Crown,
  FileText,
  Gift,
  HelpCircle,
  History,
  Home,
  Layers,
  LayoutDashboard,
  LifeBuoy,
  Lock,
  LogOut,
  Mail,
  PieChart,
  Plane,
  RefreshCw,
  Repeat,
  Send,
  Share2,
  Shield,
  ShieldAlert,
  Sparkles,
  Ticket,
  TrendingUp,
  Trophy,
  User,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

interface NavSection {
  title?: string;
  items: {
    id: string;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activeRoute, setActiveRoute, user, logout, setAuthStage } = useAuth();

  const handleNav = (routeId: string) => {
    if (routeId === 'auth-connect') {
      setAuthStage('UNAUTHENTICATED');
      setMobileOpen(false);
      return;
    }
    if (routeId === 'auth-passcode') {
      setAuthStage('SETUP_PASSCODE');
      setMobileOpen(false);
      return;
    }
    if (routeId === 'auth-lock') {
      setAuthStage('LOCKED');
      setMobileOpen(false);
      return;
    }

    setActiveRoute(routeId);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navSections: NavSection[] = [
    {
      title: 'Security & Flow',
      items: [
        { id: 'auth-connect', label: 'Wallet Connect', icon: Wallet, badge: 'Step 1' },
        { id: 'auth-passcode', label: 'Create Passcode', icon: Shield, badge: 'Step 2' },
        { id: 'auth-lock', label: 'Screen Lock', icon: Lock, badge: 'Step 3' },
      ],
    },
    {
      items: [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'trade', label: 'Trade', icon: BarChart3 },
        { id: 'wallets', label: 'Wallets', icon: Wallet },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'international-trip', label: 'International Trip', icon: Plane, badge: 'HOT' },
        { id: 'portfolio', label: 'Portfolio', icon: PieChart },
        { id: 'reward', label: 'Reward', icon: Award },
        { id: 'transactions', label: 'Transactions', icon: History },
        { id: 'royalty-slot', label: 'Royalty Slot', icon: Crown },
        { id: 'blogging', label: 'Blogging', icon: BookOpen },
        { id: 'sip-bonus', label: 'SIP Bonus', icon: TrendingUp },
        { id: 'tickets', label: 'Tickets', icon: Ticket },
        { id: 'redeem', label: 'Redeem Now', icon: Sparkles },
      ],
    },
    {
      title: 'Wallets & Assets',
      items: [
        { id: 'extra-wallet', label: 'Extra Wallet', icon: Wallet },
        { id: 'hxc-wallet', label: 'HXC Wallet', icon: Wallet },
        { id: 'hxc-convert', label: 'HXC Convert', icon: Repeat },
        { id: 'xah-convert', label: 'XAH Convert', icon: RefreshCw },
        { id: 'convert', label: 'Direct Convert', icon: Repeat },
      ],
    },
    {
      title: 'Staking',
      items: [
        { id: 'staking', label: 'Staking', icon: Lock },
        { id: 'staking-plan', label: 'Staking Plan', icon: Layers },
        { id: 'staking-income', label: 'Staking Income', icon: TrendingUp },
        { id: 'team-staking', label: 'Team Stakings', icon: Users },
        { id: 'team-staking-income', label: 'Team Staking Income', icon: Coins },
        { id: 'team-apr-info', label: 'Team APR Info', icon: BarChart3 },
      ],
    },
    {
      title: 'Farming',
      items: [
        { id: 'farming', label: 'Farming', icon: Zap },
        { id: 'farming-plan', label: 'Farming Plan', icon: Layers },
        { id: 'farming-income', label: 'Farming Income', icon: Coins },
      ],
    },
    {
      title: 'Community',
      items: [
        { id: 'community-overview', label: 'Overview', icon: Users },
        { id: 'community-levels', label: 'Community Levels', icon: Layers },
        { id: 'community-transactions', label: 'Community Transactions', icon: History },
        { id: 'community-income', label: 'Community Income', icon: TrendingUp },
        { id: 'community-share', label: 'Community Share', icon: Share2 },
      ],
    },
    {
      title: 'Jackpot & Lottery',
      items: [
        { id: 'jackpot', label: 'Jackpot', icon: Trophy },
        { id: 'jackpot-deposit', label: 'Jackpot Deposit', icon: CreditCard },
        { id: 'jackpot-wallet', label: 'Jackpot Wallet', icon: Wallet },
        { id: 'jackpot-reward', label: 'Jackpot Reward', icon: Gift },
        { id: 'jackpot-direct-reward', label: 'Jackpot Direct Reward', icon: Award },
        { id: 'winner', label: 'Winners', icon: Trophy },
      ],
    },
    {
      title: 'Company & Policies',
      items: [
        { id: 'about', label: 'About Us', icon: HelpCircle },
        { id: 'contact', label: 'Contact', icon: Mail },
        { id: 'legal', label: 'Legal Disclosures', icon: Shield },
        { id: 'privacy', label: 'Privacy Policy', icon: FileText },
        { id: 'terms', label: 'Terms of Use', icon: FileText },
        { id: 'sales-policy', label: 'Sales Policy', icon: FileText },
      ],
    },
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
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0e111d] border-r border-[#192036] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-4 border-b border-[#181f33] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-600 to-blue-500 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-[#0d101d] rounded-[10px] flex items-center justify-center font-black text-xs text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400">
                AX
              </div>
            </div>
            <div>
              <h2 className="text-xs font-extrabold tracking-wider text-slate-100 uppercase">
                AURA <span className="text-purple-400">MONEY</span>
              </h2>
              <span className="text-[10px] text-slate-500 font-mono">v26.08.27</span>
            </div>
          </div>

          <button
            onClick={() => handleNav('home')}
            className="p-1.5 rounded-lg bg-[#141829] text-slate-400 hover:text-white transition-colors"
            title="Go to Home"
          >
            <ArrowLeft size={16} />
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {section.title && (
                <p className="px-3 pt-2 pb-1 text-[10px] font-bold tracking-wider uppercase text-slate-500 font-mono">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeRoute === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-900/60 to-blue-900/40 text-white border border-purple-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-[#141829]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        size={15}
                        className={isActive ? 'text-purple-400' : 'text-slate-400'}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-400 border border-pink-500/30">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#181f33] bg-[#0a0d16] space-y-2">
          {/* Logout Action (Styled red/gradient per reference screenshot) */}
          <button
            onClick={logout}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 hover:opacity-95 shadow-md shadow-rose-950/40 flex items-center justify-center gap-2 transition-all"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>

          {/* User ID Tag */}
          {user && (
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#121626] border border-[#1d243b] text-[11px]">
              <span className="text-slate-400">User ID</span>
              <span className="font-mono font-bold text-purple-400">{user.id}</span>
            </div>
          )}

          {/* Copyright & Version (from reference screenshot) */}
          <div className="text-[9px] text-slate-500 text-center leading-tight pt-1">
            <p>Copyright © 2026 AURA Financial Inc.</p>
            <p>All rights reserved. v26.08.27</p>
          </div>
        </div>
      </aside>
    </>
  );
};

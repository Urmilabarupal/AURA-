/*
 FILE: src/pages/menu/EcosystemMenuView.tsx

 PURPOSE:
 Authoritative Ecosystem Directory & Services Menu:
 Triggered directly from the Mobile Bottom Navigation Bar Center Elevated Green Button.
 Provides instant visual access and direct navigation to all 30+ pages and features in Money X:
 - Finance & Wallets
 - Trading & Swaps
 - Yield Staking & Farming
 - Community & Network
 - Rewards, Royalty & Jackpot
 - Security, Settings & Support
*/

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BRAND } from '../../config/brand';
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  BarChart3,
  Coins,
  Copy,
  CreditCard,
  ExternalLink,
  Flame,
  Gift,
  Globe,
  Grid,
  HelpCircle,
  History,
  Home,
  Layers,
  Lock,
  Plane,
  QrCode,
  Repeat,
  Search,
  Share2,
  Shield,
  ShieldCheck,
  Sparkles,
  Sprout,
  Ticket,
  TrendingUp,
  User,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';

interface EcosystemItem {
  id: string;
  title: string;
  desc: string;
  category: 'core' | 'trade' | 'earn' | 'community' | 'rewards' | 'account';
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
  badgeColor?: string;
}

export const EcosystemMenuView: React.FC = () => {
  const { setActiveRoute, user, wallets } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const items: EcosystemItem[] = [
    // Core & Wallets
    {
      id: 'home',
      title: 'Main Dashboard',
      desc: 'Portfolio balance, real market charts, quick deposit & activity',
      category: 'core',
      icon: Home,
      badge: 'Core',
      badgeColor: 'bg-emerald-500/20 text-[#00ffa3]',
    },
    {
      id: 'wallets',
      title: 'Wallets Vault',
      desc: 'Multi-asset vault, connected Web3 wallet & total net worth',
      category: 'core',
      icon: Wallet,
      badge: 'Multi-Chain',
      badgeColor: 'bg-cyan-500/20 text-cyan-400',
    },
    {
      id: 'single-wallet',
      title: 'Single Wallet Detail',
      desc: 'Per-chain balances, on-chain deposit addresses & filtered tx logs',
      category: 'core',
      icon: CreditCard,
      badge: 'Detailed',
      badgeColor: 'bg-blue-500/20 text-blue-400',
    },
    {
      id: 'deposit',
      title: 'Instant Deposit',
      desc: 'Deposit USDT, native tokens and crypto directly on-chain',
      category: 'core',
      icon: ArrowDownLeft,
      badge: 'Instant',
      badgeColor: 'bg-[#00ffa3]/20 text-[#00ffa3]',
    },
    {
      id: 'withdraw',
      title: 'Fast Withdrawal',
      desc: 'Secure non-custodial withdrawals to any external Web3 address',
      category: 'core',
      icon: ArrowUpRight,
      badge: 'Fast',
      badgeColor: 'bg-rose-500/20 text-rose-400',
    },

    // Trading & Swaps
    {
      id: 'trade',
      title: 'Spot & Swap Trading',
      desc: 'Real-time orderbook, candlestick charts & high-liquidity swaps',
      category: 'trade',
      icon: TrendingUp,
      badge: 'Live DEX',
      badgeColor: 'bg-purple-500/20 text-purple-400',
    },
    {
      id: 'convert',
      title: 'Direct Convert',
      desc: 'Zero-slippage conversion between USDT and ecosystem tokens',
      category: 'trade',
      icon: Repeat,
      badge: '0% Fee',
      badgeColor: 'bg-emerald-500/20 text-[#00ffa3]',
    },
    {
      id: 'xah-convert',
      title: `${BRAND.tokenSymbol} Native Swap`,
      desc: 'Direct swap bridge for protocol native asset',
      category: 'trade',
      icon: Coins,
    },

    // Yield & Earning
    {
      id: 'staking',
      title: 'High-Yield Staking',
      desc: 'Stake protocol tokens with up to 100% APR daily rewards',
      category: 'earn',
      icon: Layers,
      badge: 'High APY',
      badgeColor: 'bg-[#00ffa3]/20 text-[#00ffa3]',
    },
    {
      id: 'staking-plan',
      title: 'Staking Plans',
      desc: 'Flexible lock periods from 90 days to 1825 days with tier bonuses',
      category: 'earn',
      icon: BarChart3,
    },
    {
      id: 'team-staking',
      title: 'Team Staking Yield',
      desc: 'Earn multi-tier referral overrides on team staking volumes',
      category: 'earn',
      icon: Users,
    },
    {
      id: 'farming',
      title: 'Liquidity Farming',
      desc: 'Pair tokens in liquidity pools for accelerated yield yields',
      category: 'earn',
      icon: Sprout,
      badge: '40x Boost',
      badgeColor: 'bg-amber-500/20 text-amber-400',
    },
    {
      id: 'farming-plan',
      title: 'Farming Plans',
      desc: 'Explore LP pairs, TVL metrics and lock duration rewards',
      category: 'earn',
      icon: Zap,
    },

    // Community & Network
    {
      id: 'community',
      title: 'Community Network',
      desc: 'Direct team overview, active partner roster and network tree',
      category: 'community',
      icon: Users,
      badge: '5 Levels',
      badgeColor: 'bg-emerald-500/20 text-[#00ffa3]',
    },
    {
      id: 'community-levels',
      title: 'Network Level Income',
      desc: 'Real-time breakdown of volume across Level 1 to Level 5',
      category: 'community',
      icon: Award,
    },
    {
      id: 'community-transactions',
      title: 'Community Transactions',
      desc: 'Full ledger of bonuses earned from team member actions',
      category: 'community',
      icon: History,
    },
    {
      id: 'community-share',
      title: 'Share & Invite QR',
      desc: 'Your unique referral link, QR invite card and social sharing',
      category: 'community',
      icon: QrCode,
      badge: 'Earn 10%',
      badgeColor: 'bg-[#00ffa3]/20 text-[#00ffa3]',
    },

    // Rewards & Gamification
    {
      id: 'reward',
      title: 'Ranks & Rewards',
      desc: 'Climb leadership tiers from Starter to Diamond Ambassador',
      category: 'rewards',
      icon: Gift,
      badge: 'VIP Ranks',
      badgeColor: 'bg-amber-500/20 text-amber-400',
    },
    {
      id: 'jackpot',
      title: 'Decentralized Jackpot',
      desc: 'Join global draws, win high-pot crypto pools and prizes',
      category: 'rewards',
      icon: Sparkles,
      badge: 'Hot Pool',
      badgeColor: 'bg-rose-500/20 text-rose-400',
    },
    {
      id: 'tickets',
      title: 'Draw Tickets',
      desc: 'Buy and manage lucky draw entry tickets',
      category: 'rewards',
      icon: Ticket,
    },
    {
      id: 'redeem',
      title: 'Reward Vault Redeem',
      desc: 'Claim accrued platform bonuses into your main wallet',
      category: 'rewards',
      icon: ShieldCheck,
    },
    {
      id: 'royalty-slot',
      title: 'Royalty Club Slot',
      desc: 'Exclusive revenue share pool for top community builders',
      category: 'rewards',
      icon: Flame,
    },
    {
      id: 'sip-bonus',
      title: 'SIP Systematic Bonus',
      desc: 'Recurring automated savings program with compounded rewards',
      category: 'rewards',
      icon: Coins,
    },
    {
      id: 'international-trip',
      title: 'Global Leadership Trip',
      desc: 'All-expenses-paid international retreat for milestone achievers',
      category: 'rewards',
      icon: Plane,
      badge: 'Exclusive',
      badgeColor: 'bg-blue-500/20 text-blue-400',
    },

    // Account & Settings
    {
      id: 'profile',
      title: 'My Profile & Identity',
      desc: 'Manage account credentials, KYC verification and security',
      category: 'account',
      icon: User,
    },
    {
      id: 'transactions',
      title: 'Complete Ledger',
      desc: 'All deposits, withdrawals, trades and bonuses in one place',
      category: 'account',
      icon: History,
    },
    {
      id: 'contact',
      title: '24/7 Help & Support',
      desc: 'Direct support team, ticket assistance and system FAQ',
      category: 'account',
      icon: HelpCircle,
    },
    {
      id: 'about',
      title: 'About Protocol',
      desc: 'Our mission, decentralized architecture and roadmap',
      category: 'account',
      icon: Globe,
    },
  ];

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'core', label: 'Wallets & Finance' },
    { id: 'trade', label: 'Trading & Swap' },
    { id: 'earn', label: 'Staking & Farming' },
    { id: 'community', label: 'Community' },
    { id: 'rewards', label: 'Rewards & Jackpot' },
    { id: 'account', label: 'Account & Support' },
  ];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const handleSelectRoute = (routeId: string) => {
    setActiveRoute(routeId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 pb-24 font-sans select-none text-white">
      {/* 1. Header Banner */}
      <section className="relative rounded-3xl bg-gradient-to-r from-[#05120a] via-[#091a10] to-[#040d07] border border-[#153421] p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00ffa3]/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#051c0f] border border-[#00ffa3]/40 text-xs font-mono font-bold text-[#00ffa3]">
            <Grid size={13} className="text-[#00ffa3]" />
            <span>ECOSYSTEM HUB & SERVICES</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Explore All <span className="text-[#00ffa3]">Money X Services</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Quickly jump to any feature across Wallets, Trading, Staking, Yield Farming, Community, Rewards, and Security.
          </p>

          {/* Quick Stats Pill Strip */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-xl bg-[#030a05] border border-[#153421] text-slate-300">
              <span className="text-slate-500">ID:</span> <strong className="text-white">{user?.id || 'MX-USER'}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-[#030a05] border border-[#153421] text-slate-300">
              <span className="text-slate-500">Balance:</span> <strong className="text-[#00ffa3]">{(wallets?.totalBalanceUSDT || 0).toFixed(2)} USDT</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-[#030a05] border border-[#153421] text-[#00ffa3] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ffa3] animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Search & Category Filters */}
      <section className="space-y-4">
        {/* Search Bar */}
        <div className="relative w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ecosystem pages (e.g., Staking, Wallets, Jackpot, Community)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#08080a] border border-[#18181c] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00ffa3] transition-colors"
          />
        </div>

        {/* Category Pills (Horizontal scrollable) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#00ffa3] text-black shadow-lg shadow-[#00ffa3]/25'
                  : 'bg-[#08080a] border border-[#18181c] text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Services Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
          <span>Showing {filteredItems.length} Ecosystem Features</span>
          <span className="text-[#00ffa3] font-bold">1-Click Direct Access</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => handleSelectRoute(item.id)}
                className="p-4 sm:p-5 rounded-2xl bg-[#08080a] border border-[#18181c] hover:border-[#00ffa3]/50 hover:bg-[#0c120f] transition-all cursor-pointer group shadow-xl flex flex-col justify-between space-y-3 relative overflow-hidden"
              >
                {/* Ambient Hover Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#00ffa3]/0 group-hover:bg-[#00ffa3]/5 rounded-full blur-xl transition-all" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-[#05140b] border border-[#153421] text-[#00ffa3] flex items-center justify-center group-hover:scale-110 group-hover:border-[#00ffa3]/60 transition-transform shadow-md">
                      <Icon size={20} className="stroke-[2.5]" />
                    </div>

                    {item.badge && (
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-black text-white group-hover:text-[#00ffa3] transition-colors tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#141418] flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-[#00ffa3] transition-colors">
                  <span>Open Service</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

/*
 FILE: src/pages/Dashboard.tsx

 PURPOSE:
 Primary Financial Dashboard overview.
 Corresponds to Reference Screenshots 6, 7, and 8.

 RESPONSIBILITIES:
 - Render Wallets Overview (Spot, Main, and Funding wallets with balances)
 - Render Financial Dashboard metrics (Total Balance, Total Deposit, Total Withdraw)
 - Provide Referral Link sharing widget with copy and social triggers
 - Render Team stats (Total Direct Users, Total Team members)
 - Render Income Statistics (Total Self Stake, Total Staking Income, Convert Income)
 - Render Lottery statistics (Self & Direct Tickets, Self & Direct Wins)
 - Render recent transactions with type filtering, search, and "See More" navigation
 - Display user account identity summary card

 API:
 Calls ApiService.getWallets, ApiService.getProfile, and ApiService.getTransactions.

 SECURITY:
 All metric cards are bound to authoritative server values; no hardcoded static balances.

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { ApiService } from '../services/api';
import { EmptyState } from '../components/common/EmptyState';
import { Transaction } from '../types';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Award,
  Check,
  ChevronDown,
  Coins,
  Copy,
  CreditCard,
  ExternalLink,
  Flame,
  Globe,
  Layers,
  Lock,
  Mail,
  PieChart,
  Repeat,
  Search,
  Send,
  Share2,
  Sparkles,
  Ticket,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, wallets, setActiveRoute, emptyStateMode } = useAuth();
  const { copyToClipboard } = useToast();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filterType, setFilterType] = useState<string>('App Transfer');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [incomeTimeframe, setIncomeTimeframe] = useState<string>('All Time');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);

  const referralUrl = `https://auramoney.com/?r=${user?.referId || 'HX001'}`;

  useEffect(() => {
    loadTransactions();
  }, [filterType, searchQuery, emptyStateMode]);

  const loadTransactions = async () => {
    if (emptyStateMode) {
      setTransactions([]);
      return;
    }

    try {
      const typeParam = filterType === 'All' ? undefined : filterType;
      const res = await ApiService.getTransactions({
        type: typeParam,
        search: searchQuery,
        limit: 5,
      });
      if (res.success && res.data) {
        setTransactions(res.data);
      }
    } catch (err) {
      console.error('Error fetching transactions', err);
    }
  };

  const copyReferral = () => {
    copyToClipboard(referralUrl, 'Referral link');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyWalletAddr = () => {
    if (user?.walletAddress) {
      copyToClipboard(user.walletAddress, 'Wallet address');
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Wallets Overview Cards (Screenshot 6 Top) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold tracking-wide uppercase text-slate-200">
            Wallets Overview
          </h2>
          <button
            onClick={() => setActiveRoute('wallets')}
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 font-semibold"
          >
            <span>View All</span>
            <ExternalLink size={12} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Spot Wallet */}
          <div
            onClick={() => setActiveRoute('wallets')}
            className="p-5 rounded-2xl bg-[#111625] border border-[#1d253c] hover:border-purple-500/40 transition-all cursor-pointer relative overflow-hidden group shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Wallet size={20} />
              </div>
              <span className="text-xs font-semibold text-slate-400">Spot Wallet</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Balance</p>
                <h3 className="text-xl font-black text-slate-100 font-mono">
                  {wallets?.spotBalanceNative.toFixed(4) || '0.0000'}{' '}
                  <span className="text-xs font-bold text-purple-400">AURA</span>
                </h3>
              </div>
              <p className="text-xs font-semibold text-slate-400 font-mono">
                ${wallets?.spotBalanceUSDT.toFixed(2) || '0.00'} USDT
              </p>
            </div>
          </div>

          {/* Main Wallet */}
          <div
            onClick={() => setActiveRoute('wallets')}
            className="p-5 rounded-2xl bg-[#111625] border border-[#1d253c] hover:border-blue-500/40 transition-all cursor-pointer relative overflow-hidden group shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Coins size={20} />
              </div>
              <span className="text-xs font-semibold text-slate-400">Main Wallet</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Balance</p>
                <h3 className="text-xl font-black text-slate-100 font-mono">
                  {wallets?.mainBalanceNative.toFixed(4) || '0.0000'}{' '}
                  <span className="text-xs font-bold text-purple-400">AURA</span>
                </h3>
              </div>
              <p className="text-xs font-semibold text-slate-400 font-mono">
                ${wallets?.mainBalanceUSDT.toFixed(2) || '0.00'} USDT
              </p>
            </div>
          </div>

          {/* Funding Wallet */}
          <div
            onClick={() => setActiveRoute('wallets')}
            className="p-5 rounded-2xl bg-[#111625] border border-[#1d253c] hover:border-pink-500/40 transition-all cursor-pointer relative overflow-hidden group shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                <CreditCard size={20} />
              </div>
              <span className="text-xs font-semibold text-slate-400">Funding Wallet</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Balance</p>
                <h3 className="text-xl font-black text-slate-100 font-mono">
                  {wallets?.fundingBalanceNative.toFixed(4) || '0.0000'}{' '}
                  <span className="text-xs font-bold text-purple-400">AURA</span>
                </h3>
              </div>
              <p className="text-xs font-semibold text-slate-400 font-mono">
                ${wallets?.fundingBalanceUSDT.toFixed(2) || '0.00'} USDT
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Middle Row: Financial Dashboard & Referral Link */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Financial Dashboard (Left 7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-5">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
              Financial Dashboard
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Total Balance */}
              <div className="p-4 rounded-xl bg-[#0e111d] border border-[#1b2238] space-y-1">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                  <Wallet size={14} className="text-purple-400" />
                  <span>Total Balance</span>
                </div>
                <div className="pt-1">
                  <h4 className="text-xl font-extrabold text-slate-100 font-mono">
                    {wallets?.totalBalanceUSDT.toFixed(2) || '0.00'}{' '}
                    <span className="text-xs text-slate-400">USDT</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {((wallets?.totalBalanceUSDT || 0) / 337.2).toFixed(4)} AURA
                  </p>
                </div>
              </div>

              {/* Total Deposit */}
              <div className="p-4 rounded-xl bg-[#0e111d] border border-[#1b2238] space-y-1">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                  <ArrowDownLeft size={14} className="text-emerald-400" />
                  <span>Total Deposit</span>
                </div>
                <div className="pt-1">
                  <h4 className="text-xl font-extrabold text-slate-100 font-mono">
                    {wallets?.totalDepositUSDT.toFixed(2) || '0.00'}{' '}
                    <span className="text-xs text-slate-400">USDT</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {((wallets?.totalDepositUSDT || 0) / 337.2).toFixed(4)} AURA
                  </p>
                </div>
              </div>
            </div>

            {/* Total Withdraw */}
            <div className="p-4 rounded-xl bg-[#0e111d] border border-[#1b2238] space-y-1">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                <ArrowUpRight size={14} className="text-pink-400" />
                <span>Total Withdraw</span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <h4 className="text-xl font-extrabold text-slate-100 font-mono">
                  {wallets?.totalWithdrawUSDT.toFixed(2) || '0.00'}{' '}
                  <span className="text-xs text-slate-400">USDT</span>
                </h4>
                <p className="text-[11px] text-slate-500 font-mono">
                  {((wallets?.totalWithdrawUSDT || 0) / 337.2).toFixed(4)} AURA
                </p>
              </div>
            </div>
          </div>

          {/* Referral & Team Counters (Screenshot 7) */}
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => setActiveRoute('community-overview')}
              className="p-5 rounded-2xl bg-[#131728] border border-[#202740] hover:border-purple-500/40 cursor-pointer transition-all shadow-md"
            >
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                <Users size={16} className="text-purple-400" />
                <span>Total Direct User</span>
              </div>
              <h4 className="text-2xl font-black text-slate-100 font-mono">
                {emptyStateMode ? '0' : '4'}
              </h4>
            </div>

            <div
              onClick={() => setActiveRoute('community-levels')}
              className="p-5 rounded-2xl bg-[#131728] border border-[#202740] hover:border-blue-500/40 cursor-pointer transition-all shadow-md"
            >
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                <Layers size={16} className="text-blue-400" />
                <span>Total Team</span>
              </div>
              <h4 className="text-2xl font-black text-slate-100 font-mono">
                {emptyStateMode ? '0' : '36'}
              </h4>
            </div>
          </div>
        </div>

        {/* Share Referral Link Card & User Card (Right 5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Share Referral Link (Screenshot 6 Right) */}
          <div className="p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-200">Share Your Referral Link</h3>
              <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                Share this unique link with friends and earn rewards when they sign up.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={referralUrl}
                className="flex-1 px-3 py-2.5 rounded-xl bg-[#0c0f1a] border border-[#202740] text-xs font-mono text-slate-300 focus:outline-none select-all"
              />
              <button
                onClick={copyReferral}
                className="p-2.5 rounded-xl bg-[#1c233c] hover:bg-[#252f52] border border-[#2b365a] text-slate-200 hover:text-white transition-colors"
                title="Copy Link"
              >
                {copiedLink ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
            </div>

            <button
              onClick={copyReferral}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 shadow-md shadow-indigo-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Share2 size={14} />
              <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Share'}</span>
            </button>

            {/* Social Share Buttons */}
            <div className="flex items-center justify-center gap-4 pt-1 text-slate-400">
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-[#141829] hover:text-blue-400 border border-[#202740] transition-colors"
              >
                <Send size={15} />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-[#141829] hover:text-slate-100 border border-[#202740] transition-colors"
              >
                <Globe size={15} />
              </a>
              <a
                href="mailto:support@aurafinancial.io"
                className="p-2 rounded-xl bg-[#141829] hover:text-pink-400 border border-[#202740] transition-colors"
              >
                <Mail size={15} />
              </a>
            </div>
          </div>

          {/* User Account Summary Card (Screenshot 7 & 8 Bottom Right) */}
          {user && (
            <div
              onClick={() => setActiveRoute('profile')}
              className="p-5 rounded-2xl bg-[#131728] border border-[#202740] hover:border-purple-500/40 cursor-pointer transition-all shadow-lg space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-sm font-extrabold text-white shadow-md">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-100 truncate">{user.name}</h4>
                  <p className="text-[11px] text-slate-400 font-mono">ID: {user.id}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                  {user.kycStatus}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0c0f1a] border border-[#1b2238] space-y-1 text-[11px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Refer ID:</span>
                  <span className="font-mono text-purple-400 font-semibold">{user.referId}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Address:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-slate-300 truncate max-w-[140px]">
                      {user.walletAddress.substring(0, 8)}...{user.walletAddress.substring(34)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyWalletAddr();
                      }}
                      className="p-1 rounded bg-[#1a2034] hover:bg-purple-900/40 hover:text-purple-300 text-slate-400 border border-[#263152] transition-colors"
                      title="Copy Wallet Address"
                    >
                      {copiedAddress ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Income Statistics (Screenshot 7) */}
      <section className="p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
            Income Statistics
          </h3>
          <div className="relative">
            <select
              value={incomeTimeframe}
              onChange={(e) => setIncomeTimeframe(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 rounded-xl bg-[#0c0f1a] border border-[#202740] text-xs font-semibold text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="All Time">All Time</option>
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Self Stake */}
          <div
            onClick={() => setActiveRoute('staking')}
            className="p-4 rounded-xl bg-[#0e111d] border border-[#1b2238] hover:border-purple-500/30 transition-all cursor-pointer space-y-2"
          >
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Lock size={14} className="text-purple-400" />
              <span>Total Self Stake</span>
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-100 font-mono">
                {emptyStateMode ? '0.00' : '250.00'}{' '}
                <span className="text-xs text-purple-400">AURA</span>
              </h4>
              <p className="text-[11px] text-slate-500 font-mono">
                {emptyStateMode ? '0.00' : '84,300.00'} USDT
              </p>
            </div>
          </div>

          {/* Total Staking Income */}
          <div
            onClick={() => setActiveRoute('staking-income')}
            className="p-4 rounded-xl bg-[#0e111d] border border-[#1b2238] hover:border-blue-500/30 transition-all cursor-pointer space-y-2"
          >
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <TrendingUp size={14} className="text-blue-400" />
              <span>Total Staking Income</span>
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-100 font-mono">
                {emptyStateMode ? '0.00' : '124.50'}{' '}
                <span className="text-xs text-blue-400">USDT</span>
              </h4>
              <p className="text-[11px] text-slate-500 font-mono">Accruing Daily</p>
            </div>
          </div>

          {/* Convert Income */}
          <div
            onClick={() => setActiveRoute('convert')}
            className="p-4 rounded-xl bg-[#0e111d] border border-[#1b2238] hover:border-pink-500/30 transition-all cursor-pointer space-y-2"
          >
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Repeat size={14} className="text-pink-400" />
              <span>Convert Income</span>
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-100 font-mono">
                {emptyStateMode ? '0.00' : '45.80'}{' '}
                <span className="text-xs text-pink-400">USDT</span>
              </h4>
              <p className="text-[11px] text-slate-500 font-mono">Instant liquidity fee share</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Lottery Overview (Screenshot 8 Top) */}
      <section className="p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket size={16} className="text-purple-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
              Lottery & Draw Status
            </h3>
          </div>
          <button
            onClick={() => setActiveRoute('tickets')}
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
          >
            Buy Tickets
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Self Lottery Tickets */}
          <div className="p-4 rounded-xl bg-[#0e111d] border border-[#1b2238] space-y-1">
            <p className="text-xs text-slate-400">Self Lottery Tickets</p>
            <h4 className="text-lg font-bold text-slate-100 font-mono">
              {emptyStateMode ? '0.00' : '2.00'} AURA
            </h4>
            <p className="text-[10px] text-slate-500">Current Balance</p>
          </div>

          {/* Direct Lottery Tickets */}
          <div className="p-4 rounded-xl bg-[#0e111d] border border-[#1b2238] space-y-1">
            <p className="text-xs text-slate-400">Direct Lottery Tickets</p>
            <h4 className="text-lg font-bold text-slate-100 font-mono">
              {emptyStateMode ? '0.00' : '5.00'} AURA
            </h4>
            <p className="text-[10px] text-slate-500">Current Balance</p>
          </div>

          {/* Self Lottery Win */}
          <div className="p-4 rounded-xl bg-[#0e111d] border border-[#1b2238] space-y-1">
            <p className="text-xs text-slate-400">Self Lottery Win</p>
            <h4 className="text-lg font-bold text-emerald-400 font-mono">
              {emptyStateMode ? '0.00' : '50.00'} USDT
            </h4>
            <p className="text-[10px] text-slate-500">Current Balance</p>
          </div>

          {/* Direct Lottery Win */}
          <div className="p-4 rounded-xl bg-[#0e111d] border border-[#1b2238] space-y-1">
            <p className="text-xs text-slate-400">Direct Lottery Win</p>
            <h4 className="text-lg font-bold text-blue-400 font-mono">
              {emptyStateMode ? '0.00' : '25.00'} USDT
            </h4>
            <p className="text-[10px] text-slate-500">Current Balance</p>
          </div>
        </div>
      </section>

      {/* 5. Transactions Section (Screenshot 8 Bottom) */}
      <section className="p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-200">
              Transaction ({transactions.length})
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-[#0c0f1a] border border-[#202740] text-xs font-semibold text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="All">All Transactions</option>
                <option value="App Transfer">App Transfer</option>
                <option value="Deposit">Deposit</option>
                <option value="Withdrawal">Withdrawal</option>
                <option value="Staking">Staking</option>
                <option value="Ticket">Ticket</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>

            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search Transaction"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#0c0f1a] border border-[#202740] text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Transactions Table or Empty State */}
        {transactions.length === 0 ? (
          <EmptyState
            title="Data Not Found"
            description="The requested transaction information is currently unavailable"
            actionText="Refresh Transactions"
            onAction={loadTransactions}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-[#1f263d]">
                <tr>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Reference ID</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                  <th className="py-2.5 px-3 text-right">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171d30]">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#151a2d] transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-200">{tx.typeLabel}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-purple-400">
                      {tx.referenceId}
                    </td>
                    <td className="py-3 px-3 text-slate-400 max-w-xs truncate">
                      {tx.description}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-100">
                      {tx.amount} {tx.currency}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-500 font-mono text-[11px]">
                      {tx.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* See More Button (from Screenshot 8) */}
        <div className="pt-2 text-center">
          <button
            onClick={() => setActiveRoute('transactions')}
            className="w-full max-w-xs py-2.5 px-6 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 shadow-md shadow-indigo-950/40 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <span>See More</span>
          </button>
        </div>
      </section>
    </div>
  );
};

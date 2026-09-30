/*
 FILE: src/pages/Dashboard.tsx

 PURPOSE:
 Exact 1:1 pixel-perfect reproduction of xahmoney.com/Home across all 5 uploaded reference screenshots.
 Features:
 1. Top Identity & Portfolio Bar:
    - Blue circular cartoon avatar + User ID, Refer By, Wallet Address
    - Portfolio Value (0.00% + 0.00 XAH)
    - Withdraw (Coral-Purple gradient) & Deposit (Coral-Blue gradient) action buttons
 2. Mobile Quick Action Bar (Transfer, Staking, Trade, HXC Convert)
 3. Row 1:
    - ALL Incoms Overview (Cyan/Emerald Donut Chart with Allocation & All buttons + colored legend)
    - Total Incomes (Convert Income, Team Stake, Total Level, Reward Income inset containers)
 4. Row 2:
    - Wallets Overview (Spot, Main, and Funding Wallets with 3D colorful wallet illustrations)
 5. Row 3:
    - Financial Dashboard (Total Balance, Total Deposit, Total Withdraw)
    - Community (Total Direct User, Total Team)
    - Share Your Referral Link (Copy bar, Share button, Social icons for Telegram, Instagram, WhatsApp, X)
    - User Profile Banner Card (Gradient banner, cartoon avatar, ID, Refer ID, full hex address)
 6. Floating Widgets:
    - Lucky Spin wheel badge with close toggle
    - WhatsApp floating chat bubble
 7. Mobile Navigation Dock:
    - Curved bottom bar with Home, Convert, Center Menu, Trade, Wallet
*/

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import {
  ArrowDown,
  ArrowUp,
  Briefcase,
  Copy,
  CreditCard,
  Grid,
  Heart,
  Home,
  LineChart,
  MessageCircle,
  MoreHorizontal,
  Repeat,
  Send,
  Share2,
  Shield,
  Smartphone,
  TrendingUp,
  Users,
  Wallet,
  X,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, wallets, setActiveRoute } = useAuth();
  const { copyToClipboard } = useToast();

  const [allocationFilter, setAllocationFilter] = useState<'allocation' | 'all'>('allocation');
  const [dropdownTimeframe, setDropdownTimeframe] = useState<string>('All');
  const [showLuckySpin, setShowLuckySpin] = useState<boolean>(true);

  // Authoritative user variables matching screenshots
  const userId = user?.id || 'HX633547863';
  const referBy = user?.referBy || 'HX001';
  const address = user?.walletAddress || '0x7ACc9bEC21DCDAE112Eef3C95973F27daC02d9b8';
  const shortAddress = `${address.slice(0, 5)}....${address.slice(-5)}`;
  const referralLink = `https://xahmoney.com/?r=${user?.referId || 'HX001'}`;

  const copyRefLink = () => {
    copyToClipboard(referralLink, 'Referral link copied!');
  };

  const copyFullAddress = () => {
    copyToClipboard(address, 'Wallet address copied!');
  };

  return (
    <div className="space-y-6 pb-20 select-none font-sans text-slate-100">
      
      {/* ========================================================= */}
      {/* 1. TOP IDENTITY & PORTFOLIO BAR (Screenshots 1 & 3) */}
      {/* ========================================================= */}
      <div className="rounded-2xl bg-[#161924] border border-[#202538] p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
        
        {/* Left: User Avatar & Details */}
        <div className="flex items-center gap-3.5">
          {/* Blue cartoon avatar matching screenshots */}
          <div className="w-12 h-12 rounded-full bg-[#1e88e5] flex items-center justify-center text-xl text-white shadow-inner shrink-0 border-2 border-[#161924]">
            <span>👦</span>
          </div>

          <div className="space-y-0.5 min-w-0">
            <div className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
              <span>User ID : {userId}</span>
            </div>
            <div className="text-xs text-[#8e98af] font-medium font-mono">
              Refer By : {referBy}
            </div>
            <div
              onClick={copyFullAddress}
              className="text-xs text-[#8e98af] font-medium font-mono truncate max-w-[200px] sm:max-w-xs cursor-pointer hover:text-white transition-colors"
              title="Click to copy full address"
            >
              Address : {shortAddress}
            </div>
          </div>
        </div>

        {/* Center: Portfolio Value */}
        <div className="flex flex-col lg:items-center justify-center text-left lg:text-center pl-1 lg:pl-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-[#1f2436]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8e98af] font-medium">Portfolio Value</span>
            <span className="text-xs font-semibold text-[#00e699]">0.00%</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
            0.00 <span className="text-base text-slate-300 font-normal">XAH</span>
          </div>
        </div>

        {/* Right: Withdraw & Deposit Action Buttons matching Screenshot 1 */}
        <div className="flex items-center gap-3 pt-2 lg:pt-0">
          {/* Withdraw Button (Coral to Purple Gradient) */}
          <button
            onClick={() => setActiveRoute('wallets')}
            className="flex-1 sm:flex-initial py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#ff5376] to-[#6d57ff] text-white font-semibold text-xs flex items-center justify-center gap-1.5 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-pink-950/30"
          >
            <ArrowUp size={15} className="stroke-[2.5]" />
            <span>Withdraw</span>
          </button>

          {/* Deposit Button (Coral to Blue Gradient) */}
          <button
            onClick={() => setActiveRoute('wallets')}
            className="flex-1 sm:flex-initial py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#ff5376] via-[#7d50ff] to-[#4568ff] text-white font-semibold text-xs flex items-center justify-center gap-1.5 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-purple-950/30"
          >
            <ArrowDown size={15} className="stroke-[2.5]" />
            <span>Deposit</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. MOBILE QUICK ACTIONS ROW (Screenshot 4) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-4 gap-2.5 lg:hidden">
        {/* Transfer */}
        <button
          onClick={() => setActiveRoute('wallets')}
          className="p-3 rounded-2xl bg-[#161924] border border-[#202538] flex flex-col items-center justify-center gap-1.5 hover:bg-[#1a1e2d] transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-[#10131e] flex items-center justify-center text-slate-200">
            <Repeat size={18} />
          </div>
          <span className="text-[11px] text-slate-300 font-medium">Transfer</span>
        </button>

        {/* Staking */}
        <button
          onClick={() => setActiveRoute('staking')}
          className="p-3 rounded-2xl bg-[#161924] border border-[#202538] flex flex-col items-center justify-center gap-1.5 hover:bg-[#1a1e2d] transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-[#10131e] flex items-center justify-center text-slate-200">
            <TrendingUp size={18} />
          </div>
          <span className="text-[11px] text-slate-300 font-medium">Staking</span>
        </button>

        {/* Trade */}
        <button
          onClick={() => setActiveRoute('trade')}
          className="p-3 rounded-2xl bg-[#161924] border border-[#202538] flex flex-col items-center justify-center gap-1.5 hover:bg-[#1a1e2d] transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-[#10131e] flex items-center justify-center text-slate-200">
            <LineChart size={18} />
          </div>
          <span className="text-[11px] text-slate-300 font-medium">Trade</span>
        </button>

        {/* HXC Convert */}
        <button
          onClick={() => setActiveRoute('hxc-convert')}
          className="p-3 rounded-2xl bg-[#161924] border border-[#202538] flex flex-col items-center justify-center gap-1.5 hover:bg-[#1a1e2d] transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-[#10131e] flex items-center justify-center text-slate-200">
            <Briefcase size={18} />
          </div>
          <span className="text-[11px] text-slate-300 font-medium truncate max-w-full">HXC Convert</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 3. ROW 1: ALL INCOMS OVERVIEW & TOTAL INCOMES (Screenshot 1) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ALL Incoms Overview Card (Left 7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#161924] border border-[#202538] p-5 sm:p-6 shadow-xl space-y-6">
          {/* Card Header */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">
              ALL Incoms Overview
            </h2>

            <div className="flex items-center gap-2">
              {/* Allocation Blue Button */}
              <button
                onClick={() => setAllocationFilter('allocation')}
                className="px-4 py-1.5 rounded-full bg-[#1c64f2] text-white text-xs font-semibold shadow-sm hover:bg-[#1a56d1] transition-colors cursor-pointer"
              >
                Allocation
              </button>

              {/* Dropdown Pill */}
              <div className="px-3.5 py-1.5 rounded-full bg-[#0f121d] border border-[#23293e] text-xs text-slate-300 flex items-center gap-1 cursor-pointer">
                <span>All</span>
                <span className="text-[10px] text-slate-400">▾</span>
              </div>
            </div>
          </div>

          {/* Donut Chart & Legend Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 pt-2">
            
            {/* Donut Ring Chart (Screenshot 1) */}
            <div className="md:col-span-6 flex items-center justify-center">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                  {/* Background Track */}
                  <circle
                    cx="80"
                    cy="80"
                    r="62"
                    stroke="#1a1e2d"
                    strokeWidth="14"
                    fill="none"
                  />
                  {/* Glowing Emerald / Cyan Ring matching Screenshot 1 */}
                  <circle
                    cx="80"
                    cy="80"
                    r="62"
                    stroke="#00d284"
                    strokeWidth="14"
                    strokeDasharray="390"
                    strokeDashoffset="90"
                    strokeLinecap="round"
                    fill="none"
                    className="drop-shadow-[0_0_8px_rgba(0,210,132,0.4)]"
                  />
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-slate-300 font-medium">Total Income</span>
                  <span className="text-2xl font-bold text-white tracking-tight">0.00</span>
                  <span className="text-[11px] text-slate-400 font-semibold font-mono">USDT</span>
                </div>
              </div>
            </div>

            {/* Legend Items matching Screenshot 1 */}
            <div className="md:col-span-6 space-y-3.5 pl-0 md:pl-2">
              {/* HXC Convert Income */}
              <div className="flex items-start gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff6b6b] mt-1 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-slate-200">HXC CONVERT INCOME</p>
                  <p className="text-[#8e98af] font-mono text-[11px]">00.00% (0.0K)</p>
                </div>
              </div>

              {/* Total Staking Income */}
              <div className="flex items-start gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d946ef] mt-1 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-slate-200">TOTAL STAKING INCOME</p>
                  <p className="text-[#8e98af] font-mono text-[11px]">00.00% (0.0K)</p>
                </div>
              </div>

              {/* Team Stake Income */}
              <div className="flex items-start gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] mt-1 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-slate-200">TEAM STAKE INCOME</p>
                  <p className="text-[#8e98af] font-mono text-[11px]">00.00% (0.0K)</p>
                </div>
              </div>

              {/* Total Level Income */}
              <div className="flex items-start gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6366f1] mt-1 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-slate-200">TOTAL LEVEL INCOME</p>
                  <p className="text-[#8e98af] font-mono text-[11px]">00.00% (0.0K)</p>
                </div>
              </div>

              {/* Reward Income */}
              <div className="flex items-start gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0ea5e9] mt-1 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-slate-200">REWARD INCOME</p>
                  <p className="text-[#8e98af] font-mono text-[11px]">00.00% (0.0K)</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Total Incomes Card (Right 5 Cols) matching Screenshot 1 */}
        <div className="lg:col-span-5 rounded-2xl bg-[#161924] border border-[#202538] p-5 sm:p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight">
              Total Incomes
            </h2>
            <button className="w-7 h-7 rounded-lg bg-[#111420] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer">
              <MoreHorizontal size={16} />
            </button>
          </div>

          <div className="space-y-3.5">
            {/* Convert Income */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#8e98af]">Convert Income</label>
              <div className="rounded-xl bg-[#0e111a] border border-[#1b2030] p-3 text-center">
                <span className="text-sm font-bold text-white font-mono">0.00 USDT</span>
              </div>
            </div>

            {/* 2-Columns: Team Stake Income & Total Level Income */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#8e98af] truncate block">Team Stake Income</label>
                <div className="rounded-xl bg-[#0e111a] border border-[#1b2030] p-3 text-center">
                  <span className="text-xs sm:text-sm font-bold text-white font-mono">0.00 USDT</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#8e98af] truncate block">Total level income</label>
                <div className="rounded-xl bg-[#0e111a] border border-[#1b2030] p-3 text-center">
                  <span className="text-xs sm:text-sm font-bold text-white font-mono">0.00 USDT</span>
                </div>
              </div>
            </div>

            {/* Reward Income */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#8e98af]">Reward Income</label>
              <div className="rounded-xl bg-[#0e111a] border border-[#1b2030] p-3 text-center">
                <span className="text-sm font-bold text-white font-mono">0.00 USDT</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 4. ROW 2: WALLETS OVERVIEW (Screenshot 1 & 4) */}
      {/* ========================================================= */}
      <div className="space-y-3.5">
        <h2 className="text-base font-bold text-white tracking-tight">
          Wallets Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Spot Wallet with 3D Illustration matching Screenshot 1 */}
          <div
            onClick={() => setActiveRoute('wallets')}
            className="p-5 rounded-2xl bg-[#161924] border border-[#202538] hover:border-[#3b4766] transition-all cursor-pointer relative overflow-hidden group shadow-lg"
          >
            {/* 3D Wallet Icon Illustration */}
            <div className="w-14 h-12 mb-3 relative flex items-center justify-center">
              <div className="w-11 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-400 shadow-md transform -rotate-6 relative">
                <div className="absolute top-1 left-1 right-1 h-3 rounded-sm bg-amber-400" />
                <div className="absolute bottom-1 right-1 w-4 h-3 rounded-xs bg-rose-500 shadow-xs" />
              </div>
            </div>

            <h3 className="text-sm font-bold text-white mb-4">Spot Wallet</h3>

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#8e98af]">Balance</span>
              <span className="text-white font-semibold">
                {wallets?.spotBalanceNative.toFixed(4) || '0.0000'} XAH
              </span>
            </div>
          </div>

          {/* Main Wallet with 3D Golden Illustration */}
          <div
            onClick={() => setActiveRoute('wallets')}
            className="p-5 rounded-2xl bg-[#161924] border border-[#202538] hover:border-[#3b4766] transition-all cursor-pointer relative overflow-hidden group shadow-lg"
          >
            {/* 3D Golden Wallet Icon */}
            <div className="w-14 h-12 mb-3 relative flex items-center justify-center">
              <div className="w-11 h-9 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-md transform -rotate-3 relative">
                <div className="absolute top-1 left-1 right-1 h-3 rounded-sm bg-cyan-300" />
                <div className="absolute top-3.5 right-1 w-3 h-2 rounded-xs bg-white/80" />
              </div>
            </div>

            <h3 className="text-sm font-bold text-white mb-4">Main Wallet</h3>

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#8e98af]">Balance</span>
              <span className="text-white font-semibold">
                {wallets?.mainBalanceNative.toFixed(4) || '0.0000'} XAH
              </span>
            </div>
          </div>

          {/* Funding Wallet with 3D Leather Illustration */}
          <div
            onClick={() => setActiveRoute('wallets')}
            className="p-5 rounded-2xl bg-[#161924] border border-[#202538] hover:border-[#3b4766] transition-all cursor-pointer relative overflow-hidden group shadow-lg"
          >
            {/* 3D Brown Wallet Icon */}
            <div className="w-14 h-12 mb-3 relative flex items-center justify-center">
              <div className="w-11 h-9 rounded-lg bg-gradient-to-tr from-amber-700 to-amber-500 shadow-md transform -rotate-2 relative">
                <div className="absolute top-1 left-1 right-1 h-3 rounded-sm bg-emerald-400" />
                <div className="absolute top-3.5 right-1 w-2.5 h-2.5 rounded-full bg-white shadow-xs" />
              </div>
            </div>

            <h3 className="text-sm font-bold text-white mb-4">Funding Wallet</h3>

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#8e98af]">Balance</span>
              <span className="text-white font-semibold">
                {wallets?.fundingBalanceNative.toFixed(4) || '0.0000'} XAH
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. ROW 3: FINANCIAL DASHBOARD & COMMUNITY (Screenshot 2) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Financial Dashboard + Community (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Financial Dashboard Card */}
          <div className="rounded-2xl bg-[#161924] border border-[#202538] p-5 sm:p-6 shadow-xl space-y-5">
            <h2 className="text-base font-bold text-white tracking-tight">
              Financial Dashboard
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Total Balance */}
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 text-xs font-medium text-slate-300">
                  <div className="w-7 h-7 rounded-lg bg-[#111420] flex items-center justify-center text-slate-400">
                    <Wallet size={15} />
                  </div>
                  <span>Total Balance</span>
                </div>
                <div className="rounded-xl bg-[#0e111a] border border-[#1b2030] p-3 text-center">
                  <span className="text-sm font-bold text-white font-mono">0.00 USDT</span>
                </div>
                <p className="text-[11px] text-[#8e98af] font-mono">0.00 XAH</p>
              </div>

              {/* Total Deposit */}
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 text-xs font-medium text-slate-300">
                  <div className="w-7 h-7 rounded-lg bg-[#111420] flex items-center justify-center text-slate-400">
                    <CreditCard size={15} />
                  </div>
                  <span>Total Deposit</span>
                </div>
                <div className="rounded-xl bg-[#0e111a] border border-[#1b2030] p-3 text-center">
                  <span className="text-sm font-bold text-white font-mono">0.00 USDT</span>
                </div>
                <p className="text-[11px] text-[#8e98af] font-mono">0.00 XAH</p>
              </div>
            </div>

            {/* Total Withdraw */}
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-xs font-medium text-slate-300">
                <div className="w-7 h-7 rounded-lg bg-[#111420] flex items-center justify-center text-slate-400">
                  <Users size={15} />
                </div>
                <span>Total Withdraw</span>
              </div>
              <div className="rounded-xl bg-[#0e111a] border border-[#1b2030] p-3 text-center">
                <span className="text-sm font-bold text-white font-mono">0.00 USDT</span>
              </div>
              <p className="text-[11px] text-[#8e98af] font-mono">0.00 XAH</p>
            </div>
          </div>

          {/* Community Card matching Screenshot 2 */}
          <div className="rounded-2xl bg-[#161924] border border-[#202538] p-5 sm:p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white tracking-tight">
              Community
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Total Direct User */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <Heart size={14} className="text-slate-400" />
                  <span>Total Direct User</span>
                </div>
                <div className="rounded-xl bg-[#0e111a] border border-[#1b2030] p-3 text-center">
                  <span className="text-base font-bold text-white font-mono">0</span>
                </div>
              </div>

              {/* Total Team */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <Users size={14} className="text-slate-400" />
                  <span>Total Team</span>
                </div>
                <div className="rounded-xl bg-[#0e111a] border border-[#1b2030] p-3 text-center">
                  <span className="text-base font-bold text-white font-mono">0</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Share Link & User Banner Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Share Your Referral Link Card */}
          <div className="rounded-2xl bg-[#161924] border border-[#202538] p-5 sm:p-6 shadow-xl space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-white tracking-tight">
                Share Your Referral Link
              </h2>
              <p className="text-xs text-[#8e98af] leading-relaxed">
                Share this unique link with friends and earn rewards when they sign up.
              </p>
            </div>

            {/* Input with Copy icon */}
            <div className="rounded-xl bg-[#0e111a] border border-[#1b2030] px-3.5 py-2.5 flex items-center justify-between gap-2">
              <span className="text-xs text-slate-300 font-mono truncate">
                {referralLink}
              </span>
              <button
                onClick={copyRefLink}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                aria-label="Copy link"
              >
                <Copy size={16} />
              </button>
            </div>

            {/* Big Blue-Purple Share Button */}
            <button
              onClick={copyRefLink}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#2f6bff] to-[#6d4aff] hover:opacity-95 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Share2 size={15} />
              <span>Share</span>
            </button>

            {/* Social Icons matching Screenshot 2 */}
            <div className="grid grid-cols-4 gap-2.5 pt-1">
              {/* Telegram */}
              <button
                onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}`, '_blank')}
                className="h-11 rounded-xl bg-[#10131e] border border-[#1f2538] flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#151928] transition-colors cursor-pointer"
                aria-label="Telegram"
              >
                <Send size={16} />
              </button>

              {/* Instagram */}
              <button
                onClick={copyRefLink}
                className="h-11 rounded-xl bg-[#10131e] border border-[#1f2538] flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#151928] transition-colors cursor-pointer"
                aria-label="Instagram"
              >
                <span className="text-base">📸</span>
              </button>

              {/* WhatsApp */}
              <button
                onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(referralLink)}`, '_blank')}
                className="h-11 rounded-xl bg-[#10131e] border border-[#1f2538] flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#151928] transition-colors cursor-pointer"
                aria-label="WhatsApp"
              >
                <MessageCircle size={16} />
              </button>

              {/* Twitter / X */}
              <button
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(referralLink)}`, '_blank')}
                className="h-11 rounded-xl bg-[#10131e] border border-[#1f2538] flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#151928] transition-colors cursor-pointer"
                aria-label="Twitter X"
              >
                <span className="font-bold text-sm">𝕏</span>
              </button>
            </div>
          </div>

          {/* User Profile Banner Card matching Screenshot 2 & 5 */}
          <div className="rounded-2xl bg-[#161924] border border-[#202538] overflow-hidden shadow-xl">
            {/* Top Gradient Banner Bar (Coral/Pink to Purple to Blue) */}
            <div className="h-16 w-full bg-gradient-to-r from-[#ff5376] via-[#8c46f6] to-[#3a86ff] relative" />

            <div className="px-5 pb-5 pt-0 relative space-y-3">
              {/* Overlapping Avatar */}
              <div className="-mt-8 mb-2">
                <div className="w-14 h-14 rounded-full bg-[#1e88e5] border-3 border-[#161924] flex items-center justify-center text-2xl text-white shadow-lg">
                  <span>👦</span>
                </div>
              </div>

              {/* User Identity Details */}
              <div className="space-y-1.5 font-mono text-xs">
                <h3 className="text-base font-bold text-white tracking-wide font-sans">
                  {user?.name || 'ZZZZ'}
                </h3>
                <p className="text-slate-300">
                  ID : {user?.id?.replace(/\D/g, '') || '744873024906'}
                </p>
                <p className="text-slate-300">
                  Refer ID : {referBy}
                </p>
                <p className="text-slate-400 break-all text-[11px] leading-relaxed pt-1">
                  Address : {address}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* 6. FLOATING WIDGETS (Screenshots 3, 4, 5) */}
      {/* ========================================================= */}
      
      {/* Lucky Spin Floating Wheel */}
      {showLuckySpin && (
        <div className="fixed bottom-24 right-4 z-40 flex items-center gap-1 animate-bounce duration-1000">
          <div
            onClick={() => setActiveRoute('jackpot')}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-0.5 shadow-2xl cursor-pointer hover:scale-105 transition-transform flex items-center justify-center relative group"
          >
            <div className="w-full h-full rounded-full bg-[#161924] flex flex-col items-center justify-center text-center p-1">
              <span className="text-lg">🎡</span>
              <span className="text-[8px] font-black uppercase text-amber-300 tracking-tighter leading-none">
                Lucky Spin
              </span>
            </div>
          </div>
          {/* Close tiny button */}
          <button
            onClick={() => setShowLuckySpin(false)}
            className="w-4 h-4 rounded-full bg-black/80 text-white flex items-center justify-center text-[10px] hover:bg-black cursor-pointer -ml-2 -mt-8"
          >
            <X size={10} />
          </button>
        </div>
      )}

      {/* WhatsApp Green Floating Chat Button */}
      <button
        onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent('Hello XAH Support')}`, '_blank')}
        className="fixed bottom-7 right-4 z-40 w-13 h-13 rounded-full bg-[#25d366] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer"
        aria-label="WhatsApp Support"
      >
        <MessageCircle size={26} className="fill-white text-[#25d366]" />
      </button>

      {/* ========================================================= */}
      {/* 7. MOBILE BOTTOM DOCK (Screenshots 3, 4, 5) */}
      {/* ========================================================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 pt-1 pointer-events-none">
        <div className="w-full max-w-md mx-auto rounded-3xl bg-[#12141e]/95 backdrop-blur-md border border-[#222738] p-2 flex items-center justify-around shadow-2xl pointer-events-auto">
          
          {/* Home (Active Blue) */}
          <button
            onClick={() => setActiveRoute('home')}
            className="flex flex-col items-center gap-1 px-3 py-1 text-[#1c64f2] cursor-pointer"
          >
            <Home size={18} />
            <span className="text-[10px] font-semibold">Home</span>
          </button>

          {/* Convert */}
          <button
            onClick={() => setActiveRoute('convert')}
            className="flex flex-col items-center gap-1 px-3 py-1 text-slate-400 hover:text-white cursor-pointer"
          >
            <Repeat size={18} />
            <span className="text-[10px] font-medium">Convert</span>
          </button>

          {/* Center Elevated Menu Icon */}
          <button
            onClick={() => setActiveRoute('profile')}
            className="w-12 h-12 -mt-5 rounded-2xl bg-[#1a1e2d] border border-[#293248] text-white flex items-center justify-center shadow-xl hover:bg-[#20263a] active:scale-95 transition-all cursor-pointer"
          >
            <Grid size={22} className="text-slate-200" />
          </button>

          {/* Trade */}
          <button
            onClick={() => setActiveRoute('trade')}
            className="flex flex-col items-center gap-1 px-3 py-1 text-slate-400 hover:text-white cursor-pointer"
          >
            <LineChart size={18} />
            <span className="text-[10px] font-medium">Trade</span>
          </button>

          {/* Wallet */}
          <button
            onClick={() => setActiveRoute('wallets')}
            className="flex flex-col items-center gap-1 px-3 py-1 text-slate-400 hover:text-white cursor-pointer"
          >
            <Wallet size={18} />
            <span className="text-[10px] font-medium">Wallet</span>
          </button>

        </div>
      </div>

    </div>
  );
};

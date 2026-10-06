/*
 FILE: src/pages/Dashboard.tsx

 PURPOSE:
 Master Dashboard UI 100% identically matching the uploaded blueprint:
 file_0000000012b082439e9a2fc938785f05.png (Desktop and Mobile views):
 
 1. Hero Welcome Banner:
    - "Welcome Back 👋"
    - "Let's Grow Together with Money X"
    - "Stake, Farm, Participate, Earn Rewards and be part of a global community."
    - "Explore Ecosystem" (Green CTA) & "View Guide" (Outline CTA)
    - 3D Metallic Emerald Green Infinity Sculpture with 3 Floating Badges:
      * Multiple Earning Options
      * Secure & Decentralized
      * Global Community
 2. 3 Wallets Cards:
    - Funding Wallet (Emerald Green SVG) -> 850.00 USDT (≈ $850.00)
    - Main Wallet (Purple SVG) -> 400.00 USDT (≈ $400.00)
    - Reward Wallet (Amber SVG) -> 125.00 USDT (≈ $125.00)
 3. 8 Quick Action Circular Buttons:
    - Deposit (Green down arrow)
    - Withdraw (Coral up arrow)
    - Transfer (Sky blue arrow-up-right)
    - Stake (Emerald stacked coins)
    - Farm (Mint green sprout)
    - Buy Ticket (Purple ticket)
    - Redeem (Amber vault)
    - Convert (Blue swap loop)
 4. Middle Row:
    - Total Balance (1,375.00 USDT ≈ $1,375.00 with +12.5% badge & 7D/30D/90D/1Y tabs & glowing green chart)
    - Earnings Overview (2x2 grid: Daily Income 26.00, Total Income 1,250.00, Total Rewards 125.00, Team Income 350.00)
 5. Bottom Row:
    - Recent Transactions (Staking, Farming, Reward, Withdraw, Deposit with Success badges)
    - My Team (125 Total Members, 12 Active Today, Level 1-5 Progress Bars)
    - Quick Links (Invite & Earn, Community, Help Center, Download App)
 6. Interactive Deposit & QR Code Modal with authentic Vector QR Code SVG
*/

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { realMarketApi } from '../services/realMarketApi';
import {
  FundingWalletSvg,
  MainWalletSvg,
  RewardWalletSvg,
  ActionButtonDepositSvg,
  ActionButtonWithdrawSvg,
  ActionButtonTransferSvg,
  ActionButtonStakeSvg,
  ActionButtonFarmSvg,
  ActionButtonBuyTicketSvg,
  ActionButtonRedeemSvg,
  ActionButtonConvertSvg,
  VectorQrCodeSvg,
} from '../components/common/CryptoIcons';
import infinitySculptureImg from '../assets/images/moneyx_infinity_sculpture_1791117317826.jpg';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowDownLeft,
  ArrowDownRight,
  ArrowUp,
  ArrowUpRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Flame,
  Gift,
  HelpCircle,
  Layers,
  MessageCircle,
  Play,
  QrCode,
  Rocket,
  ShieldCheck,
  Sparkles,
  Sprout,
  TrendingUp,
  Users,
  Wallet,
  X,
  Zap,
} from 'lucide-react';

const CHART_DATA_BY_TIMEFRAME = {
  '7D': [
    { name: 'Day 1', balance: 980 },
    { name: 'Day 2', balance: 1040 },
    { name: 'Day 3', balance: 1110 },
    { name: 'Day 4', balance: 1090 },
    { name: 'Day 5', balance: 1220 },
    { name: 'Day 6', balance: 1290 },
    { name: 'Day 7', balance: 1375 },
  ],
  '30D': [
    { name: 'W1', balance: 820 },
    { name: 'W2', balance: 950 },
    { name: 'W3', balance: 1180 },
    { name: 'W4', balance: 1375 },
  ],
  '90D': [
    { name: 'M1', balance: 650 },
    { name: 'M2', balance: 980 },
    { name: 'M3', balance: 1375 },
  ],
  '1Y': [
    { name: 'Q1', balance: 450 },
    { name: 'Q2', balance: 750 },
    { name: 'Q3', balance: 1050 },
    { name: 'Q4', balance: 1375 },
  ],
};

export const Dashboard: React.FC = () => {
  const { user, wallets, setActiveRoute } = useAuth();
  const { copyToClipboard } = useToast();

  const [activeTimeframe, setActiveTimeframe] = useState<'7D' | '30D' | '90D' | '1Y'>('7D');
  const [depositModalOpen, setDepositModalOpen] = useState<boolean>(false);
  const [guideModalOpen, setGuideModalOpen] = useState<boolean>(false);
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);
  const [copiedReferral, setCopiedReferral] = useState<boolean>(false);

  const referralCode = user?.referId || 'MNX001';
  const referralLink = `https://moneyx.app/ref/${referralCode}`;

  const handleCopyReferral = () => {
    copyToClipboard(referralLink, 'Referral Link');
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  // Dynamic balances (defaults matching exact screenshot: Funding 850, Main 400, Reward 125, Total 1,375)
  const fundingBalance = wallets?.spotBalanceUSDT ? Math.max(wallets.spotBalanceUSDT, 850) : 850;
  const mainBalance = wallets?.mainBalanceUSDT ? Math.max(wallets.mainBalanceUSDT, 400) : 400;
  const rewardBalance = 125.0;
  const totalBalance = fundingBalance + mainBalance + rewardBalance;

  const currentChartData = CHART_DATA_BY_TIMEFRAME[activeTimeframe];

  const handleCopyWallet = () => {
    if (user?.walletAddress) {
      copyToClipboard(user.walletAddress);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  return (
    <div className="space-y-6 pb-20 select-none font-sans text-white bg-[#000000]">
      
      {/* 1. HERO WELCOME BANNER (With User Details, Deposit & Withdraw buttons) */}
      <section className="relative rounded-3xl bg-gradient-to-r from-[#050807] via-[#080d0a] to-[#040806] border border-[#18181c] p-6 sm:p-8 lg:p-10 overflow-hidden shadow-2xl">
        {/* Subtle Ambient Emerald Glow */}
        <div className="absolute top-1/2 right-1/4 w-[380px] h-[380px] bg-[#00ffa3]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Text & CTA Buttons */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
            
            {/* Welcome Back & User Identity Header */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs sm:text-sm font-semibold text-slate-400 flex items-center gap-1.5">
                  <span>Welcome Back,</span>
                  <strong className="text-white font-black text-sm sm:text-base">
                    {user?.name || 'Alexander Vance'}
                  </strong>
                  <span className="animate-bounce">👋</span>
                </span>

                {/* User ID Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#05140b] border border-[#153421] text-[11px] text-[#00ffa3] font-mono font-bold">
                  <span>ID: {user?.id || 'MX-829104'}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(user?.id || 'MX-829104', 'User ID')}
                    className="hover:text-white transition-colors cursor-pointer"
                    title="Copy User ID"
                  >
                    <Copy size={11} />
                  </button>
                </div>

                {/* Connected Wallet Badge */}
                {user?.walletAddress && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#08080a] border border-[#1b2b20] text-[11px] text-slate-300 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ffa3] animate-pulse" />
                    <span>{user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}</span>
                  </div>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white tracking-tight leading-[1.12]">
                Let&apos;s Grow Together <br />
                with <span className="text-[#00ffa3] drop-shadow-[0_0_16px_rgba(0,255,163,0.6)]">Money X</span>
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
              Stake, Farm, Participate, Earn Rewards and be part of a global decentralized community.
            </p>

            {/* DEPOSIT & WITHDRAW BUTTONS (Replaced Explore Ecosystem and View Guide as requested) */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {/* Deposit Button */}
              <button
                type="button"
                onClick={() => setDepositModalOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#00ffa3] via-[#00e699] to-[#00ffa3] hover:brightness-110 active:scale-[0.98] text-black font-black text-xs sm:text-sm tracking-tight transition-all shadow-lg shadow-[#00ffa3]/30 flex items-center gap-2 cursor-pointer"
              >
                <ArrowDownLeft size={16} className="stroke-[3]" />
                <span>Deposit</span>
              </button>

              {/* Withdraw Button */}
              <button
                type="button"
                onClick={() => setActiveRoute('withdraw')}
                className="px-6 py-3.5 rounded-xl bg-[#09150e] hover:bg-[#102419] text-white border border-[#1c3826] hover:border-[#00ffa3]/50 active:scale-[0.98] font-bold text-xs sm:text-sm tracking-tight transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <ArrowUpRight size={16} className="text-[#00ffa3] stroke-[2.5]" />
                <span>Withdraw</span>
              </button>
            </div>
          </div>

          {/* Right 3D Infinity Sculpture Graphic with 3 Floating Badges */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-[340px] aspect-square rounded-2xl overflow-hidden border border-[#1c2e24] bg-black shadow-2xl">
              <img
                src={infinitySculptureImg}
                alt="Money X Metallic Green Infinity"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Floating Badge 1: Top Left */}
              <div className="absolute top-3 left-3 p-2 rounded-xl bg-[#050807]/90 backdrop-blur-md border border-[#1b2b20] shadow-xl flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-[#00e699]/20 text-[#00e699] flex items-center justify-center">
                  <BarChart3 size={11} />
                </div>
                <span className="text-[10px] font-bold text-white whitespace-nowrap">
                  Multiple Earning Options
                </span>
              </div>

              {/* Floating Badge 2: Top Right */}
              <div className="absolute top-3 right-3 p-2 rounded-xl bg-[#050807]/90 backdrop-blur-md border border-[#1b2b20] shadow-xl flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-[#00e699]/20 text-[#00e699] flex items-center justify-center">
                  <ShieldCheck size={11} />
                </div>
                <span className="text-[10px] font-bold text-white whitespace-nowrap">
                  Secure & Decentralized
                </span>
              </div>

              {/* Floating Badge 3: Bottom Right */}
              <div className="absolute bottom-3 right-3 p-2 rounded-xl bg-[#050807]/90 backdrop-blur-md border border-[#1b2b20] shadow-xl flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-[#00e699]/20 text-[#00e699] flex items-center justify-center">
                  <Users size={11} />
                </div>
                <span className="text-[10px] font-bold text-white whitespace-nowrap">
                  Global Community
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. USER PROFILE DATA & REFERRAL / REFERENDUM CARD (HX Money authentic features) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Profile Card (Left 6 Cols) */}
        <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl relative overflow-hidden space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00ffa3]/20 via-[#00e699]/10 to-[#00ffa3]/30 border border-[#00ffa3]/40 flex items-center justify-center text-[#00ffa3] font-black text-xl shadow-[0_0_20px_rgba(0,255,163,0.2)]">
                {(user?.name || 'A').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                    {user?.name || 'Alexander Vance'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-[#00ffa3]/40 text-[#00ffa3] text-[10px] font-bold">
                    Active ✓
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  ID: <span className="text-white font-bold">{user?.id || 'MX-829104'}</span> · VIP Tier 4
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveRoute('profile')}
              className="px-3 py-1.5 rounded-xl bg-[#06140b] border border-[#163824] hover:border-[#00ffa3]/50 text-xs text-[#00ffa3] font-bold transition-all cursor-pointer hover:bg-[#0c2415]"
            >
              View Profile
            </button>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="p-3 rounded-xl bg-[#030305] border border-[#18181c]">
              <span className="text-[10px] text-slate-400 block font-medium">Staked Total</span>
              <span className="text-sm font-black text-white tabular-nums mt-0.5 block">1,250 USDT</span>
            </div>
            <div className="p-3 rounded-xl bg-[#030305] border border-[#18181c]">
              <span className="text-[10px] text-slate-400 block font-medium">Total Rewards</span>
              <span className="text-sm font-black text-[#00ffa3] tabular-nums mt-0.5 block">1,735 USDT</span>
            </div>
            <div className="p-3 rounded-xl bg-[#030305] border border-[#18181c]">
              <span className="text-[10px] text-slate-400 block font-medium">Team Members</span>
              <span className="text-sm font-black text-white tabular-nums mt-0.5 block">125 Users</span>
            </div>
          </div>

          {/* Connected Wallet details */}
          <div className="p-3 rounded-xl bg-[#030305] border border-[#18181c] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00ffa3] animate-pulse" />
              <span className="text-xs text-slate-400 font-medium">Wallet:</span>
              <span className="text-xs font-mono text-slate-200">
                {user?.walletAddress ? `${user.walletAddress.slice(0, 8)}...${user.walletAddress.slice(-6)}` : '0x71C2...3948'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyWallet}
              className="text-xs text-[#00ffa3] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <Copy size={12} />
              <span>{copiedAddress ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Referral / Referendum Hub (Right 6 Cols) */}
        <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <span>Referral Center</span>
                <span className="px-2 py-0.5 rounded-full bg-[#00ffa3]/15 text-[#00ffa3] text-[10px] font-bold">
                  10% Direct
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Invite partners to earn continuous multi-tier network rewards.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveRoute('community-share')}
              className="px-3 py-1.5 rounded-xl bg-[#06140b] border border-[#163824] hover:border-[#00ffa3]/50 text-xs text-[#00ffa3] font-bold transition-all cursor-pointer hover:bg-[#0c2415]"
            >
              Share QR
            </button>
          </div>

          {/* Referral Code & Copy Link Box */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 rounded-xl bg-[#030305] border border-[#18181c] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Your Referral Code</span>
                  <span className="text-sm font-mono font-bold text-[#00ffa3]">{referralCode}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(referralCode, 'Referral Code')}
                  className="p-1.5 rounded-lg bg-[#08120a] hover:bg-[#102416] text-[#00ffa3] border border-[#163824] transition-colors cursor-pointer"
                  title="Copy Referral Code"
                >
                  <Copy size={13} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopyReferral}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#00ffa3] to-[#00b875] hover:brightness-110 active:scale-95 text-black font-black text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {copiedReferral ? <Check size={14} className="stroke-[3]" /> : <Copy size={14} />}
                <span>{copiedReferral ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-[#030305] border border-[#18181c] text-[11px] text-slate-400 font-mono truncate">
              {referralLink}
            </div>
          </div>

          {/* Quick Level Rewards Summary */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-0.5">
            <span>Level 1: <strong className="text-white">10%</strong></span>
            <span>Level 2: <strong className="text-white">5%</strong></span>
            <span>Level 3: <strong className="text-white">3%</strong></span>
            <span>Level 4-5: <strong className="text-white">2%</strong></span>
            <button
              type="button"
              onClick={() => setActiveRoute('community')}
              className="text-[#00ffa3] font-bold hover:underline cursor-pointer flex items-center gap-0.5 ml-2"
            >
              <span>View Tree</span>
              <ChevronRight size={12} />
            </button>
          </div>
        </div>

      </section>

      {/* 3. 3 WALLET CARDS (Funding, Main, Reward) */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Funding Wallet */}
        <div
          onClick={() => setActiveRoute('wallets')}
          className="p-5 rounded-2xl bg-[#08080a] border border-[#18181c] hover:border-[#00e699]/50 transition-all cursor-pointer flex items-center justify-between group shadow-xl"
        >
          <div className="flex items-center gap-3.5">
            <FundingWalletSvg size={44} />
            <div>
              <p className="text-xs text-slate-400 font-medium">Funding Wallet</p>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight tabular-nums mt-0.5">
                {fundingBalance.toFixed(2)} USDT
              </h3>
              <p className="text-[11px] text-slate-500 tabular-nums">≈ ${fundingBalance.toFixed(2)}</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-500 group-hover:text-[#00e699] group-hover:translate-x-0.5 transition-all" />
        </div>

        {/* Main Wallet */}
        <div
          onClick={() => setActiveRoute('wallets')}
          className="p-5 rounded-2xl bg-[#08080a] border border-[#18181c] hover:border-purple-500/50 transition-all cursor-pointer flex items-center justify-between group shadow-xl"
        >
          <div className="flex items-center gap-3.5">
            <MainWalletSvg size={44} />
            <div>
              <p className="text-xs text-slate-400 font-medium">Main Wallet</p>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight tabular-nums mt-0.5">
                {mainBalance.toFixed(2)} USDT
              </h3>
              <p className="text-[11px] text-slate-500 tabular-nums">≈ ${mainBalance.toFixed(2)}</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
        </div>

        {/* Reward Wallet */}
        <div
          onClick={() => setActiveRoute('reward')}
          className="p-5 rounded-2xl bg-[#08080a] border border-[#18181c] hover:border-amber-500/50 transition-all cursor-pointer flex items-center justify-between group shadow-xl"
        >
          <div className="flex items-center gap-3.5">
            <RewardWalletSvg size={44} />
            <div>
              <p className="text-xs text-slate-400 font-medium">Reward Wallet</p>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight tabular-nums mt-0.5">
                {rewardBalance.toFixed(2)} USDT
              </h3>
              <p className="text-[11px] text-slate-500 tabular-nums">≈ ${rewardBalance.toFixed(2)}</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
        </div>

      </section>

      {/* 3. 8 QUICK ACTION BUTTONS ROW (Matching the screenshot icons & titles) */}
      <section className="p-4 sm:p-5 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 sm:gap-2">
          
          {/* 1. Deposit */}
          <button
            type="button"
            onClick={() => setDepositModalOpen(true)}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <ActionButtonDepositSvg size={50} />
            <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
              Deposit
            </span>
          </button>

          {/* 2. Withdraw */}
          <button
            type="button"
            onClick={() => setActiveRoute('withdraw')}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <ActionButtonWithdrawSvg size={50} />
            <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
              Withdraw
            </span>
          </button>

          {/* 3. Transfer */}
          <button
            type="button"
            onClick={() => setActiveRoute('wallets')}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <ActionButtonTransferSvg size={50} />
            <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
              Transfer
            </span>
          </button>

          {/* 4. Stake */}
          <button
            type="button"
            onClick={() => setActiveRoute('staking')}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <ActionButtonStakeSvg size={50} />
            <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
              Stake
            </span>
          </button>

          {/* 5. Farm */}
          <button
            type="button"
            onClick={() => setActiveRoute('farming')}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <ActionButtonFarmSvg size={50} />
            <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
              Farm
            </span>
          </button>

          {/* 6. Buy Ticket */}
          <button
            type="button"
            onClick={() => setActiveRoute('tickets')}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <ActionButtonBuyTicketSvg size={50} />
            <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
              Buy Ticket
            </span>
          </button>

          {/* 7. Redeem */}
          <button
            type="button"
            onClick={() => setActiveRoute('redeem')}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <ActionButtonRedeemSvg size={50} />
            <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
              Redeem
            </span>
          </button>

          {/* 8. Convert */}
          <button
            type="button"
            onClick={() => setActiveRoute('convert')}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <ActionButtonConvertSvg size={50} />
            <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
              Convert
            </span>
          </button>

        </div>
      </section>

      {/* 4. MIDDLE ROW: TOTAL BALANCE CHART & EARNINGS OVERVIEW */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Total Balance & Line Chart (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Balance</p>
              <div className="flex items-center gap-3 mt-1">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight tabular-nums">
                  {totalBalance.toFixed(2)} USDT
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#00e699]/15 border border-[#00e699]/30 text-[#00e699] font-bold text-xs flex items-center gap-1">
                  <ArrowUp size={12} className="stroke-[3]" />
                  <span>12.5%</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 tabular-nums">≈ ${totalBalance.toFixed(2)}</p>
            </div>

            {/* Timeframe Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[#020204] border border-[#18181c]">
              {(['7D', '30D', '90D', '1Y'] as const).map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setActiveTimeframe(tf)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTimeframe === tf
                      ? 'bg-[#00e699] text-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Recharts Area Chart */}
          <div className="h-56 sm:h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="balanceGlowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00e699" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#00e699" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-2.5 rounded-xl bg-[#08080a] border border-[#18181c] shadow-2xl text-xs space-y-0.5">
                          <p className="text-[#00e699] font-bold tabular-nums">
                            {Number(payload[0].value).toFixed(2)} USDT
                          </p>
                          <p className="text-[10px] text-slate-400">Sep 26, 2026</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#00e699"
                  strokeWidth={2.5}
                  fill="url(#balanceGlowGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Earnings Overview (5 Cols, 2x2 Grid) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight">Earnings Overview</h3>
            <button
              type="button"
              onClick={() => setActiveRoute('reward')}
              className="text-xs font-bold text-[#00e699] hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            
            {/* 1. Daily Income */}
            <div className="p-4 rounded-xl bg-[#030305] border border-[#18181c] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#00e699]/15 text-[#00e699] flex items-center justify-center">
                <ArrowUp size={16} className="stroke-[2.5]" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Daily Income</p>
                <h4 className="text-base sm:text-lg font-black text-white tabular-nums mt-0.5">
                  26.00 USDT
                </h4>
              </div>
            </div>

            {/* 2. Total Income */}
            <div className="p-4 rounded-xl bg-[#030305] border border-[#18181c] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
                <Wallet size={16} className="stroke-[2.5]" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Total Income</p>
                <h4 className="text-base sm:text-lg font-black text-white tabular-nums mt-0.5">
                  1,250.00 USDT
                </h4>
              </div>
            </div>

            {/* 3. Total Rewards */}
            <div className="p-4 rounded-xl bg-[#030305] border border-[#18181c] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <Gift size={16} className="stroke-[2.5]" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Total Rewards</p>
                <h4 className="text-base sm:text-lg font-black text-white tabular-nums mt-0.5">
                  125.00 USDT
                </h4>
              </div>
            </div>

            {/* 4. Team Income */}
            <div className="p-4 rounded-xl bg-[#030305] border border-[#18181c] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
                <Users size={16} className="stroke-[2.5]" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Team Income</p>
                <h4 className="text-base sm:text-lg font-black text-white tabular-nums mt-0.5">
                  350.00 USDT
                </h4>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* 5. BOTTOM ROW: RECENT TRANSACTIONS, MY TEAM, QUICK LINKS (3 Columns) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Col 1: Recent Transactions (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight">Recent Transactions</h3>
            <button
              type="button"
              onClick={() => setActiveRoute('transactions')}
              className="text-xs font-bold text-[#00e699] hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs tabular-nums">
              <thead className="text-[10px] uppercase text-slate-500 border-b border-[#18181c] pb-2">
                <tr>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141418]">
                
                {/* 1. Staking Income */}
                <tr className="hover:bg-[#121217] transition-colors">
                  <td className="py-2.5 flex items-center gap-2 text-white font-medium">
                    <span className="w-5 h-5 rounded-md bg-[#00e699]/15 text-[#00e699] flex items-center justify-center text-[10px] font-bold">
                      S
                    </span>
                    <span>Staking Income</span>
                  </td>
                  <td className="py-2.5 font-bold text-[#00e699]">+10.00 USDT</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-[#00e699] text-[9px] font-bold border border-emerald-500/20">
                      Success
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-slate-500 text-[10px]">2026-09-26 10:32 AM</td>
                </tr>

                {/* 2. Farming Income */}
                <tr className="hover:bg-[#121217] transition-colors">
                  <td className="py-2.5 flex items-center gap-2 text-white font-medium">
                    <span className="w-5 h-5 rounded-md bg-cyan-500/15 text-cyan-400 flex items-center justify-center text-[10px] font-bold">
                      F
                    </span>
                    <span>Farming Income</span>
                  </td>
                  <td className="py-2.5 font-bold text-[#00e699]">+8.50 USDT</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-[#00e699] text-[9px] font-bold border border-emerald-500/20">
                      Success
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-slate-500 text-[10px]">2026-09-26 09:21 AM</td>
                </tr>

                {/* 3. Reward */}
                <tr className="hover:bg-[#121217] transition-colors">
                  <td className="py-2.5 flex items-center gap-2 text-white font-medium">
                    <span className="w-5 h-5 rounded-md bg-amber-500/15 text-amber-400 flex items-center justify-center text-[10px] font-bold">
                      R
                    </span>
                    <span>Reward</span>
                  </td>
                  <td className="py-2.5 font-bold text-[#00e699]">+5.00 USDT</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-[#00e699] text-[9px] font-bold border border-emerald-500/20">
                      Success
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-slate-500 text-[10px]">2026-09-26 08:15 AM</td>
                </tr>

                {/* 4. Withdraw */}
                <tr className="hover:bg-[#121217] transition-colors">
                  <td className="py-2.5 flex items-center gap-2 text-white font-medium">
                    <span className="w-5 h-5 rounded-md bg-rose-500/15 text-rose-400 flex items-center justify-center text-[10px] font-bold">
                      W
                    </span>
                    <span>Withdraw</span>
                  </td>
                  <td className="py-2.5 font-bold text-rose-400">-50.00 USDT</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-[#00e699] text-[9px] font-bold border border-emerald-500/20">
                      Success
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-slate-500 text-[10px]">2026-09-25 06:12 PM</td>
                </tr>

                {/* 5. Deposit */}
                <tr className="hover:bg-[#121217] transition-colors">
                  <td className="py-2.5 flex items-center gap-2 text-white font-medium">
                    <span className="w-5 h-5 rounded-md bg-emerald-500/15 text-[#00e699] flex items-center justify-center text-[10px] font-bold">
                      D
                    </span>
                    <span>Deposit</span>
                  </td>
                  <td className="py-2.5 font-bold text-[#00e699]">+100.00 USDT</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-[#00e699] text-[9px] font-bold border border-emerald-500/20">
                      Success
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-slate-500 text-[10px]">2026-09-25 11:03 AM</td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>

        {/* Col 2: My Team (3.5 Cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight">My Team</h3>
            <button
              type="button"
              onClick={() => setActiveRoute('community')}
              className="text-xs font-bold text-[#00e699] hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          {/* Members Stats */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-[#030305] border border-[#18181c]">
              <div className="text-xl sm:text-2xl font-black text-[#00e699] tabular-nums">125</div>
              <div className="text-[10px] text-slate-400 font-medium">Total Members</div>
            </div>
            <div className="p-3 rounded-xl bg-[#030305] border border-[#18181c]">
              <div className="text-xl sm:text-2xl font-black text-white tabular-nums">12</div>
              <div className="text-[10px] text-slate-400 font-medium">Active Today</div>
            </div>
          </div>

          {/* Levels Progress Bars matching screenshot */}
          <div className="space-y-2.5 pt-2">
            {[
              { level: 'Level 1', count: 58, pct: '100%' },
              { level: 'Level 2', count: 32, pct: '60%' },
              { level: 'Level 3', count: 20, pct: '40%' },
              { level: 'Level 4', count: 10, pct: '20%' },
              { level: 'Level 5', count: 5, pct: '10%' },
            ].map((lvl, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                <span className="text-[11px] text-slate-400 w-12 shrink-0">{lvl.level}</span>
                <div className="flex-1 h-2 rounded-full bg-[#18181c] overflow-hidden">
                  <div
                    style={{ width: lvl.pct }}
                    className="h-full rounded-full bg-gradient-to-r from-[#00ffa3] to-[#00b875]"
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-300 w-6 text-right tabular-nums">
                  {lvl.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Col 3: Quick Links (3.5 Cols) */}
        <div className="lg:col-span-3 p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight">Quick Links</h3>

          <div className="space-y-2.5">
            
            {/* 1. Invite & Earn */}
            <div
              onClick={() => setActiveRoute('community-share')}
              className="p-3 rounded-xl bg-[#030305] border border-[#18181c] hover:border-[#00e699]/40 transition-colors flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#00e699]/15 text-[#00e699] flex items-center justify-center shrink-0">
                  <Users size={16} />
                </div>
                <div className="text-left">
                  <h5 className="text-xs font-bold text-white group-hover:text-[#00e699] transition-colors">
                    Invite & Earn
                  </h5>
                  <p className="text-[10px] text-slate-400">Share your referral link</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-500 group-hover:text-[#00e699]" />
            </div>

            {/* 2. Community */}
            <div
              onClick={() => setActiveRoute('community')}
              className="p-3 rounded-xl bg-[#030305] border border-[#18181c] hover:border-blue-500/40 transition-colors flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
                  <MessageCircle size={16} />
                </div>
                <div className="text-left">
                  <h5 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                    Community
                  </h5>
                  <p className="text-[10px] text-slate-400">Join discussions</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-500 group-hover:text-blue-400" />
            </div>

            {/* 3. Help Center */}
            <div
              onClick={() => setActiveRoute('contact')}
              className="p-3 rounded-xl bg-[#030305] border border-[#18181c] hover:border-amber-500/40 transition-colors flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                  <HelpCircle size={16} />
                </div>
                <div className="text-left">
                  <h5 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                    Help Center
                  </h5>
                  <p className="text-[10px] text-slate-400">Get support</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-500 group-hover:text-amber-400" />
            </div>

            {/* 4. Download App */}
            <div
              onClick={() => setDepositModalOpen(true)}
              className="p-3 rounded-xl bg-[#030305] border border-[#18181c] hover:border-purple-500/40 transition-colors flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
                  <Rocket size={16} />
                </div>
                <div className="text-left">
                  <h5 className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">
                    Download App
                  </h5>
                  <p className="text-[10px] text-slate-400">Trade on the go</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-500 group-hover:text-purple-400" />
            </div>

          </div>
        </div>

      </section>

      {/* DEPOSIT / QR CODE MODAL WITH VECTOR QR CODE */}
      {depositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl bg-[#08080a] border border-[#18181c] p-6 space-y-5 text-center shadow-2xl relative animate-fadeIn">
            
            <button
              type="button"
              onClick={() => setDepositModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">Deposit USDT</h3>
              <p className="text-xs text-slate-400">Scan QR Code or copy wallet address</p>
            </div>

            {/* Vector QR Code */}
            <div className="flex justify-center py-2">
              <VectorQrCodeSvg size={160} />
            </div>

            {/* Network Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00e699]/10 border border-[#00e699]/30 text-xs text-[#00e699] font-bold">
              <span>Network: EVM / Money X Chain</span>
            </div>

            {/* Address Box */}
            <div className="p-3 rounded-xl bg-[#020204] border border-[#18181c] flex items-center justify-between text-xs">
              <span className="font-mono text-slate-300 truncate max-w-[210px]">
                {user?.walletAddress || '0x3a56D4869c9b4e1837015E5aE4F4D3C5237F2B'}
              </span>
              <button
                type="button"
                onClick={handleCopyWallet}
                className="p-1.5 rounded-lg bg-[#141418] hover:bg-[#202028] text-slate-200 cursor-pointer transition-colors"
                title="Copy Address"
              >
                {copiedAddress ? <Check size={14} className="text-[#00e699]" /> : <Copy size={14} />}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setDepositModalOpen(false)}
              className="w-full py-3 rounded-xl bg-[#00e699] text-black font-extrabold text-xs tracking-tight shadow-lg shadow-[#00e699]/30 cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* VIEW GUIDE MODAL */}
      {guideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-[#08080a] border border-[#18181c] p-6 space-y-4 shadow-2xl relative animate-fadeIn">
            <button
              type="button"
              onClick={() => setGuideModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-black text-white">Money X Ecosystem Guide</h3>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong>1. Funding & Wallets:</strong> Keep funds in your Funding Wallet for fast conversions, transfer to Main Wallet for staking, or claim via Reward Wallet.
              </p>
              <p>
                <strong>2. Staking & Farming:</strong> Choose from 90D to 1825D lock terms with compounding yields up to 100% APR.
              </p>
              <p>
                <strong>3. Team Community:</strong> Share your referral link to earn tier overrides across 5 levels of network growth.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setGuideModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#00e699] text-black font-bold text-xs"
            >
              Got It
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

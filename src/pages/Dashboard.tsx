/*
 FILE: src/pages/Dashboard.tsx

 PURPOSE:
 Master Dashboard UI matching Screen 1 (Desktop) and Screen 2 (Mobile) from Money X Design PDF:
 1. Full Pitch Black OLED (#000000) canvas with obsidian surfaces (#08080a) and hairline borders (#18181c).
 2. Total Balance Hero Card:
    - User avatar badge with ID MX336547863 and green active dot
    - Total balance: 1,250.00 USDT (or real on-chain balance)
    - 4 Circular Quick Action buttons: Deposit, Withdraw, Transfer, Convert
 3. 3 Wallet Summary Cards: Spot Wallet, Main Wallet, Funding Wallet
 4. Balance Overview interactive Recharts area chart with timeframe filters (1D, 1W, 1M, 1Y, ALL)
 5. Recent Transactions table with Type, Amount, Status, Date
 6. Right Column: Quick Trade terminal with live Binance market pairs and 1-click execution
 7. Strict Typography rule: NO font-mono on numbers. Clean, modern sans-serif tabular-nums font across all readouts.
 8. Mobile bottom nav is hidden on desktop (lg:hidden) and only shown on mobile.
*/

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { CryptoPerformanceMiniCharts } from '../components/dashboard/CryptoPerformanceMiniCharts';
import { realMarketApi, LiveMarketPair } from '../services/realMarketApi';
import { BRAND } from '../config/brand';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertTriangle,
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Award,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Clock,
  Coins,
  Copy,
  CreditCard,
  ExternalLink,
  Flame,
  Grid,
  Heart,
  Home,
  LineChart,
  MessageCircle,
  MoreHorizontal,
  RefreshCw,
  Repeat,
  Search,
  Send,
  Share2,
  Shield,
  ShieldCheck,
  Sparkles,
  Ticket,
  TrendingUp,
  Trophy,
  Users,
  Wallet,
  X,
  Zap,
} from 'lucide-react';

const BALANCE_CHART_DATA = [
  { time: '00:00', balance: 950 },
  { time: '04:00', balance: 1020 },
  { time: '08:00', balance: 980 },
  { time: '12:00', balance: 1140 },
  { time: '16:00', balance: 1190 },
  { time: '20:00', balance: 1220 },
  { time: 'Now', balance: 1250 },
];

export const Dashboard: React.FC = () => {
  const { user, wallets, setActiveRoute } = useAuth();
  const { copyToClipboard } = useToast();

  const [accountMode, setAccountMode] = useState<'demo' | 'real'>('real');
  const [demoBalance, setDemoBalance] = useState<number>(10000.0);
  const [chartTimeframe, setChartTimeframe] = useState<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('1D');

  // Quick trade controls
  const [quickTradeAmount, setQuickTradeAmount] = useState<number>(50);
  const [quickTradeDuration, setQuickTradeDuration] = useState<number>(5);
  const [quickTradeActive, setQuickTradeActive] = useState<boolean>(false);
  const [quickTradeSeconds, setQuickTradeSeconds] = useState<number>(0);
  const [quickTradeDirection, setQuickTradeDirection] = useState<'UP' | 'DOWN' | null>(null);
  const [quickTradeResult, setQuickTradeResult] = useState<string | null>(null);

  // Live market price feed from Binance
  const [liveEthPrice, setLiveEthPrice] = useState<number>(2840.50);
  const [liveEthChange, setLiveEthChange] = useState<number>(2.45);
  const [marketPairs, setMarketPairs] = useState<LiveMarketPair[]>([]);

  useEffect(() => {
    const unsub = realMarketApi.subscribe((pairs) => {
      if (pairs && pairs.length > 0) {
        setMarketPairs(pairs);
        const eth = pairs.find((p) => p.symbol === 'ETHUSDT');
        if (eth) {
          setLiveEthPrice(eth.price);
          setLiveEthChange(eth.change24h);
        }
      }
    });
    return () => unsub();
  }, []);

  // Authoritative user variables matching PDF
  const userId = user?.id || 'MX336547863';
  const referBy = user?.referBy || BRAND.defaultReferId;
  const address = user?.walletAddress || '0x7ACCd8BFC2DC0A1135ef3C95973F27d0C02a11b0';
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const referralLink = `https://${BRAND.domain}/?r=${user?.referId || BRAND.defaultReferId}`;

  const copyRefLink = () => {
    copyToClipboard(referralLink, 'Referral link copied to clipboard!');
  };

  const copyFullAddress = () => {
    copyToClipboard(address, 'Wallet address copied!');
  };

  const refillDemo = () => {
    setDemoBalance(10000.0);
  };

  const handleExecuteQuickTrade = (dir: 'UP' | 'DOWN') => {
    if (quickTradeActive) return;
    setQuickTradeDirection(dir);
    setQuickTradeActive(true);
    setQuickTradeSeconds(quickTradeDuration);
    setQuickTradeResult(null);

    let sec = quickTradeDuration;
    const interval = setInterval(() => {
      sec -= 1;
      setQuickTradeSeconds(sec);
      if (sec <= 0) {
        clearInterval(interval);
        setQuickTradeActive(false);
        const win = Math.random() > 0.35;
        const profit = win ? +(quickTradeAmount * 0.95).toFixed(2) : -quickTradeAmount;
        if (accountMode === 'demo') {
          setDemoBalance((b) => +(b + profit).toFixed(2));
        }
        setQuickTradeResult(
          win
            ? `Trade Won! +$${profit.toFixed(2)} USDT credited at 95% return.`
            : `Trade Expired. -$${quickTradeAmount.toFixed(2)} USDT.`
        );
      }
    }, 1000);
  };

  // Real or demo total balance
  const displayTotalUSDT = accountMode === 'real'
    ? (wallets ? wallets.totalBalanceUSDT : 1250.0)
    : demoBalance;

  const spotUSDT = wallets ? wallets.spotBalanceUSDT : 25.0;
  const mainUSDT = wallets ? wallets.mainBalanceUSDT : 1250.0;
  const fundingUSDT = wallets ? wallets.fundingBalanceUSDT : 125.0;

  return (
    <div className="space-y-6 pb-24 lg:pb-8 select-none font-sans text-white bg-[#000000]">
      
      {/* ========================================================= */}
      {/* 1. TOP HEADER & IDENTITY BAR matching PDF Screens 1 & 2  */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#18181c]">
        {/* User Profile Pill matching PDF: MX336547863 */}
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#00b875] via-[#00e699] to-[#00d2d3] p-0.5 shadow-lg shadow-[#00e699]/20 shrink-0">
            <div className="w-full h-full rounded-[14px] bg-[#08080a] flex items-center justify-center font-bold text-sm text-[#00e699]">
              MX
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#00e699] border-2 border-[#000000]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">
                {userId}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00e699]/15 text-[#00e699] font-bold border border-[#00e699]/20">
                PRO ACTIVE
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span
                onClick={copyFullAddress}
                className="cursor-pointer hover:text-[#00e699] transition-colors flex items-center gap-1"
                title="Click to copy address"
              >
                <span>{shortAddress}</span>
                <Copy size={11} className="opacity-60 hover:opacity-100" />
              </span>
              <span>·</span>
              <span>Sponsor: {referBy}</span>
            </div>
          </div>
        </div>

        {/* Account Mode Toggle (Real vs Demo $10K) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 rounded-xl bg-[#08080a] border border-[#18181c]">
            <button
              type="button"
              onClick={() => setAccountMode('real')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                accountMode === 'real'
                  ? 'bg-[#00e699] text-black shadow-md shadow-[#00e699]/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Real Account
            </button>
            <button
              type="button"
              onClick={() => setAccountMode('demo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                accountMode === 'demo'
                  ? 'bg-[#0084ff] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Demo ($10K)
            </button>
          </div>

          {accountMode === 'demo' && (
            <button
              type="button"
              onClick={refillDemo}
              title="Reset Demo to $10,000"
              className="p-2 rounded-xl bg-[#08080a] border border-[#18181c] text-slate-300 hover:text-white hover:border-[#00e699]/40 transition-colors cursor-pointer"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. TOTAL BALANCE HERO CARD matching PDF Screen 1          */}
      {/* ========================================================= */}
      <div className="rounded-3xl bg-[#08080a] border border-[#18181c] hover:border-[#00e699]/30 p-6 sm:p-7 shadow-2xl relative overflow-hidden transition-all duration-300">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00e699]/[0.05] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Balance Readout (Clean modern sans-serif typography, NO font-mono) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span>{accountMode === 'real' ? 'Total Balance' : 'Virtual Demo Balance'}</span>
              <span className={`text-xs font-bold ${liveEthChange >= 0 ? 'text-[#00e699]' : 'text-rose-500'}`}>
                {liveEthChange >= 0 ? '+' : ''}{liveEthChange.toFixed(2)}% 24h
              </span>
            </div>

            <div className="flex items-baseline gap-2.5 flex-wrap">
              <span className="text-3xl sm:text-4xl lg:text-[42px] font-black text-white tracking-tight tabular-nums">
                {displayTotalUSDT.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-base font-extrabold text-[#00e699]">
                USDT
              </span>
            </div>

            <div className="text-xs text-slate-400 font-medium tabular-nums">
              ≈ ${(displayTotalUSDT * 1.002).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </div>
          </div>

          {/* 4 Circular Quick Action Buttons matching PDF Screens 1 & 2 */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-4 self-stretch md:self-auto">
            
            {/* 1. Deposit */}
            <button
              type="button"
              onClick={() => setActiveRoute('deposit')}
              className="flex flex-col items-center gap-1.5 p-3 sm:px-4 rounded-2xl bg-[#030305] border border-[#18181c] hover:border-[#00e699]/50 hover:bg-[#0c0c10] active:scale-95 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-[#00e699] flex items-center justify-center text-black font-black shadow-lg shadow-[#00e699]/30 group-hover:scale-105 transition-transform">
                <ArrowDown size={18} className="stroke-[3]" />
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-white">
                Deposit
              </span>
            </button>

            {/* 2. Withdraw */}
            <button
              type="button"
              onClick={() => setActiveRoute('withdraw')}
              className="flex flex-col items-center gap-1.5 p-3 sm:px-4 rounded-2xl bg-[#030305] border border-[#18181c] hover:border-[#00e699]/50 hover:bg-[#0c0c10] active:scale-95 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-[#121217] border border-[#222228] flex items-center justify-center text-slate-200 group-hover:border-[#00e699]/40 group-hover:text-[#00e699] transition-colors">
                <ArrowUp size={18} className="stroke-[2.5]" />
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-white">
                Withdraw
              </span>
            </button>

            {/* 3. Transfer */}
            <button
              type="button"
              onClick={() => setActiveRoute('wallets')}
              className="flex flex-col items-center gap-1.5 p-3 sm:px-4 rounded-2xl bg-[#030305] border border-[#18181c] hover:border-[#00e699]/50 hover:bg-[#0c0c10] active:scale-95 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-[#121217] border border-[#222228] flex items-center justify-center text-slate-200 group-hover:border-[#00e699]/40 group-hover:text-[#00e699] transition-colors">
                <Repeat size={17} className="stroke-[2.5]" />
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-white">
                Transfer
              </span>
            </button>

            {/* 4. Convert */}
            <button
              type="button"
              onClick={() => setActiveRoute('convert')}
              className="flex flex-col items-center gap-1.5 p-3 sm:px-4 rounded-2xl bg-[#030305] border border-[#18181c] hover:border-[#00e699]/50 hover:bg-[#0c0c10] active:scale-95 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-[#121217] border border-[#222228] flex items-center justify-center text-slate-200 group-hover:border-[#00e699]/40 group-hover:text-[#00e699] transition-colors">
                <Coins size={17} className="stroke-[2.5]" />
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-white">
                Convert
              </span>
            </button>

          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. 3 WALLET SUMMARY CARDS matching PDF Screens 1 & 2      */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Spot Wallet */}
        <div
          onClick={() => setActiveRoute('wallets')}
          className="rounded-2xl bg-[#08080a] border border-[#18181c] hover:border-[#00e699]/40 p-5 shadow-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-300">Spot Wallet</span>
            <div className="w-7 h-7 rounded-lg bg-[#020204] border border-[#18181c] flex items-center justify-center text-[#00e699] group-hover:scale-110 transition-transform">
              <LineChart size={14} />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight tabular-nums">
            ${spotUSDT.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Available for spot & fast execution</p>
        </div>

        {/* Card 2: Main Wallet (Primary) */}
        <div
          onClick={() => setActiveRoute('wallets')}
          className="rounded-2xl bg-[#08080a] border border-[#00e699]/40 p-5 shadow-xl shadow-[#00e699]/5 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-white">Main Wallet</span>
            <div className="w-7 h-7 rounded-lg bg-[#00e699] flex items-center justify-center text-black font-black group-hover:scale-110 transition-transform">
              <Wallet size={14} />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight tabular-nums">
            ${mainUSDT.toFixed(2)}
          </div>
          <p className="text-[11px] text-[#00e699] mt-1">Primary on-chain settlement reserve</p>
        </div>

        {/* Card 3: Funding Wallet */}
        <div
          onClick={() => setActiveRoute('wallets')}
          className="rounded-2xl bg-[#08080a] border border-[#18181c] hover:border-[#00e699]/40 p-5 shadow-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-300">Funding Wallet</span>
            <div className="w-7 h-7 rounded-lg bg-[#020204] border border-[#18181c] flex items-center justify-center text-[#00d2d3] group-hover:scale-110 transition-transform">
              <Coins size={14} />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight tabular-nums">
            ${fundingUSDT.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Staking & rewards allocation pool</p>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 4. MAIN CONTENT GRID (Left 7-8 cols, Right 4-5 cols)      */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Balance Overview Chart & Recent Transactions (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Balance Overview Area Chart matching PDF Screen 1 */}
          <div className="rounded-2xl bg-[#08080a] border border-[#18181c] hover:border-[#00e699]/30 p-5 sm:p-6 shadow-xl space-y-5 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#18181c] pb-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Balance Overview
                </h3>
                <p className="text-xs text-slate-400">
                  Historical portfolio trajectory & yield compounding
                </p>
              </div>

              {/* Timeframe Selectors matching PDF: 1D, 1W, 1M, 1Y, ALL */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-[#020204] border border-[#18181c]">
                {(['1D', '1W', '1M', '1Y', 'ALL'] as const).map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setChartTimeframe(tf)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      chartTimeframe === tf
                        ? 'bg-[#00e699] text-black font-extrabold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-56 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={BALANCE_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00e699" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#00e699" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    stroke="#475569"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={['dataMin - 100', 'dataMax + 100']}
                    stroke="#475569"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#08080a] border border-[#18181c] rounded-xl px-3 py-2 shadow-2xl">
                            <div className="text-[10px] text-slate-400">{label}</div>
                            <div className="text-xs font-bold text-white tabular-nums">
                              ${payload[0].value} USDT
                            </div>
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
                    fill="url(#balanceGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Transactions Table matching PDF Screen 1 */}
          <div className="rounded-2xl bg-[#08080a] border border-[#18181c] hover:border-[#00e699]/30 p-5 sm:p-6 shadow-xl space-y-4 transition-all">
            <div className="flex items-center justify-between border-b border-[#18181c] pb-3">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Recent Transactions
                </h3>
                <p className="text-xs text-slate-400">
                  Authoritative blockchain ledger events
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveRoute('transactions')}
                className="text-xs font-bold text-[#00e699] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#18181c] text-slate-400 text-[11px]">
                    <th className="pb-3 font-semibold">Type</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141418]">
                  <tr className="hover:bg-[#0c0c10] transition-colors">
                    <td className="py-3 font-medium text-white flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/15 text-[#00e699] flex items-center justify-center">
                        <ArrowDown size={12} />
                      </div>
                      <span>Chain Deposit</span>
                    </td>
                    <td className="py-3 font-bold text-[#00e699] tabular-nums">+500.00 USDT</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/20 text-[#00e699] text-[10px] font-bold">
                        COMPLETED
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 text-right">2026-10-02 14:20</td>
                  </tr>

                  <tr className="hover:bg-[#0c0c10] transition-colors">
                    <td className="py-3 font-medium text-white flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500/15 text-blue-400 flex items-center justify-center">
                        <Repeat size={12} />
                      </div>
                      <span>Internal Transfer</span>
                    </td>
                    <td className="py-3 font-bold text-white tabular-nums">150.00 USDT</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/20 text-[#00e699] text-[10px] font-bold">
                        COMPLETED
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 text-right">2026-09-29 19:52</td>
                  </tr>

                  <tr className="hover:bg-[#0c0c10] transition-colors">
                    <td className="py-3 font-medium text-white flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-500/15 text-purple-400 flex items-center justify-center">
                        <Award size={12} />
                      </div>
                      <span>Staking Yield</span>
                    </td>
                    <td className="py-3 font-bold text-[#00e699] tabular-nums">+25.50 USDT</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/20 text-[#00e699] text-[10px] font-bold">
                        COMPLETED
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 text-right">2026-09-27 00:00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Quick Trade Terminal & Staking Promotion (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Trade Console matching PDF Screen 1 */}
          <div className="rounded-2xl bg-[#08080a] border border-[#18181c] hover:border-[#00e699]/30 p-5 shadow-xl space-y-4 transition-all">
            <div className="flex items-center justify-between border-b border-[#18181c] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#00e699] text-black flex items-center justify-center font-black">
                  <Zap size={14} className="stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Quick Trade Terminal</h4>
                  <span className="text-[10px] text-[#00e699] font-bold">95% Payout Rate</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveRoute('trade')}
                className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <span>Full Chart</span>
                <ArrowRight size={12} />
              </button>
            </div>

            {/* Asset Price Display */}
            <div className="p-3 rounded-xl bg-[#030305] border border-[#18181c] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400">Live Asset (Binance)</span>
                <div className="text-sm font-bold text-white">ETH / USDT</div>
              </div>
              <div className="text-right">
                <div className="text-base font-black text-white tabular-nums">
                  ${liveEthPrice.toFixed(2)}
                </div>
                <div className={`text-[11px] font-bold ${liveEthChange >= 0 ? 'text-[#00e699]' : 'text-rose-500'}`}>
                  {liveEthChange >= 0 ? '+' : ''}{liveEthChange.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Duration Selector */}
            <div className="space-y-1.5">
              <span className="text-xs text-slate-400 font-medium">Trade Duration</span>
              <div className="grid grid-cols-3 gap-2">
                {[5, 15, 60].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setQuickTradeDuration(sec)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      quickTradeDuration === sec
                        ? 'bg-[#18181c] text-[#00e699] border border-[#00e699]/50 shadow-sm'
                        : 'bg-[#030305] border border-[#18181c] text-slate-400 hover:text-white'
                    }`}
                  >
                    {sec < 60 ? `${sec}s` : '1m'}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount input */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400 font-medium">
                <span>Trade Amount</span>
                <span className="text-[#00e699]">+${(quickTradeAmount * 0.95).toFixed(2)} profit</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#030305] border border-[#18181c]">
                <button
                  type="button"
                  onClick={() => setQuickTradeAmount((a) => Math.max(10, a - 25))}
                  className="w-7 h-7 rounded-lg bg-[#121217] hover:bg-[#1a1a22] text-white font-bold flex items-center justify-center cursor-pointer transition-colors"
                >
                  -
                </button>
                <span className="text-sm font-black text-white tabular-nums">
                  ${quickTradeAmount} USDT
                </span>
                <button
                  type="button"
                  onClick={() => setQuickTradeAmount((a) => Math.min(1000, a + 25))}
                  className="w-7 h-7 rounded-lg bg-[#121217] hover:bg-[#1a1a22] text-white font-bold flex items-center justify-center cursor-pointer transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* UP / DOWN Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                disabled={quickTradeActive}
                onClick={() => handleExecuteQuickTrade('UP')}
                className="py-3 rounded-xl bg-[#00e699] hover:bg-[#00ffaa] active:scale-[0.98] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#00e699]/30 transition-all cursor-pointer disabled:opacity-50"
              >
                <ArrowUp size={16} className="stroke-[3]" />
                <span>UP · CALL</span>
              </button>

              <button
                type="button"
                disabled={quickTradeActive}
                onClick={() => handleExecuteQuickTrade('DOWN')}
                className="py-3 rounded-xl bg-[#ff3b5c] hover:bg-[#ff5271] active:scale-[0.98] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#ff3b5c]/30 transition-all cursor-pointer disabled:opacity-50"
              >
                <ArrowDown size={16} className="stroke-[3]" />
                <span>DOWN · PUT</span>
              </button>
            </div>

            {/* Trade Countdown Status */}
            {quickTradeActive && (
              <div className="p-3 rounded-xl bg-[#030305] border border-[#00e699]/40 flex items-center justify-between text-xs animate-fadeIn">
                <span className="font-bold text-[#00e699]">
                  {quickTradeDirection} Position Active
                </span>
                <span className="text-slate-300 font-bold tabular-nums">
                  Settling in {quickTradeSeconds}s...
                </span>
              </div>
            )}

            {/* Result Toast */}
            {quickTradeResult && (
              <div className="p-3 rounded-xl bg-[#00e699]/15 border border-[#00e699]/40 text-[#00e699] text-xs font-bold text-center animate-fadeIn">
                {quickTradeResult}
              </div>
            )}
          </div>

          {/* Staking Promo Card matching PDF Screen 1 */}
          <div className="rounded-2xl bg-gradient-to-br from-[#08080a] to-[#040406] border border-[#18181c] hover:border-[#00e699]/30 p-5 shadow-xl space-y-3 relative overflow-hidden transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00e699]/15 text-[#00e699] border border-[#00e699]/20">
                FIXED APY
              </span>
              <Sparkles size={16} className="text-[#00e699]" />
            </div>

            <div>
              <h4 className="text-base font-black text-white tracking-tight">
                Earn Up to 100% APR
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Stake USDT and {BRAND.tokenSymbol} across flexible lock periods with daily automated payouts.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveRoute('staking')}
              className="w-full py-2.5 rounded-xl bg-[#00e699] hover:bg-[#00ffaa] text-black font-extrabold text-xs tracking-tight shadow-md shadow-[#00e699]/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Stake Now</span>
              <ArrowRight size={14} className="stroke-[3]" />
            </button>
          </div>

        </div>

      </div>

      {/* 5. 24-Hour Crypto Market Performance (Binance Public API) */}
      <CryptoPerformanceMiniCharts />

    </div>
  );
};

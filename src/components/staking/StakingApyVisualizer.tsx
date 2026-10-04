/*
 FILE: src/components/staking/StakingApyVisualizer.tsx

 PURPOSE:
 High-Fidelity, Real-Time APY Percentage Visualization & Dynamic Staking Yield Simulator using Recharts.
 Engineered to provide enterprise-grade financial data density matching Olymp Trade and institutional DeFi terminals:
 - Live dynamic APY % curve with realistic validator revenue fluctuation
 - Multi-tier tenure selector (Flexible, 90D, 365D, 730D, 1825D)
 - Compound frequency selector (Daily Compound APY, Weekly, Simple APR)
 - Dual visual modes: Dynamic APY % Trend, Cumulative Capital Growth ($ / Native), and Daily Rewards Bar
 - Interactive Stake Calculator slider linked directly to real-time Recharts yield projections
 - Pitch Black OLED (#000000) styling with Olymp Trade signature neon emerald (#00e699) accents
*/

import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { BRAND } from '../../config/brand';
import {
  Activity,
  ArrowUpRight,
  Calculator,
  CheckCircle2,
  Clock,
  Coins,
  Flame,
  Layers,
  Percent,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';

export type StakingTimeframe = '1M' | '3M' | '6M' | '1Y' | '5Y';
export type CompoundMode = 'daily' | 'weekly' | 'simple';
export type ChartMetric = 'apy' | 'capital' | 'rewards';

interface StakingApyVisualizerProps {
  initialStakeAmount?: number;
  onSelectPlan?: (planId: string) => void;
  className?: string;
}

export const StakingApyVisualizer: React.FC<StakingApyVisualizerProps> = ({
  initialStakeAmount = 1000,
  onSelectPlan,
  className = '',
}) => {
  // Navigation & View Controls
  const [timeframe, setTimeframe] = useState<StakingTimeframe>('1Y');
  const [selectedTier, setSelectedTier] = useState<number>(1825); // 1825 Days = 100% APR (VIP)
  const [compoundMode, setCompoundMode] = useState<CompoundMode>('daily');
  const [chartMetric, setChartMetric] = useState<ChartMetric>('apy');
  const [stakeAmount, setStakeAmount] = useState<number>(initialStakeAmount);

  // Real-time ticking engine for APY & TVL
  const [liveApyDelta, setLiveApyDelta] = useState<number>(0);
  const [isTickUp, setIsTickUp] = useState<boolean>(true);
  const [tvl, setTvl] = useState<number>(142854920);
  const [epochSeconds, setEpochSeconds] = useState<number>(13284); // 03h 41m 24s countdown

  // Live real-time APY pulse every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() * 0.12 - 0.05); // slight ± fluctuation
      setLiveApyDelta((prev) => {
        const next = Math.max(-0.8, Math.min(0.8, prev + delta));
        setIsTickUp(delta >= 0);
        return +next.toFixed(2);
      });
      // slight TVL increment reflecting block rewards
      setTvl((prev) => prev + Math.floor(Math.random() * 140 - 40));
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  // Epoch countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setEpochSeconds((prev) => (prev > 0 ? prev - 1 : 86400));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format epoch countdown
  const formattedEpoch = useMemo(() => {
    const h = Math.floor(epochSeconds / 3600);
    const m = Math.floor((epochSeconds % 3600) / 60);
    const s = epochSeconds % 60;
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  }, [epochSeconds]);

  // Base APR by tier
  const tierConfig: Record<number, { name: string; baseApr: number; minStake: number; bonusMultiplier: number }> = {
    90: { name: 'Quarterly Lock (90D)', baseApr: 12.0, minStake: 10, bonusMultiplier: 1.0 },
    365: { name: 'Annual Vault (365D)', baseApr: 25.0, minStake: 50, bonusMultiplier: 1.15 },
    730: { name: 'Biannual Vault (730D)', baseApr: 45.0, minStake: 100, bonusMultiplier: 1.35 },
    1825: { name: 'Institutional Sovereign (1825D)', baseApr: 100.0, minStake: 250, bonusMultiplier: 1.65 },
  };

  const currentTier = tierConfig[selectedTier] || tierConfig[1825];

  // Calculated Effective APY based on compounding
  const effectiveApy = useMemo(() => {
    const apr = currentTier.baseApr;
    let apyVal = apr;
    if (compoundMode === 'daily') {
      // APY = (1 + r/n)^n - 1
      const r = apr / 100;
      apyVal = (Math.pow(1 + r / 365, 365) - 1) * 100;
    } else if (compoundMode === 'weekly') {
      const r = apr / 100;
      apyVal = (Math.pow(1 + r / 52, 52) - 1) * 100;
    }
    return +(apyVal + liveApyDelta).toFixed(2);
  }, [currentTier, compoundMode, liveApyDelta]);

  // Calculated Financial Returns
  const dailyRewardRate = (effectiveApy / 365);
  const dailyReturnUSD = +((stakeAmount * (dailyRewardRate / 100))).toFixed(2);
  const monthlyReturnUSD = +(dailyReturnUSD * 30.416).toFixed(2);
  const annualReturnUSD = +((stakeAmount * (effectiveApy / 100))).toFixed(2);
  const totalMaturityReturnUSD = +(annualReturnUSD * (selectedTier / 365)).toFixed(2);
  const totalPayoutAtMaturity = +(stakeAmount + totalMaturityReturnUSD).toFixed(2);

  // Generate historical & projected time-series data for Recharts
  const chartData = useMemo(() => {
    const points: {
      label: string;
      apy: number;
      baseApr: number;
      benchmarkApy: number; // e.g. Ethereum/Standard DeFi staking 3.8%
      capital: number;
      projectedYield: number;
      dailyReward: number;
    }[] = [];

    let steps = 14;
    let stepDays = 2;
    if (timeframe === '1M') {
      steps = 15;
      stepDays = 2;
    } else if (timeframe === '3M') {
      steps = 18;
      stepDays = 5;
    } else if (timeframe === '6M') {
      steps = 20;
      stepDays = 9;
    } else if (timeframe === '1Y') {
      steps = 24;
      stepDays = 15;
    } else if (timeframe === '5Y') {
      steps = 30;
      stepDays = 60;
    }

    const baseApr = currentTier.baseApr;
    const r = baseApr / 100;

    for (let i = 0; i <= steps; i++) {
      const day = i * stepDays;
      // Slight smooth sine-wave oscillation to mimic real on-chain transaction gas reward shifts
      const wave = Math.sin((i / steps) * Math.PI * 2.5) * 1.8 + Math.cos(i * 0.8) * 0.9;
      const currentPointApy = Math.max(
        baseApr * 0.9,
        +(effectiveApy + (i === steps ? liveApyDelta : wave)).toFixed(2)
      );

      // Compounded Capital Growth formula
      let currentCapital = stakeAmount;
      if (compoundMode === 'daily') {
        currentCapital = stakeAmount * Math.pow(1 + r / 365, day);
      } else if (compoundMode === 'weekly') {
        currentCapital = stakeAmount * Math.pow(1 + r / 52, day / 7);
      } else {
        currentCapital = stakeAmount * (1 + (r * day) / 365);
      }

      const yieldEarned = Math.max(0, currentCapital - stakeAmount);
      const dayReward = +((currentCapital * (currentPointApy / 365 / 100))).toFixed(2);

      let label = `Day ${day}`;
      if (timeframe === '1Y') {
        const monthNum = Math.floor(day / 30);
        label = `M${monthNum + 1}`;
      } else if (timeframe === '5Y') {
        const yearFraction = (day / 365).toFixed(1);
        label = `Y${yearFraction}`;
      }

      points.push({
        label,
        apy: currentPointApy,
        baseApr,
        benchmarkApy: 4.12, // Baseline benchmark reference
        capital: Math.round(currentCapital),
        projectedYield: Math.round(yieldEarned),
        dailyReward: dayReward,
      });
    }

    return points;
  }, [timeframe, currentTier, effectiveApy, liveApyDelta, compoundMode, stakeAmount]);

  // Quick Preset Stake Buttons
  const presetAmounts = [250, 500, 1000, 2500, 5000, 10000];

  return (
    <div
      className={`rounded-2xl bg-[#08080a] border border-[#18181c] p-4 sm:p-6 shadow-2xl space-y-6 text-slate-100 ${className}`}
    >
      {/* 1. Header & Live Protocol Metrics Strip (Extreme Financial Data Density) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#18181c] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#00e699]/15 border border-[#00e699]/30 flex items-center justify-center text-[#00e699]">
              <TrendingUp size={18} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight uppercase">
                  Real-Time APY Yield Matrix
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#00e699]/20 border border-[#00e699]/40 text-[#00e699] text-[10px] font-mono font-bold flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e699]" />
                  LIVE ORACLE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                On-Chain Compound Interest Engine with Instant Auto-Restaking
              </p>
            </div>
          </div>
        </div>

        {/* Live APY Readout Badge */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <div className="px-3.5 py-2 rounded-xl bg-[#020204] border border-[#18181c] flex items-center gap-3">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Live Effective APY:
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-[#00e699] font-sans tabular-nums tracking-tight">
                {effectiveApy.toFixed(2)}%
              </span>
              <span
                className={`text-[11px] font-sans tabular-nums font-bold flex items-center ${
                  isTickUp ? 'text-[#00e699]' : 'text-[#ff3b5c]'
                }`}
              >
                {isTickUp ? '+' : ''}
                {liveApyDelta >= 0 ? `+${liveApyDelta}%` : `${liveApyDelta}%`}
              </span>
            </div>
          </div>

          <div className="hidden sm:flex px-3.5 py-2 rounded-xl bg-[#020204] border border-[#18181c] flex-col">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-sans">
              Next Epoch Distribution
            </span>
            <span className="text-xs font-bold text-white font-sans tabular-nums flex items-center gap-1.5">
              <Clock size={12} className="text-[#00e699]" />
              {formattedEpoch}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Institutional Financial Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#020204] border border-[#18181c] space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-sans">
            Total Value Locked (TVL)
          </span>
          <div className="text-sm sm:text-base font-black text-white font-sans tabular-nums">
            ${(tvl).toLocaleString()}{' '}
            <span className="text-[10px] font-bold text-[#00e699]">USD</span>
          </div>
          <p className="text-[10px] text-slate-500 font-sans tabular-nums">+4.2% Net Inflow (7D)</p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#020204] border border-[#18181c] space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-sans">
            Base Protocol APR
          </span>
          <div className="text-sm sm:text-base font-black text-white font-sans tabular-nums">
            {currentTier.baseApr.toFixed(2)}%
          </div>
          <p className="text-[10px] text-slate-500 font-sans">Contract Guaranteed Floor</p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#020204] border border-[#18181c] space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-sans">
            Daily Reward Rate
          </span>
          <div className="text-sm sm:text-base font-black text-[#00e699] font-sans tabular-nums">
            +{dailyRewardRate.toFixed(4)}% / Day
          </div>
          <p className="text-[10px] text-slate-500 font-sans">Calculated on compound basis</p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#020204] border border-[#18181c] space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-sans">
            Slashing Protection
          </span>
          <div className="text-sm sm:text-base font-black text-emerald-400 font-sans flex items-center gap-1">
            <ShieldCheck size={14} className="text-[#00e699]" />
            100% Reserve
          </div>
          <p className="text-[10px] text-slate-500 font-sans">Sovereign Treasury Insured</p>
        </div>
      </div>

      {/* 3. Interactive Chart Controls & View Switchers */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Tier Selector Buttons (Screenshot 35 plans) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#020204] border border-[#18181c]">
          {[
            { days: 90, label: '90D (12%)' },
            { days: 365, label: '365D (25%)' },
            { days: 730, label: '730D (45%)' },
            { days: 1825, label: '1825D (100% APR VIP)' },
          ].map((tier) => (
            <button
              key={tier.days}
              type="button"
              onClick={() => setSelectedTier(tier.days)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedTier === tier.days
                  ? 'bg-[#00e699] text-black shadow-md shadow-[#00e699]/30'
                  : 'text-slate-400 hover:text-white hover:bg-[#121216]'
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>

        {/* Metric Selector (APY % vs Capital Growth vs Rewards) */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#020204] border border-[#18181c]">
          {[
            { id: 'apy', label: 'APY % Curve' },
            { id: 'capital', label: 'Capital Growth ($)' },
            { id: 'rewards', label: 'Daily Accrual ($)' },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setChartMetric(m.id as ChartMetric)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                chartMetric === m.id
                  ? 'bg-[#18181c] text-[#00e699] font-bold border border-[#26262e]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#020204] border border-[#18181c]">
          {(['1M', '3M', '6M', '1Y', '5Y'] as StakingTimeframe[]).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                timeframe === tf
                  ? 'bg-[#00e699] text-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* 4. The Recharts APY Curve & Financial Data Canvas */}
      <div className="h-[280px] sm:h-[340px] w-full rounded-xl bg-[#020204] border border-[#18181c] p-3 sm:p-4 relative">
        {/* Subtle Legend Bar inside canvas */}
        <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-4 text-[11px] font-mono bg-[#08080a]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#18181c]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00e699]" />
            <span className="text-slate-300">
              {chartMetric === 'apy'
                ? 'Dynamic APY %'
                : chartMetric === 'capital'
                ? 'Total Balance ($)'
                : 'Projected Reward ($)'}
            </span>
          </div>
          {chartMetric === 'apy' && (
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="w-2.5 h-0.5 bg-slate-500" />
              <span>Industry Benchmark (4.1%)</span>
            </div>
          )}
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 15, right: 15, left: -10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="olympApyAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00e699" stopOpacity={0.35} />
                <stop offset="60%" stopColor="#00e699" stopOpacity={0.08} />
                <stop offset="100%" stopColor="#00e699" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="olympBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00ffaa" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#00e699" stopOpacity={0.2} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="2 3"
              stroke="#141418"
              vertical={false}
            />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: '#18181c' }}
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
            />

            <YAxis
              tickLine={false}
              axisLine={{ stroke: '#18181c' }}
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
              domain={
                chartMetric === 'apy'
                  ? [0, (dataMax: number) => Math.ceil(dataMax * 1.15)]
                  : ['auto', 'auto']
              }
              tickFormatter={(val) => {
                if (chartMetric === 'apy') return `${val}%`;
                if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
                return `$${val}`;
              }}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-xl bg-[#08080a]/95 backdrop-blur-xl border border-[#222228] p-3 text-xs font-mono space-y-1.5 shadow-2xl">
                      <div className="text-slate-400 font-bold border-b border-[#18181c] pb-1">
                        Timeline: <span className="text-white">{data.label}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-slate-400">Effective APY:</span>
                        <span className="font-black text-[#00e699]">
                          {data.apy.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-slate-400">Total Portfolio Value:</span>
                        <span className="font-bold text-white">
                          ${data.capital.toLocaleString()} USDT
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-slate-400">Cumulative Yield:</span>
                        <span className="font-bold text-emerald-400">
                          +${data.projectedYield.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-slate-400">Daily Accrual:</span>
                        <span className="font-bold text-cyan-400">
                          ${data.dailyReward.toFixed(2)} / day
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Reference Line for Base APR floor */}
            {chartMetric === 'apy' && (
              <ReferenceLine
                y={currentTier.baseApr}
                stroke="#00e699"
                strokeDasharray="3 3"
                strokeOpacity={0.4}
                label={{
                  value: `Contract Floor: ${currentTier.baseApr}%`,
                  fill: '#00e699',
                  fontSize: 10,
                  position: 'insideBottomRight',
                }}
              />
            )}

            {/* Benchmark ETH/DeFi line for APY mode */}
            {chartMetric === 'apy' && (
              <Line
                type="monotone"
                dataKey="benchmarkApy"
                stroke="#64748b"
                strokeWidth={1.5}
                dot={false}
                strokeDasharray="4 4"
              />
            )}

            {/* Dynamic APY Series */}
            {chartMetric === 'apy' && (
              <Area
                type="monotone"
                dataKey="apy"
                stroke="#00e699"
                strokeWidth={2.5}
                fill="url(#olympApyAreaGrad)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: '#00e699',
                  stroke: '#08080a',
                  strokeWidth: 2,
                }}
              />
            )}

            {/* Capital Growth Mode */}
            {chartMetric === 'capital' && (
              <Area
                type="monotone"
                dataKey="capital"
                stroke="#00e699"
                strokeWidth={2.5}
                fill="url(#olympApyAreaGrad)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: '#00ffaa',
                  stroke: '#08080a',
                  strokeWidth: 2,
                }}
              />
            )}

            {/* Daily Rewards Bar Mode */}
            {chartMetric === 'rewards' && (
              <Bar
                dataKey="dailyReward"
                fill="url(#olympBarGrad)"
                radius={[4, 4, 0, 0]}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* 5. Compound Strategy Selector & Interactive Yield Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1">
        {/* Left: Interactive Stake Slider & Amount Presets */}
        <div className="lg:col-span-7 p-4 sm:p-5 rounded-xl bg-[#020204] border border-[#18181c] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator size={16} className="text-[#00e699]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Interactive Yield Simulator
              </h3>
            </div>
            {/* Compound Frequency Selector */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#08080a] border border-[#18181c]">
              {[
                { id: 'daily', label: 'Daily Restake (Max APY)' },
                { id: 'weekly', label: 'Weekly' },
                { id: 'simple', label: 'Simple (APR)' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCompoundMode(c.id as CompoundMode)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                    compoundMode === c.id
                      ? 'bg-[#00e699] text-black font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amount input & Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Capital Commitment:</span>
              <div className="flex items-center gap-1.5 font-sans">
                <span className="text-lg font-black text-white tabular-nums">
                  ${stakeAmount.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-[#00e699]">
                  USDT / {BRAND.tokenSymbol}
                </span>
              </div>
            </div>

            <input
              type="range"
              min={currentTier.minStake}
              max={50000}
              step={50}
              value={stakeAmount}
              onChange={(e) => setStakeAmount(Number(e.target.value))}
              className="w-full h-1.5 bg-[#18181c] rounded-lg appearance-none cursor-pointer accent-[#00e699]"
            />

            {/* Quick Amount Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] text-slate-500 uppercase font-sans">
                Presets:
              </span>
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setStakeAmount(amt)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-sans tabular-nums transition-colors cursor-pointer ${
                    stakeAmount === amt
                      ? 'bg-[#18181c] text-[#00e699] font-bold border border-[#00e699]/40'
                      : 'bg-[#08080a] text-slate-400 hover:text-white border border-[#18181c]'
                  }`}
                >
                  ${amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Projected Financial Returns Card */}
        <div className="lg:col-span-5 p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#08080a] to-[#040406] border border-[#18181c] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">
              Projected Maturity Settlement ({selectedTier} Days)
            </span>

            <div className="space-y-2 border-b border-[#18181c] pb-3 text-xs font-sans tabular-nums">
              <div className="flex items-center justify-between text-slate-300">
                <span>Daily Payout:</span>
                <span className="font-bold text-[#00e699]">
                  +${dailyReturnUSD} USDT / day
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Monthly Payout:</span>
                <span className="font-bold text-emerald-400">
                  +${monthlyReturnUSD} USDT
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Net Maturity Profit:</span>
                <span className="font-bold text-[#00ffaa]">
                  +${totalMaturityReturnUSD.toLocaleString()} USDT
                </span>
              </div>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-sans block">
                  Total Projected Capital
                </span>
                <span className="text-xl sm:text-2xl font-black text-white font-sans tabular-nums">
                  ${totalPayoutAtMaturity.toLocaleString()}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase font-sans block">
                  ROI Multiplier
                </span>
                <span className="text-sm font-black text-[#00e699] font-sans tabular-nums">
                  +{((totalMaturityReturnUSD / (stakeAmount || 1)) * 100).toFixed(0)}% ROI
                </span>
              </div>
            </div>
          </div>

          {/* Action Button styled with Olymp Trade primary green */}
          <button
            type="button"
            onClick={() => onSelectPlan && onSelectPlan(String(selectedTier))}
            className="w-full py-3 px-4 rounded-xl bg-[#00e699] hover:bg-[#00ffaa] text-black font-extrabold text-xs tracking-tight shadow-lg shadow-[#00e699]/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <Sparkles size={14} className="stroke-[2.5]" />
            <span>Lock & Stake in {currentTier.name}</span>
            <ArrowUpRight size={14} className="stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};

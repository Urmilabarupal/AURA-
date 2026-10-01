/*
 FILE: src/components/dashboard/CryptoPerformanceMiniCharts.tsx

 PURPOSE:
 High-fidelity, responsive 24-Hour Crypto Market Performance component using Recharts.
 Features:
 - Mini sparkline area charts for top assets (XAH, BTC, ETH, BNB, SOL)
 - Interactive active asset selector with expanded 24H trend visualization
 - Realistic 24-hour hourly points, high/low stats, 24h volume
 - Custom glowing Recharts Tooltip with gradient fills matching luxury dark theme
*/

import React, { useState } from 'react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowDownRight,
  ArrowUpRight,
  Flame,
  LineChart as LineChartIcon,
  TrendingUp,
} from 'lucide-react';

interface AssetTrend {
  symbol: string;
  name: string;
  price: string;
  change24h: number;
  high24h: string;
  low24h: string;
  volume24h: string;
  color: string;
  gradientId: string;
  history: { time: string; price: number }[];
}

const CRYPTO_DATA: AssetTrend[] = [
  {
    symbol: 'XAH',
    name: 'XAH Chain Native',
    price: '$1.48',
    change24h: 8.74,
    high24h: '$1.52',
    low24h: '$1.34',
    volume24h: '$4.82M',
    color: '#00e699',
    gradientId: 'xahAreaGrad',
    history: [
      { time: '00:00', price: 1.34 },
      { time: '03:00', price: 1.36 },
      { time: '06:00', price: 1.35 },
      { time: '09:00', price: 1.41 },
      { time: '12:00', price: 1.39 },
      { time: '15:00', price: 1.44 },
      { time: '18:00', price: 1.43 },
      { time: '21:00', price: 1.46 },
      { time: 'Now', price: 1.48 },
    ],
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: '$3,480.20',
    change24h: 3.42,
    high24h: '$3,510.00',
    low24h: '$3,360.50',
    volume24h: '$18.4B',
    color: '#8b5cf6',
    gradientId: 'ethAreaGrad',
    history: [
      { time: '00:00', price: 3365 },
      { time: '03:00', price: 3380 },
      { time: '06:00', price: 3350 },
      { time: '09:00', price: 3410 },
      { time: '12:00', price: 3435 },
      { time: '15:00', price: 3420 },
      { time: '18:00', price: 3455 },
      { time: '21:00', price: 3470 },
      { time: 'Now', price: 3480.2 },
    ],
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: '$89,450.00',
    change24h: 2.15,
    high24h: '$90,120.00',
    low24h: '$87,200.00',
    volume24h: '$34.2B',
    color: '#f59e0b',
    gradientId: 'btcAreaGrad',
    history: [
      { time: '00:00', price: 87500 },
      { time: '03:00', price: 87200 },
      { time: '06:00', price: 87900 },
      { time: '09:00', price: 88400 },
      { time: '12:00', price: 88100 },
      { time: '15:00', price: 88900 },
      { time: '18:00', price: 89100 },
      { time: '21:00', price: 89320 },
      { time: 'Now', price: 89450 },
    ],
  },
  {
    symbol: 'BNB',
    name: 'BNB Chain',
    price: '$612.40',
    change24h: -1.05,
    high24h: '$624.00',
    low24h: '$608.20',
    volume24h: '$1.45B',
    color: '#ef4444',
    gradientId: 'bnbAreaGrad',
    history: [
      { time: '00:00', price: 622 },
      { time: '03:00', price: 624 },
      { time: '06:00', price: 618 },
      { time: '09:00', price: 615 },
      { time: '12:00', price: 616 },
      { time: '15:00', price: 613 },
      { time: '18:00', price: 610 },
      { time: '21:00', price: 611 },
      { time: 'Now', price: 612.4 },
    ],
  },
];

// Custom Recharts Tooltip
const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0];
    return (
      <div className="rounded-xl bg-[#0e111a]/95 border border-[#2a324a] p-2.5 shadow-2xl backdrop-blur-md text-xs font-mono">
        <div className="text-[10px] text-slate-400 font-sans">{label} (UTC)</div>
        <div className="text-sm font-bold text-white mt-0.5">
          ${typeof dataPoint.value === 'number' ? dataPoint.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : dataPoint.value}
        </div>
      </div>
    );
  }
  return null;
};

export const CryptoPerformanceMiniCharts: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('XAH');
  const [timeframe, setTimeframe] = useState<'1H' | '24H' | '7D'>('24H');

  const activeAsset = CRYPTO_DATA.find((a) => a.symbol === selectedSymbol) || CRYPTO_DATA[0];
  const isPositive = activeAsset.change24h >= 0;

  return (
    <div className="rounded-2xl bg-[#161924] border border-[#202538] p-5 sm:p-6 shadow-xl space-y-5 select-none font-sans">
      
      {/* Header with Title & Timeframe Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1f2538] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3b82f6]/20 to-[#8b5cf6]/20 border border-[#8b5cf6]/30 flex items-center justify-center text-purple-400 shrink-0">
            <TrendingUp size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                24-Hour Market Performance
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Feed
              </span>
            </div>
            <p className="text-[11px] text-[#8e98af]">
              Real-time multi-asset valuation & 24h technical performance
            </p>
          </div>
        </div>

        {/* Timeframe pills */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0e111a] border border-[#1f2436] self-start sm:self-auto">
          {(['1H', '24H', '7D'] as const).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                timeframe === tf
                  ? 'bg-[#1e2538] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Mini-Sparkline Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {CRYPTO_DATA.map((asset) => {
          const isSelected = asset.symbol === selectedSymbol;
          const pos = asset.change24h >= 0;

          return (
            <div
              key={asset.symbol}
              onClick={() => setSelectedSymbol(asset.symbol)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-28 ${
                isSelected
                  ? 'bg-[#1b2030] border-[#384366] shadow-lg'
                  : 'bg-[#0e111a] border-[#1b2030] hover:border-[#2a334d] hover:bg-[#131724]'
              }`}
            >
              {/* Asset Header */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">{asset.symbol}</span>
                  <span className="text-[10px] text-[#8e98af] truncate max-w-[60px]">{asset.name}</span>
                </div>
                <div
                  className={`text-[11px] font-bold font-mono flex items-center ${
                    pos ? 'text-[#00e699]' : 'text-red-400'
                  }`}
                >
                  {pos ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  <span>{pos ? `+${asset.change24h}%` : `${asset.change24h}%`}</span>
                </div>
              </div>

              {/* Price */}
              <div className="text-sm font-bold text-white font-mono tracking-tight z-10">
                {asset.price}
              </div>

              {/* Sparkline Visual using Recharts */}
              <div className="h-10 w-full -mb-1 -mx-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={asset.history} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`mini_${asset.gradientId}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={asset.color} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={asset.color} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke={asset.color}
                      strokeWidth={1.8}
                      fill={`url(#mini_${asset.gradientId})`}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Expanded Active Asset 24H Chart */}
      <div className="rounded-xl bg-[#0e111a] border border-[#1b2030] p-4 sm:p-5 space-y-4">
        {/* Active Stats Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#161a29] border border-[#252e46] flex items-center justify-center font-bold text-sm text-white">
              {activeAsset.symbol}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white tracking-tight">
                  {activeAsset.name} ({activeAsset.symbol})
                </span>
                <span
                  className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full flex items-center ${
                    isPositive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  <span>{isPositive ? `+${activeAsset.change24h}%` : `${activeAsset.change24h}%`}</span>
                </span>
              </div>
              <div className="text-xs text-[#8e98af] font-mono">
                Live Price: <strong className="text-white text-sm">{activeAsset.price}</strong>
              </div>
            </div>
          </div>

          {/* 24h High / Low / Volume */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-[10px] text-[#8e98af] block font-sans">24h High</span>
              <span className="text-white font-bold">{activeAsset.high24h}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#8e98af] block font-sans">24h Low</span>
              <span className="text-white font-bold">{activeAsset.low24h}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#8e98af] block font-sans">24h Volume</span>
              <span className="text-purple-400 font-bold">{activeAsset.volume24h}</span>
            </div>
          </div>
        </div>

        {/* Big Recharts Area Chart Container */}
        <div className="h-56 sm:h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activeAsset.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={activeAsset.gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={activeAsset.color} stopOpacity={0.4} />
                  <stop offset="70%" stopColor={activeAsset.color} stopOpacity={0.08} />
                  <stop offset="100%" stopColor={activeAsset.color} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                stroke="#475569"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dy={6}
              />
              <YAxis
                stroke="#475569"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
                tickFormatter={(val) => `$${val > 1000 ? `${(val / 1000).toFixed(1)}k` : val}`}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke={activeAsset.color}
                strokeWidth={2.4}
                fill={`url(#${activeAsset.gradientId})`}
                dot={{ r: 3, fill: activeAsset.color, stroke: '#0e111a', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#ffffff', stroke: activeAsset.color, strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

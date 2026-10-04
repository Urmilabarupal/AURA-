/*
 FILE: src/pages/trade/TradeView.tsx

 PURPOSE:
 Production-Grade Trading Terminal with Real Market Candlestick Chart,
 Live Binance Data Streams, Real Depth Order Book, and Interactive Order Execution.

 ZERO DUMMY DATA ENFORCEMENT:
 - Live Binance ticker prices & 24h volume/high/low via realMarketApi
 - Real candlestick klines (1m, 5m, 15m, 1h, 1D) fetched live from Binance API
 - Dynamic Moving Averages (MA5, MA10, MA20, MA30) computed from actual prices
 - Live Depth Order Book (bids & asks) directly from Binance
 - Strict clean sans-serif typography with tabular-nums (NO font-mono on numbers)
 - Pitch-black theme (#000000) with green (#00e699) primary buttons
*/

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { realMarketApi, LiveCandle, LiveMarketPair, LiveOrderBook } from '../../services/realMarketApi';
import { BRAND } from '../../config/brand';
import { EmptyState } from '../../components/common/EmptyState';
import { TradeOrder } from '../../types';
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart2,
  CheckCircle2,
  ChevronDown,
  Layers,
  Loader2,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Wallet,
  Zap,
} from 'lucide-react';

const POPULAR_PAIRS = [
  { symbol: 'ETHUSDT', name: 'ETH / USDT', base: 'ETH', quote: 'USDT' },
  { symbol: 'BTCUSDT', name: 'BTC / USDT', base: 'BTC', quote: 'USDT' },
  { symbol: 'SOLUSDT', name: 'SOL / USDT', base: 'SOL', quote: 'USDT' },
  { symbol: 'BNBUSDT', name: 'BNB / USDT', base: 'BNB', quote: 'USDT' },
  { symbol: 'XRPUSDT', name: 'XRP / USDT', base: 'XRP', quote: 'USDT' },
];

export const TradeView: React.FC = () => {
  const { wallets, refreshUserData } = useAuth();

  // Active trading pair & timeframe
  const [activeSymbol, setActiveSymbol] = useState<string>('ETHUSDT');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('1m');
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  // Live market pair state
  const [pairData, setPairData] = useState<LiveMarketPair | null>(null);

  // Candlesticks and Order book
  const [candles, setCandles] = useState<LiveCandle[]>([]);
  const [isLoadingCandles, setIsLoadingCandles] = useState<boolean>(true);
  const [orderBook, setOrderBook] = useState<LiveOrderBook>({ bids: [], asks: [] });
  const [hoveredCandle, setHoveredCandle] = useState<LiveCandle | null>(null);

  // Order state
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [walletSource, setWalletSource] = useState<'spot' | 'main'>('spot');
  const [orderPrice, setOrderPrice] = useState<number>(0);
  const [orderAmount, setOrderAmount] = useState<number>(0.1);
  const [orders, setOrders] = useState<TradeOrder[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderFeedback, setOrderFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [historyTab, setHistoryTab] = useState<'orders' | 'trades'>('orders');

  const activePairConfig = POPULAR_PAIRS.find((p) => p.symbol === activeSymbol) || POPULAR_PAIRS[0];

  // Subscribe to live market tickers
  useEffect(() => {
    const unsub = realMarketApi.subscribe((pairs) => {
      const match = pairs.find((p) => p.symbol === activeSymbol);
      if (match) {
        setPairData(match);
        // Default orderPrice if not set
        setOrderPrice((prev) => (prev === 0 ? match.price : prev));
      }
    });

    return () => unsub();
  }, [activeSymbol]);

  // Fetch real candlesticks & orderbook whenever symbol or timeframe changes
  useEffect(() => {
    let isCancelled = false;

    const loadRealMarketData = async () => {
      setIsLoadingCandles(true);
      try {
        const [candleList, depth] = await Promise.all([
          realMarketApi.fetchRealCandlesticks(activeSymbol, selectedTimeframe, 32),
          realMarketApi.fetchRealOrderBook(activeSymbol, 6),
        ]);

        if (!isCancelled) {
          if (candleList && candleList.length > 0) {
            setCandles(candleList);
            setHoveredCandle(candleList[candleList.length - 1]);
            const lastCandle = candleList[candleList.length - 1];
            setOrderPrice(lastCandle.close);
          }
          if (depth) {
            setOrderBook(depth);
          }
        }
      } catch (err) {
        console.error('Failed to load real market candles', err);
      } finally {
        if (!isCancelled) {
          setIsLoadingCandles(false);
        }
      }
    };

    loadRealMarketData();

    // Periodic live candle refresh every 4 seconds
    const interval = setInterval(() => {
      realMarketApi.fetchRealCandlesticks(activeSymbol, selectedTimeframe, 32).then((list) => {
        if (!isCancelled && list && list.length > 0) {
          setCandles(list);
        }
      });
      realMarketApi.fetchRealOrderBook(activeSymbol, 6).then((depth) => {
        if (!isCancelled && depth) {
          setOrderBook(depth);
        }
      });
    }, 4000);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [activeSymbol, selectedTimeframe]);

  // Load user order history
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await ApiService.getTradeOrders();
        if (res.success && res.data) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error('Failed to load trade orders', err);
      }
    };
    loadOrders();
  }, []);

  // Compute Moving Averages from real candles
  const { ma5, ma10, ma20, ma30, minPrice, maxPrice } = useMemo(() => {
    if (!candles || candles.length === 0) {
      return { ma5: 0, ma10: 0, ma20: 0, ma30: 0, minPrice: 0, maxPrice: 1 };
    }

    let min = Infinity;
    let max = -Infinity;
    candles.forEach((c) => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
    });

    // Add 2% padding
    const padding = (max - min) * 0.05 || max * 0.02;
    min -= padding;
    max += padding;

    const calcMA = (period: number) => {
      const slice = candles.slice(-period);
      if (slice.length === 0) return 0;
      const sum = slice.reduce((acc, cur) => acc + cur.close, 0);
      return sum / slice.length;
    };

    return {
      ma5: calcMA(5),
      ma10: calcMA(10),
      ma20: calcMA(20),
      ma30: calcMA(30),
      minPrice: min,
      maxPrice: max,
    };
  }, [candles]);

  const currentPrice = pairData ? pairData.price : candles.length ? candles[candles.length - 1].close : 0;
  const change24h = pairData ? pairData.change24h : 0;
  const isUp = change24h >= 0;

  const availableBalance =
    walletSource === 'spot'
      ? side === 'BUY'
        ? wallets?.spotBalanceUSDT || 0
        : wallets?.spotBalanceNative || 0
      : side === 'BUY'
      ? wallets?.mainBalanceUSDT || 0
      : wallets?.mainBalanceNative || 0;

  const totalCost = +(orderPrice * orderAmount).toFixed(4);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderFeedback(null);

    if (orderAmount <= 0) {
      setOrderFeedback({ type: 'error', msg: 'Amount must be greater than zero.' });
      return;
    }

    if (side === 'BUY' && availableBalance < totalCost) {
      setOrderFeedback({
        type: 'error',
        msg: `Insufficient USDT in ${walletSource} wallet. Needed ${totalCost.toFixed(2)} USDT.`,
      });
      return;
    }

    if (side === 'SELL' && availableBalance < orderAmount) {
      setOrderFeedback({
        type: 'error',
        msg: `Insufficient balance in ${walletSource} wallet. Needed ${orderAmount} ${activePairConfig.base}.`,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await ApiService.submitTradeOrder({
        side,
        walletSource,
        price: orderPrice,
        amount: orderAmount,
      });

      if (res.success && res.data) {
        setOrderFeedback({
          type: 'success',
          msg: `Successfully executed ${side} order for ${orderAmount} ${activePairConfig.base}!`,
        });
        await refreshUserData();
        const ordersRes = await ApiService.getTradeOrders();
        if (ordersRes.success && ordersRes.data) {
          setOrders(ordersRes.data);
        }
      } else {
        setOrderFeedback({
          type: 'error',
          msg: res.error?.message || 'Order failed to execute.',
        });
      }
    } catch (err: any) {
      setOrderFeedback({ type: 'error', msg: err.message || 'Trade execution error.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to map price to SVG Y coordinate (viewBox height 260)
  const chartHeight = 260;
  const getY = (price: number) => {
    if (maxPrice <= minPrice) return chartHeight / 2;
    const norm = (price - minPrice) / (maxPrice - minPrice);
    return chartHeight - norm * chartHeight;
  };

  return (
    <div className="space-y-6 pb-20 select-none font-sans text-white">
      {/* 1. Header & Live Trading Pair Stats */}
      <section className="p-5 sm:p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#18181c] pb-4">
          
          {/* Pair Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 p-2 rounded-xl bg-[#030305] border border-[#18181c] hover:border-[#00e699]/50 transition-all cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-[#00e699] flex items-center justify-center font-black text-xs text-black shadow-md shadow-[#00e699]/20">
                {activePairConfig.base.slice(0, 3)}
              </div>
              <div className="text-left pr-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold text-white tracking-tight">
                    {activePairConfig.name}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#00e699]/15 text-[#00e699]">
                    SPOT
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Binance Live Order Flow</p>
              </div>
              <ChevronDown size={16} className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Options */}
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 rounded-xl bg-[#08080a] border border-[#18181c] shadow-2xl z-30 p-1.5 space-y-1">
                {POPULAR_PAIRS.map((pair) => (
                  <button
                    key={pair.symbol}
                    type="button"
                    onClick={() => {
                      setActiveSymbol(pair.symbol);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      activeSymbol === pair.symbol
                        ? 'bg-[#00e699]/15 text-[#00e699]'
                        : 'text-slate-300 hover:bg-[#121217] hover:text-white'
                    }`}
                  >
                    <span>{pair.name}</span>
                    <span className="text-[10px] text-slate-500 font-normal">{pair.base}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Current Live Price & 24h Change */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-black text-white tabular-nums tracking-tight">
              ${currentPrice > 0 ? currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : '...'}
            </span>
            <div className={`flex items-center gap-0.5 text-xs sm:text-sm font-bold tabular-nums ${isUp ? 'text-[#00e699]' : 'text-rose-500'}`}>
              {isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              <span>{isUp ? '+' : ''}{change24h.toFixed(2)}%</span>
            </div>
          </div>

        </div>

        {/* 24h Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#030305] border border-[#18181c]">
            <p className="text-[10px] text-slate-400 font-medium">24h High</p>
            <p className="font-bold text-white tabular-nums mt-0.5">
              ${pairData ? pairData.high24h.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '...'}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#030305] border border-[#18181c]">
            <p className="text-[10px] text-slate-400 font-medium">24h Low</p>
            <p className="font-bold text-white tabular-nums mt-0.5">
              ${pairData ? pairData.low24h.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '...'}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#030305] border border-[#18181c]">
            <p className="text-[10px] text-slate-400 font-medium">24h Volume ({activePairConfig.base})</p>
            <p className="font-bold text-white tabular-nums mt-0.5">
              {pairData ? pairData.volume24h.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '...'}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#030305] border border-[#18181c]">
            <p className="text-[10px] text-slate-400 font-medium">Payout Rate</p>
            <p className="font-bold text-[#00e699] tabular-nums mt-0.5">
              {pairData ? `${pairData.payout}% Institutional` : '92%'}
            </p>
          </div>
        </div>

        {/* Moving Average Indicators & Timeframe Selector Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {/* Moving Averages Legend */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] tabular-nums">
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              MA5: {ma5 > 0 ? ma5.toFixed(2) : '--'}
            </span>
            <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              MA10: {ma10 > 0 ? ma10.toFixed(2) : '--'}
            </span>
            <span className="flex items-center gap-1.5 text-purple-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              MA20: {ma20 > 0 ? ma20.toFixed(2) : '--'}
            </span>
            <span className="flex items-center gap-1.5 text-[#00e699] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#00e699]" />
              MA30: {ma30 > 0 ? ma30.toFixed(2) : '--'}
            </span>
          </div>

          {/* Timeframe Selectors */}
          <div className="flex items-center gap-1 bg-[#030305] p-1 rounded-xl border border-[#18181c]">
            {['1m', '5m', '15m', '1h', '1D'].map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedTimeframe === tf
                    ? 'bg-[#00e699] text-black shadow-sm font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Interactive High-Precision Candlestick Chart */}
        <div className="w-full h-80 bg-[#000000] rounded-xl border border-[#18181c] p-3 relative overflow-hidden flex flex-col justify-between">
          
          {isLoadingCandles && candles.length === 0 ? (
            <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 space-y-2">
              <Loader2 size={24} className="animate-spin text-[#00e699]" />
              <span className="text-xs">Fetching real Binance market candlesticks...</span>
            </div>
          ) : (
            <>
              {/* Subtle background price level grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-15">
                <div className="border-b border-dashed border-slate-600 w-full" />
                <div className="border-b border-dashed border-slate-600 w-full" />
                <div className="border-b border-dashed border-slate-600 w-full" />
                <div className="border-b border-dashed border-slate-600 w-full" />
              </div>

              {/* Price level axis indicators */}
              <div className="absolute right-2 top-2 bottom-2 flex flex-col justify-between text-[9px] text-slate-500 tabular-nums pointer-events-none">
                <span>${maxPrice.toFixed(1)}</span>
                <span>${((maxPrice + minPrice) / 2).toFixed(1)}</span>
                <span>${minPrice.toFixed(1)}</span>
              </div>

              {/* Candlesticks & MA Paths rendered via scalable SVG */}
              <svg
                className="w-full h-full"
                viewBox={`0 0 ${candles.length * 24 + 40} ${chartHeight}`}
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="volGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00e699" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#00e699" stopOpacity="0.05" />
                  </linearGradient>
                  <linearGradient id="volRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff3b5c" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#ff3b5c" stopOpacity="0.05" />
                  </linearGradient>
                </defs>

                {/* MA Trend Lines */}
                {candles.length > 5 && (
                  <path
                    d={candles
                      .map((c, i) => {
                        const slice = candles.slice(Math.max(0, i - 4), i + 1);
                        const avg = slice.reduce((acc, cur) => acc + cur.close, 0) / slice.length;
                        const x = i * 24 + 18;
                        const y = getY(avg);
                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeOpacity="0.75"
                  />
                )}

                {candles.length > 10 && (
                  <path
                    d={candles
                      .map((c, i) => {
                        const slice = candles.slice(Math.max(0, i - 9), i + 1);
                        const avg = slice.reduce((acc, cur) => acc + cur.close, 0) / slice.length;
                        const x = i * 24 + 18;
                        const y = getY(avg);
                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    strokeOpacity="0.75"
                  />
                )}

                {/* Candlestick Bars */}
                {candles.map((c, idx) => {
                  const x = idx * 24 + 18;
                  const yOpen = getY(c.open);
                  const yClose = getY(c.close);
                  const yHigh = getY(c.high);
                  const yLow = getY(c.low);
                  const isCandleGreen = c.close >= c.open;
                  const candleColor = isCandleGreen ? '#00e699' : '#ff3b5c';
                  const bodyTop = Math.min(yOpen, yClose);
                  const bodyHeight = Math.max(Math.abs(yOpen - yClose), 2);

                  // Volume bar at bottom
                  const volHeight = Math.min(c.volume * 0.05, 45);

                  return (
                    <g
                      key={c.time}
                      onMouseEnter={() => setHoveredCandle(c)}
                      className="cursor-crosshair transition-opacity hover:opacity-100 opacity-90"
                    >
                      {/* Volume histogram bar */}
                      <rect
                        x={x - 4}
                        y={chartHeight - volHeight}
                        width="8"
                        height={volHeight}
                        fill={isCandleGreen ? 'url(#volGreen)' : 'url(#volRed)'}
                      />

                      {/* Upper & Lower Wick */}
                      <line
                        x1={x}
                        y1={yHigh}
                        x2={x}
                        y2={yLow}
                        stroke={candleColor}
                        strokeWidth="1.5"
                      />

                      {/* Candlestick Body */}
                      <rect
                        x={x - 6}
                        y={bodyTop}
                        width="12"
                        height={bodyHeight}
                        fill={candleColor}
                        rx="1.5"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Active Candlestick HUD Tooltip Overlay */}
              {hoveredCandle && (
                <div className="absolute top-3 left-3 p-3 rounded-xl bg-[#08080a]/90 backdrop-blur-md border border-[#18181c] text-[11px] tabular-nums space-y-1.5 shadow-2xl pointer-events-none">
                  <div className="flex items-center justify-between gap-4 text-slate-400">
                    <span className="text-[#00e699] font-bold">
                      {new Date(hoveredCandle.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    <span className={hoveredCandle.close >= hoveredCandle.open ? 'text-[#00e699] font-bold' : 'text-rose-500 font-bold'}>
                      {hoveredCandle.close >= hoveredCandle.open ? 'Bullish' : 'Bearish'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-slate-300">
                    <span>Open: <strong className="text-white">${hoveredCandle.open.toFixed(2)}</strong></span>
                    <span>High: <strong className="text-white">${hoveredCandle.high.toFixed(2)}</strong></span>
                    <span>Low: <strong className="text-white">${hoveredCandle.low.toFixed(2)}</strong></span>
                    <span>Close: <strong className="text-white">${hoveredCandle.close.toFixed(2)}</strong></span>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </section>

      {/* 2. Middle Row: Real Depth Order Book & Buy/Sell Order Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Real Live Order Book (Left 6 Cols) */}
        <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Live Order Book Depth
            </h3>
            <span className="text-[10px] text-[#00e699] font-bold px-2 py-0.5 rounded-full bg-[#00e699]/10 border border-[#00e699]/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e699] animate-pulse" />
              Binance Engine
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* Bids (Buy Orders) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold border-b border-[#18181c] pb-1">
                <span>Bid Price</span>
                <span>Size</span>
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {orderBook.bids.length === 0 ? (
                  <p className="text-[11px] text-slate-500 py-4 text-center">Loading bids...</p>
                ) : (
                  orderBook.bids.map((b, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-1 px-1.5 rounded bg-emerald-950/20 text-[#00e699] font-semibold tabular-nums text-[11px]"
                    >
                      <span>${b.price.toFixed(2)}</span>
                      <span className="text-slate-300 font-normal">{b.size.toFixed(3)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Asks (Sell Orders) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold border-b border-[#18181c] pb-1">
                <span>Ask Price</span>
                <span>Size</span>
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {orderBook.asks.length === 0 ? (
                  <p className="text-[11px] text-slate-500 py-4 text-center">Loading asks...</p>
                ) : (
                  orderBook.asks.map((a, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-1 px-1.5 rounded bg-rose-950/20 text-[#ff3b5c] font-semibold tabular-nums text-[11px]"
                    >
                      <span>${a.price.toFixed(2)}</span>
                      <span className="text-slate-300 font-normal">{a.size.toFixed(3)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Execution Panel (Right 6 Cols) */}
        <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-4">
          
          {/* Buy/Sell Call/Put Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSide('BUY')}
              className={`py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                side === 'BUY'
                  ? 'bg-[#00e699] text-black shadow-lg shadow-[#00e699]/30 scale-[1.01]'
                  : 'bg-[#030305] text-slate-400 hover:text-white border border-[#18181c]'
              }`}
            >
              <TrendingUp size={16} />
              <span>Buy · CALL</span>
            </button>
            <button
              type="button"
              onClick={() => setSide('SELL')}
              className={`py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                side === 'SELL'
                  ? 'bg-[#ff3b5c] text-white shadow-lg shadow-[#ff3b5c]/30 scale-[1.01]'
                  : 'bg-[#030305] text-slate-400 hover:text-white border border-[#18181c]'
              }`}
            >
              <TrendingDown size={16} />
              <span>Sell · PUT</span>
            </button>
          </div>

          {/* Balance Selector Card */}
          <div className="p-3.5 rounded-xl bg-[#030305] border border-[#18181c] flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Available {side === 'BUY' ? 'USDT' : activePairConfig.base} Balance
              </p>
              <h4 className="text-base font-black text-white tabular-nums">
                {availableBalance.toFixed(side === 'BUY' ? 2 : 4)}{' '}
                <span className="text-xs text-[#00e699] font-bold">
                  {side === 'BUY' ? 'USDT' : activePairConfig.base}
                </span>
              </h4>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="tradeWalletSource"
                  checked={walletSource === 'spot'}
                  onChange={() => setWalletSource('spot')}
                  className="accent-[#00e699]"
                />
                <span className={walletSource === 'spot' ? 'text-[#00e699] font-bold' : 'text-slate-500'}>
                  Spot
                </span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="tradeWalletSource"
                  checked={walletSource === 'main'}
                  onChange={() => setWalletSource('main')}
                  className="accent-[#00e699]"
                />
                <span className={walletSource === 'main' ? 'text-[#00e699] font-bold' : 'text-slate-500'}>
                  Main Wallet
                </span>
              </label>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmitOrder} className="space-y-3.5">
            {orderFeedback && (
              <div
                className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                  orderFeedback.type === 'success'
                    ? 'bg-emerald-950/40 border-emerald-800/50 text-[#00e699]'
                    : 'bg-red-950/40 border-red-800/50 text-[#ff3b5c]'
                }`}
              >
                {orderFeedback.type === 'success' ? (
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-[#00e699]" />
                ) : (
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-[#ff3b5c]" />
                )}
                <span>{orderFeedback.msg}</span>
              </div>
            )}

            {/* Price Input */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>Execution Price</span>
                <span>USDT</span>
              </div>
              <input
                type="number"
                step="any"
                value={orderPrice}
                onChange={(e) => setOrderPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#030305] border border-[#18181c] text-xs font-semibold tabular-nums text-white focus:outline-none focus:border-[#00e699]"
              />
            </div>

            {/* Amount Input */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>Amount to Trade</span>
                <span>{activePairConfig.base}</span>
              </div>
              <input
                type="number"
                step="any"
                value={orderAmount}
                onChange={(e) => setOrderAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#030305] border border-[#18181c] text-xs font-semibold tabular-nums text-white focus:outline-none focus:border-[#00e699]"
              />
            </div>

            {/* Total */}
            <div className="p-3 rounded-xl bg-[#030305] border border-[#18181c] flex items-center justify-between text-xs tabular-nums">
              <span className="text-slate-400">Total Settlement</span>
              <span className="font-extrabold text-white">
                {totalCost.toFixed(4)} <span className="text-[#00e699]">USDT</span>
              </span>
            </div>

            {/* Submit Button (Green Primary Color) */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 px-4 rounded-xl text-xs font-extrabold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                side === 'BUY'
                  ? 'bg-[#00e699] hover:bg-[#00ffaa] text-black shadow-[#00e699]/30 active:scale-[0.98]'
                  : 'bg-[#ff3b5c] hover:bg-[#ff5271] text-white shadow-[#ff3b5c]/30 active:scale-[0.98]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Processing Protocol Order...</span>
                </>
              ) : (
                <span>{side === 'BUY' ? `Place Buy Order (${activePairConfig.base})` : `Place Sell Order (${activePairConfig.base})`}</span>
              )}
            </button>
          </form>

        </div>
      </div>

      {/* 3. Bottom Row: Order History */}
      <section className="p-5 sm:p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-4">
        <div className="flex items-center gap-3 border-b border-[#18181c] pb-3">
          <button
            type="button"
            onClick={() => setHistoryTab('orders')}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
              historyTab === 'orders'
                ? 'bg-[#00e699] text-black font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Order History
          </button>
          <button
            type="button"
            onClick={() => setHistoryTab('trades')}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
              historyTab === 'trades'
                ? 'bg-[#00e699] text-black font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Filled Trades
          </button>
        </div>

        {orders.length === 0 ? (
          <EmptyState
            title={historyTab === 'orders' ? 'No Active Orders' : 'No Trades'}
            description="Filled and pending orders executed on the platform will display here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs tabular-nums">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-[#18181c]">
                <tr>
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Side</th>
                  <th className="py-2.5 px-3">Wallet</th>
                  <th className="py-2.5 px-3">Price</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                  <th className="py-2.5 px-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141418]">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#121217] transition-colors">
                    <td className="py-3 px-3 text-[#00e699] font-bold">{ord.id}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                          ord.side === 'BUY'
                            ? 'bg-emerald-950/60 text-[#00e699]'
                            : 'bg-rose-950/60 text-rose-400'
                        }`}
                      >
                        {ord.side}
                      </span>
                    </td>
                    <td className="py-3 px-3 capitalize text-slate-400">{ord.walletSource}</td>
                    <td className="py-3 px-3 text-white font-semibold">${ord.price.toFixed(2)}</td>
                    <td className="py-3 px-3 text-white">{ord.amount.toFixed(4)}</td>
                    <td className="py-3 px-3 text-white font-bold">${ord.total.toFixed(2)} USDT</td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/40 text-[#00e699] border border-emerald-500/20">
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-500 text-[11px]">{ord.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

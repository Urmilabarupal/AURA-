/*
 FILE: src/pages/trade/TradeView.tsx

 PURPOSE:
 Spot Exchange Trading module with interactive chart, order book, and order management.
 Corresponds to Reference Screenshots 9, 10, and 11.

 RESPONSIBILITIES:
 - Display AURA/USDT trading pair metrics (24h High/Low/Volume, Total & Circulating Supply)
 - Render candlestick and Moving Average chart (MA5, MA10, MA20, MA30) with timeframe tabs
 - Display live Trades feed (Price, Amount, Time)
 - Provide Buy / Sell order panel with Spot / Main Wallet balance toggles
 - Enforce server-authoritative order validation and balance execution
 - Support Order History and Trade History with "No Buy" / "No Trades" empty states

 API:
 Calls ApiService.getMarketTrades, ApiService.submitTradeOrder, ApiService.getTradeOrders,
 and ApiService.getWallets.

 SECURITY:
 In accordance with Rules 5, 11, and 27, balances and fills are determined strictly
 by the authoritative engine.

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { BRAND } from '../../config/brand';
import { EmptyState } from '../../components/common/EmptyState';
import { MarketTrade, TradeOrder } from '../../types';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  BarChart2,
  CheckCircle2,
  Clock,
  Layers,
  Loader2,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  Wallet,
} from 'lucide-react';

export const TradeView: React.FC = () => {
  const { wallets, refreshUserData, emptyStateMode } = useAuth();

  // Market metrics (from Screenshot 9)
  const currentPrice = 337.2;
  const priceChange = '+0.00%';
  const high24h = 342.0;
  const low24h = 335.0;
  const volNative = '197,123';
  const volUSDT = '66,469,875';
  const totalSupply = '1,000,000,000';
  const circulatingSupply = '197,123';

  // State
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('1m');
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [walletSource, setWalletSource] = useState<'spot' | 'main'>('spot');
  const [orderPrice, setOrderPrice] = useState<number>(337.2);
  const [orderAmount, setOrderAmount] = useState<number>(0.01);
  const [trades, setTrades] = useState<MarketTrade[]>([]);
  const [orders, setOrders] = useState<TradeOrder[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderFeedback, setOrderFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Active History Tab
  const [historyTab, setHistoryTab] = useState<'orders' | 'trades'>('orders');

  useEffect(() => {
    loadMarketData();
  }, [emptyStateMode]);

  const loadMarketData = async () => {
    try {
      if (emptyStateMode) {
        setTrades([]);
        setOrders([]);
        return;
      }
      const [tradesRes, ordersRes] = await Promise.all([
        ApiService.getMarketTrades(),
        ApiService.getTradeOrders(),
      ]);
      if (tradesRes.success && tradesRes.data) {
        setTrades(tradesRes.data);
      }
      if (ordersRes.success && ordersRes.data) {
        setOrders(ordersRes.data);
      }
    } catch (err) {
      console.error('Failed to load market data', err);
    }
  };

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
        msg: `Insufficient USDT in ${walletSource} wallet. Needed ${totalCost} USDT.`,
      });
      return;
    }

    if (side === 'SELL' && availableBalance < orderAmount) {
      setOrderFeedback({
        type: 'error',
        msg: `Insufficient ${BRAND.tokenSymbol} in ${walletSource} wallet. Needed ${orderAmount} ${BRAND.tokenSymbol}.`,
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
          msg: `Successfully executed ${side} order for ${orderAmount} ${BRAND.tokenSymbol}!`,
        });
        await refreshUserData();
        loadMarketData();
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

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Pair Header & Key Statistics (Screenshots 9 & 10) */}
      <section className="p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#18181c] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-black text-sm text-[#00e699]">
              {BRAND.shortName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-100 font-mono tracking-tight">
                  {BRAND.tokenSymbol}/USDT
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/40 text-[#00e699] border border-emerald-800/40">
                  Spot
                </span>
              </div>
              <p className="text-xs text-slate-400">{BRAND.chainName} Native Pair</p>
            </div>
          </div>

          {/* Big Price Display (Screenshot 9) */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-[#00e699] font-mono tracking-tight">
              {currentPrice.toFixed(3)}
            </span>
            <span className="text-xs font-semibold text-slate-400 font-mono">0.000 (0.00%)</span>
          </div>
        </div>

        {/* 24h Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-[#020204] border border-[#18181c]">
            <p className="text-[10px] text-slate-500 font-medium">24h High</p>
            <p className="font-mono font-bold text-slate-200 mt-0.5">{high24h.toFixed(3)}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#020204] border border-[#18181c]">
            <p className="text-[10px] text-slate-500 font-medium">24h Low</p>
            <p className="font-mono font-bold text-slate-200 mt-0.5">{low24h.toFixed(3)}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#020204] border border-[#18181c]">
            <p className="text-[10px] text-slate-500 font-medium">24h Volume ({BRAND.tokenSymbol})</p>
            <p className="font-mono font-bold text-slate-200 mt-0.5">{volNative}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#020204] border border-[#18181c]">
            <p className="text-[10px] text-slate-500 font-medium">24h Volume (USDT)</p>
            <p className="font-mono font-bold text-slate-200 mt-0.5">{volUSDT}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#020204] border border-[#18181c]">
            <p className="text-[10px] text-slate-500 font-medium">Total Supply</p>
            <p className="font-mono font-bold text-slate-200 mt-0.5">{totalSupply}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#020204] border border-[#18181c]">
            <p className="text-[10px] text-slate-500 font-medium">Circulating Supply</p>
            <p className="font-mono font-bold text-purple-400 mt-0.5">{circulatingSupply}</p>
          </div>
        </div>

        {/* Moving Average Indicators & Timeframe Bar (Screenshot 9) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {/* Indicators Legend */}
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1 text-pink-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-pink-500"></span> dayK
            </span>
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> MA5: 335.66
            </span>
            <span className="flex items-center gap-1 text-blue-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span> MA10: 335.09
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#00e699]"></span> MA20: 335.16
            </span>
            <span className="flex items-center gap-1 text-purple-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span> MA30: 335.19
            </span>
          </div>

          {/* Timeframe Selectors (Screenshot 9 & 10) */}
          <div className="flex items-center gap-1 bg-[#020204] p-1 rounded-xl border border-[#18181c]">
            {['1m', '5m', '15m', '1h', '1D', 'All'].map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedTimeframe === tf
                    ? 'bg-[#00e699] text-black font-extrabold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Simulated SVG Chart with Candlesticks & MAs (matching Screenshot 9) */}
        <div className="w-full h-64 bg-[#000000] rounded-xl border border-[#141418] p-4 relative overflow-hidden flex flex-col justify-between">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
            <div className="border-b border-dashed border-slate-700 w-full"></div>
            <div className="border-b border-dashed border-slate-700 w-full"></div>
            <div className="border-b border-dashed border-slate-700 w-full"></div>
            <div className="border-b border-dashed border-slate-700 w-full"></div>
          </div>

          {/* SVG Price curve */}
          <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
            {/* MA Lines */}
            <path
              d="M 0 130 C 150 128, 300 125, 450 126 C 600 127, 750 125, 800 125"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            <path
              d="M 0 135 C 150 133, 300 130, 450 129 C 600 128, 750 126, 800 126"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="1.5"
            />
            <path
              d="M 0 140 C 150 138, 300 134, 450 132 C 600 130, 750 127, 800 127"
              fill="none"
              stroke="#a855f7"
              strokeWidth="1.5"
            />

            {/* Candlestick Bars */}
            {[
              { x: 50, o: 135, c: 125, h: 120, l: 140, green: true },
              { x: 100, o: 125, c: 130, h: 122, l: 133, green: false },
              { x: 150, o: 130, c: 124, h: 120, l: 132, green: true },
              { x: 200, o: 124, c: 122, h: 118, l: 126, green: true },
              { x: 250, o: 122, c: 126, h: 119, l: 128, green: false },
              { x: 300, o: 126, c: 120, h: 115, l: 128, green: true },
              { x: 350, o: 120, c: 122, h: 116, l: 124, green: false },
              { x: 400, o: 122, c: 118, h: 114, l: 125, green: true },
              { x: 450, o: 118, c: 116, h: 112, l: 120, green: true },
              { x: 500, o: 116, c: 119, h: 114, l: 122, green: false },
              { x: 550, o: 119, c: 115, h: 110, l: 121, green: true },
              { x: 600, o: 115, c: 114, h: 108, l: 118, green: true },
              { x: 650, o: 114, c: 116, h: 110, l: 120, green: false },
              { x: 700, o: 116, c: 112, h: 108, l: 118, green: true },
              { x: 750, o: 112, c: 110, h: 105, l: 115, green: true },
            ].map((c, idx) => (
              <g key={idx}>
                {/* Wick */}
                <line
                  x1={c.x}
                  y1={c.h}
                  x2={c.x}
                  y2={c.l}
                  stroke={c.green ? '#10b981' : '#f43f5e'}
                  strokeWidth="1.5"
                />
                {/* Body */}
                <rect
                  x={c.x - 6}
                  y={Math.min(c.o, c.c)}
                  width="12"
                  height={Math.max(Math.abs(c.o - c.c), 2)}
                  fill={c.green ? '#10b981' : '#f43f5e'}
                  rx="1"
                />
              </g>
            ))}
          </svg>

          {/* Chart Tooltip Box (Screenshot 9 overlay) */}
          <div className="absolute top-4 left-4 p-3 rounded-xl bg-[#08080a]/95 backdrop-blur-md border border-[#222228] text-[10px] font-mono space-y-1 shadow-2xl">
            <p className="text-[#00e699] font-bold">2026/09/29 20:00</p>
            <div className="grid grid-cols-2 gap-x-3 text-slate-300">
              <span>Open: 342.00</span>
              <span>Close: 342.00</span>
              <span>Low: 342.00</span>
              <span>High: 342.00</span>
            </div>
            <div className="pt-1 border-t border-[#18181c] text-slate-400">
              <p className="text-amber-400">MA5: 335.659</p>
              <p className="text-blue-400">MA10: 335.090</p>
              <p className="text-[#00e699]">MA30: 335.196</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Middle Row: Live Trades Feed & Buy/Sell Order Panel (Screenshot 10) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Trades Table (Left 6 Cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
              Recent Trades
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Live WebSocket Feed</span>
          </div>

          {trades.length === 0 ? (
            <EmptyState
              title="No Trades Recorded"
              description="Real-time trades will appear here as orders execute."
              actionText="Reload Market"
              onAction={loadMarketData}
            />
          ) : (
            <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-[#18181c]">
                  <tr>
                    <th className="py-2 px-2">Price (USDT)</th>
                    <th className="py-2 px-2 text-right">Amount ({BRAND.tokenSymbol})</th>
                    <th className="py-2 px-2 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141418]">
                  {trades.map((tr) => (
                    <tr key={tr.id} className="hover:bg-[#121216] transition-colors">
                      <td
                        className={`py-2 px-2 font-bold ${
                          tr.type === 'BUY' ? 'text-[#00e699]' : 'text-[#ff3b5c]'
                        }`}
                      >
                        {tr.price.toFixed(3)}
                      </td>
                      <td className="py-2 px-2 text-right text-slate-300">
                        {tr.amount.toFixed(4)}
                      </td>
                      <td className="py-2 px-2 text-right text-slate-500 text-[11px]">
                        {tr.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Buy / Sell Order Panel (Right 6 Cols, Screenshot 10) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-5">
          {/* Buy/Sell Tabs (Screenshot 10) */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSide('BUY')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                side === 'BUY'
                  ? 'bg-[#00e699] text-black font-extrabold shadow-lg shadow-[#00e699]/30'
                  : 'bg-[#141418] text-slate-400 hover:text-white'
              }`}
            >
              Buy · CALL
            </button>
            <button
              type="button"
              onClick={() => setSide('SELL')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                side === 'SELL'
                  ? 'bg-[#ff3b5c] text-white font-extrabold shadow-lg shadow-[#ff3b5c]/30'
                  : 'bg-[#141418] text-slate-400 hover:text-white'
              }`}
            >
              Sell · PUT
            </button>
          </div>

          {/* Total Balance Card */}
          <div className="p-3.5 rounded-xl bg-[#020204] border border-[#18181c] flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Total Balance
              </p>
              <h4 className="text-base font-extrabold text-slate-100 font-mono">
                {availableBalance.toFixed(side === 'BUY' ? 2 : 4)}{' '}
                <span className="text-xs text-[#00e699] font-bold">
                  {side === 'BUY' ? 'USDT' : BRAND.tokenSymbol}
                </span>
              </h4>
            </div>

            {/* Wallet Selection Switch (Spot vs Main Wallet) */}
            <div className="flex items-center gap-3 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="tradeWallet"
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
                  name="tradeWallet"
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

          {/* Order Form */}
          <form onSubmit={handleSubmitOrder} className="space-y-4">
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
                <span>Price</span>
                <span>USDT</span>
              </div>
              <input
                type="number"
                step="0.001"
                value={orderPrice}
                onChange={(e) => setOrderPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#020204] border border-[#18181c] text-xs font-mono text-slate-100 focus:outline-none focus:border-[#00e699]"
              />
            </div>

            {/* Amount Input */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>Amount</span>
                <span>{BRAND.tokenSymbol}</span>
              </div>
              <input
                type="number"
                step="0.0001"
                value={orderAmount}
                onChange={(e) => setOrderAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#020204] border border-[#18181c] text-xs font-mono text-slate-100 focus:outline-none focus:border-[#00e699]"
              />
            </div>

            {/* Total Calculation */}
            <div className="p-3 rounded-xl bg-[#020204] border border-[#18181c] flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Total</span>
              <span className="font-bold text-slate-100">
                {totalCost.toFixed(4)} <span className="text-[#00e699]">USDT</span>
              </span>
            </div>

            {/* Execute Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                side === 'BUY'
                  ? 'bg-[#00e699] hover:bg-[#00ffaa] text-black font-extrabold shadow-[#00e699]/30'
                  : 'bg-[#ff3b5c] hover:bg-[#ff5271] text-white font-extrabold shadow-[#ff3b5c]/30'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Executing Order...</span>
                </>
              ) : (
                <span>{side === 'BUY' ? 'Execute Buy Order' : 'Execute Sell Order'}</span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* 3. Bottom Row: Order History & Trade History */}
      <section className="p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-4">
        <div className="flex items-center gap-3 border-b border-[#18181c] pb-3">
          <button
            onClick={() => setHistoryTab('orders')}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
              historyTab === 'orders'
                ? 'bg-[#00e699] text-black font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Order History
          </button>
          <button
            onClick={() => setHistoryTab('trades')}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
              historyTab === 'trades'
                ? 'bg-[#00e699] text-black font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Trade History
          </button>
        </div>

        {/* Content with screenshot empty state "No Buy" / "No Trades" */}
        {orders.length === 0 ? (
          <EmptyState
            title={historyTab === 'orders' ? 'No Buy' : 'No Trades'}
            description={
              historyTab === 'orders'
                ? 'You do not have any open or historical spot orders.'
                : 'No filled trades recorded for your account yet.'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-[#1f263d]">
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
              <tbody className="divide-y divide-[#171d30]">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#151a2d]">
                    <td className="py-3 px-3 text-purple-400 font-bold">{ord.id}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                          ord.side === 'BUY'
                            ? 'bg-emerald-950/50 text-emerald-400'
                            : 'bg-pink-950/50 text-pink-400'
                        }`}
                      >
                        {ord.side}
                      </span>
                    </td>
                    <td className="py-3 px-3 capitalize text-slate-400">{ord.walletSource}</td>
                    <td className="py-3 px-3 text-slate-200">{ord.price.toFixed(3)}</td>
                    <td className="py-3 px-3 text-slate-200">{ord.amount.toFixed(4)} {BRAND.tokenSymbol}</td>
                    <td className="py-3 px-3 text-slate-200 font-bold">{ord.total.toFixed(2)} USDT</td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950/40 text-blue-400 border border-blue-800/40">
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-500">{ord.timestamp}</td>
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

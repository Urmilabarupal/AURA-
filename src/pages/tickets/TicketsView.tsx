/*
 FILE: src/pages/tickets/TicketsView.tsx

 PURPOSE:
 Decentralized Lottery & Raffle Ticket Purchase Portal.
 Corresponds to Reference Screenshots 25 and 26.

 RESPONSIBILITIES:
 - Display 4 navigation tabs: Last Week Ticket, Ticket, Direct, Winning Prize
 - Render live ticket purchase widget with unit price (10 USDT), quantity selector, and wallet source
 - Execute authoritative ticket creation and wallet deduction via ApiService
 - Support "Data Not Found" empty state and populated ticket roster

 API:
 Calls ApiService.getTickets, ApiService.buyTickets, and ApiService.getWallets.

 SECURITY:
 In accordance with Rules 5, 14, and 27, ticket generation and payment deduction
 are strictly authoritative.

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { EmptyState } from '../../components/common/EmptyState';
import { LotteryTicket } from '../../types';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Coins,
  History,
  Loader2,
  Minus,
  Plus,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Ticket,
  Trophy,
  Users,
  Wallet,
} from 'lucide-react';

export const TicketsView: React.FC = () => {
  const { wallets, refreshUserData, emptyStateMode } = useAuth();

  const [activeTab, setActiveTab] = useState<'lastWeek' | 'ticket' | 'direct' | 'winningPrize'>('ticket');
  const [tickets, setTickets] = useState<LotteryTicket[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [walletSource, setWalletSource] = useState<'funding' | 'spot'>('funding');
  const [isBuying, setIsBuying] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const unitPriceUSDT = 10.0;
  const currentTokenPrice = 0.0297;
  const totalCostUSDT = quantity * unitPriceUSDT;

  useEffect(() => {
    loadTickets();
  }, [emptyStateMode]);

  const loadTickets = async () => {
    if (emptyStateMode) {
      setTickets([]);
      return;
    }
    const res = await ApiService.getTickets();
    if (res.success && res.data) {
      setTickets(res.data);
    }
  };

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const available =
      walletSource === 'funding'
        ? wallets?.fundingBalanceUSDT || 0
        : wallets?.spotBalanceUSDT || 0;

    if (available < totalCostUSDT) {
      setFeedback({
        type: 'error',
        msg: `Insufficient balance in ${walletSource} wallet. Needed ${totalCostUSDT} USDT.`,
      });
      return;
    }

    setIsBuying(true);
    try {
      const res = await ApiService.buyTickets({
        quantity,
        walletSource,
      });

      if (res.success) {
        setFeedback({
          type: 'success',
          msg: `Successfully purchased ${quantity} ticket(s)! Best of luck in the draw!`,
        });
        await refreshUserData();
        loadTickets();
      } else {
        setFeedback({ type: 'error', msg: res.error?.message || 'Failed to purchase tickets.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', msg: err.message || 'Ticket purchase error.' });
    } finally {
      setIsBuying(false);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    if (activeTab === 'winningPrize') return t.isWinner;
    if (activeTab === 'lastWeek') return t.drawWeek < 40;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-100 uppercase tracking-tight">Tickets</h1>
          <p className="text-xs text-slate-400">Weekly Guaranteed Community Jackpot Lottery</p>
        </div>
      </div>

      {/* Main Grid: Tabs & Ticket History on Left, Buy Widget on Right (Screenshots 25 & 26) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 4 Tabs & Tickets Table */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1b2238] pb-3">
            <h3 className="text-sm font-bold text-slate-200">
              Transaction ({filteredTickets.length})
            </h3>

            {/* 4 Tabs from Screenshot 25 */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#0c0f1a] p-1 rounded-xl border border-[#1e253b]">
              <button
                onClick={() => setActiveTab('lastWeek')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'lastWeek'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calendar size={13} />
                <span>Last Week Ticket</span>
              </button>
              <button
                onClick={() => setActiveTab('ticket')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'ticket'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Ticket size={13} />
                <span>Ticket</span>
              </button>
              <button
                onClick={() => setActiveTab('direct')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'direct'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users size={13} />
                <span>Direct</span>
              </button>
              <button
                onClick={() => setActiveTab('winningPrize')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'winningPrize'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Trophy size={13} />
                <span>Winning Prize</span>
              </button>
            </div>
          </div>

          {filteredTickets.length === 0 ? (
            <EmptyState
              title="Data Not Found"
              description="The requested information is currently unavailable"
              actionText="Refresh Tickets"
              onAction={loadTickets}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-[#1f263d]">
                  <tr>
                    <th className="py-2.5 px-3">Ticket ID</th>
                    <th className="py-2.5 px-3">Number</th>
                    <th className="py-2.5 px-3">Draw Date</th>
                    <th className="py-2.5 px-3">Cost</th>
                    <th className="py-2.5 px-3 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#171d30]">
                  {filteredTickets.map((t) => (
                    <tr key={t.id} className="hover:bg-[#151a2d]">
                      <td className="py-3 px-3 text-purple-400 font-bold">{t.id}</td>
                      <td className="py-3 px-3 text-slate-100 font-bold tracking-wider">
                        #{t.ticketNumber}
                      </td>
                      <td className="py-3 px-3 text-slate-400">{t.drawDate}</td>
                      <td className="py-3 px-3 text-slate-300">${t.priceUSDT.toFixed(2)} USDT</td>
                      <td className="py-3 px-3 text-right">
                        {t.isWinner ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                            WON ${t.prizeAmountUSDT} USDT
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950/40 text-blue-400 border border-blue-800/40">
                            {t.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Ticket Purchase Box (Screenshot 25 Right) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-5">
          {/* Top Ticket Price Card (Screenshot 25) */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/60 to-purple-950/60 border border-blue-500/30 space-y-1">
            <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">
              TICKET PRICE
            </span>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-black text-slate-100 font-mono">10</h4>
              <span className="text-xs text-purple-300 font-bold">USDT</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              One lottery ticket is equivalent to 10 USDT in AURA.
            </p>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0c0f1a] border border-[#1b2238] text-xs">
            <span className="text-slate-400">Current Token Price</span>
            <span className="font-mono font-bold text-slate-200">${currentTokenPrice}</span>
          </div>

          {/* Lottery Purchase Widget */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1b2238] pb-2">
              <h4 className="text-sm font-bold text-slate-200">Lottery</h4>
              <Sparkles size={14} className="text-purple-400" />
            </div>

            <div className="p-3 rounded-xl bg-[#0c0f1a] border border-[#1b2238] flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Total Balance</p>
                <h5 className="text-base font-extrabold text-slate-100 font-mono">
                  ${walletSource === 'funding' ? wallets?.fundingBalanceUSDT.toFixed(2) : wallets?.spotBalanceUSDT.toFixed(2)}{' '}
                  <span className="text-xs text-purple-400 font-bold">USDT</span>
                </h5>
              </div>
              <span className="text-xs text-slate-400 font-mono capitalize">{walletSource}</span>
            </div>

            <form onSubmit={handleBuy} className="space-y-4">
              {feedback && (
                <div
                  className={`p-3 rounded-xl border flex items-start gap-2 text-xs ${
                    feedback.type === 'success'
                      ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300'
                      : 'bg-red-950/40 border-red-800/50 text-red-300'
                  }`}
                >
                  {feedback.type === 'success' ? (
                    <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-emerald-400" />
                  ) : (
                    <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-400" />
                  )}
                  <span>{feedback.msg}</span>
                </div>
              )}

              {/* Price & Quantity Box (Screenshot 25) */}
              <div className="grid grid-cols-2 gap-3 items-center">
                <div className="p-2.5 rounded-xl bg-[#0c0f1a] border border-[#202740]">
                  <p className="text-[10px] text-slate-500 font-semibold">Price (UNIT)</p>
                  <p className="font-mono font-bold text-slate-200 text-sm mt-0.5">$10.00</p>
                </div>

                <div className="p-2.5 rounded-xl bg-[#0c0f1a] border border-[#202740]">
                  <p className="text-[10px] text-slate-500 font-semibold">Quantity</p>
                  <div className="flex items-center justify-between mt-0.5">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1 rounded bg-[#181f36] text-slate-300 hover:text-white"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="font-mono font-extrabold text-slate-100 text-sm">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1 rounded bg-[#181f36] text-slate-300 hover:text-white"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Wallet Select (Screenshot 25 dropdown) */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Payment Wallet</label>
                <select
                  value={walletSource}
                  onChange={(e) => setWalletSource(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0c0f1a] border border-[#202740] text-xs text-slate-200 focus:outline-none"
                >
                  <option value="funding">Funding Wallet (${wallets?.fundingBalanceUSDT.toFixed(2)})</option>
                  <option value="spot">Spot Wallet (${wallets?.spotBalanceUSDT.toFixed(2)})</option>
                </select>
              </div>

              {/* Total Calculation */}
              <div className="flex items-center justify-between text-xs font-mono pt-1">
                <span className="text-slate-400">Total Purchase:</span>
                <span className="text-base font-extrabold text-slate-100">
                  {totalCostUSDT.toFixed(2)} <span className="text-purple-400">USDT</span>
                </span>
              </div>

              {/* Buy Button (Screenshot 25) */}
              <button
                type="submit"
                disabled={isBuying}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-950/40"
              >
                {isBuying ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Processing Ticket Order...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={14} />
                    <span>Buy Ticket</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

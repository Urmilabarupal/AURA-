/*
 FILE: src/pages/tickets/TicketsView.tsx

 PURPOSE:
 Decentralized Lottery & Raffle Ticket Purchase Portal.
 Styled with authentic Olymp Trade pitch-black OLED palette:
 - Canvas: #000000, Obsidian card bodies: #08080a, Sub-insets: #020204, Hairline borders: #18181c
 - Buttons & Accents: Signature Olymp Trade Emerald Green (#00e699)
*/

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { EmptyState } from '../../components/common/EmptyState';
import { LotteryTicket } from '../../types';
import { BRAND } from '../../config/brand';
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
        ? wallets?.fundingBalanceUSDT || 84300.0
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
    <div className="space-y-6 pb-12 font-sans select-none text-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            Lottery Tickets
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Weekly Guaranteed Community Jackpot Lottery
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 4 Tabs & Tickets Table */}
        <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#18181c] pb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Tickets ({filteredTickets.length})
            </h3>

            {/* 4 Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#020204] p-1 rounded-xl border border-[#18181c]">
              <button
                onClick={() => setActiveTab('lastWeek')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'lastWeek'
                    ? 'bg-[#18181c] text-[#00e699] font-bold border border-[#26262e]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calendar size={13} />
                <span>Last Week</span>
              </button>
              <button
                onClick={() => setActiveTab('ticket')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'ticket'
                    ? 'bg-[#00e699] text-black font-extrabold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Ticket size={13} />
                <span>Active Tickets</span>
              </button>
              <button
                onClick={() => setActiveTab('direct')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'direct'
                    ? 'bg-[#18181c] text-[#00e699] font-bold border border-[#26262e]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users size={13} />
                <span>Direct</span>
              </button>
              <button
                onClick={() => setActiveTab('winningPrize')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'winningPrize'
                    ? 'bg-[#00e699] text-black font-extrabold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Trophy size={13} />
                <span>Winners</span>
              </button>
            </div>
          </div>

          {filteredTickets.length === 0 ? (
            <EmptyState
              title="Data Not Found"
              description="No tickets purchased for this draw period yet."
              actionText="Refresh Tickets"
              onAction={loadTickets}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-[#18181c]">
                  <tr>
                    <th className="py-2.5 px-3">Ticket ID</th>
                    <th className="py-2.5 px-3">Number</th>
                    <th className="py-2.5 px-3">Draw Date</th>
                    <th className="py-2.5 px-3">Cost</th>
                    <th className="py-2.5 px-3 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#121216]">
                  {filteredTickets.map((t) => (
                    <tr key={t.id} className="hover:bg-[#0e0e12] transition-colors">
                      <td className="py-3 px-3 text-[#00e699] font-bold">{t.id}</td>
                      <td className="py-3 px-3 text-white font-bold tracking-wider">
                        #{t.ticketNumber}
                      </td>
                      <td className="py-3 px-3 text-slate-400">{t.drawDate}</td>
                      <td className="py-3 px-3 text-white font-bold">{t.priceUSDT} USDT</td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.isWinner
                              ? 'bg-[#00e699]/15 text-[#00e699] border border-[#00e699]/30'
                              : 'bg-[#18181c] text-slate-400'
                          }`}
                        >
                          {t.isWinner ? 'WINNER!' : 'IN DRAW'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Ticket Purchase Box */}
        <div className="lg:col-span-4 p-5 sm:p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-5">
          <div className="p-4 rounded-xl bg-[#020204] border border-[#18181c] space-y-1">
            <span className="text-[10px] font-bold text-[#00e699] uppercase tracking-widest font-mono">
              TICKET PRICE
            </span>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-black text-white font-mono">10</h4>
              <span className="text-xs text-[#00e699] font-bold font-mono">USDT</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              One decentralized lottery ticket is pegged to 10 USDT.
            </p>
          </div>

          {/* Lottery Purchase Widget */}
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-[#020204] border border-[#18181c] flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase font-mono">
                  Wallet Balance
                </p>
                <h5 className="text-base font-extrabold text-white font-mono">
                  ${walletSource === 'funding' ? (wallets?.fundingBalanceUSDT || 84300.0).toFixed(2) : (wallets?.spotBalanceUSDT || 0).toFixed(2)}{' '}
                  <span className="text-xs text-[#00e699] font-bold">USDT</span>
                </h5>
              </div>
              <span className="text-xs text-slate-400 font-mono capitalize">{walletSource}</span>
            </div>

            <form onSubmit={handleBuy} className="space-y-4">
              {feedback && (
                <div
                  className={`p-3 rounded-xl border flex items-start gap-2 text-xs ${
                    feedback.type === 'success'
                      ? 'bg-emerald-950/40 border-[#00e699]/40 text-[#00e699]'
                      : 'bg-red-950/40 border-red-800/50 text-[#ff3b5c]'
                  }`}
                >
                  {feedback.type === 'success' ? (
                    <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-[#00e699]" />
                  ) : (
                    <AlertCircle size={15} className="shrink-0 mt-0.5 text-[#ff3b5c]" />
                  )}
                  <span>{feedback.msg}</span>
                </div>
              )}

              {/* Price & Quantity Box */}
              <div className="grid grid-cols-2 gap-3 items-center">
                <div className="p-2.5 rounded-xl bg-[#020204] border border-[#18181c]">
                  <p className="text-[10px] text-slate-500 font-semibold font-mono">Price (UNIT)</p>
                  <p className="font-mono font-bold text-white text-sm mt-0.5">$10.00</p>
                </div>

                <div className="p-2.5 rounded-xl bg-[#020204] border border-[#18181c]">
                  <p className="text-[10px] text-slate-500 font-semibold font-mono">Quantity</p>
                  <div className="flex items-center justify-between mt-0.5">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1 rounded bg-[#08080a] border border-[#18181c] text-slate-300 hover:text-white"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="font-mono font-black text-white text-sm">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1 rounded bg-[#08080a] border border-[#18181c] text-slate-300 hover:text-white"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Wallet Select */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 font-mono">Payment Wallet</label>
                <select
                  value={walletSource}
                  onChange={(e) => setWalletSource(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#020204] border border-[#18181c] text-xs text-white focus:outline-none focus:border-[#00e699]"
                >
                  <option value="funding">Funding Wallet (${(wallets?.fundingBalanceUSDT || 84300.0).toFixed(2)})</option>
                  <option value="spot">Spot Wallet (${(wallets?.spotBalanceUSDT || 0).toFixed(2)})</option>
                </select>
              </div>

              {/* Total Calculation */}
              <div className="flex items-center justify-between text-xs font-mono pt-1">
                <span className="text-slate-400">Total Purchase:</span>
                <span className="text-base font-black text-white">
                  {totalCostUSDT.toFixed(2)} <span className="text-[#00e699]">USDT</span>
                </span>
              </div>

              {/* Buy Button */}
              <button
                type="submit"
                disabled={isBuying}
                className="w-full py-3.5 px-4 rounded-xl text-xs font-extrabold text-black bg-[#00e699] hover:bg-[#00ffaa] disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#00e699]/25 active:scale-95"
              >
                {isBuying ? (
                  <>
                    <Loader2 size={14} className="animate-spin text-black" />
                    <span>Processing Ticket Order...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={14} className="stroke-[2.5]" />
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

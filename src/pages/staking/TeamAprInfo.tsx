/*
 FILE: src/pages/staking/TeamAprInfo.tsx

 PURPOSE:
 Team APR Distribution, Laps Tracking, and Rank Tier Bracket matrix.
 Styled with authentic Olymp Trade pitch-black OLED palette:
 - Canvas: #000000, Obsidian card bodies: #08080a, Hairline borders: #18181c
 - Buttons & Accents: Signature Olymp Trade Emerald Green (#00e699)
*/

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { EmptyState } from '../../components/common/EmptyState';
import { Transaction } from '../../types';
import { ArrowLeft, ArrowRight, BarChart3, Clock, DollarSign, Layers } from 'lucide-react';

export const TeamAprInfo: React.FC = () => {
  const { emptyStateMode } = useAuth();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState<number>(1);

  const todayReceivedUSDT = emptyStateMode ? 0.0 : 18.5;
  const todayLapsUSDT = emptyStateMode ? 0.0 : 0.0;

  // Rank 1 to 9 brackets
  const rankBrackets = [
    { rank: 1, min: 15, max: 20 },
    { rank: 2, min: 20, max: 30 },
    { rank: 3, min: 30, max: 50 },
    { rank: 4, min: 50, max: 75 },
    { rank: 5, min: 75, max: 125 },
    { rank: 6, min: 125, max: 175 },
    { rank: 7, min: 175, max: 250 },
    { rank: 8, min: 250, max: 500 },
    { rank: 9, min: 500, max: 1000 },
  ];

  useEffect(() => {
    if (emptyStateMode) {
      setTransactions([]);
    } else {
      loadTransactions();
    }
  }, [emptyStateMode, page]);

  const loadTransactions = async () => {
    try {
      const res = await ApiService.getTransactions({ limit: 4 });
      if (res.success && res.data) {
        setTransactions(res.data.filter((t) => t.type === 'STAKING_INCOME'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans select-none">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            Team APR Income
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic Multi-Tier APR Brackets & Laps Audit
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Transaction List */}
        <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-5">
          <div className="border-b border-[#18181c] pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Transaction Ledger ({transactions.length})
            </h3>
          </div>

          {transactions.length === 0 ? (
            <EmptyState
              title="Data Not Found"
              description="No APR income records discovered for this billing period."
              actionText="Refresh APR Income"
              onAction={loadTransactions}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-[#18181c]">
                  <tr>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Reference ID</th>
                    <th className="py-2.5 px-3">Tier</th>
                    <th className="py-2.5 px-3 text-right">Received</th>
                    <th className="py-2.5 px-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#121216]">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#0e0e12] transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-200">{tx.typeLabel}</td>
                      <td className="py-3 px-3 text-[#00e699]">{tx.referenceId}</td>
                      <td className="py-3 px-3 text-slate-300">Rank Bracket 1</td>
                      <td className="py-3 px-3 text-right font-bold text-[#00e699]">
                        +${tx.amountUSD.toFixed(2)} USDT
                      </td>
                      <td className="py-3 px-3 text-right text-slate-500 text-[11px]">
                        {tx.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-3">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-200 bg-[#020204] hover:bg-[#18181c] border border-[#18181c] disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setPage(page + 1)}
              className="py-2.5 px-4 rounded-xl text-xs font-bold text-black bg-[#00e699] hover:bg-[#00ffaa] shadow-md shadow-[#00e699]/20 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Right Column: Today Stats & Brackets Table */}
        <div className="lg:col-span-4 space-y-4">
          {/* Today Received & Laps Card */}
          <div className="p-5 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Today Received Amount</span>
              <span className="text-sm font-bold text-[#00e699] font-mono">
                ${todayReceivedUSDT.toFixed(4)} USDT
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#18181c]">
              <span className="text-xs text-slate-400">Today Laps Amount</span>
              <span className="text-sm font-bold text-slate-500 font-mono">
                ${todayLapsUSDT.toFixed(4)} USDT
              </span>
            </div>
          </div>

          {/* Brackets Table */}
          <div className="p-5 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Rank APR Distribution Brackets
            </h4>

            <div className="overflow-hidden rounded-xl border border-[#18181c]">
              <table className="w-full text-center text-xs font-mono">
                <thead className="bg-[#020204] text-[11px] uppercase text-slate-500 border-b border-[#18181c]">
                  <tr>
                    <th className="py-2 px-2">Rank</th>
                    <th className="py-2 px-2">Min</th>
                    <th className="py-2 px-2">Max</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#121216]">
                  {rankBrackets.map((rb) => (
                    <tr key={rb.rank} className="hover:bg-[#0e0e12] transition-colors">
                      <td className="py-2 px-2 font-bold text-[#00e699]">{rb.rank}</td>
                      <td className="py-2 px-2 text-slate-300">{rb.min}</td>
                      <td className="py-2 px-2 text-slate-300 font-semibold">{rb.max}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

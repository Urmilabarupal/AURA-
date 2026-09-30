/*
 FILE: src/pages/staking/TeamAprInfo.tsx

 PURPOSE:
 Team APR Distribution, Laps Tracking, and Rank Tier Bracket matrix.
 Corresponds to Reference Screenshots 37 and 39. Implements Section 17.

 RESPONSIBILITIES:
 - Display Today Received Amount and Today Laps Amount
 - Render Rank 1 to Rank 9 Min/Max bracket limits table
 - Display transactions log with Preview & Next pagination controls
 - Support "Data Not Found" empty state and populated state

 API:
 Calls ApiService.getTransactions.

 NOTE:
 Developer documentation only. Never expose sensitive information.
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

  // Rank 1 to 9 brackets (Screenshot 37 & 39 exact values)
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
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-100 uppercase tracking-tight">
            Team APR Income
          </h1>
          <p className="text-xs text-slate-400">Dynamic Multi-Tier APR Brackets & Laps Audit</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Transaction List with Preview & Next (Screenshots 37 & 39 Left) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-5">
          <div className="border-b border-[#1b2238] pb-3">
            <h3 className="text-sm font-bold text-slate-200">
              Transaction ({transactions.length})
            </h3>
          </div>

          {transactions.length === 0 ? (
            <EmptyState
              title="Data Not Found"
              description="The requested information is currently unavailable"
              actionText="Refresh APR Income"
              onAction={loadTransactions}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-[#1f263d]">
                  <tr>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Reference ID</th>
                    <th className="py-2.5 px-3">Tier</th>
                    <th className="py-2.5 px-3 text-right">Received</th>
                    <th className="py-2.5 px-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#171d30]">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#151a2d]">
                      <td className="py-3 px-3 font-semibold text-slate-200">{tx.typeLabel}</td>
                      <td className="py-3 px-3 text-purple-400">{tx.referenceId}</td>
                      <td className="py-3 px-3 text-slate-300">Rank Bracket 1</td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-400">
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

          {/* Pagination Buttons: Preview and Next (Screenshots 37 & 39) */}
          <div className="grid grid-cols-2 gap-3 pt-3">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Preview</span>
            </button>

            <button
              onClick={() => setPage(page + 1)}
              className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Right Column: Today Stats & Brackets Table (Screenshots 37 & 39 Right) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Today Received & Laps Card */}
          <div className="p-5 rounded-2xl bg-[#131728] border border-[#202740] shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Today Received Amount</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                ${todayReceivedUSDT.toFixed(4)} USDT
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#1b2238]">
              <span className="text-xs text-slate-400">Today Laps Amount</span>
              <span className="text-sm font-bold text-slate-400 font-mono">
                ${todayLapsUSDT.toFixed(4)} USDT
              </span>
            </div>
          </div>

          {/* Brackets Table (Screenshot 37 & 39) */}
          <div className="p-5 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Rank APR Distribution Brackets
            </h4>

            <div className="overflow-hidden rounded-xl border border-[#1b2238]">
              <table className="w-full text-center text-xs font-mono">
                <thead className="bg-[#0c0f1a] text-[11px] uppercase text-slate-500 border-b border-[#1b2238]">
                  <tr>
                    <th className="py-2 px-2">Rank</th>
                    <th className="py-2 px-2">Min</th>
                    <th className="py-2 px-2">Max</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#171d30]">
                  {rankBrackets.map((rb) => (
                    <tr key={rb.rank} className="hover:bg-[#151a2d]">
                      <td className="py-2 px-2 font-bold text-purple-400">{rb.rank}</td>
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

/*
 FILE: src/pages/rewards/RoyaltySlot.tsx

 PURPOSE:
 Global Royalty Pool Dividend & Tier Slot distribution interface.
 Corresponds to Reference Screenshot 22.

 RESPONSIBILITIES:
 - Display Royalty Slot projections: "From Royalty Slot You Will Earn" and "You Earned From The Royalty Slot"
 - Render pool progress bar and percentage completion
 - Provide transaction log with Sort By, Search, and "See More" pagination
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
import { Crown, DollarSign, RefreshCw, Search, Sparkles, TrendingUp } from 'lucide-react';

export const RoyaltySlot: React.FC = () => {
  const { emptyStateMode } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (emptyStateMode) {
      setTransactions([]);
    } else {
      loadTransactions();
    }
  }, [emptyStateMode]);

  const loadTransactions = async () => {
    try {
      const res = await ApiService.getTransactions({ limit: 5 });
      if (res.success && res.data) {
        setTransactions(res.data.filter((t) => t.type === 'STAKING_INCOME' || t.type === 'ROYALTY_INCOME'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const willEarnUSD = emptyStateMode ? 0.0 : 1500.0;
  const earnedUSD = emptyStateMode ? 0.0 : 425.5;
  const progressPercent = emptyStateMode ? 0 : 28.3;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-100 uppercase tracking-tight">
            Royalty Slot
          </h1>
          <p className="text-xs text-slate-400">Global Revenue Sharing Dividend Pool</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Transactions / Data Not Found (Screenshot 22 Left) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-lg space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#18181c] pb-3">
            <h3 className="text-sm font-bold text-slate-200">
              Transaction ({transactions.length})
            </h3>

            <div className="flex items-center gap-2">
              <select className="px-3 py-1.5 rounded-xl bg-[#020204] border border-[#18181c] text-xs text-slate-300">
                <option value="newest">Sort By: Newest</option>
                <option value="highest">Sort By: Amount</option>
              </select>
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search Transaction"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-7 pr-3 py-1.5 rounded-xl bg-[#020204] border border-[#18181c] text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {transactions.length === 0 ? (
            <EmptyState
              title="Data Not Found"
              description="The requested information is currently unavailable"
              actionText="Reload Pool Data"
              onAction={loadTransactions}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-[#18181c]">
                  <tr>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Reference ID</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#171d30]">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#151a2d]">
                      <td className="py-3 px-3 font-semibold text-slate-200">{tx.typeLabel}</td>
                      <td className="py-3 px-3 font-mono text-[#00e699]">{tx.referenceId}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                        +${tx.amountUSD.toFixed(2)} USDT
                      </td>
                      <td className="py-3 px-3 text-right text-slate-500 font-mono text-[11px]">
                        {tx.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="pt-2 text-center">
            <button
              onClick={loadTransactions}
              className="w-full max-w-xs py-2.5 px-6 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 shadow-md shadow-indigo-950/40 cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <span>See More</span>
            </button>
          </div>
        </div>

        {/* Right Column: Earnings & Progress Card (Screenshot 22 Right) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-lg space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-[#00e699] border border-purple-500/30">
              <Crown size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Royalty Performance</h3>
              <p className="text-[10px] text-slate-400">Quarterly Global Distribution</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#020204] border border-[#18181c] space-y-1">
              <p className="text-xs text-slate-400 font-medium">From Royalty Slot You Will Earn:</p>
              <h4 className="text-xl font-black text-slate-100 font-mono">
                ${willEarnUSD.toFixed(4)}
              </h4>
            </div>

            <div className="p-4 rounded-xl bg-[#020204] border border-[#18181c] space-y-1">
              <p className="text-xs text-slate-400 font-medium">You Earned From The Royalty Slot:</p>
              <h4 className="text-xl font-black text-emerald-400 font-mono">
                ${earnedUSD.toFixed(4)}
              </h4>
            </div>

            {/* Progress Gauge (Screenshot 22) */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Pool Progress</span>
                <span className="font-mono text-[#00e699] font-bold">{progressPercent.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-[#020204] h-3 rounded-full overflow-hidden border border-[#1d243b]">
                <div
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

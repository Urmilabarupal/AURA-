/*
 FILE: src/pages/rewards/BloggingView.tsx

 PURPOSE:
 Content Creator and Community Blogging Bounty incentive portal.
 Corresponds to Reference Screenshot 23.

 RESPONSIBILITIES:
 - Display Creator Bounty projections: "From Blogging You Will Earn" and "You Earned From The Blogging"
 - Render content submission verification form and status
 - Provide transaction history for blog reward disbursements
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
import { BookOpen, ExternalLink, PenTool, RefreshCw, Search, Send, Sparkles } from 'lucide-react';

export const BloggingView: React.FC = () => {
  const { emptyStateMode } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [blogUrl, setBlogUrl] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

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
        setTransactions(res.data.filter((t) => t.type === 'BLOGGING_INCOME' || t.type === 'COMMUNITY_COMMISSION'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const willEarnUSD = emptyStateMode ? 0.0 : 800.0;
  const earnedUSD = emptyStateMode ? 0.0 : 150.0;
  const progressPercent = emptyStateMode ? 0 : 18.75;

  const handleSubmitBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogUrl.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setBlogUrl('');
    }, 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-100 uppercase tracking-tight">
            Blogging
          </h1>
          <p className="text-xs text-slate-400">Content Creator & Article Bounty Rewards</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Transactions / Data Not Found (Screenshot 23 Left) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-lg space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#18181c] pb-3">
            <h3 className="text-sm font-bold text-slate-200">
              Transaction ({transactions.length})
            </h3>
            <div className="flex items-center gap-2">
              <select className="px-3 py-1.5 rounded-xl bg-[#020204] border border-[#18181c] text-xs text-slate-300">
                <option value="newest">Sort By: Newest</option>
                <option value="amount">Sort By: Reward</option>
              </select>
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search Transaction"
                  className="pl-7 pr-3 py-1.5 rounded-xl bg-[#020204] border border-[#18181c] text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {transactions.length === 0 ? (
            <EmptyState
              title="Data Not Found"
              description="The requested information is currently unavailable"
              actionText="Refresh Rewards"
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

        {/* Right Column: Earnings & Submission Card (Screenshot 23 Right) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-lg space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Blogging Rewards</h3>
              <p className="text-[10px] text-slate-400">Publish & Earn Ecosystem Bounty</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#020204] border border-[#18181c] space-y-1">
              <p className="text-xs text-slate-400 font-medium">From Blogging You Will Earn :</p>
              <h4 className="text-xl font-black text-slate-100 font-mono">
                ${willEarnUSD.toFixed(4)}
              </h4>
            </div>

            <div className="p-4 rounded-xl bg-[#020204] border border-[#18181c] space-y-1">
              <p className="text-xs text-slate-400 font-medium">You Earned From The Blogging :</p>
              <h4 className="text-xl font-black text-emerald-400 font-mono">
                ${earnedUSD.toFixed(4)}
              </h4>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Reward Cap Met</span>
                <span className="font-mono text-[#00e699] font-bold">{progressPercent.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-[#020204] h-3 rounded-full overflow-hidden border border-[#1d243b]">
                <div
                  className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Submission Form */}
            <form onSubmit={handleSubmitBlog} className="pt-2 border-t border-[#1d243b] space-y-3">
              <p className="text-xs font-bold text-slate-200">Submit Article / Video Link</p>
              <input
                type="url"
                placeholder="https://medium.com/@your-review"
                value={blogUrl}
                onChange={(e) => setBlogUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#020204] border border-[#18181c] text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-[#00ffaa] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Send size={13} />
                <span>{submitted ? 'Bounty Review Submitted!' : 'Submit for Review'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

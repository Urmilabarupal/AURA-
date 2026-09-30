/*
 FILE: src/pages/community/CommunityTransactions.tsx

 PURPOSE:
 Community Referral Commission Transactions & Level Commission Matrix.
 Corresponds to Reference Screenshot 38. Implements Rule 19.

 RESPONSIBILITIES:
 - Display 10-tier Commission Percentage cards (Level 1 20%, Level 2 10%, etc.)
 - Render community commission transaction audit trail
 - Support "Data Not Found" empty state and populated state
 - Provide sub-navigation across Community modules

 API:
 Calls ApiService.getCommunityLevels and ApiService.getTransactions.

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { EmptyState } from '../../components/common/EmptyState';
import { CommunityLevelData, Transaction } from '../../types';
import { Award, Layers, Percent, TrendingUp, Users } from 'lucide-react';

export const CommunityTransactions: React.FC = () => {
  const { setActiveRoute, emptyStateMode } = useAuth();

  const [levels, setLevels] = useState<CommunityLevelData[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadData();
  }, [emptyStateMode]);

  const loadData = async () => {
    const lvlRes = await ApiService.getCommunityLevels();
    if (lvlRes.success && lvlRes.data) {
      setLevels(lvlRes.data);
    }

    if (emptyStateMode) {
      setTransactions([]);
    } else {
      const txRes = await ApiService.getTransactions({ limit: 5 });
      if (txRes.success && txRes.data) {
        setTransactions(txRes.data.filter((t) => t.type === 'COMMUNITY_COMMISSION' || t.type === 'STAKING_INCOME'));
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Sub-Navigation Bar (Screenshot 38) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#131728] border border-[#202740] shadow-md">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveRoute('community-overview')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            Overview
          </button>
          <button
            onClick={() => setActiveRoute('community-levels')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            Levels
          </button>
          <button
            onClick={() => setActiveRoute('community-transactions')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-sm"
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveRoute('community-income')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            Income
          </button>
          <button
            onClick={() => setActiveRoute('community-share')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            Share
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Transactions / Data Not Found (Screenshot 38 Left) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-4">
          <div className="border-b border-[#1b2238] pb-3">
            <h3 className="text-sm font-bold text-slate-200">
              Transactions ({transactions.length})
            </h3>
          </div>

          {transactions.length === 0 ? (
            <EmptyState
              title="Data Not Found"
              description="The requested information is currently unavailable"
              actionText="Refresh Transactions"
              onAction={loadData}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-[#1f263d]">
                  <tr>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Reference ID</th>
                    <th className="py-2.5 px-3">Rate</th>
                    <th className="py-2.5 px-3 text-right">Commission</th>
                    <th className="py-2.5 px-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#171d30]">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#151a2d]">
                      <td className="py-3 px-3 font-semibold text-slate-200">{tx.typeLabel}</td>
                      <td className="py-3 px-3 text-purple-400">{tx.referenceId}</td>
                      <td className="py-3 px-3 text-slate-300">Level 1 (20%)</td>
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
        </div>

        {/* Right Column: 2-Column Level Commission Rates (Screenshot 38 Right) */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3">
          {levels.map((lvl) => (
            <div
              key={lvl.level}
              className="p-4 rounded-2xl bg-[#131728] border border-[#202740] shadow-md space-y-2 text-center"
            >
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-300">
                <Percent size={13} className="text-purple-400" />
                <span>Level {lvl.level}</span>
              </div>

              <div className="py-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/40">
                  REWARD {lvl.commissionPercent}%
                </span>
                <h4 className="text-xl font-black text-slate-100 font-mono mt-2">
                  {emptyStateMode ? '0' : lvl.referredUsersCount}
                </h4>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Referrals
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

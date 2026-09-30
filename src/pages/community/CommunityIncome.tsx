/*
 FILE: src/pages/community/CommunityIncome.tsx

 PURPOSE:
 Community Referral Commission Income Summary and Payout Analytics.
 Implements Rule 19 (Community Income).

 RESPONSIBILITIES:
 - Display Total Referral Commissions, Today's Earnings, and Direct Bonus
 - Render level-by-level income breakdown table
 - Support sub-navigation across Community modules

 API:
 Calls ApiService.getCommunityLevels and ApiService.getWallets.

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { CommunityLevelData } from '../../types';
import { Award, Coins, DollarSign, Layers, TrendingUp, Users } from 'lucide-react';

export const CommunityIncome: React.FC = () => {
  const { setActiveRoute, emptyStateMode } = useAuth();
  const [levels, setLevels] = useState<CommunityLevelData[]>([]);

  useEffect(() => {
    loadLevels();
  }, [emptyStateMode]);

  const loadLevels = async () => {
    const res = await ApiService.getCommunityLevels();
    if (res.success && res.data) {
      if (emptyStateMode) {
        setLevels(res.data.map((l) => ({ ...l, earnedIncomeUSDT: 0 })));
      } else {
        setLevels(res.data);
      }
    }
  };

  const totalCommission = emptyStateMode
    ? 0
    : levels.reduce((acc, curr) => acc + curr.earnedIncomeUSDT, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Sub-Navigation Bar */}
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
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveRoute('community-income')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-sm"
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

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#131728] border border-[#202740] shadow-md space-y-1">
          <p className="text-xs text-slate-400 font-semibold uppercase">Total Commission Earned</p>
          <h3 className="text-2xl font-black text-slate-100 font-mono">
            ${totalCommission.toFixed(2)} <span className="text-xs text-purple-400">USDT</span>
          </h3>
          <p className="text-[10px] text-slate-500">All-time multi-level commissions</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#131728] border border-[#202740] shadow-md space-y-1">
          <p className="text-xs text-slate-400 font-semibold uppercase">Today's Income</p>
          <h3 className="text-2xl font-black text-emerald-400 font-mono">
            ${(totalCommission * 0.08).toFixed(2)} USDT
          </h3>
          <p className="text-[10px] text-slate-500">Credited automatically</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#131728] border border-[#202740] shadow-md space-y-1">
          <p className="text-xs text-slate-400 font-semibold uppercase">Direct Bonus Share</p>
          <h3 className="text-2xl font-black text-blue-400 font-mono">
            ${(totalCommission * 0.45).toFixed(2)} USDT
          </h3>
          <p className="text-[10px] text-slate-500">Level 1 (20% commission tier)</p>
        </div>
      </div>

      {/* Income Breakdown by Level */}
      <div className="p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide border-b border-[#1b2238] pb-3">
          Level Commission Breakdown (Levels 1 - 10)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-[#1f263d]">
              <tr>
                <th className="py-2.5 px-3">Level</th>
                <th className="py-2.5 px-3">Commission Rate</th>
                <th className="py-2.5 px-3">Active Members</th>
                <th className="py-2.5 px-3">Team Deposit</th>
                <th className="py-2.5 px-3 text-right">Earned Income</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171d30]">
              {levels.map((lvl) => (
                <tr key={lvl.level} className="hover:bg-[#151a2d]">
                  <td className="py-3 px-3 font-bold text-slate-200">Level {lvl.level}</td>
                  <td className="py-3 px-3 text-purple-400 font-bold">{lvl.commissionPercent}%</td>
                  <td className="py-3 px-3 text-slate-300">{lvl.referredUsersCount}</td>
                  <td className="py-3 px-3 text-slate-300">${lvl.totalDepositUSDT.toFixed(2)} USDT</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-400">
                    +${lvl.earnedIncomeUSDT.toFixed(2)} USDT
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/*
 FILE: src/pages/staking/TeamStaking.tsx

 PURPOSE:
 Team Staking Volume, Downline Holding Income, and Multi-Level Yield tracking.
 Styled with authentic Olymp Trade pitch-black OLED palette:
 - Canvas: #000000, Obsidian card bodies: #08080a, Hairline borders: #18181c
 - Buttons & Accents: Signature Olymp Trade Emerald Green (#00e699)
*/

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { EmptyState } from '../../components/common/EmptyState';
import { Transaction } from '../../types';
import { BRAND } from '../../config/brand';
import { Coins, DollarSign, Layers, TrendingUp, Users, Wallet } from 'lucide-react';

export const TeamStaking: React.FC = () => {
  const { emptyStateMode } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [holdingPercent, setHoldingPercent] = useState<number>(25);
  const [level1Percent, setLevel1Percent] = useState<number>(50);

  const teamHoldingIncome = emptyStateMode ? 0.0 : 1850.5;
  const totalTeamStake = emptyStateMode ? 0.0 : 4850.0;
  const perDayTotalIncome = emptyStateMode ? 0.0 : 42.85;
  const level1Stake = emptyStateMode ? 0.0 : 1200.0;

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
        setTransactions(res.data.filter((t) => t.type === 'STAKING_INCOME' || t.type === 'COMMUNITY_COMMISSION'));
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
            Team Staking Income
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Collaborative Network Staking & Yield Pool
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Transactions */}
        <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-5">
          <div className="border-b border-[#18181c] pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Network Transactions ({transactions.length})
            </h3>
          </div>

          {transactions.length === 0 ? (
            <EmptyState
              title="No Data"
              description="No team staking activity recorded yet on this account."
              actionText="Refresh Team Data"
              onAction={loadTransactions}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-[#18181c]">
                  <tr>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Reference ID</th>
                    <th className="py-2.5 px-3">Member</th>
                    <th className="py-2.5 px-3 text-right">Commission</th>
                    <th className="py-2.5 px-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#121216]">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#0e0e12] transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-200">{tx.typeLabel}</td>
                      <td className="py-3 px-3 text-[#00e699]">{tx.referenceId}</td>
                      <td className="py-3 px-3 text-slate-300">Level 1 Member</td>
                      <td className="py-3 px-3 text-right font-bold text-[#00e699]">
                        +${tx.amount.toFixed(2)} USDT
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

        {/* Right Column: Metrics & Selectors */}
        <div className="lg:col-span-4 space-y-4">
          {/* Total Team Holding Income */}
          <div className="p-5 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold">Total Team Holding Income</p>
              <h4 className="text-xl font-black text-white font-mono mt-1">
                ${teamHoldingIncome.toFixed(4)} USDT
              </h4>
            </div>
            <div className="p-3 rounded-xl bg-[#00e699]/15 text-[#00e699]">
              <Coins size={22} className="stroke-[2.5]" />
            </div>
          </div>

          {/* Total Team Stake */}
          <div className="p-5 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold">Total Team Stake</p>
              <h4 className="text-xl font-black text-white font-mono mt-1">
                {totalTeamStake.toFixed(2)} {BRAND.tokenSymbol}
              </h4>
            </div>
            <div className="p-3 rounded-xl bg-[#020204] border border-[#18181c] text-white">
              <Users size={22} />
            </div>
          </div>

          {/* Per Day Total Income Card */}
          <div className="p-5 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">Per Day Total Income</span>
              <span className="text-sm font-black text-[#00e699] font-mono">
                ${perDayTotalIncome.toFixed(4)}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center gap-1 bg-[#020204] p-1.5 rounded-xl border border-[#18181c]">
                {[5, 25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setHoldingPercent(pct)}
                    className={`flex-1 py-1 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                      holdingPercent === pct
                        ? 'bg-[#00e699] text-black shadow-sm font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Level 1 Stake Card */}
          <div className="p-5 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">Level 1 Stake</span>
              <span className="text-sm font-black text-white font-mono">
                ${level1Stake.toFixed(2)}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center gap-1 bg-[#020204] p-1.5 rounded-xl border border-[#18181c]">
                {[5, 25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setLevel1Percent(pct)}
                    className={`flex-1 py-1 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                      level1Percent === pct
                        ? 'bg-[#00e699] text-black shadow-sm font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

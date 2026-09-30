/*
 FILE: src/pages/staking/StakingView.tsx

 PURPOSE:
 Staking Overview and Active Lock Status management.
 Corresponds to Reference Screenshot 34. Implements Section 17.

 RESPONSIBILITIES:
 - Display active staking plan status card: "Plan not activated" vs "Active Staking"
 - Render Total Amount staked in native token
 - Provide transaction log for stake deposits and daily yield accruals
 - Support "Data Not Found" empty state and populated state
 - Link directly to Staking Plans

 API:
 Calls ApiService.getWallets and ApiService.getTransactions.

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { EmptyState } from '../../components/common/EmptyState';
import { Transaction } from '../../types';
import { ArrowRight, CheckCircle2, Coins, Layers, Lock, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

export const StakingView: React.FC = () => {
  const { wallets, setActiveRoute, emptyStateMode } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const isStakingActive = !emptyStateMode;
  const totalStakedAURA = emptyStateMode ? 0.0 : 250.0;
  const totalStakedUSD = emptyStateMode ? 0.0 : 84300.0;

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
        setTransactions(res.data.filter((t) => t.type.includes('STAKING')));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-100 uppercase tracking-tight">Staking</h1>
          <p className="text-xs text-slate-400">Fixed-Yield Compound Staking Ledger</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Transactions / Empty State (Screenshot 34 Left) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-5">
          <div className="flex items-center justify-between border-b border-[#1b2238] pb-3">
            <h3 className="text-sm font-bold text-slate-200">
              Transactions ({transactions.length})
            </h3>
            <button
              onClick={() => setActiveRoute('staking-plan')}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
            >
              Browse Plans
            </button>
          </div>

          {transactions.length === 0 ? (
            <EmptyState
              title="Data Not Found"
              description="The requested information is currently unavailable"
              actionText="View Staking Plans"
              onAction={() => setActiveRoute('staking-plan')}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-[#1f263d]">
                  <tr>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Reference ID</th>
                    <th className="py-2.5 px-3">Plan</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#171d30]">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#151a2d]">
                      <td className="py-3 px-3 font-semibold text-slate-200">{tx.typeLabel}</td>
                      <td className="py-3 px-3 text-purple-400">{tx.referenceId}</td>
                      <td className="py-3 px-3 text-slate-300">{tx.description}</td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-400">
                        {tx.amount} {tx.currency}
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

        {/* Right Column: Staking Status Card (Screenshot 34 Right) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-5">
          {/* Staking Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/60 to-purple-950/60 border border-blue-500/30 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 shrink-0">
              <Lock size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100">Staking</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                {isStakingActive
                  ? 'Plan active! Earning daily compounded yields.'
                  : 'Plan not activated, join Staking and enjoy steady Incomes!'}
              </p>
            </div>
          </div>

          {/* Total Amount Staked */}
          <div className="p-4 rounded-xl bg-[#0c0f1a] border border-[#1b2238] space-y-1">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              TOTAL AMOUNT
            </span>
            <h3 className="text-2xl font-black text-slate-100 font-mono">
              {totalStakedAURA.toFixed(2)}{' '}
              <span className="text-xs font-bold text-purple-400">AURA</span>
            </h3>
            <p className="text-xs text-slate-500 font-mono">${totalStakedUSD.toFixed(2)} USDT</p>
          </div>

          {/* Status Indicator (Screenshot 34) */}
          <div className="p-3.5 rounded-xl bg-[#0c0f1a] border border-[#1b2238] flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isStakingActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
              }`}
            ></span>
            <span className="text-xs font-semibold text-slate-200">
              {isStakingActive ? 'Staking Plan Active (100% APR)' : 'Staking Not Started'}
            </span>
          </div>

          {/* Action Button */}
          <button
            onClick={() => setActiveRoute('staking-plan')}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-95 shadow-md shadow-purple-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles size={14} />
            <span>Choose Staking Plan</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

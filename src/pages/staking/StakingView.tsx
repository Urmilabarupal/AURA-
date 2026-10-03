/*
 FILE: src/pages/staking/StakingView.tsx

 PURPOSE:
 Staking Overview and Active Lock Status management with Real-Time APY Percentage Visualization.
 Styled with authentic Olymp Trade Pitch-Black OLED theme:
 - Pitch black OLED canvas (#000000)
 - High-density Recharts APY Curve & Compound Yield simulator
 - Active staking plan status card & total staked metrics
 - Real-time transaction ledger with clean monospace typography
 - Neon emerald (#00e699) primary buttons & indicators
*/

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { EmptyState } from '../../components/common/EmptyState';
import { Transaction } from '../../types';
import { BRAND } from '../../config/brand';
import { StakingApyVisualizer } from '../../components/staking/StakingApyVisualizer';
import {
  ArrowRight,
  CheckCircle2,
  Coins,
  History,
  Layers,
  Lock,
  Percent,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

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
    <div className="space-y-6 pb-12 font-sans select-none">
      {/* 1. Header with Live Status Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Staking Vaults
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#00e699]/15 border border-[#00e699]/30 text-[#00e699] text-[10px] font-mono font-bold">
              UP TO 102.5% APY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Institutional Fixed-Yield & Compounded Smart Contract Pools
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveRoute('staking-plan')}
          className="px-4 py-2.5 rounded-xl bg-[#00e699] hover:bg-[#00ffaa] text-black font-extrabold text-xs tracking-tight shadow-lg shadow-[#00e699]/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
        >
          <Sparkles size={14} className="stroke-[2.5]" />
          <span>Browse All Plans</span>
          <ArrowRight size={14} className="stroke-[2.5]" />
        </button>
      </div>

      {/* 2. Real-Time APY Percentage Visualization & Dynamic Yield Simulator (Recharts) */}
      <StakingApyVisualizer
        initialStakeAmount={1000}
        onSelectPlan={(planId) => setActiveRoute('staking-plan')}
      />

      {/* 3. Staking Overview Metrics & Transaction Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Transactions / Empty State */}
        <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-[#18181c] pb-3">
            <div className="flex items-center gap-2">
              <History size={16} className="text-[#00e699]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Staking Ledger ({transactions.length})
              </h3>
            </div>
            <button
              onClick={() => setActiveRoute('staking-plan')}
              className="text-xs text-[#00e699] hover:text-[#00ffaa] font-semibold transition-colors cursor-pointer"
            >
              Deposit New Stake
            </button>
          </div>

          {transactions.length === 0 ? (
            <EmptyState
              title="Data Not Found"
              description="No active staking transactions detected on this account."
              actionText="Deposit & Stake Now"
              onAction={() => setActiveRoute('staking-plan')}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-[#18181c]">
                  <tr>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Reference ID</th>
                    <th className="py-2.5 px-3">Pool Tier</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#121216]">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#0e0e12] transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-200">{tx.typeLabel}</td>
                      <td className="py-3 px-3 text-[#00e699]">{tx.referenceId}</td>
                      <td className="py-3 px-3 text-slate-300">{tx.description}</td>
                      <td className="py-3 px-3 text-right font-bold text-[#00e699]">
                        +{tx.amount} {tx.currency}
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

        {/* Right Column: User Staking Status Card */}
        <div className="lg:col-span-4 p-5 sm:p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-5">
          {/* Staking Status Banner */}
          <div className="p-4 rounded-xl bg-[#020204] border border-[#18181c] flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-[#00e699]/15 text-[#00e699] shrink-0">
              <Lock size={18} className="stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Smart Contract Status
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                {isStakingActive
                  ? 'Plan active! Earning daily compounded yields automatically.'
                  : 'No active plan found. Select a high-yield term to start earning daily.'}
              </p>
            </div>
          </div>

          {/* Total Amount Staked */}
          <div className="p-4 rounded-xl bg-[#020204] border border-[#18181c] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">
                Total Staked Principal
              </span>
              <span className="text-[10px] font-mono text-[#00e699] font-bold">100% APR LOCK</span>
            </div>
            <h3 className="text-2xl font-black text-white font-mono">
              {totalStakedAURA.toFixed(2)}{' '}
              <span className="text-xs font-bold text-[#00e699] font-sans">
                {BRAND.tokenSymbol}
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              ≈ ${totalStakedUSD.toLocaleString()} USDT
            </p>
          </div>

          {/* Status Indicator */}
          <div className="p-3.5 rounded-xl bg-[#020204] border border-[#18181c] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isStakingActive ? 'bg-[#00e699] animate-pulse' : 'bg-[#ff3b5c]'
                }`}
              />
              <span className="text-xs font-semibold text-slate-200">
                {isStakingActive ? 'Compounding Active' : 'Staking Inactive'}
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-[#00e699]">
              {isStakingActive ? '102.5% APY' : '0%'}
            </span>
          </div>

          {/* Action Button */}
          <button
            onClick={() => setActiveRoute('staking-plan')}
            className="w-full py-3 px-4 rounded-xl text-xs font-extrabold text-black bg-[#00e699] hover:bg-[#00ffaa] shadow-lg shadow-[#00e699]/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <Sparkles size={14} className="stroke-[2.5]" />
            <span>Deposit into Staking Pool</span>
            <ArrowRight size={14} className="stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};

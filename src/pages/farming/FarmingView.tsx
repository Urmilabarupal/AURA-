/*
 FILE: src/pages/farming/FarmingView.tsx

 PURPOSE:
 Decentralized Liquidity Yield Farming overview and pool analytics.
 Implements Rule 18 (Farming Module).

 RESPONSIBILITIES:
 - Display TVL (Total Value Locked) and Total Harvested Rewards
 - Render active farming pools (AURA/USDT LP 124.5% APY, AURA/ETH LP 92.0%, HXC/USDT LP 68.4%)
 - Provide harvest actions to claim accumulated yield into Spot Wallet
 - Display farming transactions and "Data Not Found" empty state

 API:
 Calls ApiService.getFarmingPlans and ApiService.getTransactions.

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { EmptyState } from '../../components/common/EmptyState';
import { FarmingPlan, Transaction } from '../../types';
import { BRAND } from '../../config/brand';
import { ArrowRight, Coins, Flame, Layers, Lock, Sparkles, TrendingUp, Zap } from 'lucide-react';

export const FarmingView: React.FC = () => {
  const { setActiveRoute, emptyStateMode } = useAuth();

  const [plans, setPlans] = useState<FarmingPlan[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const tvl = emptyStateMode ? 0 : 8248100;
  const harvestedYieldUSD = emptyStateMode ? 0 : 312.4;

  useEffect(() => {
    loadData();
  }, [emptyStateMode]);

  const loadData = async () => {
    const plansRes = await ApiService.getFarmingPlans();
    if (plansRes.success && plansRes.data) {
      setPlans(plansRes.data);
    }

    if (emptyStateMode) {
      setTransactions([]);
    } else {
      const txRes = await ApiService.getTransactions({ limit: 4 });
      if (txRes.success && txRes.data) {
        setTransactions(txRes.data.filter((t) => t.type.includes('FARMING') || t.type.includes('STAKING')));
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-100 uppercase tracking-tight">Farming</h1>
          <p className="text-xs text-slate-400">Automated Liquidity Provision & Yield Generation</p>
        </div>
        <button
          onClick={() => setActiveRoute('farming-plan')}
          className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md transition-colors"
        >
          Explore LP Pools
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-[#131728] border border-[#202740] shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Total Value Locked (TVL)
            </p>
            <h3 className="text-2xl font-black text-slate-100 font-mono mt-1">
              ${tvl.toLocaleString()} USD
            </h3>
            <span className="text-[10px] text-emerald-400 font-mono">Cross-chain Protocol Depth</span>
          </div>
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
            <Zap size={24} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#131728] border border-[#202740] shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Harvested Yield
            </p>
            <h3 className="text-2xl font-black text-emerald-400 font-mono mt-1">
              ${harvestedYieldUSD.toFixed(2)} USDT
            </h3>
            <span className="text-[10px] text-slate-400">Available to harvest</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
            <Coins size={24} />
          </div>
        </div>
      </div>

      {/* Farming Pools List */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 px-1">
          Active Liquidity Pools ({plans.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((pool) => (
            <div
              key={pool.id}
              className="p-5 rounded-2xl bg-[#131728] border border-[#202740] hover:border-purple-500/40 shadow-lg space-y-4 flex flex-col justify-between transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                      LP
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">{pool.poolPair}</h4>
                      <span className="text-[10px] text-purple-400 font-mono font-bold">
                        {pool.multiplier}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                    {pool.apyPercent}% APY
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#0c0f1a] border border-[#1b2238] space-y-1 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Lock Duration:</span>
                    <span className="text-slate-200">{pool.lockPeriodDays} Days</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Pool TVL:</span>
                    <span className="text-slate-200">${pool.tvlUSD.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Reward Token:</span>
                    <span className="text-purple-400 font-bold">{pool.rewardToken}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveRoute('farming-plan')}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Farm LP</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Farming History */}
      <div className="p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide border-b border-[#1b2238] pb-3">
          Farming Activity History
        </h3>

        {transactions.length === 0 ? (
          <EmptyState
            title="Data Not Found"
            description="The requested farming information is currently unavailable"
            actionText="Refresh Pools"
            onAction={loadData}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-[#1f263d]">
                <tr>
                  <th className="py-2 px-3">Type</th>
                  <th className="py-2 px-3">Reference ID</th>
                  <th className="py-2 px-3">Pool</th>
                  <th className="py-2 px-3 text-right">Yield</th>
                  <th className="py-2 px-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171d30]">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#151a2d]">
                    <td className="py-3 px-3 font-semibold text-slate-200">{tx.typeLabel}</td>
                    <td className="py-3 px-3 text-purple-400">{tx.referenceId}</td>
                    <td className="py-3 px-3 text-slate-300">{BRAND.tokenSymbol}/USDT LP</td>
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
    </div>
  );
};

/*
 FILE: src/pages/staking/StakingPlan.tsx

 PURPOSE:
 Staking Plans Catalog and Yield Commitment interface.
 Corresponds to Reference Screenshot 35. Implements Section 17.

 RESPONSIBILITIES:
 - Render Staking Plan cards (1825 Days 100% APR, 730 Days 45%, 365 Days 25%, 90 Days 12%)
 - Display period, currency, period type (/ Day), APR %, and feature checkmarks
 - Provide working "Choose Plan" commitment modal with live yield calculation
 - Enforce server-authoritative balance verification and stake execution

 API:
 Calls ApiService.getStakingPlans, ApiService.stake, and ApiService.getWallets.

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { StakingPlan } from '../../types';
import { BRAND } from '../../config/brand';
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  Coins,
  Crown,
  Layers,
  Loader2,
  Lock,
  Percent,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';

export const StakingPlanView: React.FC = () => {
  const { wallets, refreshUserData, setActiveRoute } = useAuth();

  const [plans, setPlans] = useState<StakingPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<StakingPlan | null>(null);
  const [stakeAmount, setStakeAmount] = useState<number>(100);
  const [isStaking, setIsStaking] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    const res = await ApiService.getStakingPlans();
    if (res.success && res.data) {
      setPlans(res.data);
    }
  };

  const handleOpenPlan = (plan: StakingPlan) => {
    setSelectedPlan(plan);
    setStakeAmount(plan.minAmount);
    setFeedback(null);
  };

  const handleExecuteStake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    setFeedback(null);

    const available = wallets?.mainBalanceNative || 0;
    if (available < stakeAmount) {
      setFeedback({
        type: 'error',
        msg: `Insufficient ${BRAND.tokenSymbol} in Main Wallet. Available: ${available.toFixed(4)} ${BRAND.tokenSymbol}`,
      });
      return;
    }

    if (stakeAmount < selectedPlan.minAmount) {
      setFeedback({
        type: 'error',
        msg: `Minimum stake for this plan is ${selectedPlan.minAmount} ${BRAND.tokenSymbol}.`,
      });
      return;
    }

    setIsStaking(true);
    try {
      const res = await ApiService.stake({
        planId: selectedPlan.id,
        amountAURA: stakeAmount,
      });

      if (res.success) {
        setFeedback({
          type: 'success',
          msg: `Successfully locked ${stakeAmount} ${BRAND.tokenSymbol} in ${selectedPlan.name}!`,
        });
        await refreshUserData();
        setTimeout(() => {
          setSelectedPlan(null);
          setActiveRoute('staking');
        }, 1500);
      } else {
        setFeedback({ type: 'error', msg: res.error?.message || 'Staking failed.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', msg: err.message || 'Staking error.' });
    } finally {
      setIsStaking(false);
    }
  };

  const dailyReturnEst = selectedPlan
    ? +((stakeAmount * (selectedPlan.aprPercent / 100)) / 365).toFixed(4)
    : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-100 uppercase tracking-tight">
            Staking Plan
          </h1>
          <p className="text-xs text-slate-400">Guaranteed Return Fixed-Term Staking Pools</p>
        </div>
      </div>

      {/* Plans Grid (Screenshot 35 layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="p-6 rounded-2xl bg-[#131728] border border-[#202740] hover:border-purple-500/50 transition-all shadow-xl space-y-5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Plan Title & APR Badge (Screenshot 35) */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 font-mono">
                    Premium Pool
                  </span>
                  <h3 className="text-lg font-black text-slate-100 mt-0.5">{plan.name}</h3>
                </div>
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
                  <Percent size={20} />
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 leading-relaxed">{plan.description}</p>

              {/* Bullet Features with Checkmarks (Screenshot 35) */}
              <div className="p-4 rounded-xl bg-[#0c0f1a] border border-[#1b2238] space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Check size={14} className="text-blue-400" />
                  <span>Period: <strong className="text-white">{plan.durationDays} Days</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Check size={14} className="text-blue-400" />
                  <span>Currency: <strong className="text-white">{plan.currency}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Check size={14} className="text-blue-400" />
                  <span>Period Type: <strong className="text-white">{plan.periodType}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Check size={14} className="text-blue-400" />
                  <span>APR: <strong className="text-emerald-400 font-mono">{plan.aprPercent.toFixed(2)}%</strong></span>
                </div>
              </div>
            </div>

            {/* Choose Plan Button (Screenshot 35) */}
            <button
              onClick={() => handleOpenPlan(plan)}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles size={14} />
              <span>Choose Plan</span>
            </button>
          </div>
        ))}
      </div>

      {/* Plan Commitment Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-[#141829] border border-[#202740] shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#1d243b] pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100">{selectedPlan.name}</h3>
                <p className="text-[11px] text-purple-400 font-mono">
                  {selectedPlan.aprPercent}% APR · {selectedPlan.durationDays} Days Lock
                </p>
              </div>
              <button onClick={() => setSelectedPlan(null)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleExecuteStake} className="space-y-4">
              {feedback && (
                <div
                  className={`p-3 rounded-xl border flex items-start gap-2 text-xs ${
                    feedback.type === 'success'
                      ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300'
                      : 'bg-red-950/40 border-red-800/50 text-red-300'
                  }`}
                >
                  {feedback.type === 'success' ? (
                    <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-emerald-400" />
                  ) : (
                    <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-400" />
                  )}
                  <span>{feedback.msg}</span>
                </div>
              )}

              <div className="p-3 rounded-xl bg-[#0c0f1a] border border-[#1b2238] flex items-center justify-between text-xs">
                <span className="text-slate-400">Available in Main Wallet:</span>
                <span className="font-mono font-bold text-slate-100">
                  {wallets?.mainBalanceNative.toFixed(4) || '0.0000'} {BRAND.tokenSymbol}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>Stake Amount ({BRAND.tokenSymbol})</span>
                  <button
                    type="button"
                    onClick={() => setStakeAmount(wallets?.mainBalanceNative || 0)}
                    className="text-purple-400 hover:text-purple-300 font-bold"
                  >
                    MAX
                  </button>
                </div>
                <input
                  type="number"
                  min={selectedPlan.minAmount}
                  step="1"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0f1a] border border-[#202740] text-sm font-mono text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Yield Forecast */}
              <div className="p-3 rounded-xl bg-[#0c0f1a] border border-[#1b2238] space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Daily Yield:</span>
                  <span className="font-bold text-emerald-400">+{dailyReturnEst} {BRAND.tokenSymbol}/day</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Lock Period Yield:</span>
                  <span className="font-bold text-slate-100">
                    +{(dailyReturnEst * selectedPlan.durationDays).toFixed(2)} {BRAND.tokenSymbol}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isStaking}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-950/40"
              >
                {isStaking ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Locking Staking Assets...</span>
                  </>
                ) : (
                  <span>Confirm & Lock Staking</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

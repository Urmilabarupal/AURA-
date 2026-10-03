/*
 FILE: src/pages/staking/StakingPlan.tsx

 PURPOSE:
 Staking Plans Catalog and Yield Commitment interface.
 Styled with authentic Olymp Trade pitch-black OLED palette:
 - Canvas: #000000, Obsidian card bodies: #08080a, Hairline borders: #18181c
 - Buttons: Signature Olymp Trade Emerald Green (#00e699)
 - Real-time yield estimator inside commitment modal
 - Server-authoritative balance verification
*/

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { StakingPlan } from '../../types';
import { BRAND } from '../../config/brand';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Coins,
  Crown,
  Layers,
  Loader2,
  Lock,
  Percent,
  ShieldCheck,
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

  const totalReturnEst = selectedPlan
    ? +((stakeAmount * (selectedPlan.aprPercent / 100) * (selectedPlan.durationDays / 365))).toFixed(2)
    : 0;

  return (
    <div className="space-y-6 pb-12 font-sans select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveRoute('staking')}
              className="p-1.5 rounded-lg bg-[#08080a] border border-[#18181c] text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Staking Vault Catalog
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Guaranteed Yield Fixed-Term Pools with On-Chain Auto-Restaking
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveRoute('staking')}
          className="px-3.5 py-2 rounded-xl bg-[#08080a] border border-[#18181c] text-xs font-mono font-semibold text-[#00e699] hover:bg-[#121216] transition-colors cursor-pointer flex items-center gap-2"
        >
          <TrendingUp size={14} />
          <span>View Real-Time APY Chart</span>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => {
          const isVip = plan.durationDays >= 1825;
          return (
            <div
              key={plan.id}
              className={`p-6 rounded-2xl bg-[#08080a] border transition-all duration-200 shadow-2xl flex flex-col justify-between space-y-5 ${
                isVip
                  ? 'border-[#00e699]/40 hover:border-[#00e699] hover:shadow-[0_0_30px_rgba(0,230,153,0.15)]'
                  : 'border-[#18181c] hover:border-[#282830]'
              }`}
            >
              <div className="space-y-4">
                {/* Plan Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider font-mono ${
                        isVip ? 'text-[#00e699]' : 'text-slate-400'
                      }`}
                    >
                      {isVip ? '★ Institutional Sovereign Tier' : 'Standard Yield Pool'}
                    </span>
                    <h3 className="text-lg font-black text-white mt-0.5">{plan.name}</h3>
                  </div>
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      isVip
                        ? 'bg-[#00e699]/15 border border-[#00e699]/30 text-[#00e699]'
                        : 'bg-[#020204] border border-[#18181c] text-slate-300'
                    }`}
                  >
                    <Percent size={20} className="stroke-[2.5]" />
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed">{plan.description}</p>

                {/* Features Box */}
                <div className="p-4 rounded-xl bg-[#020204] border border-[#18181c] space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-2">
                      <Check size={14} className="text-[#00e699]" />
                      Lock Period:
                    </span>
                    <strong className="text-white font-mono">{plan.durationDays} Days</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-2">
                      <Check size={14} className="text-[#00e699]" />
                      Payout Currency:
                    </span>
                    <strong className="text-white font-mono">{plan.currency}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-2">
                      <Check size={14} className="text-[#00e699]" />
                      Settlement Frequency:
                    </span>
                    <strong className="text-white">{plan.periodType}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 border-t border-[#18181c] pt-2">
                    <span className="flex items-center gap-2 font-bold text-white">
                      <TrendingUp size={14} className="text-[#00e699]" />
                      Fixed APR:
                    </span>
                    <strong className="text-base font-black text-[#00e699] font-mono">
                      {plan.aprPercent.toFixed(2)}%
                    </strong>
                  </div>
                </div>
              </div>

              {/* Choose Plan Button (Olymp Trade Green) */}
              <button
                type="button"
                onClick={() => handleOpenPlan(plan)}
                className={`w-full py-3.5 px-4 rounded-xl text-xs font-extrabold tracking-tight transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                  isVip
                    ? 'bg-[#00e699] hover:bg-[#00ffaa] text-black shadow-lg shadow-[#00e699]/30'
                    : 'bg-[#18181c] hover:bg-[#222228] text-white hover:text-[#00e699] border border-[#222228]'
                }`}
              >
                <Sparkles size={14} className="stroke-[2.5]" />
                <span>Select {plan.name}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Plan Commitment Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-[#08080a] border border-[#18181c] shadow-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-[#18181c] pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{selectedPlan.name}</h3>
                <p className="text-xs text-[#00e699] font-mono mt-0.5">
                  {selectedPlan.aprPercent}% APR · {selectedPlan.durationDays} Days Lock
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#18181c] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleExecuteStake} className="space-y-4">
              {feedback && (
                <div
                  className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                    feedback.type === 'success'
                      ? 'bg-emerald-950/40 border-[#00e699]/40 text-[#00e699]'
                      : 'bg-red-950/40 border-red-800/50 text-[#ff3b5c]'
                  }`}
                >
                  {feedback.type === 'success' ? (
                    <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-[#00e699]" />
                  ) : (
                    <AlertCircle size={16} className="shrink-0 mt-0.5 text-[#ff3b5c]" />
                  )}
                  <span>{feedback.msg}</span>
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-[#020204] border border-[#18181c] flex items-center justify-between text-xs">
                <span className="text-slate-400">Available in Main Wallet:</span>
                <span className="font-mono font-bold text-white">
                  {wallets?.mainBalanceNative.toFixed(4) || '0.0000'} {BRAND.tokenSymbol}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300">
                  <label className="font-semibold">Stake Amount ({BRAND.tokenSymbol})</label>
                  <button
                    type="button"
                    onClick={() => setStakeAmount(wallets?.mainBalanceNative || 0)}
                    className="text-[#00e699] hover:text-[#00ffaa] font-bold text-xs"
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
                  className="w-full px-4 py-3 rounded-xl bg-[#020204] border border-[#18181c] text-sm font-mono text-white focus:outline-none focus:border-[#00e699] transition-colors"
                />
              </div>

              {/* Yield Projection Breakdown */}
              <div className="p-3.5 rounded-xl bg-[#020204] border border-[#18181c] space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Daily Estimated Payout:</span>
                  <span className="text-[#00e699] font-bold">
                    +{dailyReturnEst} {BRAND.tokenSymbol}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Total Maturity Return:</span>
                  <span className="text-[#00ffaa] font-bold">
                    +{totalReturnEst} {BRAND.tokenSymbol}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-[#18181c] pt-2 text-white">
                  <span className="font-bold">Total Payout at Maturity:</span>
                  <span className="font-black text-white">
                    {(stakeAmount + totalReturnEst).toFixed(2)} {BRAND.tokenSymbol}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isStaking}
                  className="w-full py-3.5 px-4 rounded-xl text-xs font-extrabold text-black bg-[#00e699] hover:bg-[#00ffaa] shadow-lg shadow-[#00e699]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isStaking ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-black" />
                      <span>Locking Capital On-Chain...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={15} className="stroke-[2.5]" />
                      <span>Confirm & Lock {stakeAmount} {BRAND.tokenSymbol}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

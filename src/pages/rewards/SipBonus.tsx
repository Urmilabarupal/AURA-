/*
 FILE: src/pages/rewards/SipBonus.tsx

 PURPOSE:
 Systematic Investment Plan (SIP) Monthly Salary & Community Leadership Bonus.
 Corresponds to Reference Screenshot 24.

 RESPONSIBILITIES:
 - Display SIP bonus ranks: Seed, Growth, Booster, Elite, Legend
 - Render requirements: Required Active Persons, SIP ticket amount, Total Volume
 - Display Monthly Reward Salary for each tier
 - Show progress bars for active community members recruited
 - Support salary claims and status updates

 API:
 Calls ApiService.getSipBonusTiers.

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { SipBonusTier } from '../../types';
import { BRAND } from '../../config/brand';
import { AlertCircle, Award, CheckCircle2, ChevronRight, Gift, Sparkles, TrendingUp, Users } from 'lucide-react';

export const SipBonus: React.FC = () => {
  const { emptyStateMode, refreshUserData } = useAuth();
  const [tiers, setTiers] = useState<SipBonusTier[]>([]);
  const [claimedTier, setClaimedTier] = useState<string | null>(null);

  useEffect(() => {
    loadTiers();
  }, [emptyStateMode]);

  const loadTiers = async () => {
    const res = await ApiService.getSipBonusTiers();
    if (res.success && res.data) {
      if (emptyStateMode) {
        setTiers(res.data.map((t) => ({ ...t, activeUsersCount: 0, isUnlocked: false })));
      } else {
        setTiers(res.data);
      }
    }
  };

  const handleClaimSalary = (tierName: string) => {
    setClaimedTier(tierName);
    setTimeout(async () => {
      setClaimedTier(null);
      await refreshUserData();
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header (Screenshot 24) */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-100 uppercase tracking-tight">
            {BRAND.name} SIP Bonus
          </h1>
          <p className="text-xs text-slate-400">Monthly Recurring Leadership Salary</p>
        </div>
      </div>

      {/* Tier Cards List (Screenshot 24) */}
      <div className="space-y-4">
        {tiers.map((tier, idx) => {
          const progressPercent = Math.min((tier.activeUsersCount / tier.neededPersons) * 100, 100);

          return (
            <div
              key={idx}
              className={`p-6 rounded-2xl border transition-all ${
                tier.isUnlocked
                  ? 'bg-[#151c33] border-purple-500/40 shadow-lg'
                  : 'bg-[#131728] border-[#202740]'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-2xl shrink-0 ${
                      tier.isUnlocked
                        ? 'bg-gradient-to-tr from-pink-500 to-purple-600 text-white shadow-md'
                        : 'bg-[#181f36] text-slate-500'
                    }`}
                  >
                    <TrendingUp size={22} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-slate-100">{tier.rankName}</h3>
                      {tier.isUnlocked && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                          QUALIFIED
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 font-mono">
                      Needed: Person = {tier.neededPersons}, SIP = ${tier.sipAmount} USDT, Amount = ${tier.totalVolumeRequired} USDT
                    </p>

                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="text-xs font-bold text-slate-300">
                        Monthly Reward Salary:
                      </span>
                      <span className="text-sm font-black text-emerald-400 font-mono">
                        {tier.monthlyRewardSalary} USDT
                      </span>
                    </div>
                  </div>
                </div>

                <div className="md:min-w-[200px] text-right space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Active Users:</span>
                    <span className="font-mono text-purple-300 font-bold">
                      {tier.activeUsersCount} / {tier.neededPersons}
                    </span>
                  </div>

                  <div className="w-full bg-[#0c0f1a] h-2.5 rounded-full overflow-hidden border border-[#1e253b]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        tier.isUnlocked
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : 'bg-gradient-to-r from-purple-500 to-blue-500'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>

                  {tier.isUnlocked && (
                    <button
                      onClick={() => handleClaimSalary(tier.rankName)}
                      className="mt-2 w-full py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 shadow-md shadow-emerald-950/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Gift size={13} />
                      <span>{claimedTier === tier.rankName ? 'Credited to Wallet!' : 'Claim Salary'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

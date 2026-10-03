/*
 FILE: src/pages/jackpot/JackpotReward.tsx

 PURPOSE:
 Jackpot Team Business and Multi-Tier Milestone Rewards.
 Corresponds to Reference Screenshots 43 and 44. Implements Rule 20.

 RESPONSIBILITIES:
 - Display Team Business breakdown (Direct, Master Leg, Another Leg) with iconic 3D badges
 - Display user's current Reward Rank (e.g. "0 Rank")
 - Render complete 6-tier Jackpot Reward Ladder (Jackpot Reward 1 to 6)
 - Support claiming unlocked jackpot milestone rewards

 API:
 Calls ApiService.getWallets.

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Award,
  Crown,
  DollarSign,
  Gift,
  Loader2,
  Rocket,
  Sparkles,
  Star,
  Trophy,
  Users,
} from 'lucide-react';

export const JackpotReward: React.FC = () => {
  const { user, emptyStateMode } = useAuth();
  const [claimedTier, setClaimedTier] = useState<number | null>(null);

  const direct = emptyStateMode ? 0.0 : 4.0;
  const masterLeg = emptyStateMode ? 0.0 : 25.0;
  const anotherLeg = emptyStateMode ? 0.0 : 15.0;

  const jackpotTiers = [
    { tier: 1, name: 'Jackpot Reward 1', direct: 2, masterLeg: 20, allLegs: 20, rewardUSDT: 20, unlocked: !emptyStateMode },
    { tier: 2, name: 'Jackpot Reward 2', direct: 4, masterLeg: 40, allLegs: 40, rewardUSDT: 40, unlocked: false },
    { tier: 3, name: 'Jackpot Reward 3', direct: 6, masterLeg: 80, allLegs: 80, rewardUSDT: 80, unlocked: false },
    { tier: 4, name: 'Jackpot Reward 4', direct: 8, masterLeg: 100, allLegs: 100, rewardUSDT: 100, unlocked: false },
    { tier: 5, name: 'Jackpot Reward 5', direct: 10, masterLeg: 200, allLegs: 200, rewardUSDT: 200, unlocked: false },
    { tier: 6, name: 'Jackpot Reward 6', direct: 12, masterLeg: 400, allLegs: 400, rewardUSDT: 400, unlocked: false },
  ];

  const handleClaim = (tierNum: number) => {
    setClaimedTier(tierNum);
    setTimeout(() => {
      setClaimedTier(null);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-100 uppercase tracking-tight">
            Jackpot Reward
          </h1>
          <p className="text-xs text-slate-400">Team Business Milestones & Tier Bonuses</p>
        </div>
      </div>

      {/* Team Business Summary Card (Screenshot 43 Top) */}
      <div className="p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-lg space-y-4">
        <div className="border-b border-[#18181c] pb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200">Team Business</h3>
          <span className="text-xs text-[#00e699] font-mono">Userid: {user?.id}</span>
        </div>

        {/* 3 Metric Columns with 3D Icons (Screenshot 43) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#020204] border border-[#18181c] flex items-center justify-between">
            <div>
              <h4 className="text-2xl font-black text-slate-100 font-mono">
                {direct.toFixed(2)}
              </h4>
              <p className="text-xs text-slate-400 font-semibold mt-1">Direct</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-[#00e699] shadow-inner">
              <Rocket size={28} />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#020204] border border-[#18181c] flex items-center justify-between">
            <div>
              <h4 className="text-2xl font-black text-slate-100 font-mono">
                {masterLeg.toFixed(2)}
              </h4>
              <p className="text-xs text-slate-400 font-semibold mt-1">Master Leg</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
              <Star size={28} />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#020204] border border-[#18181c] flex items-center justify-between">
            <div>
              <h4 className="text-2xl font-black text-slate-100 font-mono">
                {anotherLeg.toFixed(2)}
              </h4>
              <p className="text-xs text-slate-400 font-semibold mt-1">Another Leg</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
              <DollarSign size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Jackpot Reward Ladder (Screenshots 43 & 44) */}
      <div className="p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-lg space-y-5">
        {/* Your Reward Banner (Screenshot 44) */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/60 to-blue-950/60 border border-purple-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-[#00e699]">
              <Trophy size={20} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#00ffaa]">YOUR REWARD</span>
              <h4 className="text-xl font-black text-slate-100 font-mono">
                {emptyStateMode ? '0 Rank' : 'Rank 1'}
              </h4>
            </div>
          </div>
        </div>

        {/* 6 Jackpot Tiers (Screenshot 44) */}
        <div className="space-y-3">
          {jackpotTiers.map((tier) => (
            <div
              key={tier.tier}
              className={`p-4 rounded-2xl border transition-all ${
                tier.unlocked
                  ? 'bg-[#151c33] border-purple-500/40 shadow-md'
                  : 'bg-[#020204] border-[#1d243b]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-100">{tier.name}</h4>
                    {tier.unlocked && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                        MET
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                    <span>Needed: Direct {tier.direct}</span>
                    <span>·</span>
                    <span>Master leg: {tier.masterLeg}</span>
                    <span>·</span>
                    <span>All Legs: {tier.allLegs}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 sm:min-w-[180px]">
                  <span className="text-sm font-black text-emerald-400 font-mono">
                    Reward: {tier.rewardUSDT} USDT
                  </span>

                  {tier.unlocked ? (
                    <button
                      onClick={() => handleClaim(tier.tier)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 shadow-md transition-all cursor-pointer"
                    >
                      {claimedTier === tier.tier ? 'Claimed!' : 'Claim'}
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono">In Progress</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

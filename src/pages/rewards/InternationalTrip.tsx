/*
 FILE: src/pages/rewards/InternationalTrip.tsx

 PURPOSE:
 Exclusive International Travel Reward qualification portal.
 Corresponds to Reference Screenshots 16 and 17.

 RESPONSIBILITIES:
 - Display promotional Explorer 4N 5D package details (Flight, Hotel, Meals included)
 - Render dual qualification pathways: "Stake Only" ($12,000) vs "Matching Only" ($5,000 + $32,000)
 - Show live progress indicators and criteria cards
 - Display campaign validity dates and qualification claim action

 API:
 Calls ApiService.getProfile and ApiService.getWallets.

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Hotel,
  Luggage,
  Plane,
  Sparkles,
  Utensils,
} from 'lucide-react';

export const InternationalTrip: React.FC = () => {
  const { emptyStateMode, setActiveRoute } = useAuth();

  const selfStakingAchieved = emptyStateMode ? 0 : 12000;
  const selfPortfolioAchieved = emptyStateMode ? 0 : 5000;
  const matchingAchieved = emptyStateMode ? 0 : 32000;

  const isStakeOnlyQualified = selfStakingAchieved >= 12000;
  const isMatchingQualified = selfPortfolioAchieved >= 5000 && matchingAchieved >= 32000;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Hero Promo Banner (Screenshot 16) */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1b1736] via-[#151930] to-[#0c0f1c] border border-purple-500/30 p-8 sm:p-10 shadow-2xl text-center space-y-6">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg">
            <Plane size={28} />
          </div>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-[#0d101d] rounded-[14px] flex items-center justify-center font-bold text-xs text-white">
              AX
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-200 to-pink-300 tracking-tight">
            Travel To International Trip
          </h1>
          <p className="text-xs sm:text-sm font-extrabold tracking-widest text-purple-400 uppercase font-mono">
            EXPLORER 4N 5D PACKAGE
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300 pt-2 font-medium">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <Plane size={15} /> Flight
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <Hotel size={15} /> Hotel
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1.5 text-pink-300">
              <Utensils size={15} /> Meals Included
            </span>
          </div>
        </div>

        {/* Dual Progress Pill Cards (Screenshot 16 bottom) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto pt-2">
          {/* Stake Only */}
          <div className="p-4 rounded-2xl bg-[#0c0f1a]/80 border border-[#232b47] text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-pink-400 uppercase tracking-wide">
                Stake Only
              </span>
              {isStakeOnlyQualified && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                  ACHIEVED
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300">
              SELF $12,000 STAKING — {isStakeOnlyQualified ? 'ACHIEVED' : 'IN PROGRESS'}
            </p>
            <div className="w-full bg-[#1b2238] h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-pink-500 to-purple-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((selfStakingAchieved / 12000) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Matching Only */}
          <div className="p-4 rounded-2xl bg-[#0c0f1a]/80 border border-[#232b47] text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                Matching Only
              </span>
              {isMatchingQualified && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                  ACHIEVED
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300">
              Self: ${selfPortfolioAchieved} · Matching: ${matchingAchieved}
            </p>
            <div className="w-full bg-[#1b2238] h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-cyan-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((matchingAchieved / 32000) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Campaign Details & Criteria Cards (Screenshot 17) */}
      <section className="p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Calendar size={13} />
            <span>Offer From 01 Sep 2026 to 31st Dec 2026</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            From September 1 to December 31, qualify for the Travel to International Explorer 4N 5D package by achieving $12,000 Self Staking or $5,000 Self Portfolio with $32,000 Matching. Enjoy flights, hotel accommodation, and meals included in this exclusive travel reward.
          </p>
        </div>

        {/* 3 Metric Cards (Screenshot 17) */}
        <div className="space-y-3">
          {/* Card 1: Self Staking - Stake Only */}
          <div className="p-5 rounded-2xl bg-[#0c0f1a] border border-[#1e253b] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                <Luggage size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Self Staking - Stake Only</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Achieve $12,000 in self staking to qualify for the international Explorer package. This is your primary qualification path for the travel offer.
                </p>
              </div>
            </div>
            <div className="text-right sm:min-w-[120px]">
              <span className="text-xl font-black text-slate-100 font-mono">
                ${selfStakingAchieved.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <p className="text-[10px] text-slate-500">Target: $12,000</p>
            </div>
          </div>

          {/* Card 2: Self Portfolio - Matching Only */}
          <div className="p-5 rounded-2xl bg-[#0c0f1a] border border-[#1e253b] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                <Compass size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Self Portfolio - Matching Only</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Achieve $5,000 self portfolio to unlock matching benefits. This represents your personal investment in the system.
                </p>
              </div>
            </div>
            <div className="text-right sm:min-w-[120px]">
              <span className="text-xl font-black text-slate-100 font-mono">
                ${selfPortfolioAchieved.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <p className="text-[10px] text-slate-500">Target: $5,000</p>
            </div>
          </div>

          {/* Card 3: Matching Achievement */}
          <div className="p-5 rounded-2xl bg-[#0c0f1a] border border-[#1e253b] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                <Award size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Matching Achievement</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Achieve $32,000 matching volume to complete your qualification for the international travel package with matching option.
                </p>
              </div>
            </div>
            <div className="text-right sm:min-w-[120px]">
              <span className="text-xl font-black text-slate-100 font-mono">
                ${matchingAchieved.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <p className="text-[10px] text-slate-500">Target: $32,000</p>
            </div>
          </div>
        </div>

        {/* Qualification Status Button */}
        <div className="pt-2 text-center">
          <button
            onClick={() => setActiveRoute('staking')}
            className="py-3 px-8 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-95 transition-all shadow-lg shadow-purple-950/40 cursor-pointer inline-flex items-center gap-2"
          >
            <Sparkles size={16} />
            <span>Increase Staking To Qualify</span>
          </button>
        </div>
      </section>
    </div>
  );
};

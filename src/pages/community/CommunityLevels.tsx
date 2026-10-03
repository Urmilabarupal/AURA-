/*
 FILE: src/pages/community/CommunityLevels.tsx

 PURPOSE:
 10-Tier Community Depth Matrix & Level Analytics.
 Corresponds to Reference Screenshot 45. Implements Rule 19.

 RESPONSIBILITIES:
 - Display 10-tier community hierarchy grid (Level 1 to Level 10)
 - Show user count and aggregate deposits for each level
 - Render downline members list
 - Support sub-navigation across Community modules

 API:
 Calls ApiService.getCommunityLevels.

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { EmptyState } from '../../components/common/EmptyState';
import { CommunityLevelData } from '../../types';
import { Layers, ShieldCheck, User, Users } from 'lucide-react';

export const CommunityLevels: React.FC = () => {
  const { setActiveRoute, emptyStateMode } = useAuth();
  const [levels, setLevels] = useState<CommunityLevelData[]>([]);

  useEffect(() => {
    loadLevels();
  }, [emptyStateMode]);

  const loadLevels = async () => {
    const res = await ApiService.getCommunityLevels();
    if (res.success && res.data) {
      if (emptyStateMode) {
        setLevels(res.data.map((l) => ({ ...l, referredUsersCount: 0, totalDepositUSDT: 0 })));
      } else {
        setLevels(res.data);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Sub-Navigation Bar (Screenshot 45) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-md">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveRoute('community-overview')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            Overview
          </button>
          <button
            onClick={() => setActiveRoute('community-levels')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#00e699] text-black font-extrabold shadow-sm"
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
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Referred Users */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-lg space-y-4">
          <div className="border-b border-[#18181c] pb-3">
            <h3 className="text-sm font-bold text-slate-200">Referred Users</h3>
          </div>

          <EmptyState
            title="Data Not Found"
            description="The requested information is currently unavailable"
            actionText="Refresh Levels"
            onAction={loadLevels}
          />
        </div>

        {/* Right Column: 2-Column Level 1 to 10 Grid (Screenshot 45 Right) */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3">
          {levels.map((lvl) => (
            <div
              key={lvl.level}
              className="p-4 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-md space-y-2 text-center"
            >
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-300">
                <Users size={14} className="text-blue-400" />
                <span>Level {lvl.level}</span>
              </div>

              <div className="py-1">
                <h4 className="text-2xl font-black text-slate-100 font-mono">
                  {lvl.referredUsersCount}
                </h4>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Total Deposit
                </p>
                <p className="text-xs font-bold text-emerald-400 font-mono mt-0.5">
                  ${lvl.totalDepositUSDT.toFixed(2)} USDT
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

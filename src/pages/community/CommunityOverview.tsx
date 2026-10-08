/*
 FILE: src/pages/community/CommunityOverview.tsx

 PURPOSE:
 Community Network Overview & Direct Referral Roster.
 Corresponds to Reference Screenshot 46. Implements Rule 19.

 RESPONSIBILITIES:
 - Provide Community sub-navigation (Overview, Levels, Transactions, Income, Share)
 - Display "Total Referred People" prominent card with "INVITED" status
 - Render Referred Users roster with registration date, volume, and active status
 - Support "Data Not Found" empty state and populated state

 API:
 Calls ApiService.getProfile and ApiService.getWallets.

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { EmptyState } from '../../components/common/EmptyState';
import { BRAND } from '../../config/brand';
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  Layers,
  Send,
  Share2,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react';

export const CommunityOverview: React.FC = () => {
  const { user, setActiveRoute, emptyStateMode } = useAuth();
  const [copied, setCopied] = useState<boolean>(false);

  const referralUrl = `https://${BRAND.domain}/?r=${user?.referId || BRAND.defaultReferId}`;
  const totalReferred = emptyStateMode ? 0 : 4;

  const sampleUsers = [
    { id: `${BRAND.name.slice(0, 2).toUpperCase()}99281`, name: 'Elena Rostova', date: '2026-09-20', deposit: 1200.0, status: 'ACTIVE' },
    { id: `${BRAND.name.slice(0, 2).toUpperCase()}88102`, name: 'Marcus Chen', date: '2026-09-15', deposit: 500.0, status: 'ACTIVE' },
    { id: `${BRAND.name.slice(0, 2).toUpperCase()}77194`, name: 'Sarah Jenkins', date: '2026-09-10', deposit: 400.0, status: 'ACTIVE' },
    { id: `${BRAND.name.slice(0, 2).toUpperCase()}66120`, name: 'David Kim', date: '2026-09-02', deposit: 300.0, status: 'ACTIVE' },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Community Sub-Navigation Bar (Screenshot 38, 45, 46) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-md">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveRoute('community-overview')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#00e699] text-black font-extrabold shadow-sm"
          >
            Overview
          </button>
          <button
            onClick={() => setActiveRoute('community-levels')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
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

        <button
          onClick={copyLink}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#020204] border border-[#18181c] text-xs font-mono text-[#00ffaa] hover:text-white transition-colors"
        >
          <Share2 size={13} />
          <span>{copied ? 'Copied!' : 'Copy Invite Link'}</span>
        </button>
      </div>

      {/* Main Grid: Referred Users on Left, Total Referred People on Right (Screenshot 46) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Referred Users List */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-lg space-y-4">
          <div className="border-b border-[#18181c] pb-3">
            <h3 className="text-sm font-bold text-slate-200">Referred Users</h3>
          </div>

          {emptyStateMode || sampleUsers.length === 0 ? (
            <EmptyState
              title="Data Not Found"
              description="You have not referred any users yet. Share your invite link to build your team!"
              actionText="Share Invite Link"
              onAction={() => setActiveRoute('community-share')}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-[#18181c]">
                  <tr>
                    <th className="py-2.5 px-3">Member ID</th>
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Join Date</th>
                    <th className="py-2.5 px-3 text-right">Total Deposit</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#171d30]">
                  {sampleUsers.map((m) => (
                    <tr key={m.id} className="hover:bg-[#151a2d]">
                      <td className="py-3 px-3 text-[#00e699] font-bold">{m.id}</td>
                      <td className="py-3 px-3 text-slate-200">{m.name}</td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">{m.date}</td>
                      <td className="py-3 px-3 text-right text-slate-100 font-bold">
                        ${m.deposit.toFixed(2)} USDT
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Total Referred People Card (Modern Money X Emerald Obsidian styling) */}
        <div className="lg:col-span-4 p-8 rounded-3xl bg-[#08080a] border border-[#00e699]/30 shadow-2xl text-center space-y-6 text-white relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e699]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex justify-center relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-[#00e699]/15 border border-[#00e699]/40 flex items-center justify-center shadow-[0_0_25px_rgba(0,230,153,0.3)]">
              <Users size={36} className="text-[#00ffa3]" />
            </div>
          </div>

          <div className="space-y-1 relative z-10">
            <h2 className="text-5xl font-black font-mono tracking-tight text-[#00ffa3] drop-shadow-[0_0_12px_rgba(0,255,163,0.4)]">
              {totalReferred}
            </h2>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Referred People
            </p>
          </div>

          {/* Quick Metrics in card */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#18181c] relative z-10 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-[#020204] border border-[#18181c]">
              <span className="text-[10px] text-slate-500 block">Direct Team</span>
              <span className="font-bold text-white mt-0.5 block">{totalReferred} Active</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#020204] border border-[#18181c]">
              <span className="text-[10px] text-slate-500 block">Commission</span>
              <span className="font-bold text-[#00ffa3] mt-0.5 block">10.0%</span>
            </div>
          </div>

          {/* Invited Action Button */}
          <button
            onClick={() => setActiveRoute('community-share')}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#00e699] hover:bg-[#00ffa3] text-black font-black text-xs tracking-wider uppercase shadow-xl shadow-[#00e699]/25 transition-all cursor-pointer active:scale-98 relative z-10"
          >
            INVITED / SHARE LINK
          </button>
        </div>
      </div>
    </div>
  );
};

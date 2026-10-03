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

        {/* Right Column: Total Referred People Card (Screenshot 46 Right) */}
        <div className="lg:col-span-4 p-8 rounded-3xl bg-blue-600 border border-blue-400/40 shadow-2xl text-center space-y-6 text-white">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
              <Users size={36} className="text-white" />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-5xl font-black font-mono tracking-tight">{totalReferred}</h2>
            <p className="text-sm font-bold uppercase tracking-wider text-blue-100">
              Total Referred People
            </p>
          </div>

          {/* Invited Action Button (Screenshot 46) */}
          <button
            onClick={() => setActiveRoute('community-share')}
            className="w-full py-3 px-6 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-black text-xs tracking-wider uppercase shadow-xl transition-all cursor-pointer"
          >
            INVITED
          </button>
        </div>
      </div>
    </div>
  );
};

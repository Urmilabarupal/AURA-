/*
 FILE: src/pages/jackpot/JackpotWinners.tsx

 PURPOSE:
 Immutable Lottery & Jackpot Drawing Winners Registry.
 Corresponds to Reference Winner screen. Implements Rule 20.

 RESPONSIBILITIES:
 - Display verified jackpot and raffle winners
 - Render Draw ID, Ticket Number, masked User ID, prize amounts, and draw dates
 - Provide search and draw filtering
 - Support "Data Not Found" empty state and populated state

 API:
 Calls ApiService.getJackpotWinners.

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { EmptyState } from '../../components/common/EmptyState';
import { JackpotDrawWinner } from '../../types';
import { Award, Calendar, RefreshCw, Search, Sparkles, Trophy } from 'lucide-react';

export const JackpotWinners: React.FC = () => {
  const { emptyStateMode } = useAuth();
  const [winners, setWinners] = useState<JackpotDrawWinner[]>([]);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    loadWinners();
  }, [emptyStateMode]);

  const loadWinners = async () => {
    if (emptyStateMode) {
      setWinners([]);
      return;
    }
    const res = await ApiService.getJackpotWinners();
    if (res.success && res.data) {
      setWinners(res.data);
    }
  };

  const filtered = winners.filter(
    (w) =>
      w.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      w.userIdMasked.toLowerCase().includes(search.toLowerCase()) ||
      w.drawId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-100 uppercase tracking-tight">Winners</h1>
          <p className="text-xs text-slate-400">Verifiable On-Chain Lottery & Jackpot Draws</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#18181c] pb-3">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-amber-400" />
            <h3 className="text-sm font-bold text-slate-200">
              Verified Draw Winners ({filtered.length})
            </h3>
          </div>

          <div className="relative min-w-[220px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search Ticket / User ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#020204] border border-[#18181c] text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="Data Not Found"
            description="The requested winner records are currently unavailable."
            actionText="Refresh Records"
            onAction={loadWinners}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-[#18181c]">
                <tr>
                  <th className="py-2.5 px-3">Draw ID</th>
                  <th className="py-2.5 px-3">Ticket Number</th>
                  <th className="py-2.5 px-3">Winner User ID</th>
                  <th className="py-2.5 px-3 text-right">Prize (USDT)</th>
                  <th className="py-2.5 px-3 text-right">Draw Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171d30]">
                {filtered.map((w) => (
                  <tr key={w.id} className="hover:bg-[#151a2d]">
                    <td className="py-3 px-3 font-bold text-[#00e699]">{w.drawId}</td>
                    <td className="py-3 px-3 text-slate-200 font-bold">#{w.ticketNumber}</td>
                    <td className="py-3 px-3 text-slate-400">{w.userIdMasked}</td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-400">
                      ${w.prizeUSDT.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDT
                    </td>
                    <td className="py-3 px-3 text-right text-slate-500 text-[11px]">{w.date}</td>
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

/*
 FILE: src/pages/jackpot/JackpotView.tsx

 PURPOSE:
 Decentralized Jackpot Prize Pool overview & Participant dashboard.
 Corresponds to Reference Screenshot 40. Implements Rule 20.

 RESPONSIBILITIES:
 - Display user's participation status (Active / Inactive)
 - Render Expected Payout ("You will Receive"), Total Jackpot Income, and Today's Jackpot Income
 - Provide recent jackpot transaction feed and "Data Not Found" empty state
 - Link to Jackpot Deposit and Rewards

 API:
 Calls ApiService.getWallets and ApiService.getTransactions.

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { EmptyState } from '../../components/common/EmptyState';
import { Transaction } from '../../types';
import { Award, Coins, DollarSign, Gift, ShieldAlert, Sparkles, Trophy, Users, Zap } from 'lucide-react';

export const JackpotView: React.FC = () => {
  const { user, wallets, setActiveRoute, emptyStateMode } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const isJackpotActive = !emptyStateMode;
  const youWillReceiveUSDT = emptyStateMode ? 0 : 1630.0;
  const totalJackpotIncome = emptyStateMode ? 0.0 : 450.0;
  const todayJackpotIncome = emptyStateMode ? 0.0 : 45.0;

  useEffect(() => {
    if (emptyStateMode) {
      setTransactions([]);
    } else {
      loadTransactions();
    }
  }, [emptyStateMode]);

  const loadTransactions = async () => {
    try {
      const res = await ApiService.getTransactions({ limit: 5 });
      if (res.success && res.data) {
        setTransactions(res.data.filter((t) => t.type === 'JACKPOT_REWARD' || t.type === 'TICKET_PURCHASE'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-100 uppercase tracking-tight">Jackpot</h1>
          <p className="text-xs text-slate-400">Guaranteed Multi-Tier Global Jackpot Pool</p>
        </div>
        <button
          onClick={() => setActiveRoute('jackpot-deposit')}
          className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md transition-colors"
        >
          Deposit to Jackpot
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Recent Transactions / Data Not Found (Screenshot 40 Left) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-4">
          <div className="border-b border-[#1b2238] pb-3">
            <h3 className="text-sm font-bold text-slate-200">Recent Transactions</h3>
          </div>

          {transactions.length === 0 ? (
            <EmptyState
              title="Data Not Found"
              description="The requested information is currently unavailable"
              actionText="Refresh Jackpot Activity"
              onAction={loadTransactions}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-[#1f263d]">
                  <tr>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#171d30]">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#151a2d]">
                      <td className="py-3 px-3 font-semibold text-slate-200">{tx.typeLabel}</td>
                      <td className="py-3 px-3 text-slate-400">{tx.timestamp}</td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-400">
                        +${tx.amount.toFixed(2)} USDT
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: User ID, Status, Expected Return (Screenshot 40 Right) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-5">
          {/* User ID & Status Card */}
          <div className="p-4 rounded-xl bg-[#0c0f1a] border border-[#1b2238] flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-500 font-mono">User id: {user?.id}</p>
              <h4 className="text-sm font-bold text-slate-200 mt-1">Jackpot Status</h4>
              <span
                className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                  isJackpotActive
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                    : 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                }`}
              >
                {isJackpotActive ? 'Active Qualified' : 'Inactive'}
              </span>
            </div>

            {/* Stylized Badge (Screenshot 40 Right) */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 via-pink-500 to-blue-500 p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-[#0d101d] rounded-[14px] flex items-center justify-center text-purple-400 font-bold">
                <Trophy size={24} />
              </div>
            </div>
          </div>

          {/* You Will Receive & Total Jackpot Income (Screenshot 40) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[#0c0f1a] border border-[#1b2238] space-y-1">
              <p className="text-[10px] text-slate-400 font-semibold">You will Receive</p>
              <h5 className="text-base font-black text-purple-300 font-mono">
                {youWillReceiveUSDT} <span className="text-[10px] text-slate-400 font-normal">USDT</span>
              </h5>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0c0f1a] border border-[#1b2238] space-y-1">
              <p className="text-[10px] text-slate-400 font-semibold">Total jackpot income</p>
              <h5 className="text-base font-black text-emerald-400 font-mono">
                ${totalJackpotIncome.toFixed(2)}
              </h5>
            </div>
          </div>

          {/* Today Jackpot Income (Screenshot 40) */}
          <div className="p-4 rounded-xl bg-[#0c0f1a] border border-[#1b2238] space-y-1">
            <p className="text-xs text-slate-400 font-semibold">Today jackpot income</p>
            <h4 className="text-xl font-black text-slate-100 font-mono">
              ${todayJackpotIncome.toFixed(2)}{' '}
              <span className="text-xs text-purple-400">USDT</span>
            </h4>
          </div>

          {/* Shortcuts */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setActiveRoute('jackpot-reward')}
              className="py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Gift size={13} />
              <span>Rank Rewards</span>
            </button>
            <button
              onClick={() => setActiveRoute('winner')}
              className="py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-[#1a223a] hover:bg-[#222c4c] border border-[#2b375c] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trophy size={13} className="text-amber-400" />
              <span>Draw Winners</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

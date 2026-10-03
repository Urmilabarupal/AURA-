/*
 FILE: src/pages/jackpot/JackpotWallet.tsx

 PURPOSE:
 Dedicated Jackpot Ledger & Prize Holding Wallet.
 Corresponds to Reference Screenshot 42. Implements Rule 20.

 RESPONSIBILITIES:
 - Display Jackpot specific wallet balances (USDT Tether)
 - Provide quick navigation to Jackpot Deposit and Rewards
 - Render dedicated jackpot activity receipts

 API:
 Calls ApiService.getWallets.

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, ArrowRight, Coins, CreditCard, DollarSign, Trophy, Wallet } from 'lucide-react';

export const JackpotWallet: React.FC = () => {
  const { wallets, setActiveRoute, emptyStateMode } = useAuth();

  const jackpotBalance = emptyStateMode ? 0 : wallets?.jackpotBalanceUSDT || 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header (Screenshot 42) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveRoute('jackpot')}
            className="p-2 rounded-xl bg-[#08080a] hover:bg-[#1d233c] text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-100 uppercase tracking-tight">
              Jackpot Wallets
            </h1>
            <p className="text-xs text-slate-400">Isolated Jackpot Escrow & Prize Ledger</p>
          </div>
        </div>
      </div>

      {/* Jackpot Wallet Card (Screenshot 42) */}
      <div className="p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-lg space-y-6">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
          Jackpot Wallet
        </h3>

        <div className="p-5 rounded-2xl bg-[#020204] border border-[#18181c] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xl shadow-inner">
              ₮
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-slate-100">USDT</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#182038] text-slate-400">
                  Tether
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Jackpot Protocol Escrow</p>
            </div>
          </div>

          <div className="text-right">
            <h4 className="text-xl font-black text-slate-100 font-mono">
              {jackpotBalance.toFixed(2)}
            </h4>
            <p className="text-xs text-slate-500 font-mono">${jackpotBalance.toFixed(2)}</p>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setActiveRoute('jackpot-deposit')}
            className="p-4 rounded-xl bg-[#171d32] border border-[#232c4a] hover:border-purple-500/40 text-left transition-all group flex items-center justify-between cursor-pointer"
          >
            <div>
              <div className="flex items-center gap-2 text-[#00e699] text-xs font-bold uppercase tracking-wider mb-1">
                <CreditCard size={14} />
                <span>Deposit More to Jackpot</span>
              </div>
              <p className="text-xs text-slate-300">Fund your balance to qualify for upcoming drawings</p>
            </div>
            <ArrowRight size={18} className="text-slate-500 group-hover:text-[#00e699] transition-colors" />
          </button>

          <button
            onClick={() => setActiveRoute('jackpot-reward')}
            className="p-4 rounded-xl bg-[#171d32] border border-[#232c4a] hover:border-blue-500/40 text-left transition-all group flex items-center justify-between cursor-pointer"
          >
            <div>
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Trophy size={14} />
                <span>Jackpot Rewards Ladder</span>
              </div>
              <p className="text-xs text-slate-300">View team milestones and tier reward bonuses</p>
            </div>
            <ArrowRight size={18} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};

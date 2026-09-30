/*
 FILE: src/pages/wallets/ExtraWallet.tsx

 PURPOSE:
 Extra Wallet & Secondary Asset holding ledger.
 Corresponds to Reference Screenshot 29 (Extra Wallet / HXC Wallet).

 RESPONSIBILITIES:
 - Display secondary network balances (HXC / Extra Token)
 - Render USD equivalent valuations
 - Provide instant shortcuts to HXC Convert and Staking
 - Maintain live authoritative balance updates

 API:
 Calls ApiService.getWallets.

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, ArrowRight, Coins, Repeat, ShieldCheck, Wallet } from 'lucide-react';

export const ExtraWallet: React.FC = () => {
  const { wallets, setActiveRoute, emptyStateMode } = useAuth();

  const hxcBalance = emptyStateMode ? 0 : wallets?.extraBalanceHXC || 0;
  const usdValue = +(hxcBalance * 0.85).toFixed(2);

  return (
    <div className="space-y-6 pb-12">
      {/* Header (Screenshot 29) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveRoute('wallets')}
            className="p-2 rounded-xl bg-[#141829] hover:bg-[#1d233c] text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-100 uppercase tracking-tight">
              Extra Wallet (HXC)
            </h1>
            <p className="text-xs text-slate-400">Secondary Liquidity & Loyalty Asset</p>
          </div>
        </div>
      </div>

      {/* Asset Card (Screenshot 29 row) */}
      <div className="p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-6">
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#0c0f1a] border border-[#1d243b]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 p-0.5 flex items-center justify-center shadow-md">
              <div className="w-full h-full bg-[#0d101d] rounded-[10px] flex items-center justify-center font-bold text-xs text-purple-300">
                HXC
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">HXC</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950/50 text-purple-300 border border-purple-800/40">
                  Helix Chain
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Extra Reserve Token</p>
            </div>
          </div>

          <div className="text-right">
            <h4 className="text-lg font-black text-slate-100 font-mono">
              {hxcBalance.toFixed(4)} <span className="text-xs text-purple-400">HXC</span>
            </h4>
            <p className="text-xs text-slate-500 font-mono">${usdValue.toFixed(4)} USD</p>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setActiveRoute('hxc-convert')}
            className="p-4 rounded-xl bg-[#171d32] border border-[#232c4a] hover:border-purple-500/40 text-left transition-all group flex items-center justify-between cursor-pointer"
          >
            <div>
              <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Repeat size={14} />
                <span>Convert to USDT</span>
              </div>
              <p className="text-xs text-slate-300">Swap HXC balance to liquid USDT instantly</p>
            </div>
            <ArrowRight size={18} className="text-slate-500 group-hover:text-purple-400 transition-colors" />
          </button>

          <button
            onClick={() => setActiveRoute('staking')}
            className="p-4 rounded-xl bg-[#171d32] border border-[#232c4a] hover:border-blue-500/40 text-left transition-all group flex items-center justify-between cursor-pointer"
          >
            <div>
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Coins size={14} />
                <span>Stake HXC</span>
              </div>
              <p className="text-xs text-slate-300">Lock in long-term high APR yield contracts</p>
            </div>
            <ArrowRight size={18} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};

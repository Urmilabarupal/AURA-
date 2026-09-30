/*
 FILE: src/pages/jackpot/JackpotDeposit.tsx

 PURPOSE:
 Dedicated Jackpot Pool Deposit & Liquidity Staking interface.
 Corresponds to Reference Screenshot 41. Implements Rule 20.

 RESPONSIBILITIES:
 - Display supported currencies (USDT Tether)
 - Render Spot Wallet available balance
 - Execute authoritative deposit into user's Jackpot ledger via ApiService
 - Provide balance Refresh trigger

 API:
 Calls ApiService.deposit and ApiService.getWallets.

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Coins,
  CreditCard,
  DollarSign,
  Loader2,
  RefreshCw,
  Wallet,
} from 'lucide-react';

export const JackpotDeposit: React.FC = () => {
  const { wallets, refreshUserData, setActiveRoute, emptyStateMode } = useAuth();

  const [depositAmount, setDepositAmount] = useState<number>(50);
  const [isDepositing, setIsDepositing] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const spotBalance = emptyStateMode ? 0 : wallets?.spotBalanceUSDT || 0;
  const jackpotBalance = emptyStateMode ? 0 : wallets?.jackpotBalanceUSDT || 0;

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (depositAmount <= 0) {
      setFeedback({ type: 'error', msg: 'Deposit amount must be greater than 0.' });
      return;
    }

    if (spotBalance < depositAmount) {
      setFeedback({
        type: 'error',
        msg: `Insufficient USDT in Spot Wallet. Available: $${spotBalance.toFixed(2)} USDT`,
      });
      return;
    }

    setIsDepositing(true);
    try {
      const res = await ApiService.deposit({
        wallet: 'jackpot',
        amountUSDT: depositAmount,
        currency: 'USDT',
      });

      if (res.success) {
        setFeedback({
          type: 'success',
          msg: `Successfully deposited ${depositAmount} USDT into Jackpot Pool!`,
        });
        await refreshUserData();
      } else {
        setFeedback({ type: 'error', msg: res.error?.message || 'Deposit failed.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', msg: err.message || 'Deposit network error.' });
    } finally {
      setIsDepositing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveRoute('jackpot')}
            className="p-2 rounded-xl bg-[#141829] hover:bg-[#1d233c] text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-100 uppercase tracking-tight">
              Jackpot Deposit
            </h1>
            <p className="text-xs text-slate-400">Qualify for Grand Drawings & Weekly Bonanzas</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Currencies List & Deposit Form (Screenshot 41 Left) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-5">
          <div className="border-b border-[#1b2238] pb-3">
            <h3 className="text-sm font-bold text-slate-200">
              Currencies <span className="text-purple-400 font-mono">(1)</span>
            </h3>
          </div>

          {/* Currency Row (Screenshot 41) */}
          <div className="p-4 rounded-xl bg-[#0c0f1a] border border-[#1b2238] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                ₮
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">USDT</h4>
                <p className="text-xs text-slate-400">Tether TRC-20 / ERC-20</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-base font-black text-slate-100 font-mono">
                {jackpotBalance.toFixed(2)} USDT
              </span>
              <p className="text-[10px] text-slate-500">Jackpot Balance</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleDeposit} className="space-y-4 pt-2">
            {feedback && (
              <div
                className={`p-3 rounded-xl border flex items-start gap-2 text-xs ${
                  feedback.type === 'success'
                    ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300'
                    : 'bg-red-950/40 border-red-800/50 text-red-300'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-emerald-400" />
                ) : (
                  <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-400" />
                )}
                <span>{feedback.msg}</span>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Deposit Amount (USDT)</span>
                <span className="text-slate-400">Spot Balance: ${spotBalance.toFixed(2)}</span>
              </div>
              <input
                type="number"
                min="10"
                step="10"
                value={depositAmount}
                onChange={(e) => setDepositAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0f1a] border border-[#202740] text-sm font-mono text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={isDepositing}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-950/40"
            >
              {isDepositing ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Funding Jackpot Pool...</span>
                </>
              ) : (
                <span>Confirm Jackpot Deposit</span>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Total Balance & Refresh (Screenshot 41 Right) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-5">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Total Balance
            </span>
            <p className="text-xs text-slate-500">Spot Wallet</p>
            <h3 className="text-3xl font-black text-slate-100 font-mono mt-1">
              {spotBalance.toFixed(2)}{' '}
              <span className="text-xs font-bold text-purple-400">USDT</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">${spotBalance.toFixed(2)}</p>
          </div>

          {/* Big Blue Refresh Button (Screenshot 41) */}
          <button
            onClick={refreshUserData}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
};

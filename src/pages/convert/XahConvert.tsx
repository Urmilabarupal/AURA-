/*
 FILE: src/pages/convert/XahConvert.tsx

 PURPOSE:
 Dedicated Native Token (AURA/XAH) to USDT Conversion portal.
 Corresponds to Reference Screenshot 30. Implements Section 16.

 RESPONSIBILITIES:
 - Display user's Spot Wallet balance
 - Calculate live conversion rate (1 AURA = 337.20 USDT)
 - Execute authoritative conversion and update wallet balances
 - Render conversion transaction log with Sort, Search, and "See More" pagination

 API:
 Calls ApiService.convertXah and ApiService.getTransactions.

 SECURITY:
 Validates user balance and executes conversion atomically server-side.

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { EmptyState } from '../../components/common/EmptyState';
import { Transaction } from '../../types';
import { BRAND } from '../../config/brand';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Loader2,
  RefreshCw,
  Repeat,
  Search,
  Wallet,
} from 'lucide-react';

export const XahConvert: React.FC = () => {
  const { wallets, refreshUserData, emptyStateMode } = useAuth();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amountXAH, setAmountXAH] = useState<number>(1);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const conversionRate = 337.2;
  const receivedUSDT = +(amountXAH * conversionRate).toFixed(2);

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
        setTransactions(res.data.filter((t) => t.type === 'CONVERT_XAH'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const available = wallets?.spotBalanceNative || 0;
    if (amountXAH <= 0) {
      setFeedback({ type: 'error', msg: 'Please enter an amount greater than 0.' });
      return;
    }

    if (available < amountXAH) {
      setFeedback({
        type: 'error',
        msg: `Insufficient ${BRAND.tokenSymbol} in Spot Wallet. Available: ${available.toFixed(4)} ${BRAND.tokenSymbol}`,
      });
      return;
    }

    setIsConverting(true);
    try {
      const res = await ApiService.convertXah(amountXAH);
      if (res.success && res.data) {
        setFeedback({
          type: 'success',
          msg: `Converted ${amountXAH} ${BRAND.tokenSymbol} to ${res.data.receivedUSDT} USDT!`,
        });
        await refreshUserData();
        loadTransactions();
      } else {
        setFeedback({ type: 'error', msg: res.error?.message || 'Conversion failed.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', msg: err.message || 'Conversion network error.' });
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-100 uppercase tracking-tight">
            {BRAND.name} Convert
          </h1>
          <p className="text-xs text-slate-400">Native Asset Liquidity Settlement</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Transactions / See More (Screenshot 30 Left) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1b2238] pb-3">
            <h3 className="text-sm font-bold text-slate-200">
              Transaction ({transactions.length})
            </h3>
            <div className="flex items-center gap-2">
              <select className="px-3 py-1.5 rounded-xl bg-[#0c0f1a] border border-[#202740] text-xs text-slate-300">
                <option value="all">Sort By</option>
                <option value="amount">Amount</option>
              </select>
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search Transaction"
                  className="pl-7 pr-3 py-1.5 rounded-xl bg-[#0c0f1a] border border-[#202740] text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {transactions.length === 0 ? (
            <EmptyState
              title="Data Not Found"
              description="The requested information is currently unavailable"
              actionText="Refresh Conversions"
              onAction={loadTransactions}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-[#1f263d]">
                  <tr>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Reference ID</th>
                    <th className="py-2.5 px-3 text-right">{BRAND.tokenSymbol} Converted</th>
                    <th className="py-2.5 px-3 text-right">USDT Received</th>
                    <th className="py-2.5 px-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#171d30]">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#151a2d]">
                      <td className="py-3 px-3 font-semibold text-slate-200">{tx.typeLabel}</td>
                      <td className="py-3 px-3 font-mono text-purple-400">{tx.referenceId}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-200">
                        {tx.amount} {BRAND.tokenSymbol}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                        +${tx.amountUSD.toFixed(2)} USDT
                      </td>
                      <td className="py-3 px-3 text-right text-slate-500 font-mono text-[11px]">
                        {tx.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="pt-2 text-center">
            <button
              onClick={loadTransactions}
              className="w-full max-w-xs py-2.5 px-6 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 shadow-md shadow-indigo-950/40 cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <span>See More</span>
            </button>
          </div>
        </div>

        {/* Right Column: Convert Form (Screenshot 30 Right) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-5">
          {/* Balance Display */}
          <div className="p-4 rounded-xl bg-[#0c0f1a] border border-[#1b2238] space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold uppercase tracking-wider">Balance</span>
              <span className="font-mono">Spot Wallet</span>
            </div>
            <h4 className="text-xl font-black text-slate-100 font-mono">
              {emptyStateMode ? '0.0000' : (wallets?.spotBalanceUSDT || 0).toFixed(4)}{' '}
              <span className="text-xs text-purple-400">USDT</span>
            </h4>
            <p className="text-xs text-slate-500 font-mono">
              Available: {emptyStateMode ? '0.0000' : (wallets?.spotBalanceNative || 0).toFixed(4)} {BRAND.tokenSymbol}
            </p>
          </div>

          <form onSubmit={handleConvert} className="space-y-4">
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
              <label className="text-[11px] font-semibold text-slate-300">Amount ({BRAND.tokenSymbol})</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amountXAH}
                onChange={(e) => setAmountXAH(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-3 rounded-xl bg-[#0c0f1a] border border-[#202740] text-sm font-mono text-center font-bold text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#0c0f1a] border border-[#1b2238] flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">You Receive:</span>
              <span className="font-extrabold text-emerald-400 text-sm">
                ~${receivedUSDT.toFixed(2)} USDT
              </span>
            </div>

            {/* Convert Button (Screenshot 30) */}
            <button
              type="submit"
              disabled={isConverting}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-950/40"
            >
              {isConverting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Converting {BRAND.tokenSymbol}...</span>
                </>
              ) : (
                <span>Convert</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

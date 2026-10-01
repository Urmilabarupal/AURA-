/*
 FILE: src/pages/convert/DirectConvert.tsx

 PURPOSE:
 Instant Cross-Asset Direct Conversion interface.
 Corresponds to Reference Screenshot 33. Implements Section 16.

 RESPONSIBILITIES:
 - Provide direct swap between USDT and AURA with live preview
 - Execute instant conversion against authoritative backend ledger
 - Render "No Transaction" empty state (matching screenshot circular icon) or history

 API:
 Calls ApiService.convertDirect and ApiService.getTransactions.

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
  ArrowRightLeft,
  Ban,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Repeat,
  Wallet,
} from 'lucide-react';

export const DirectConvert: React.FC = () => {
  const { wallets, refreshUserData, emptyStateMode } = useAuth();

  const [fromCurrency, setFromCurrency] = useState<string>('USDT');
  const [toCurrency, setToCurrency] = useState<string>(BRAND.tokenSymbol);
  const [amount, setAmount] = useState<number>(1);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const rate = 337.2;
  const convertedAmount =
    fromCurrency === 'USDT' ? +(amount / rate).toFixed(4) : +(amount * rate).toFixed(2);

  const available =
    fromCurrency === 'USDT'
      ? wallets?.spotBalanceUSDT || 0
      : wallets?.spotBalanceNative || 0;

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
        setTransactions(res.data.filter((t) => t.type.includes('CONVERT')));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSwapDirection = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (amount <= 0) {
      setFeedback({ type: 'error', msg: 'Amount must be greater than zero.' });
      return;
    }

    if (available < amount) {
      setFeedback({
        type: 'error',
        msg: `Insufficient ${fromCurrency} balance. Available: ${available} ${fromCurrency}`,
      });
      return;
    }

    setIsConverting(true);
    try {
      const res = await ApiService.convertDirect({
        fromCurrency,
        toCurrency,
        amount,
      });

      if (res.success) {
        setFeedback({
          type: 'success',
          msg: `Converted ${amount} ${fromCurrency} to ${res.data?.received} ${toCurrency}!`,
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
          <h1 className="text-xl font-black text-slate-100 uppercase tracking-tight">Convert</h1>
          <p className="text-xs text-slate-400">Direct Algorithmic Swap Engine</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: No Transaction / Transactions (Screenshot 33 Left) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-5">
          <div className="border-b border-[#1b2238] pb-3">
            <h3 className="text-sm font-bold text-slate-200">Transaction</h3>
          </div>

          {transactions.length === 0 ? (
            /* Screenshot 33 exact empty state with slashed circle icon and "No Transaction" */
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
              <div className="w-20 h-20 rounded-full border-2 border-slate-700/60 flex items-center justify-center text-slate-600">
                <Ban size={36} />
              </div>
              <h4 className="text-sm font-bold text-slate-400">No Transaction</h4>
              <p className="text-xs text-slate-600">
                You have not initiated any direct conversions yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-[#1f263d]">
                  <tr>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Reference ID</th>
                    <th className="py-2.5 px-3">Details</th>
                    <th className="py-2.5 px-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#171d30]">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#151a2d]">
                      <td className="py-3 px-3 font-semibold text-slate-200">{tx.typeLabel}</td>
                      <td className="py-3 px-3 text-purple-400">{tx.referenceId}</td>
                      <td className="py-3 px-3 text-slate-300">{tx.description}</td>
                      <td className="py-3 px-3 text-right text-slate-500 text-[11px]">
                        {tx.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Convert Box (Screenshot 33 Right) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-5">
          <div className="p-4 rounded-xl bg-[#0c0f1a] border border-[#1b2238] space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Balance</span>
            <h4 className="text-xl font-black text-slate-100 font-mono">
              {emptyStateMode ? '0.0000' : available.toFixed(4)}{' '}
              <span className="text-xs text-purple-400">{fromCurrency}</span>
            </h4>
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

            {/* Asset Swap Selector */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0c0f1a] border border-[#202740]">
              <span className="text-xs font-bold text-slate-200">{fromCurrency}</span>
              <button
                type="button"
                onClick={handleSwapDirection}
                className="p-1.5 rounded-lg bg-[#1a2138] text-purple-400 hover:text-white transition-colors"
                title="Reverse Swap"
              >
                <ArrowRightLeft size={14} />
              </button>
              <span className="text-xs font-bold text-slate-200">{toCurrency}</span>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">Amount ({fromCurrency})</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-3 rounded-xl bg-[#0c0f1a] border border-[#202740] text-sm font-mono text-center font-bold text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#0c0f1a] border border-[#1b2238] flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Receive Estimate:</span>
              <span className="font-extrabold text-emerald-400 text-sm">
                ~{convertedAmount} {toCurrency}
              </span>
            </div>

            {/* Convert Button (Screenshot 33) */}
            <button
              type="submit"
              disabled={isConverting}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-950/40"
            >
              {isConverting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Executing Swap...</span>
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

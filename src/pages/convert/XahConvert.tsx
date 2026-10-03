/*
 FILE: src/pages/convert/XahConvert.tsx

 PURPOSE:
 Dedicated Native Token to USDT Conversion portal.
 Styled with authentic Olymp Trade pitch-black OLED palette:
 - Canvas: #000000, Obsidian card bodies: #08080a, Sub-insets: #020204, Hairline borders: #18181c
 - Buttons & Accents: Signature Olymp Trade Emerald Green (#00e699)
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
  const available = emptyStateMode ? 0 : (wallets?.mainBalanceNative || 1.485);

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

    if (amountXAH <= 0) {
      setFeedback({ type: 'error', msg: 'Please enter an amount greater than 0.' });
      return;
    }

    if (available < amountXAH) {
      setFeedback({
        type: 'error',
        msg: `Insufficient ${BRAND.tokenSymbol} in Wallet. Available: ${available.toFixed(4)} ${BRAND.tokenSymbol}`,
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
    <div className="space-y-6 pb-12 font-sans select-none text-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            {BRAND.name} Settlement Convert
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Native Protocol Token to USDT Instant Clearing
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Transactions / See More */}
        <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#18181c] pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Conversion Ledger ({transactions.length})
            </h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter transactions..."
                  className="pl-7 pr-3 py-1.5 rounded-xl bg-[#020204] border border-[#18181c] text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00e699]"
                />
              </div>
            </div>
          </div>

          {transactions.length === 0 ? (
            <EmptyState
              title="Data Not Found"
              description="No native conversion records discovered on this account."
              actionText="Refresh Conversions"
              onAction={loadTransactions}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-[#18181c]">
                  <tr>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Reference ID</th>
                    <th className="py-2.5 px-3 text-right">Amount ({BRAND.tokenSymbol})</th>
                    <th className="py-2.5 px-3 text-right">Received (USDT)</th>
                    <th className="py-2.5 px-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#121216]">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#0e0e12] transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-200">{tx.typeLabel}</td>
                      <td className="py-3 px-3 text-[#00e699]">{tx.referenceId}</td>
                      <td className="py-3 px-3 text-right font-bold text-white">
                        {tx.amount} {BRAND.tokenSymbol}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-[#00e699]">
                        +${tx.amountUSD.toFixed(2)} USDT
                      </td>
                      <td className="py-3 px-3 text-right text-slate-500 text-[11px]">
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
              className="py-2.5 px-6 rounded-xl text-xs font-extrabold text-black bg-[#00e699] hover:bg-[#00ffaa] shadow-md shadow-[#00e699]/20 cursor-pointer inline-flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>Refresh Ledger</span>
            </button>
          </div>
        </div>

        {/* Right Column: Convert Form */}
        <div className="lg:col-span-4 p-5 sm:p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-5">
          <div className="p-4 rounded-xl bg-[#020204] border border-[#18181c] space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">
              Available Native Balance
            </span>
            <h4 className="text-xl font-black text-white font-mono">
              {available.toFixed(4)}{' '}
              <span className="text-xs text-[#00e699] font-sans">{BRAND.tokenSymbol}</span>
            </h4>
          </div>

          <form onSubmit={handleConvert} className="space-y-4">
            {feedback && (
              <div
                className={`p-3 rounded-xl border flex items-start gap-2 text-xs ${
                  feedback.type === 'success'
                    ? 'bg-emerald-950/40 border-[#00e699]/40 text-[#00e699]'
                    : 'bg-red-950/40 border-red-800/50 text-[#ff3b5c]'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-[#00e699]" />
                ) : (
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-[#ff3b5c]" />
                )}
                <span>{feedback.msg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 font-mono">
                Amount ({BRAND.tokenSymbol})
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amountXAH}
                onChange={(e) => setAmountXAH(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-xl bg-[#020204] border border-[#18181c] text-sm font-mono text-center font-black text-white focus:outline-none focus:border-[#00e699] transition-colors"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#020204] border border-[#18181c] flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Receive Estimate:</span>
              <span className="font-black text-[#00e699] text-sm">
                ~${receivedUSDT.toFixed(2)} USDT
              </span>
            </div>

            <button
              type="submit"
              disabled={isConverting}
              className="w-full py-3.5 px-4 rounded-xl text-xs font-extrabold text-black bg-[#00e699] hover:bg-[#00ffaa] disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#00e699]/30 active:scale-95"
            >
              {isConverting ? (
                <>
                  <Loader2 size={15} className="animate-spin text-black" />
                  <span>Converting Funds...</span>
                </>
              ) : (
                <>
                  <Repeat size={15} className="stroke-[2.5]" />
                  <span>Convert to USDT</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

/*
 FILE: src/pages/convert/HxcConvert.tsx

 PURPOSE:
 Halving and Secondary Asset Liquidity Conversion interface.
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
  CheckCircle2,
  Loader2,
  Repeat,
  RotateCcw,
  Search,
} from 'lucide-react';

export const HxcConvert: React.FC = () => {
  const { wallets, refreshUserData, emptyStateMode } = useAuth();

  const [activeTab, setActiveTab] = useState<'income' | 'daily'>('income');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const hxcBalance = emptyStateMode ? 0.0 : wallets?.extraBalanceHXC || 0;
  const hxcConvertTotal = emptyStateMode ? 0.0 : 250.0;
  const incomeTotal = emptyStateMode ? 0.0 : 212.5;
  const income5Years = emptyStateMode ? 0.0 : 1250.0;

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
        setTransactions(res.data.filter((t) => t.type === 'CONVERT_HXC'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConvertNow = async () => {
    if (hxcBalance <= 0) {
      setFeedback({ type: 'error', msg: `No ${BRAND.secondaryTokenSymbol} balance available to convert.` });
      return;
    }

    setIsConverting(true);
    try {
      const res = await ApiService.convertHxc(Math.min(hxcBalance, 50));
      if (res.success) {
        setFeedback({
          type: 'success',
          msg: `Converted 50 ${BRAND.secondaryTokenSymbol} to ${res.data?.receivedUSDT} USDT!`,
        });
        await refreshUserData();
        loadTransactions();
      } else {
        setFeedback({ type: 'error', msg: res.error?.message || 'Conversion error.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', msg: err.message || 'Network error.' });
    } finally {
      setIsConverting(false);
    }
  };

  const handleReset = () => {
    setFeedback({ type: 'success', msg: `${BRAND.name} conversion metrics refreshed.` });
  };

  return (
    <div className="space-y-6 pb-12 font-sans select-none text-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            {BRAND.name} Liquidity Conversion
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Halving & Liquidity Distribution Ledger
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Tabs & Transactions */}
        <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-5">
          {/* Top Tabs */}
          <div className="flex items-center gap-2 border-b border-[#18181c] pb-3">
            <button
              onClick={() => setActiveTab('income')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'income'
                  ? 'bg-[#00e699] text-black shadow-md shadow-[#00e699]/20'
                  : 'text-slate-400 hover:text-white bg-[#020204]'
              }`}
            >
              Convert Income
            </button>
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'daily'
                  ? 'bg-[#00e699] text-black shadow-md shadow-[#00e699]/20'
                  : 'text-slate-400 hover:text-white bg-[#020204]'
              }`}
            >
              {BRAND.name} Convert Income Daily
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Transaction Ledger ({transactions.length})
            </h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search ledger..."
                  className="pl-7 pr-3 py-1.5 rounded-xl bg-[#020204] border border-[#18181c] text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00e699]"
                />
              </div>
            </div>
          </div>

          {transactions.length === 0 ? (
            <EmptyState
              title="Data Not Found"
              description="No liquidity conversion transactions logged on this account."
              actionText="Reload Data"
              onAction={loadTransactions}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-[#18181c]">
                  <tr>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Reference ID</th>
                    <th className="py-2.5 px-3 text-right">Amount ({BRAND.secondaryTokenSymbol})</th>
                    <th className="py-2.5 px-3 text-right">Received (USDT)</th>
                    <th className="py-2.5 px-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#121216]">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#0e0e12] transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-200">{tx.typeLabel}</td>
                      <td className="py-3 px-3 text-[#00e699]">{tx.referenceId}</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-200">
                        {tx.amount} {BRAND.secondaryTokenSymbol}
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
              <span>Refresh Records</span>
            </button>
          </div>
        </div>

        {/* Right Column: Metrics & Convert Actions */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: Convert Box */}
          <div className="p-5 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-4">
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                {BRAND.name} Balance
              </p>
              <div className="p-3.5 rounded-xl bg-[#020204] border border-[#18181c] flex items-center justify-between mt-2">
                <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">
                  Available Balance
                </span>
                <span className="text-base font-black text-white font-mono">
                  {hxcBalance.toFixed(2)}{' '}
                  <span className="text-xs text-[#00e699] font-sans">
                    {BRAND.secondaryTokenSymbol}
                  </span>
                </span>
              </div>
            </div>

            {feedback && (
              <div
                className={`p-2.5 rounded-xl border flex items-start gap-2 text-xs ${
                  feedback.type === 'success'
                    ? 'bg-emerald-950/40 border-[#00e699]/40 text-[#00e699]'
                    : 'bg-red-950/40 border-red-800/50 text-[#ff3b5c]'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-[#00e699]" />
                ) : (
                  <AlertCircle size={14} className="shrink-0 mt-0.5 text-[#ff3b5c]" />
                )}
                <span>{feedback.msg}</span>
              </div>
            )}

            {/* Reset & Convert Now Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-300 border border-[#18181c] hover:bg-[#121216] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Reset Parameters</span>
              </button>

              <button
                type="button"
                onClick={handleConvertNow}
                disabled={isConverting}
                className="w-full py-3 px-4 rounded-xl text-xs font-extrabold text-black bg-[#00e699] hover:bg-[#00ffaa] disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-[#00e699]/25 cursor-pointer active:scale-95"
              >
                {isConverting ? (
                  <>
                    <Loader2 size={14} className="animate-spin text-black" />
                    <span>Processing Conversion...</span>
                  </>
                ) : (
                  <>
                    <Repeat size={14} className="stroke-[2.5]" />
                    <span>Convert Now</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card 2: Convert Total */}
          <div className="p-4 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold font-mono">
              Cumulative Converted
            </span>
            <span className="text-base font-black text-white font-mono">
              {hxcConvertTotal.toFixed(2)}{' '}
              <span className="text-xs text-[#00e699] font-sans">
                {BRAND.secondaryTokenSymbol}
              </span>
            </span>
          </div>

          {/* Card 3: 5 Years Income Cards */}
          <div className="p-5 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Total Income</span>
              <span className="text-sm font-bold text-white font-mono">
                ${incomeTotal.toFixed(4)} USDT
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#18181c]">
              <span className="text-xs text-slate-400">5 Years Projection</span>
              <span className="text-sm font-bold text-[#00e699] font-mono">
                ${income5Years.toFixed(4)} USDT
              </span>
            </div>

            <div className="pt-2 border-t border-[#18181c] space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>Achievement: $0.0000</span>
                <span className="text-[#00e699] font-bold">0.00%</span>
              </div>
              <div className="w-full bg-[#020204] border border-[#18181c] h-2 rounded-full overflow-hidden">
                <div className="w-1/4 bg-[#00e699] h-full rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

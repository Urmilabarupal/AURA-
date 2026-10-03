/*
 FILE: src/pages/convert/DirectConvert.tsx

 PURPOSE:
 Instant Cross-Asset Direct Conversion interface.
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
      ? wallets?.fundingBalanceUSDT || 84300.0
      : wallets?.mainBalanceNative || 1.485;

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
    <div className="space-y-6 pb-12 font-sans select-none text-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            Direct Swap & Convert
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Instant Algorithmic Liquidity Router with Minimal Slippage
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Transactions */}
        <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-5">
          <div className="border-b border-[#18181c] pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Swap Transactions ({transactions.length})
            </h3>
          </div>

          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full border border-[#18181c] bg-[#020204] flex items-center justify-center text-slate-600">
                <Ban size={28} />
              </div>
              <h4 className="text-sm font-bold text-slate-300">No Swap Records</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                You have not initiated any direct conversions yet on this account.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-[#18181c]">
                  <tr>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Pair</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#121216]">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#0e0e12] transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-200">{tx.typeLabel}</td>
                      <td className="py-3 px-3 text-[#00e699]">{tx.description}</td>
                      <td className="py-3 px-3 text-right font-bold text-[#00e699]">
                        +{tx.amount} {tx.currency}
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
        </div>

        {/* Right Column: Swap Console */}
        <div className="lg:col-span-4 p-5 sm:p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-5">
          <div className="p-4 rounded-xl bg-[#020204] border border-[#18181c] space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-mono font-bold tracking-wider">
              Available Balance
            </span>
            <h4 className="text-xl font-black text-white font-mono">
              {emptyStateMode ? '0.0000' : available.toFixed(4)}{' '}
              <span className="text-xs text-[#00e699] font-sans">{fromCurrency}</span>
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

            {/* Asset Swap Selector */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#020204] border border-[#18181c]">
              <span className="text-xs font-bold text-white font-mono">{fromCurrency}</span>
              <button
                type="button"
                onClick={handleSwapDirection}
                className="p-2 rounded-lg bg-[#0e0e12] border border-[#18181c] text-[#00e699] hover:bg-[#18181c] hover:scale-110 transition-all cursor-pointer"
                title="Reverse Swap Direction"
              >
                <ArrowRightLeft size={14} className="stroke-[2.5]" />
              </button>
              <span className="text-xs font-bold text-white font-mono">{toCurrency}</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 font-mono">
                Amount ({fromCurrency})
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-xl bg-[#020204] border border-[#18181c] text-sm font-mono text-center font-black text-white focus:outline-none focus:border-[#00e699] transition-colors"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#020204] border border-[#18181c] flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Receive Estimate:</span>
              <span className="font-black text-[#00e699] text-sm">
                ~{convertedAmount} {toCurrency}
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
                  <span>Executing On-Chain Swap...</span>
                </>
              ) : (
                <>
                  <Repeat size={15} className="stroke-[2.5]" />
                  <span>Instant Convert Now</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

/*
 FILE: src/pages/rewards/PortfolioView.tsx

 PURPOSE:
 Equity Holdings, Shares Portfolio, and Investment Analytics.
 Corresponds to Reference Screenshot 18.

 RESPONSIBILITIES:
 - Display Equity Holdings card (Nexus Share / Equity · Technology · Direct growth)
 - Render Balance circular graphic gauge with Total Balance USDT and Daily return
 - Provide transactions section supporting "Data Not Found" empty state and populated state
 - Support investment and dividend tracking

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
import { ArrowLeft, ArrowUpRight, DollarSign, PieChart, Sparkles, TrendingUp, Zap } from 'lucide-react';

export const PortfolioView: React.FC = () => {
  const { wallets, setActiveRoute, emptyStateMode } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadTransactions();
  }, [emptyStateMode]);

  const loadTransactions = async () => {
    if (emptyStateMode) {
      setTransactions([]);
      return;
    }
    try {
      const res = await ApiService.getTransactions({ limit: 5 });
      if (res.success && res.data) {
        setTransactions(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const investedShares = emptyStateMode ? 0 : 45.0;
  const portfolioUSD = emptyStateMode ? 0 : 2100.0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-100 uppercase tracking-tight">
            Portfolio
          </h1>
          <p className="text-xs text-slate-400">Equity Shares & Decentralized Growth</p>
        </div>
      </div>

      {/* Top Row: Share Card & Circular Balance Gauge (Screenshot 18) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Equity Share Card (Screenshot 18 Left) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-blue-500 p-0.5 flex items-center justify-center shadow-lg">
              <div className="w-full h-full bg-[#0d101d] rounded-[14px] flex items-center justify-center font-bold text-xs text-white">
                AX
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">AURA Share</h3>
              <p className="text-xs text-purple-400 font-medium">Equity · Technology · Direct growth</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[11px] text-slate-500 font-medium">Invested amount</p>
            <h4 className="text-lg font-black text-slate-100 font-mono">
              {investedShares.toFixed(2)} <span className="text-xs text-purple-400">AXS</span>
            </h4>
          </div>
        </div>

        {/* Circular Balance Gauge (Screenshot 18 Right) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg flex flex-col items-center justify-center text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Balance</p>
          {/* Circular Rainbow Ring */}
          <div className="relative w-36 h-36 rounded-full p-2 bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-950/40">
            <div className="w-full h-full bg-[#0d101d] rounded-full flex flex-col items-center justify-center p-2">
              <span className="text-[10px] text-slate-400">Total Balance</span>
              <span className="text-sm font-black text-slate-100 font-mono">
                ${portfolioUSD.toFixed(2)}
              </span>
              <span className="text-[9px] text-emerald-400 font-mono font-bold">Today: +1.4%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section: Transactions / Data State (Screenshot 18) */}
      <section className="p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide border-b border-[#1b2238] pb-3">
          Portfolio Activity & Dividends
        </h3>

        {transactions.length === 0 ? (
          <EmptyState
            title="Data Not Found"
            description="The requested information is currently unavailable"
            actionText="Refresh Portfolio"
            onAction={loadTransactions}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-[#1f263d]">
                <tr>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Reference ID</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171d30]">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#151a2d]">
                    <td className="py-3 px-3 font-semibold text-slate-200">{tx.typeLabel}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-purple-400">
                      {tx.referenceId}
                    </td>
                    <td className="py-3 px-3 text-slate-400">{tx.description}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-100">
                      {tx.amount} {tx.currency}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-500 text-[11px] font-mono">
                      {tx.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

/*
 FILE: src/pages/transactions/TransactionsView.tsx

 PURPOSE:
 Comprehensive Blockchain Transaction Ledger.
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
  ArrowDownLeft,
  ArrowUpRight,
  ChevronDown,
  Filter,
  History,
  RefreshCw,
  Search,
} from 'lucide-react';

export const TransactionsView: React.FC = () => {
  const { emptyStateMode } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [limit, setLimit] = useState<number>(10);

  useEffect(() => {
    if (emptyStateMode) {
      setTransactions([]);
    } else {
      loadTransactions();
    }
  }, [emptyStateMode, filterType, limit]);

  const loadTransactions = async () => {
    try {
      const res = await ApiService.getTransactions({
        type: filterType === 'ALL' ? undefined : filterType,
        limit,
      });
      if (res.success && res.data) {
        let filtered = res.data;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (t) =>
              t.referenceId.toLowerCase().includes(q) ||
              t.description.toLowerCase().includes(q) ||
              t.typeLabel.toLowerCase().includes(q)
          );
        }
        setTransactions(filtered);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSeeMore = () => {
    setLimit((prev) => prev + 10);
  };

  return (
    <div className="space-y-6 pb-12 font-sans select-none text-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            Transaction Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit-Grade Decentralized Accounting Record
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#18181c] pb-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Records ({transactions.length})
          </h2>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-[#020204] border border-[#18181c] text-xs font-mono font-semibold text-slate-300 focus:outline-none focus:border-[#00e699] cursor-pointer"
              >
                <option value="ALL">All Types</option>
                <option value="APP_TRANSFER">App Transfer</option>
                <option value="DEPOSIT">Deposit</option>
                <option value="WITHDRAW">Withdraw</option>
                <option value="STAKING_DEPOSIT">Staking Lock</option>
                <option value="STAKING_INCOME">Staking Yield</option>
                <option value="TRADE_BUY">Spot Buy</option>
                <option value="TRADE_SELL">Spot Sell</option>
                <option value="TICKET_PURCHASE">Lottery Ticket</option>
                <option value="REDEEM">Redeem Payout</option>
                <option value="CONVERT_XAH">{BRAND.tokenSymbol} Swap</option>
                <option value="CONVERT_HXC">{BRAND.name} Convert</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
            </div>

            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search Reference / ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#020204] border border-[#18181c] text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00e699]"
              />
            </div>

            <button
              onClick={loadTransactions}
              className="p-2 rounded-xl bg-[#020204] border border-[#18181c] text-slate-300 hover:text-[#00e699] transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {transactions.length === 0 ? (
          <EmptyState
            title="Data Not Found"
            description="No transaction records match the specified query filters."
            actionText="Clear Filters"
            onAction={() => {
              setFilterType('ALL');
              setSearchQuery('');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-[#18181c]">
                <tr>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Reference ID</th>
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                  <th className="py-3 px-3 text-right">Status</th>
                  <th className="py-3 px-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#121216]">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#0e0e12] transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-200">
                      <span className="flex items-center gap-1.5">
                        {tx.type.includes('DEPOSIT') || tx.type.includes('BUY') ? (
                          <ArrowDownLeft size={13} className="text-[#00e699]" />
                        ) : (
                          <ArrowUpRight size={13} className="text-[#ff3b5c]" />
                        )}
                        <span>{tx.typeLabel}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[11px] text-[#00e699]">
                      {tx.referenceId}
                    </td>
                    <td className="py-3 px-3 text-slate-400 max-w-sm truncate">{tx.description}</td>
                    <td className="py-3 px-3 text-right font-bold text-white">
                      {tx.amount} {tx.currency}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00e699]/15 text-[#00e699] border border-[#00e699]/30">
                        {tx.status}
                      </span>
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
            onClick={handleSeeMore}
            className="py-2.5 px-6 rounded-xl text-xs font-extrabold text-black bg-[#00e699] hover:bg-[#00ffaa] shadow-md shadow-[#00e699]/20 transition-all cursor-pointer inline-flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Load More Records</span>
          </button>
        </div>
      </div>
    </div>
  );
};

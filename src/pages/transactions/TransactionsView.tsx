/*
 FILE: src/pages/transactions/TransactionsView.tsx

 PURPOSE:
 Comprehensive Transaction Audit and History ledger.
 Corresponds to Reference Screenshot 21.

 RESPONSIBILITIES:
 - Display transaction counter badge: Transaction (N)
 - Provide real-time category filtering (App Transfer, Deposit, Withdraw, Trade, Staking, Ticket, Convert, Redeem)
 - Search transactions by Reference ID, description, or hash
 - Render full transaction table or "Data Not Found" empty state (Rule 12 & Section 24)
 - Support pagination via "See More" button

 API:
 Calls ApiService.getTransactions.

 SECURITY:
 In accordance with Rule 7, returns only transactions authorized for the active user.

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    loadTransactions();
  }, [filterType, searchQuery, limit, emptyStateMode]);

  const loadTransactions = async () => {
    if (emptyStateMode) {
      setTransactions([]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await ApiService.getTransactions({
        type: filterType,
        search: searchQuery,
        limit,
      });
      if (res.success && res.data) {
        setTransactions(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeeMore = () => {
    setLimit((prev) => prev + 10);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-100 uppercase tracking-tight">
            Transactions
          </h1>
          <p className="text-xs text-slate-400">Complete Immutable Audit Trail</p>
        </div>
      </div>

      {/* Main Container (Screenshot 21) */}
      <div className="p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-5">
        {/* Controls Bar (Screenshot 21 Top) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-200">
              Transaction ({transactions.length})
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-[#0c0f1a] border border-[#202740] text-xs font-semibold text-slate-300 focus:outline-none cursor-pointer"
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
            <div className="relative min-w-[220px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search Transaction"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#0c0f1a] border border-[#202740] text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              onClick={loadTransactions}
              className="p-2 rounded-xl bg-[#181e33] border border-[#252f50] text-slate-300 hover:text-white"
              title="Refresh"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Content: Empty State vs Table (Screenshot 21) */}
        {transactions.length === 0 ? (
          <EmptyState
            title="Data Not Found"
            description="The requested information is currently unavailable"
            actionText="Clear Filters"
            onAction={() => {
              setFilterType('ALL');
              setSearchQuery('');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-[#1f263d]">
                <tr>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Reference ID</th>
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                  <th className="py-3 px-3 text-right">Status</th>
                  <th className="py-3 px-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171d30]">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#151a2d] transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-200">
                      <span className="flex items-center gap-1.5">
                        {tx.type.includes('DEPOSIT') || tx.type.includes('BUY') ? (
                          <ArrowDownLeft size={13} className="text-emerald-400" />
                        ) : (
                          <ArrowUpRight size={13} className="text-pink-400" />
                        )}
                        <span>{tx.typeLabel}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-purple-400">
                      {tx.referenceId}
                    </td>
                    <td className="py-3 px-3 text-slate-400 max-w-sm truncate">{tx.description}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-100">
                      {tx.amount} {tx.currency}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                        {tx.status}
                      </span>
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

        {/* See More Button (Screenshot 21) */}
        <div className="pt-2 text-center">
          <button
            onClick={handleSeeMore}
            className="w-full max-w-xs py-2.5 px-6 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 shadow-md shadow-indigo-950/40 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <span>See More</span>
          </button>
        </div>
      </div>
    </div>
  );
};

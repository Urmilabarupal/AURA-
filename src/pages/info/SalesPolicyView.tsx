/*
 FILE: src/pages/info/SalesPolicyView.tsx

 PURPOSE:
 Fee schedules, conversion slippage policies, and financial execution rules.
 Implements Rule 1 & Section 2.

 RESPONSIBILITIES:
 - Disclose exchange fee structures (Spot: 0.1%, Withdrawals: network gas only)
 - Outline conversion slippage controls and ticket purchase finality

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React from 'react';
import { BRAND } from '../../config/brand';
import { DollarSign, FileCheck, Percent } from 'lucide-react';

export const SalesPolicyView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div className="space-y-1">
        <h1 className="text-xl font-black text-slate-100 uppercase tracking-tight">
          Sales & Fee Policy
        </h1>
        <p className="text-xs text-slate-400">Transaction Fees, Slippage & Settlement Mechanics</p>
      </div>

      <div className="p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-lg space-y-6 text-xs text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-100">1. Trading & Swap Fees</h2>
          <p>
            Spot trading orders incur a flat maker/taker fee of 0.1%. Direct conversions between {BRAND.tokenSymbol} and USDT utilize instant liquidity algorithmic pricing with guaranteed zero slippage within standard size tiers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-100">2. Withdrawal Network Fees</h2>
          <p>
            On-chain withdrawals incur only actual network blockchain gas fees (e.g. 1.0 USDT for TRC-20, 0.1 {BRAND.tokenSymbol} for native chain settlement). The protocol does not charge custodial surcharge fees.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-100">3. Non-Refundable Ticket Purchases</h2>
          <p>
            Ticket allocations for drawings and lottery events are immutably signed to the smart contract ledger upon purchase and cannot be cancelled or refunded after issuance.
          </p>
        </section>
      </div>
    </div>
  );
};

/*
 FILE: src/pages/info/TermsView.tsx

 PURPOSE:
 Terms of Service and User Master Service Agreement.
 Implements Rule 1 & Section 2.

 RESPONSIBILITIES:
 - Disclose platform acceptable use, account security, and smart contract conditions
 - Detail terms for Staking, Trading, Farming, and Lottery mechanics

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React from 'react';
import { BRAND } from '../../config/brand';
import { FileText, Shield } from 'lucide-react';

export const TermsView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div className="space-y-1">
        <h1 className="text-xl font-black text-slate-100 uppercase tracking-tight">
          Terms of Use
        </h1>
        <p className="text-xs text-slate-400">User Agreement & Service Conditions</p>
      </div>

      <div className="p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-lg space-y-6 text-xs text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-100">1. Acceptance of Terms</h2>
          <p>
            By connecting a wallet or registering an account on {BRAND.name}, you agree to comply with these terms, our security policies, and all applicable protocol rules.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-100">2. Staking & Yield Terms</h2>
          <p>
            Staking plans lock designated native tokens for the duration chosen by the user (e.g., 90, 365, 730, or 1825 Days). Compounded yields accrue daily according to algorithmic rates.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-100">3. Lottery & Jackpot Drawings</h2>
          <p>
            All tickets purchased for weekly jackpot drawings are final once issued. Winning numbers are derived from verifiable on-chain block hashes to prevent tampering.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-100">4. Prohibited Activities</h2>
          <p>
            Users agree not to exploit bugs, run adversarial scripts to disrupt liquidity pools, or attempt cross-account unauthorized access.
          </p>
        </section>
      </div>
    </div>
  );
};

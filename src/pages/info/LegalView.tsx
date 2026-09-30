/*
 FILE: src/pages/info/LegalView.tsx

 PURPOSE:
 Regulatory disclosures, risk notifications, and compliance overview.
 Implements Rule 1 & Section 2.

 RESPONSIBILITIES:
 - Disclose digital asset risks, volatility cautions, and jurisdictional restrictions
 - Provide anti-money laundering (AML) and counter-terrorist financing (CTF) commitments

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React from 'react';
import { AlertTriangle, FileText, Lock, Shield } from 'lucide-react';

export const LegalView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div className="space-y-1">
        <h1 className="text-xl font-black text-slate-100 uppercase tracking-tight">
          Legal & Regulatory
        </h1>
        <p className="text-xs text-slate-400">Risk Disclosures & Protocol Compliance</p>
      </div>

      <div className="p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-6 text-xs text-slate-300 leading-relaxed">
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <p>
            Digital assets and decentralized protocols involve market risks. Past yield performance in staking or liquidity farming does not guarantee future results.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-100">1. Regulatory Framework</h2>
          <p>
            AURA operates under decentralized cryptographic consensus. Users are responsible for ensuring that participation complies with the domestic taxation, legal, and exchange controls of their jurisdiction of residence.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-100">2. Anti-Money Laundering (AML) Compliance</h2>
          <p>
            The platform enforces algorithmic screening of deposit addresses and complies with global counter-terrorist financing conventions. Blacklisted sanctions addresses will be automatically blocked.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-100">3. Non-Custodial Limitation</h2>
          <p>
            The protocol operates through client-side signature generation. The software developers and maintainers do not possess custody or control of user private keys.
          </p>
        </section>
      </div>
    </div>
  );
};

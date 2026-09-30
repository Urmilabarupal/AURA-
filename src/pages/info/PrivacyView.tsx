/*
 FILE: src/pages/info/PrivacyView.tsx

 PURPOSE:
 Data Privacy, Cookie Policy, and Cryptographic Security Governance.
 Implements Rule 1 & Section 2.

 RESPONSIBILITIES:
 - Disclose data retention policies, local storage encryption, and telemetry policy
 - Guarantee non-disclosure of user identity records

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React from 'react';
import { EyeOff, Lock, ShieldCheck } from 'lucide-react';

export const PrivacyView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div className="space-y-1">
        <h1 className="text-xl font-black text-slate-100 uppercase tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400">User Data Protection & Encryption Protocol</p>
      </div>

      <div className="p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-6 text-xs text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-100">1. Information Collection</h2>
          <p>
            We collect only minimum operational information necessary for session authentication: public wallet address, country preference, contact telephone, and local user identifier.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-100">2. Passcode & PIN Storage</h2>
          <p>
            Your local application PIN passcode is never stored or transmitted in plain text. It is processed through one-way cryptographic hashing before session verification.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-100">3. Third-Party Sharing</h2>
          <p>
            We strictly do NOT sell, license, or distribute user contact information to advertisers, marketing brokers, or commercial syndicates.
          </p>
        </section>
      </div>
    </div>
  );
};

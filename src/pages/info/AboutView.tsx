/*
 FILE: src/pages/info/AboutView.tsx

 PURPOSE:
 Company overview, technology infrastructure, and institutional mission.
 Dynamic brand configuration powered by BRAND config.
*/

import React from 'react';
import { BRAND } from '../../config/brand';
import { Award, CheckCircle2, Globe, Lock, Shield, Sparkles, Zap } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12 max-w-4xl font-sans">
      <div className="space-y-1">
        <h1 className="text-xl font-black text-slate-100 uppercase tracking-tight">About Us</h1>
        <p className="text-xs text-slate-400">Pioneering Decentralized Financial Infrastructure</p>
      </div>

      <div className="p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-6">
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-100">{BRAND.name} Financial Protocol</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            {BRAND.name} is an enterprise-grade decentralized platform combining multi-chain settlement, spot exchange liquidity, high-yield staking pools, and community incentive mechanics. Engineered for transparency, security, and algorithmic performance across {BRAND.chainName}.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#0c0f1a] border border-[#1b2238] space-y-2">
            <Shield className="text-emerald-400" size={20} />
            <h3 className="text-xs font-bold text-slate-200">Non-Custodial Architecture</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Users retain full sovereignty of private assets. Multi-signature consensus protects protocol liquidity.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0c0f1a] border border-[#1b2238] space-y-2">
            <Lock className="text-blue-400" size={20} />
            <h3 className="text-xs font-bold text-slate-200">Formal Verification</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Smart contracts undergo rigorous mathematical proofs and continuous independent security audits.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0c0f1a] border border-[#1b2238] space-y-2">
            <Globe className="text-emerald-400" size={20} />
            <h3 className="text-xs font-bold text-slate-200">Global Liquidity Pools</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Unified cross-chain liquidity connecting native {BRAND.tokenSymbol} settlement with TRC-20, ERC-20, and BEP-20 assets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

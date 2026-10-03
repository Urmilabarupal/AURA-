/*
 FILE: src/components/common/SecurityModal.tsx

 PURPOSE:
 Security Advisory and Anti-Phishing Warning modal.
 Corresponds to Reference Screenshots 4 & 5.

 RESPONSIBILITIES:
 - Display mandatory security notice to user on first entry / initialization
 - Alert users to verify domain, protect secret phrases, and prevent impersonation scams
 - Acknowledge and dismiss modal with persistent confirmation

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React from 'react';
import { AlertTriangle, CheckCircle2, Lock, ShieldAlert, X } from 'lucide-react';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl bg-[#08080a] border border-amber-500/30 shadow-2xl shadow-amber-950/40 overflow-hidden">
        {/* Banner Top */}
        <div className="bg-gradient-to-r from-red-600 via-amber-600 to-orange-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-black/20 backdrop-blur-xs">
              <ShieldAlert size={22} className="text-amber-200" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase bg-black/30 px-2 py-0.5 rounded">
                Official Advisory
              </span>
              <h3 className="text-base font-extrabold tracking-tight mt-0.5">WARNING! ALERTA</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-black/20 text-white/80 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-red-950/30 border border-red-800/40 flex items-start gap-3">
            <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-red-300">THINK! VERIFY! PROTECT!</strong> Fraudulent agents may create fake support groups or duplicate domains. Always double-check your URL bar.
            </p>
          </div>

          <div className="space-y-2.5 pt-1">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>We will <strong className="text-slate-100">NEVER</strong> request your private key, seed phrase, or local passcode.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>Official announcements are broadcast exclusively on verified channels.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>All smart contract addresses and liquidity pools are immutably signed.</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
              <Lock size={12} /> SSL 256-Bit Encrypted
            </span>
            <span>Ref: SEC-2026-AURA</span>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-2 py-3 rounded-xl font-bold text-white text-xs tracking-wide bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 hover:opacity-95 shadow-lg shadow-orange-950/50 transition-all flex items-center justify-center gap-2"
          >
            I UNDERSTAND & STAY ALERT
          </button>
        </div>
      </div>
    </div>
  );
};

/*
 FILE: src/pages/auth/CreatePasscode.tsx

 PURPOSE:
 Create Passcode interface styled with authentic Olymp Trade dark theme:
 - Dark pitch black OLED background (#000000)
 - High-craft card (#08080a) with hairline border (#18181c)
 - Top-left brand emblem with emerald/cyan gradient
 - Input fields with sleek #020204 background and green focus state
 - Signature Olymp Trade Emerald Green submit button
*/

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, Eye, EyeOff, Loader2, RefreshCw, ShieldCheck } from 'lucide-react';
import { BRAND } from '../../config/brand';

export const CreatePasscode: React.FC = () => {
  const { setupPasscode, setAuthStage } = useAuth();
  const [passcode, setPasscode] = useState<string>('');
  const [confirmPasscode, setConfirmPasscode] = useState<string>('');
  const [showPasscode, setShowPasscode] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!passcode || passcode.length < 6) {
      setErrorMsg('Passcode must be at least 6 digits.');
      return;
    }

    if (!/^\d+$/.test(passcode)) {
      setErrorMsg('Passcode must contain digits only.');
      return;
    }

    if (passcode !== confirmPasscode) {
      setErrorMsg('Passcode and confirmation do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await setupPasscode(passcode);
      if (res.success) {
        setIsRefreshing(true);
        setTimeout(() => {
          setAuthStage('LOCKED');
        }, 600);
      } else {
        setErrorMsg(res.message || 'Failed to configure passcode.');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during submission.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#000000] flex flex-col items-center justify-center p-4 py-8 select-none font-sans text-white">
      <div className="w-full max-w-[430px]">
        {/* Card */}
        <div className="rounded-3xl bg-[#08080a] border border-[#18181c] p-7 sm:p-9 shadow-2xl space-y-6">
          
          {/* Top-Left: Brand Header */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-7 h-6 flex items-center justify-center">
              <svg className="w-7 h-6" viewBox="0 0 64 54" fill="none">
                <defs>
                  <linearGradient id="createPasscodeLogoGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00b875" />
                    <stop offset="50%" stopColor="#00e699" />
                    <stop offset="100%" stopColor="#00d2d3" />
                  </linearGradient>
                </defs>
                <path
                  d="M 22 13 C 14 13, 10 20, 10 27 C 10 34, 14 41, 22 41 C 28 41, 32 36, 32 27 C 32 18, 36 13, 42 13 C 50 13, 54 20, 54 27 C 54 34, 50 41, 42 41 C 36 41, 32 36, 32 27"
                  stroke="url(#createPasscodeLogoGrad)"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 12 27 L 32 27 L 52 27"
                  stroke="url(#createPasscodeLogoGrad)"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="font-extrabold text-sm tracking-wider text-white font-mono">
              {BRAND.name.toUpperCase()}
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-1.5 text-center">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Create Passcode
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              Set up a secure 6-digit PIN to safeguard your non-custodial trading account.
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 flex items-start gap-2.5 text-xs text-[#ff3b5c] animate-shake">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input 1: Passcode */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                New Passcode (6 digits)
              </label>
              <div className="relative">
                <input
                  type={showPasscode ? 'text' : 'password'}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="w-full px-4 py-3 rounded-xl bg-[#020204] border border-[#18181c] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00e699] font-mono tracking-widest transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPasscode ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Input 2: Confirm Passcode */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Confirm Passcode
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={confirmPasscode}
                  onChange={(e) => setConfirmPasscode(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="w-full px-4 py-3 rounded-xl bg-[#020204] border border-[#18181c] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00e699] font-mono tracking-widest transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Security Footnote */}
            <div className="p-3 rounded-xl bg-[#020204] border border-[#18181c] flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck size={16} className="text-[#00e699] shrink-0" />
              <span>Passcodes are hashed client-side with PBKDF2 encryption.</span>
            </div>

            {/* Submit Button (Olymp Trade Emerald Green) */}
            <button
              type="submit"
              disabled={isSubmitting || isRefreshing}
              className="w-full py-3.5 px-4 rounded-xl bg-[#00e699] hover:bg-[#00ffaa] active:scale-[0.98] disabled:opacity-50 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#00e699]/30 hover:shadow-[#00e699]/50 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isSubmitting || isRefreshing ? (
                <>
                  <Loader2 size={16} className="animate-spin text-black" />
                  <span>Securing Account...</span>
                </>
              ) : (
                <span>Confirm & Lock Account</span>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

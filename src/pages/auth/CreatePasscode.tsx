/*
 FILE: src/pages/auth/CreatePasscode.tsx

 PURPOSE:
 Exact 1:1 pixel-perfect reproduction of the uploaded "Create Passcode" screen from xahmoney.com (image.png).
 Features:
 - Dark matte background (#121316)
 - Rounded card (#1e2029) with 28px border radius
 - Top-left XAH Money logo with folded ribbon
 - Centered "Create Passcode" title in Coral -> Purple -> Blue gradient
 - Subtitle: "Create a new passcode, keep your passcode safe, as these passcodes are not recoverable"
 - Input 1: "Passcode" with Eye toggle inside #242735 background
 - Input 2: "Confirm Passcode" with Eye toggle inside #242735 background
 - Footnotes:
   * Passcode is required now to use HX.Money's new features.
   * Passcode cannot be reset
 - Pill submit button: vibrant Coral -> Magenta -> Blue gradient with bold "Submit" text
 - Direct navigation to Screen Lock upon setup

 SECURITY:
 Authoritative session verification & client-side input validation.
*/

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, Eye, EyeOff, Loader2, RefreshCw } from 'lucide-react';
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
    <div className="min-h-screen w-full bg-[#121316] flex flex-col items-center justify-center p-4 py-8 select-none font-sans">
      <div className="w-full max-w-[430px]">
        {/* Card matching image.png exactly */}
        <div className="rounded-[28px] bg-[#1e2029] border border-[#272b38] p-7 sm:p-9 shadow-2xl space-y-6">
          
          {/* Top-Left: Brand Header (HX Folded Ribbon + XAH Money) */}
          <div className="flex items-center gap-2.5">
            {/* HX Folded Ribbon Logo */}
            <div className="relative w-6 h-5 flex items-center justify-center">
              <svg className="w-6 h-5" viewBox="0 0 64 54" fill="none">
                <defs>
                  <linearGradient id="passcodeLogoGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff2a6d" />
                    <stop offset="48%" stopColor="#9d4edd" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                </defs>
                <path
                  d="M 22 13 C 14 13, 10 20, 10 27 C 10 34, 14 41, 22 41 C 28 41, 32 36, 32 27 C 32 18, 36 13, 42 13 C 50 13, 54 20, 54 27 C 54 34, 50 41, 42 41 C 36 41, 32 36, 32 27"
                  stroke="url(#passcodeLogoGrad)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 12 27 L 32 27 L 52 27"
                  stroke="url(#passcodeLogoGrad)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Dynamic Brand text */}
            <span className="font-extrabold text-[15px] tracking-wide text-white">
              {BRAND.name}
            </span>
          </div>

          {/* Title & Subtitle matching image.png */}
          <div className="text-center space-y-2 pt-1">
            <h1 className="text-[25px] sm:text-[27px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ff5a5f] via-[#c056f5] to-[#5b8bf5] tracking-tight">
              Create Passcode
            </h1>
            <p className="text-xs text-[#c5cbdb] leading-relaxed max-w-[330px] mx-auto font-normal">
              Create a new passcode, keep your passcode safe, as these passcodes are not recoverable
            </p>
          </div>

          {isRefreshing ? (
            <div className="py-8 flex flex-col items-center justify-center space-y-3 text-center">
              <RefreshCw size={32} className="animate-spin text-purple-400" />
              <p className="text-sm font-semibold text-slate-100">
                Passcode Created! Loading Screen Lock...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/40 flex items-start gap-2.5 text-xs text-red-300">
                  <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Input 1: Passcode matching image.png */}
              <div className="relative">
                <input
                  type={showPasscode ? 'text' : 'password'}
                  inputMode="numeric"
                  autoComplete="new-password"
                  maxLength={6}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Passcode"
                  className="w-full h-[52px] pl-4 pr-11 rounded-[14px] bg-[#242735] border border-transparent focus:border-[#7c5cf6] text-sm text-white placeholder:text-[#71788f] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71788f] hover:text-slate-200 transition-colors cursor-pointer"
                  aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}
                >
                  {showPasscode ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Input 2: Confirm Passcode matching image.png */}
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  inputMode="numeric"
                  autoComplete="new-password"
                  maxLength={6}
                  value={confirmPasscode}
                  onChange={(e) => setConfirmPasscode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Confirm Passcode"
                  className="w-full h-[52px] pl-4 pr-11 rounded-[14px] bg-[#242735] border border-transparent focus:border-[#7c5cf6] text-sm text-white placeholder:text-[#71788f] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71788f] hover:text-slate-200 transition-colors cursor-pointer"
                  aria-label={showConfirm ? 'Hide confirmation' : 'Show confirmation'}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Footnotes matching image.png */}
              <div className="space-y-1 text-[11px] text-[#7c849b] pt-1 leading-relaxed">
                <p>* Passcode is required now to use {BRAND.name}'s new features.</p>
                <p>* Passcode cannot be reset</p>
              </div>

              {/* Submit Pill Button matching image.png */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-[52px] rounded-full bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#4361ee] text-white font-bold text-base hover:opacity-95 active:scale-[0.99] disabled:opacity-50 transition-all shadow-lg shadow-purple-950/40 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Setting up...</span>
                    </>
                  ) : (
                    <span>Submit</span>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};

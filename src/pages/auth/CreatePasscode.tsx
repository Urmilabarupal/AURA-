/*
 FILE: src/pages/auth/CreatePasscode.tsx

 PURPOSE:
 Passcode Setup Screen strictly matching user's exact requirements:
 1. NO numeric 1-9 keypad buttons!
 2. ONLY TWO direct text/password inputs:
    - Input 1: "Passcode" / "Enter Passcode"
    - Input 2: "Confirm Passcode" / "Re-enter Passcode"
 3. Eye toggle icons for both inputs to show/hide passcode
 4. Strict Security Validations:
    - Minimum 6 characters/digits
    - Both passcodes must match exactly
 5. On submitting / Next:
    - Saves passcode securely
    - Transitions directly to the Screen Lock ("Enter Passcode") page!
*/

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MoneyXLogo } from '../../components/common/MoneyXLogo';
import { GlowingLockGraphic } from '../../components/common/GlowingLockGraphic';
import { useToast } from '../../components/common/Toast';
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Globe,
  Loader2,
  Lock,
  ShieldCheck,
  XCircle,
} from 'lucide-react';

export const CreatePasscode: React.FC = () => {
  const { setupPasscode, setAuthStage } = useAuth();
  const { showToast } = useToast();

  const [passcode, setPasscode] = useState<string>('');
  const [confirmPasscode, setConfirmPasscode] = useState<string>('');

  const [showPasscode, setShowPasscode] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Validation conditions
  const isLengthValid = passcode.length >= 6;
  const isMatching = passcode.length > 0 && passcode === confirmPasscode;
  const isFormValid = isLengthValid && isMatching;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLengthValid) {
      setErrorMsg('Passcode must be at least 6 characters long');
      return;
    }

    if (!isMatching) {
      setErrorMsg('Passcodes do not match. Please ensure both fields are identical');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await setupPasscode(passcode, false);
      if (res.success) {
        showToast('Passcode configured! Please enter your passcode to unlock.', 'success');
        // Advance directly to the Screen Lock page!
        setAuthStage('LOCKED');
      } else {
        setErrorMsg(res.message || 'Failed to save passcode');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error configuring passcode');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#000000] text-white flex flex-col justify-between p-3 sm:p-5 select-none font-sans relative overflow-x-hidden">
      
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[260px] bg-[#00ffa3]/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-[#00ffa3]/5 rounded-full blur-[120px]" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-20 w-full max-w-[480px] mx-auto flex items-center justify-between shrink-0 pt-2 pb-1">
        <div className="w-8" /> {/* Balance spacer */}
        <MoneyXLogo size="sm" glow showSubtitle={false} />
        <div className="w-9 h-9 rounded-full bg-[#06140b] border border-[#163824] flex items-center justify-center text-[#00ffa3]">
          <Globe size={15} />
        </div>
      </header>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[460px] mx-auto flex flex-col items-center justify-center my-auto px-2 py-3">
        
        {/* Card */}
        <div className="w-full rounded-[28px] bg-[#060f0a]/90 backdrop-blur-2xl border border-[#163824] p-5 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.95)] text-left space-y-4">
          
          {/* Padlock Graphic & Header */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="flex justify-center -my-2">
              <GlowingLockGraphic size="sm" state="idle" />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Set Your <span className="text-[#00ffa3]">Passcode</span>
              </h1>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Create a secure passcode of at least 6 characters to lock and protect your account on this device.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 flex items-center gap-2 text-xs text-[#ff3b5c] animate-shake">
              <AlertCircle size={15} className="shrink-0" />
              <span className="flex-1">{errorMsg}</span>
            </div>
          )}

          {/* Form with ONLY TWO INPUTS (No 1-9 keypad!) */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            
            {/* Input 1: Passcode */}
            <div className="space-y-1">
              <label className="text-xs sm:text-[13px] font-semibold text-slate-200 block">
                Enter Passcode
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={16} className={passcode.length > 0 ? 'text-[#00ffa3]' : 'text-slate-400'} />
                </div>
                <input
                  type={showPasscode ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="Enter at least 6 characters"
                  autoFocus
                  className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-[#030905] border border-[#173021] text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#00ffa3] focus:shadow-[0_0_15px_rgba(0,255,163,0.25)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Toggle passcode visibility"
                >
                  {showPasscode ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Input 2: Confirm Passcode */}
            <div className="space-y-1">
              <label className="text-xs sm:text-[13px] font-semibold text-slate-200 block">
                Confirm Passcode
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <ShieldCheck size={16} className={confirmPasscode.length > 0 ? 'text-[#00ffa3]' : 'text-slate-400'} />
                </div>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPasscode}
                  onChange={(e) => {
                    setConfirmPasscode(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="Re-enter your passcode"
                  className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-[#030905] border border-[#173021] text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#00ffa3] focus:shadow-[0_0_15px_rgba(0,255,163,0.25)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Toggle confirm passcode visibility"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Security Checklist */}
            <div className="p-3 rounded-xl bg-[#030905]/80 border border-[#14281c] space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                {isLengthValid ? (
                  <CheckCircle2 size={13} className="text-[#00ffa3] shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
                )}
                <span className={isLengthValid ? 'text-slate-200 font-medium' : 'text-slate-500'}>
                  At least 6 characters long
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isMatching ? (
                  <CheckCircle2 size={13} className="text-[#00ffa3] shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
                )}
                <span className={isMatching ? 'text-slate-200 font-medium' : 'text-slate-500'}>
                  Both passcodes match
                </span>
              </div>
            </div>

            {/* Action Button -> Goes to Screen Lock */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className={`w-full py-4 rounded-full font-black text-sm sm:text-base tracking-tight transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-xl ${
                  isFormValid
                    ? 'bg-gradient-to-r from-[#00ffa3] via-[#00e699] to-[#00b875] text-black shadow-[0_0_28px_rgba(0,255,163,0.55)] hover:brightness-110 active:scale-[0.99]'
                    : 'bg-[#122218] border border-[#1d3d2a] text-slate-500 opacity-60 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin text-black" />
                    <span>Saving Security Key...</span>
                  </>
                ) : (
                  <>
                    <span>Next: Go to Screen Lock</span>
                    <ArrowRight size={16} className="stroke-[3]" />
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>

      {/* Footer text */}
      <footer className="w-full text-center py-2 text-[10px] text-slate-600 font-mono z-10 shrink-0">
        Money X Ecosystem · Decentralized Security Vault
      </footer>

    </div>
  );
};

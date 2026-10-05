/*
 FILE: src/pages/auth/CreatePasscode.tsx

 PURPOSE:
 Compact, Zero-Scroll "Create Passcode" Screen:
 - Fits 100% in a single display screen without vertical scrolling
 - Only two direct inputs (Passcode & Confirm Passcode) - keypad buttons removed as requested!
 - User can type with their physical / mobile keyboard directly into the inputs
 - Eye toggle to view / hide digits
 - Two security guarantee items with emerald green checkmarks
 - Full-width neon emerald pill button: "Create Passcode →"
*/

import React, { useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthLayoutWrapper } from '../../components/common/AuthLayoutWrapper';
import { GlowingLockGraphic } from '../../components/common/GlowingLockGraphic';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
} from 'lucide-react';

export const CreatePasscode: React.FC = () => {
  const { setupPasscode, setAuthStage, walletAddress } = useAuth();

  const [passcode, setPasscode] = useState<string>('');
  const [confirmPasscode, setConfirmPasscode] = useState<string>('');

  const [showPasscode, setShowPasscode] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const confirmInputRef = useRef<HTMLInputElement>(null);

  const handlePasscodeChange = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 6);
    setPasscode(clean);
    setErrorMsg(null);
    if (clean.length === 6) {
      // Auto focus confirm field
      confirmInputRef.current?.focus();
    }
  };

  const handleConfirmChange = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 6);
    setConfirmPasscode(clean);
    setErrorMsg(null);
  };

  const handleCreatePasscode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (passcode.length !== 6) {
      setErrorMsg('Please enter a 6-digit passcode');
      return;
    }

    if (confirmPasscode.length !== 6) {
      setErrorMsg('Please confirm your 6-digit passcode');
      return;
    }

    if (passcode !== confirmPasscode) {
      setErrorMsg('Passcodes do not match. Please re-enter.');
      setConfirmPasscode('');
      confirmInputRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await setupPasscode(passcode);
      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          // Transition to Screen Lock: Enter Passcode
          setAuthStage('LOCKED');
        }, 400);
      } else {
        setErrorMsg(res.message || 'Failed to configure passcode.');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error configuring passcode.');
      setIsSubmitting(false);
    }
  };

  const isReady = passcode.length === 6 && confirmPasscode.length === 6;

  return (
    <AuthLayoutWrapper
      activeStep={2}
      stepLabels={{
        step1: { title: 'Wallet', sub: 'Connected' },
        step2: { title: 'Passcode', sub: 'Set 6-digit' },
        step3: { title: 'Complete', sub: 'Start Using' },
      }}
    >
      {/* Compact Main Card (Zero scroll, purely keyboard inputs) */}
      <div className="w-full max-w-[540px] rounded-2xl sm:rounded-3xl bg-[#050f09]/92 backdrop-blur-2xl border border-[#163824] p-4 sm:p-6 shadow-[0_16px_45px_rgba(0,0,0,0.85),0_0_35px_rgba(0,255,163,0.06)] relative overflow-hidden text-left space-y-3.5">
        
        {/* Floating 3D Glowing Padlock on Top Right */}
        <div className="hidden sm:block absolute -top-4 -right-3 pointer-events-none opacity-80 z-0">
          <GlowingLockGraphic size="sm" state={isSuccess ? 'success' : errorMsg ? 'error' : 'idle'} />
        </div>

        {/* Card Header */}
        <div className="relative z-10 space-y-1 pr-0 sm:pr-20">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
            Create <span className="text-[#00ffa3] drop-shadow-[0_0_14px_rgba(0,255,163,0.65)]">Passcode</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-normal">
            Create a 6-digit passcode to secure your account on this device. Keep it safe, as it cannot be recovered.
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-800/50 flex items-center gap-2 text-xs text-[#ff3b5c] animate-shake">
            <AlertCircle size={14} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ----------------- TWO KEYBOARD INPUT CAPSULES (No keypad buttons) ----------------- */}
        <form onSubmit={handleCreatePasscode} className="relative z-10 space-y-2.5">
          
          {/* Input 1: Passcode */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-[#030905]/95 border border-[#173021] focus-within:border-[#00ffa3] focus-within:shadow-[0_0_16px_rgba(0,255,163,0.2)] transition-all flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 mr-2">
              <div className="w-7 h-7 rounded-lg bg-black/40 flex items-center justify-center text-slate-400 shrink-0">
                <Lock size={15} className={passcode.length > 0 ? 'text-[#00ffa3]' : 'text-slate-400'} />
              </div>
              <div className="flex-1 min-w-0">
                <label className="text-[10px] font-bold text-slate-400 block leading-none mb-1">
                  Passcode
                </label>
                <input
                  type={showPasscode ? 'text' : 'password'}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={passcode}
                  onChange={(e) => handlePasscodeChange(e.target.value)}
                  placeholder="••••••"
                  autoFocus
                  className="w-full bg-transparent text-sm sm:text-base font-mono font-bold tracking-[0.3em] text-[#00ffa3] placeholder-slate-600 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPasscode(!showPasscode)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle passcode visibility"
            >
              {showPasscode ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Input 2: Confirm Passcode */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-[#030905]/95 border border-[#173021] focus-within:border-[#00ffa3] focus-within:shadow-[0_0_16px_rgba(0,255,163,0.2)] transition-all flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 mr-2">
              <div className="w-7 h-7 rounded-lg bg-black/40 flex items-center justify-center text-slate-400 shrink-0">
                <Lock size={15} className={confirmPasscode.length > 0 ? 'text-[#00ffa3]' : 'text-slate-400'} />
              </div>
              <div className="flex-1 min-w-0">
                <label className="text-[10px] font-bold text-slate-400 block leading-none mb-1">
                  Confirm Passcode
                </label>
                <input
                  ref={confirmInputRef}
                  type={showConfirm ? 'text' : 'password'}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={confirmPasscode}
                  onChange={(e) => handleConfirmChange(e.target.value)}
                  placeholder="••••••"
                  className="w-full bg-transparent text-sm sm:text-base font-mono font-bold tracking-[0.3em] text-[#00ffa3] placeholder-slate-600 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle confirm passcode visibility"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Checklist Guarantee Items */}
          <div className="space-y-1.5 pt-0.5">
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <CheckCircle2 size={14} className="text-[#00ffa3] shrink-0 fill-[#00ffa3]/20" />
              <span>Passcode is required now to use Money X&apos;s features.</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <CheckCircle2 size={14} className="text-[#00ffa3] shrink-0 fill-[#00ffa3]/20" />
              <span>Passcode cannot be reset.</span>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-1.5">
            <button
              type="submit"
              disabled={!isReady || isSubmitting || isSuccess}
              className={`w-full py-3 rounded-full font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-lg ${
                isReady && !isSubmitting
                  ? 'bg-gradient-to-r from-[#00ffa3] via-[#00e699] to-[#00ffa3] hover:brightness-110 active:scale-[0.99] text-black shadow-[0_0_24px_rgba(0,255,163,0.4)]'
                  : 'bg-[#0a180f] border border-[#1b3323] text-slate-500 opacity-60 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin text-black" />
                  <span>Creating Passcode...</span>
                </>
              ) : isSuccess ? (
                <span>Passcode Created! Redirecting...</span>
              ) : (
                <>
                  <span>Create Passcode</span>
                  <ArrowRight size={16} className="stroke-[2.5]" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </AuthLayoutWrapper>
  );
};

/*
 FILE: src/pages/auth/EnterPasscode.tsx

 PURPOSE:
 Compact, Zero-Scroll Screen Lock ("Enter Passcode") Screen:
 - Preserves the authentic original design with 3x4 tactile keypad and checkmark button ("गुड का निशान" ✓)
 - 100% fits on a single display viewport without any vertical scrolling
 - Center 3D glowing padlock graphic
 - Header: "Enter Passcode"
 - 6-dot indicator with eye visibility toggle
 - 3x4 tactile keypad with backspace, 0, and bright green checkmark (✓)
 - Physical keyboard listener (digits 0-9, Backspace, Enter)
*/

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthLayoutWrapper } from '../../components/common/AuthLayoutWrapper';
import { GlowingLockGraphic } from '../../components/common/GlowingLockGraphic';
import {
  AlertCircle,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Wallet,
  X,
} from 'lucide-react';

export const EnterPasscode: React.FC = () => {
  const { verifyPasscode, setAuthStage, refreshUserData, createdPasscode, walletAddress } = useAuth();
  const [pin, setPin] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const hasConfiguredPasscode = Boolean(
    createdPasscode ||
    (typeof localStorage !== 'undefined' && localStorage.getItem('xah_custom_passcode'))
  );

  const handleKeyPress = (num: string) => {
    if (isVerifying || isSuccess) return;
    if (pin.length < 6) {
      const next = pin + num;
      setPin(next);
      setErrorMsg(null);
    }
  };

  const handleDelete = () => {
    if (isVerifying || isSuccess) return;
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg(null);
  };

  const handleConfirm = () => {
    if (pin.length === 6) {
      attemptUnlock(pin);
    } else {
      setErrorMsg('Please enter your 6-digit passcode');
    }
  };

  const attemptUnlock = async (pinToTest: string) => {
    setIsVerifying(true);
    setErrorMsg(null);

    try {
      const res = await verifyPasscode(pinToTest);
      if (res.success) {
        setIsSuccess(true);
        setTimeout(async () => {
          await refreshUserData();
          // Open Dashboard!
          setAuthStage('AUTHENTICATED');
        }, 400);
      } else {
        setErrorMsg(res.message || 'Incorrect passcode. Please try again.');
        setPin('');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification error');
      setPin('');
    } finally {
      setIsVerifying(false);
    }
  };

  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isVerifying || isSuccess) return;

      if (/^[0-9]$/.test(e.key)) {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Enter') {
        if (pin.length === 6) {
          attemptUnlock(pin);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, isVerifying, isSuccess]);

  return (
    <AuthLayoutWrapper
      activeStep={3}
      stepLabels={{
        step1: { title: 'Wallet', sub: 'Connected' },
        step2: { title: 'Passcode', sub: 'Configured' },
        step3: { title: 'Complete', sub: 'Unlock App' },
      }}
    >
      {/* Compact Main Card (Zero scroll, extra level polish) */}
      <div className="w-full max-w-[460px] rounded-2xl sm:rounded-3xl bg-[#050f09]/92 backdrop-blur-2xl border border-[#163824] p-4 sm:p-5 shadow-[0_16px_45px_rgba(0,0,0,0.85),0_0_35px_rgba(0,255,163,0.06)] text-center space-y-2.5">
        
        {/* Center 3D Glowing Padlock Graphic (Compact sm size) */}
        <div className="flex justify-center -my-1">
          <GlowingLockGraphic
            size="sm"
            state={isSuccess ? 'success' : errorMsg ? 'error' : 'idle'}
          />
        </div>

        {/* Card Header */}
        <div className="space-y-0.5">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
            Enter <span className="text-[#00ffa3] drop-shadow-[0_0_14px_rgba(0,255,163,0.65)]">Passcode</span>
          </h1>
          <p className="text-[11px] text-slate-400 font-normal">
            Enter your 6-digit passcode to unlock your account.
          </p>
        </div>

        {/* Warning if no passcode in storage */}
        {!hasConfiguredPasscode && (
          <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-600/40 text-amber-300 text-[11px] text-center space-y-1">
            <p>No passcode configured yet on this device.</p>
            <button
              type="button"
              onClick={() => setAuthStage('UNAUTHENTICATED')}
              className="w-full py-1.5 px-3 rounded-lg bg-[#00ffa3] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer hover:brightness-110"
            >
              <Wallet size={12} />
              <span>Connect Wallet & Create Passcode</span>
            </button>
          </div>
        )}

        {/* Error notification */}
        {errorMsg && (
          <div className="p-2 rounded-xl bg-red-950/40 border border-red-800/50 flex items-center justify-center gap-1.5 text-xs text-[#ff3b5c] animate-shake">
            <AlertCircle size={13} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success notification */}
        {isSuccess && (
          <div className="p-2 rounded-xl bg-emerald-950/40 border border-[#00ffa3]/50 flex items-center justify-center gap-1.5 text-xs text-[#00ffa3] font-bold animate-fadeIn">
            <Check size={14} className="stroke-[3]" />
            <span>Passcode Verified! Opening Dashboard...</span>
          </div>
        )}

        {/* ----------------- 6 DOTS PIN DISPLAY CONTAINER ----------------- */}
        <div className="p-2.5 sm:p-3 rounded-xl bg-[#030905]/95 border border-[#173021] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-black/40 flex items-center justify-center text-slate-400">
              <Lock size={14} className={pin.length > 0 ? 'text-[#00ffa3]' : 'text-slate-400'} />
            </div>
            <div className="text-left">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Security PIN</span>
              <div className="flex items-center gap-2.5 mt-1 h-3.5">
                {[0, 1, 2, 3, 4, 5].map((idx) => {
                  const isFilled = pin.length > idx;
                  return (
                    <div
                      key={idx}
                      className={`transition-all duration-200 flex items-center justify-center ${
                        isFilled
                          ? showPin
                            ? 'text-xs font-mono font-black text-[#00ffa3]'
                            : 'w-3 h-3 rounded-full bg-[#00ffa3] shadow-[0_0_10px_rgba(0,255,163,0.9)] scale-110'
                          : 'w-3 h-3 rounded-full border border-slate-600 bg-transparent'
                      }`}
                    >
                      {isFilled && showPin ? pin[idx] : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowPin(!showPin)}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle pin visibility"
          >
            {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* ----------------- TACTILE 3X4 KEYPAD WITH CHECKMARK (✓) ----------------- */}
        <div className="w-full">
          <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-xl bg-[#020704] border border-[#12261b]">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyPress(digit.toString())}
                disabled={isVerifying || isSuccess}
                className="h-10 sm:h-11 rounded-lg bg-[#06140b] border border-[#162e20] text-base font-bold text-white hover:bg-[#0c2415] hover:text-[#00ffa3] active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-xs disabled:opacity-50"
              >
                {digit}
              </button>
            ))}

            {/* Row 4: [ ✕ ] Backspace | 0 | [ ✓ ] Confirm Checkmark Button */}
            <button
              type="button"
              onClick={handleDelete}
              disabled={isVerifying || isSuccess || pin.length === 0}
              className="h-10 sm:h-11 rounded-lg bg-[#06140b] border border-[#162e20] text-slate-400 hover:text-white hover:bg-[#0c2415] active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-xs disabled:opacity-40"
              aria-label="Backspace"
            >
              <X size={16} className="stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              disabled={isVerifying || isSuccess}
              className="h-10 sm:h-11 rounded-lg bg-[#06140b] border border-[#162e20] text-base font-bold text-white hover:bg-[#0c2415] hover:text-[#00ffa3] active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-xs disabled:opacity-50"
            >
              0
            </button>

            {/* Checkmark Button ("गुड का निशान" ✓) with glowing emerald state */}
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isVerifying || isSuccess || pin.length !== 6}
              className={`h-10 sm:h-11 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-md ${
                pin.length === 6
                  ? 'bg-[#00ffa3] text-black shadow-[0_0_18px_rgba(0,255,163,0.7)] scale-105 active:scale-95'
                  : 'bg-[#06140b] border border-[#162e20] text-slate-600 opacity-40 cursor-not-allowed'
              }`}
              aria-label="Confirm passcode"
            >
              {isVerifying ? (
                <Loader2 size={16} className="animate-spin text-black" />
              ) : (
                <Check size={18} className="stroke-[3.5]" />
              )}
            </button>
          </div>
        </div>

        {/* Reconnect Different Wallet Option */}
        <button
          type="button"
          onClick={() => setAuthStage('UNAUTHENTICATED')}
          className="text-[11px] text-slate-400 hover:text-[#00ffa3] transition-colors cursor-pointer inline-flex items-center gap-1"
        >
          <Wallet size={12} />
          <span>Connect Different Wallet</span>
        </button>

      </div>
    </AuthLayoutWrapper>
  );
};

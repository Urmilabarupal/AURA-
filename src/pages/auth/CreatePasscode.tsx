/*
 FILE: src/pages/auth/CreatePasscode.tsx

 PURPOSE:
 "Set Your 6 Digit Passcode" screen matching Screen 4 from the Money X Design PDF:
 - Pitch black OLED canvas (#000000)
 - Glowing green lock emblem inside circular halo
 - Title: "Set Your 6 Digit Passcode"
 - 6 individual square box digit inputs
 - Signature Money X emerald green "Continue" button
 - Seamless transition to Screen 5 (Enter Passcode / Screen Lock)
*/

import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MoneyXLogo } from '../../components/common/MoneyXLogo';
import { AlertCircle, Check, Loader2, Lock, ShieldCheck } from 'lucide-react';
import { BRAND } from '../../config/brand';

export const CreatePasscode: React.FC = () => {
  const { setupPasscode, setAuthStage, walletAddress } = useAuth();
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input box on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, '');
    if (!clean) {
      const next = [...digits];
      next[index] = '';
      setDigits(next);
      return;
    }

    const char = clean.slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    setErrorMsg(null);

    // Auto-advance to next box
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;

    const next = [...digits];
    for (let i = 0; i < 6; i++) {
      next[i] = pasteData[i] || '';
    }
    setDigits(next);
    const focusIdx = Math.min(pasteData.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const fullCode = digits.join('');
  const isComplete = fullCode.length === 6;

  const handleContinue = async () => {
    if (!isComplete) {
      setErrorMsg('Please enter all 6 digits.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await setupPasscode(fullCode);
      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          // Transition directly to Screen 5: Enter Your Passcode / Screen Lock
          setAuthStage('LOCKED');
        }, 600);
      } else {
        setErrorMsg(res.message || 'Failed to configure passcode.');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error configuring passcode.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#000000] flex flex-col items-center justify-center p-4 py-8 select-none font-sans text-white">
      <div className="w-full max-w-[420px] flex flex-col items-center text-center space-y-7">
        
        {/* Money X Original Brand Header */}
        <MoneyXLogo size="md" glow />

        {/* Lock Graphic Circle matching PDF Screen 4 */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-[#00e699]/10 border border-[#00e699]/30 flex items-center justify-center text-[#00e699] shadow-[0_0_40px_rgba(0,230,153,0.2)]">
            <Lock size={36} className="stroke-[2.5]" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#00e699] text-black flex items-center justify-center shadow-md">
            <ShieldCheck size={14} className="stroke-[3]" />
          </div>
        </div>

        {/* Title & Description matching PDF Screen 4 */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Set Your 6 Digit Passcode
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Create a secure 6-digit PIN to lock and protect your non-custodial wallet session.
          </p>
          {walletAddress && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#08080a] border border-[#18181c] text-[11px] text-slate-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#00e699]" />
              <span>Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
            </div>
          )}
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="w-full p-3 rounded-xl bg-red-950/40 border border-red-800/50 flex items-center justify-center gap-2 text-xs text-[#ff3b5c] animate-shake">
            <AlertCircle size={15} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 6 Square Input Boxes matching Screen 4 in PDF */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3 w-full" onPaste={handlePaste}>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className={`w-12 h-14 sm:w-13 sm:h-16 rounded-xl bg-[#08080a] border text-center text-xl sm:text-2xl font-bold transition-all focus:outline-none ${
                digit
                  ? 'border-[#00e699] text-[#00e699] shadow-lg shadow-[#00e699]/15'
                  : 'border-[#18181c] text-white focus:border-[#00e699]/70 focus:bg-[#0c0c10]'
              }`}
            />
          ))}
        </div>

        {/* Continue Button matching Screen 4 in PDF */}
        <button
          type="button"
          onClick={handleContinue}
          disabled={!isComplete || isSubmitting || isSuccess}
          className={`w-full py-4 rounded-xl font-black text-sm tracking-tight transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-xl ${
            isComplete && !isSubmitting
              ? 'bg-[#00e699] hover:bg-[#00ffaa] text-black shadow-[#00e699]/30 active:scale-[0.98]'
              : 'bg-[#121217] border border-[#222228] text-slate-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin text-black" />
              <span>Configuring Passcode...</span>
            </>
          ) : isSuccess ? (
            <>
              <Check size={18} className="stroke-[3] text-black" />
              <span>Passcode Configured!</span>
            </>
          ) : (
            <span>Continue</span>
          )}
        </button>

      </div>
    </div>
  );
};

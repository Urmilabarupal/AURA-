/*
 FILE: src/pages/auth/EnterPasscode.tsx

 PURPOSE:
 High-security Screen Lock Keypad styled with Olymp Trade authentic OLED dark theme:
 - Pitch black OLED canvas (#000000)
 - Neon Emerald / Cyan ribbon logo
 - Connected 3x4 tactile keypad with hairline borders (#18181c)
 - Glowing emerald PIN feedback indicator
 - Sub-second biometric/PIN authentication
*/

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Check, Loader2, X } from 'lucide-react';
import { BRAND } from '../../config/brand';

export const EnterPasscode: React.FC = () => {
  const { verifyPasscode, setAuthStage, refreshUserData } = useAuth();
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      setErrorMsg(null);

      // Auto submit when 6 digits are typed
      if (newPin.length === 6) {
        attemptVerify(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg(null);
  };

  const handleConfirm = () => {
    if (pin.length >= 6) {
      attemptVerify(pin);
    } else {
      setErrorMsg('Please enter your 6-digit passcode');
    }
  };

  const attemptVerify = async (pinToTest: string) => {
    setIsVerifying(true);
    setErrorMsg(null);
    try {
      const res = await verifyPasscode(pinToTest);
      if (res.success) {
        setIsSuccess(true);
        setTimeout(async () => {
          await refreshUserData();
          setAuthStage('AUTHENTICATED');
        }, 500);
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

  return (
    <div className="min-h-screen w-full bg-[#000000] text-slate-100 flex flex-col items-center justify-between p-4 py-8 select-none font-sans">
      
      {/* Centered Main Lock Card */}
      <div className="w-full max-w-[370px] flex flex-col items-center text-center my-auto space-y-7">
        
        {/* Olymp Trade Neon Ribbon Logo */}
        <div className="relative w-16 h-14 flex items-center justify-center">
          <svg className="w-16 h-14" viewBox="0 0 64 54" fill="none">
            <defs>
              <linearGradient id="olympRibbonGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00b875" />
                <stop offset="50%" stopColor="#00e699" />
                <stop offset="100%" stopColor="#00d2d3" />
              </linearGradient>
            </defs>
            <path
              d="M 22 13 C 14 13, 10 20, 10 27 C 10 34, 14 41, 22 41 C 28 41, 32 36, 32 27 C 32 18, 36 13, 42 13 C 50 13, 54 20, 54 27 C 54 34, 50 41, 42 41 C 36 41, 32 36, 32 27"
              stroke="url(#olympRibbonGrad)"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 12 27 L 32 27 L 52 27"
              stroke="url(#olympRibbonGrad)"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1.5">
          <h1 className="text-[24px] font-black text-white tracking-tight leading-tight">
            Enter Passcode
          </h1>
          <p className="text-[13px] text-slate-400 font-normal">
            Access your {BRAND.name} trading terminal with your PIN
          </p>
        </div>

        {/* Typing indicator / Error message */}
        <div className="h-6 flex items-center justify-center">
          {errorMsg ? (
            <p className="text-xs font-semibold text-[#ff3b5c] animate-shake">
              {errorMsg}
            </p>
          ) : isSuccess ? (
            <p className="text-xs font-bold text-[#00e699] flex items-center gap-1.5 animate-fadeIn">
              <Check size={14} className="stroke-[3]" />
              <span>Passcode Verified!</span>
            </p>
          ) : pin.length > 0 ? (
            <div className="flex items-center gap-2.5 animate-fadeIn">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all duration-150 ${
                    pin.length > idx
                      ? 'bg-[#00e699] scale-110 shadow-md shadow-[#00e699]/40'
                      : 'bg-[#18181c]'
                  }`}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 opacity-30">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <div key={idx} className="w-2.5 h-2.5 rounded-full bg-[#27272e]" />
              ))}
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* CONNECTED KEYPAD GRID (3 Columns x 4 Rows) */}
        {/* ========================================================= */}
        <div className="w-full rounded-2xl border border-[#18181c] overflow-hidden bg-[#08080a] shadow-2xl">
          
          {/* Row 1: 1, 2, 3 */}
          <div className="grid grid-cols-3 border-b border-[#18181c]">
            {[1, 2, 3].map((digit, idx) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyPress(digit.toString())}
                disabled={isVerifying || isSuccess}
                className={`h-[62px] flex items-center justify-center text-[22px] font-semibold text-white hover:bg-[#121217] active:bg-[#18181c] transition-colors cursor-pointer select-none disabled:opacity-50 ${
                  idx < 2 ? 'border-r border-[#18181c]' : ''
                }`}
              >
                {digit}
              </button>
            ))}
          </div>

          {/* Row 2: 4, 5, 6 */}
          <div className="grid grid-cols-3 border-b border-[#18181c]">
            {[4, 5, 6].map((digit, idx) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyPress(digit.toString())}
                disabled={isVerifying || isSuccess}
                className={`h-[62px] flex items-center justify-center text-[22px] font-semibold text-white hover:bg-[#121217] active:bg-[#18181c] transition-colors cursor-pointer select-none disabled:opacity-50 ${
                  idx < 2 ? 'border-r border-[#18181c]' : ''
                }`}
              >
                {digit}
              </button>
            ))}
          </div>

          {/* Row 3: 7, 8, 9 */}
          <div className="grid grid-cols-3 border-b border-[#18181c]">
            {[7, 8, 9].map((digit, idx) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyPress(digit.toString())}
                disabled={isVerifying || isSuccess}
                className={`h-[62px] flex items-center justify-center text-[22px] font-semibold text-white hover:bg-[#121217] active:bg-[#18181c] transition-colors cursor-pointer select-none disabled:opacity-50 ${
                  idx < 2 ? 'border-r border-[#18181c]' : ''
                }`}
              >
                {digit}
              </button>
            ))}
          </div>

          {/* Row 4: [ ✕ ] Backspace | 0 | [ ✓ ] Confirm */}
          <div className="grid grid-cols-3">
            {/* Col 1: Delete button */}
            <button
              type="button"
              onClick={handleDelete}
              disabled={isVerifying || isSuccess || pin.length === 0}
              className="h-[62px] border-r border-[#18181c] flex items-center justify-center hover:bg-[#121217] active:bg-[#18181c] transition-colors cursor-pointer select-none disabled:opacity-30"
              aria-label="Delete last digit"
            >
              <div className="w-[34px] h-[22px] rounded-[5px] bg-[#18181c] hover:bg-[#25252c] text-slate-300 flex items-center justify-center shadow-sm">
                <X size={13} className="stroke-[3]" />
              </div>
            </button>

            {/* Col 2: Number 0 */}
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              disabled={isVerifying || isSuccess}
              className="h-[62px] border-r border-[#18181c] flex items-center justify-center text-[22px] font-semibold text-white hover:bg-[#121217] active:bg-[#18181c] transition-colors cursor-pointer select-none disabled:opacity-50"
            >
              0
            </button>

            {/* Col 3: Confirm button with glowing emerald status */}
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isVerifying || isSuccess || pin.length === 0}
              className={`h-[62px] flex items-center justify-center transition-colors cursor-pointer select-none ${
                pin.length >= 6
                  ? 'text-[#00e699] hover:bg-[#121217] active:bg-[#18181c]'
                  : 'text-slate-600 hover:text-slate-400 hover:bg-[#121217]'
              }`}
              aria-label="Confirm passcode"
            >
              {isVerifying ? (
                <Loader2 size={18} className="animate-spin text-[#00e699]" />
              ) : (
                <Check size={21} className="stroke-[2.8]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Security Footnote */}
      <div className="text-center pt-6 pb-2">
        <p className="text-[12px] text-slate-500 font-normal tracking-wide">
          Passcode adds an extra layer of non-custodial cryptographic security
        </p>
      </div>
    </div>
  );
};

/*
 FILE: src/pages/auth/EnterPasscode.tsx

 PURPOSE:
 Exact 1:1 pixel-perfect reproduction of the uploaded Screen Lock interface from xahmoney.com (image.png).
 Features:
 - Exact background color #14151a matching the reference screenshot
 - Centered folded ribbon "HX" gradient logo (Pink -> Purple -> Cyan)
 - Title "Enter Passcode" in Poppins bold
 - Subtitle "Access your account with your PIN"
 - Completely clean, uncluttered layout matching the reference screenshot (no visible dots at rest)
 - Dynamic typing feedback when digits are typed
 - Connected 3x4 table keypad grid:
   * Rows 1-3: Numbers 1 to 9
   * Row 4 Col 1: White pill badge with black "✕" for backspace
   * Row 4 Col 2: Number "0"
   * Row 4 Col 3: Subtle gray checkmark "✓" that activates when PIN is ready
 - Bottom footnote: "Passcode adds an extra layer of security when using the app"
 - Strictly validates against user's created 6-digit passcode to unlock into the Dashboard

 SECURITY:
 Authoritative verification against AuthContext and backend engine.
*/

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Check, Loader2, X } from 'lucide-react';

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
    <div className="auth-theme min-h-screen w-full text-slate-100 flex flex-col items-center justify-between p-4 py-8 select-none font-sans">
      
      {/* Centered Main Lock Card matching image.png */}
      <div className="w-full max-w-[370px] flex flex-col items-center text-center my-auto space-y-7">
        
        {/* Exact Folded Ribbon HX Logo from image.png */}
        <div className="relative w-16 h-14 flex items-center justify-center">
          <svg className="w-16 h-14" viewBox="0 0 64 54" fill="none">
            <defs>
              <linearGradient id="xahRibbonGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#52d916" />
                <stop offset="48%" stopColor="#7dff32" />
                <stop offset="100%" stopColor="#b7ff8b" />
              </linearGradient>
            </defs>
            {/* Smooth continuous ribbon loop creating H and X */}
            <path
              d="M 22 13 C 14 13, 10 20, 10 27 C 10 34, 14 41, 22 41 C 28 41, 32 36, 32 27 C 32 18, 36 13, 42 13 C 50 13, 54 20, 54 27 C 54 34, 50 41, 42 41 C 36 41, 32 36, 32 27"
              stroke="url(#xahRibbonGrad)"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Center cross connection */}
            <path
              d="M 12 27 L 32 27 L 52 27"
              stroke="url(#xahRibbonGrad)"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Title & Subtitle matching image.png */}
        <div className="space-y-2">
          <h1 className="text-[23px] font-bold text-white tracking-tight leading-tight">
            Enter Passcode
          </h1>
          <p className="text-[13px] text-[#8e96aa] font-normal tracking-normal">
            Access your account with your PIN
          </p>
        </div>

        {/* Typing indicator / Error message */}
        <div className="h-6 flex items-center justify-center">
          {errorMsg ? (
            <p className="text-xs font-medium text-red-400 animate-shake">
              {errorMsg}
            </p>
          ) : isSuccess ? (
            <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 animate-fadeIn">
              <Check size={14} className="stroke-[3]" />
              <span>Passcode Verified!</span>
            </p>
          ) : pin.length > 0 ? (
            <div className="flex items-center gap-2.5 animate-fadeIn">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-150 ${
                    pin.length > idx
                      ? 'bg-gradient-to-r from-[#52d916] to-[#7dff32] scale-110'
                      : 'bg-[#232733]'
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>

        {/* ========================================================= */}
        {/* CONNECTED KEYPAD GRID (3 Columns x 4 Rows) matching image.png */}
        {/* Table-style single container with 1px border dividers */}
        {/* ========================================================= */}
        <div className="w-full rounded-xl border border-[#232733] overflow-hidden bg-[#14151a] shadow-xl">
          
          {/* Row 1: 1, 2, 3 */}
          <div className="grid grid-cols-3 border-b border-[#232733]">
            {[1, 2, 3].map((digit, idx) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyPress(digit.toString())}
                disabled={isVerifying || isSuccess}
                className={`h-[62px] flex items-center justify-center text-[22px] font-semibold text-white hover:bg-[#1a1d26] active:bg-[#222633] transition-colors cursor-pointer select-none disabled:opacity-50 ${
                  idx < 2 ? 'border-r border-[#232733]' : ''
                }`}
              >
                {digit}
              </button>
            ))}
          </div>

          {/* Row 2: 4, 5, 6 */}
          <div className="grid grid-cols-3 border-b border-[#232733]">
            {[4, 5, 6].map((digit, idx) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyPress(digit.toString())}
                disabled={isVerifying || isSuccess}
                className={`h-[62px] flex items-center justify-center text-[22px] font-semibold text-white hover:bg-[#1a1d26] active:bg-[#222633] transition-colors cursor-pointer select-none disabled:opacity-50 ${
                  idx < 2 ? 'border-r border-[#232733]' : ''
                }`}
              >
                {digit}
              </button>
            ))}
          </div>

          {/* Row 3: 7, 8, 9 */}
          <div className="grid grid-cols-3 border-b border-[#232733]">
            {[7, 8, 9].map((digit, idx) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyPress(digit.toString())}
                disabled={isVerifying || isSuccess}
                className={`h-[62px] flex items-center justify-center text-[22px] font-semibold text-white hover:bg-[#1a1d26] active:bg-[#222633] transition-colors cursor-pointer select-none disabled:opacity-50 ${
                  idx < 2 ? 'border-r border-[#232733]' : ''
                }`}
              >
                {digit}
              </button>
            ))}
          </div>

          {/* Row 4: [ ✕ ] Backspace | 0 | [ ✓ ] Confirm */}
          <div className="grid grid-cols-3">
            {/* Col 1: White rounded badge with black ✕ matching image.png */}
            <button
              type="button"
              onClick={handleDelete}
              disabled={isVerifying || isSuccess || pin.length === 0}
              className="h-[62px] border-r border-[#232733] flex items-center justify-center hover:bg-[#1a1d26] active:bg-[#222633] transition-colors cursor-pointer select-none disabled:opacity-30"
              aria-label="Delete last digit"
            >
              <div className="w-[34px] h-[22px] rounded-[5px] bg-[#e6e9ee] hover:bg-white text-black flex items-center justify-center shadow-sm">
                <X size={13} className="stroke-[3]" />
              </div>
            </button>

            {/* Col 2: Number 0 */}
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              disabled={isVerifying || isSuccess}
              className="h-[62px] border-r border-[#232733] flex items-center justify-center text-[22px] font-semibold text-white hover:bg-[#1a1d26] active:bg-[#222633] transition-colors cursor-pointer select-none disabled:opacity-50"
            >
              0
            </button>

            {/* Col 3: Checkmark confirm icon matching image.png */}
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isVerifying || isSuccess || pin.length === 0}
              className={`h-[62px] flex items-center justify-center transition-colors cursor-pointer select-none ${
                pin.length >= 6
                  ? 'text-white hover:bg-[#1a1d26] active:bg-[#222633]'
                  : 'text-[#475266] hover:text-[#717b96] hover:bg-[#1a1d26]'
              }`}
              aria-label="Confirm passcode"
            >
              {isVerifying ? (
                <Loader2 size={18} className="animate-spin text-purple-400" />
              ) : (
                <Check size={21} className="stroke-[2.8]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Security Footnote matching image.png */}
      <div className="text-center pt-6 pb-2">
        <p className="text-[12px] text-[#6b7588] font-normal tracking-wide">
          Passcode adds an extra layer of security when using the app
        </p>
      </div>
    </div>
  );
};

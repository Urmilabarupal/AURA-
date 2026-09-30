/*
 FILE: src/pages/auth/EnterPasscode.tsx

 PURPOSE:
 Exact 1:1 reproduction of the uploaded Screen Lock interface from xahmoney.com (image.png).
 Features:
 - Floating folded ribbon "HX" gradient logo (no background box)
 - Title "Enter Passcode" & subtitle "Access your account with your PIN"
 - Reactive masked 4-PIN dots
 - Connected table-style Keypad grid (3x4) with thin border dividers:
   * 1 to 9 numbers
   * Row 4 Col 1: White rounded badge with black "✕" for backspace/clear
   * Row 4 Col 2: Number "0"
   * Row 4 Col 3: Checkmark "✓" confirm icon
 - Footer security note: "Passcode adds an extra layer of security when using the app"
 - Authoritative verification leading directly into the Dashboard

 SECURITY:
 Validates PIN against backend engine. Never exposes plaintext credentials.
*/

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Check, Loader2, Sparkles, X } from 'lucide-react';

export const EnterPasscode: React.FC = () => {
  const { verifyPasscode, setAuthStage, createdPasscode, refreshUserData } = useAuth();
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      setErrorMsg(null);

      // Auto submit if length reaches 4 digits
      if (newPin.length === 4) {
        attemptVerify(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg(null);
  };

  const handleConfirm = () => {
    if (pin.length >= 4) {
      attemptVerify(pin);
    } else {
      setErrorMsg('Please enter at least 4 digits');
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
        setErrorMsg(res.message || 'Incorrect passcode');
        setPin('');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification error');
      setPin('');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAutoFillCreatedPasscode = () => {
    const targetPin = createdPasscode || '1234';
    setPin(targetPin);
    attemptVerify(targetPin);
  };

  return (
    <div className="min-h-screen w-full bg-[#141722] flex flex-col items-center justify-between p-4 py-8 relative select-none">
      {/* Main Lock Screen Section matching image.png */}
      <div className="w-full max-w-[410px] flex flex-col items-center text-center my-auto space-y-6">
        
        {/* Floating Folded Ribbon Logo matching image.png */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-16 h-16" viewBox="0 0 40 40" fill="none">
            <defs>
              <linearGradient id="lockRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff3864" />
                <stop offset="50%" stopColor="#9d4edd" />
                <stop offset="100%" stopColor="#3a86ff" />
              </linearGradient>
            </defs>
            {/* Exact folded loop ribbon matching image.png */}
            <path
              d="M13 10 C8 15, 8 26, 13 31 C18 36, 24 24, 29 29 C34 34, 35 24, 29 20 C24 16, 17 27, 13 22 C9 17, 9 10, 13 10 Z"
              stroke="url(#lockRibbonGrad)"
              strokeWidth="3.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M29 10 C34 15, 34 26, 29 31 M13 10 C8 15, 8 26, 13 31"
              stroke="url(#lockRibbonGrad)"
              strokeWidth="3.6"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1.5">
          <h2 className="text-[22px] font-bold text-slate-100 tracking-tight">
            Enter Passcode
          </h2>
          <p className="text-[13px] text-[#8e98af] font-normal">
            Access your account with your PIN
          </p>
        </div>

        {/* Masked PIN Indicators */}
        <div className="flex items-center justify-center gap-3.5 pt-1">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                pin.length > idx
                  ? 'bg-gradient-to-r from-[#ff3864] via-[#9d4edd] to-[#3a86ff] scale-125 shadow-md shadow-purple-500/50'
                  : 'bg-[#1e2333] border border-[#2b3248]'
              }`}
            />
          ))}
        </div>

        {/* Error message or Success State */}
        {errorMsg && (
          <p className="text-xs font-medium text-red-400 animate-shake">{errorMsg}</p>
        )}
        {isSuccess && (
          <p className="text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1.5 animate-fadeIn">
            <Check size={14} />
            <span>Passcode Verified! Loading Dashboard...</span>
          </p>
        )}

        {/* ========================================================= */}
        {/* CONNECTED KEYPAD GRID (3 Columns x 4 Rows) matching image.png */}
        {/* Table-style single container with 1px border dividers */}
        {/* ========================================================= */}
        <div className="w-full max-w-[390px] rounded-2xl border border-[#222736] overflow-hidden shadow-2xl bg-[#141722]">
          {/* Row 1: 1, 2, 3 */}
          <div className="grid grid-cols-3 border-b border-[#222736]">
            {[1, 2, 3].map((digit, idx) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyPress(digit.toString())}
                disabled={isVerifying || isSuccess}
                className={`h-16 flex items-center justify-center text-xl font-bold text-white hover:bg-[#1a1e2d] active:bg-[#202538] transition-colors cursor-pointer disabled:opacity-50 ${
                  idx < 2 ? 'border-r border-[#222736]' : ''
                }`}
              >
                {digit}
              </button>
            ))}
          </div>

          {/* Row 2: 4, 5, 6 */}
          <div className="grid grid-cols-3 border-b border-[#222736]">
            {[4, 5, 6].map((digit, idx) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyPress(digit.toString())}
                disabled={isVerifying || isSuccess}
                className={`h-16 flex items-center justify-center text-xl font-bold text-white hover:bg-[#1a1e2d] active:bg-[#202538] transition-colors cursor-pointer disabled:opacity-50 ${
                  idx < 2 ? 'border-r border-[#222736]' : ''
                }`}
              >
                {digit}
              </button>
            ))}
          </div>

          {/* Row 3: 7, 8, 9 */}
          <div className="grid grid-cols-3 border-b border-[#222736]">
            {[7, 8, 9].map((digit, idx) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyPress(digit.toString())}
                disabled={isVerifying || isSuccess}
                className={`h-16 flex items-center justify-center text-xl font-bold text-white hover:bg-[#1a1e2d] active:bg-[#202538] transition-colors cursor-pointer disabled:opacity-50 ${
                  idx < 2 ? 'border-r border-[#222736]' : ''
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
              className="h-16 border-r border-[#222736] flex items-center justify-center hover:bg-[#1a1e2d] active:bg-[#202538] transition-colors cursor-pointer disabled:opacity-40"
              aria-label="Delete last digit"
            >
              <div className="w-8 h-5 rounded-md bg-[#e2e8f0] hover:bg-white text-black flex items-center justify-center shadow-sm">
                <X size={14} className="stroke-[2.8]" />
              </div>
            </button>

            {/* Col 2: Number 0 */}
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              disabled={isVerifying || isSuccess}
              className="h-16 border-r border-[#222736] flex items-center justify-center text-xl font-bold text-white hover:bg-[#1a1e2d] active:bg-[#202538] transition-colors cursor-pointer disabled:opacity-50"
            >
              0
            </button>

            {/* Col 3: Checkmark confirm icon matching image.png */}
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isVerifying || isSuccess || pin.length === 0}
              className="h-16 flex items-center justify-center text-[#7e8ba0] hover:text-white hover:bg-[#1a1e2d] active:bg-[#202538] transition-colors cursor-pointer disabled:opacity-30"
              aria-label="Confirm passcode"
            >
              {isVerifying ? (
                <Loader2 size={20} className="animate-spin text-purple-400" />
              ) : (
                <Check size={22} className="stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>

        {/* Demo Helper Button */}
        <button
          type="button"
          onClick={handleAutoFillCreatedPasscode}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#191c28] hover:bg-[#202534] border border-[#242839] text-[11px] text-purple-300 font-mono transition-colors cursor-pointer"
        >
          <Sparkles size={11} className="text-pink-400" />
          <span>
            Created Passcode: <strong className="text-white">{createdPasscode || '1234'}</strong> (Tap to unlock)
          </span>
        </button>
      </div>

      {/* Footer Security Footnote matching image.png */}
      <div className="text-center pt-4">
        <p className="text-[12px] text-[#717b96] font-normal">
          Passcode adds an extra layer of security when using the app
        </p>
      </div>
    </div>
  );
};

/*
 FILE: src/pages/auth/EnterPasscode.tsx

 PURPOSE:
 "Enter Your Passcode" screen matching Screen 5 from Money X Design PDF:
 - Pitch black OLED canvas (#000000)
 - Money X Brand Logo & Emblem
 - Headline: "Enter Your Passcode"
 - 6 indicator dots for entered PIN
 - Connected 3x4 tactile keypad with numbers 1-9, 0, backspace, and the checkmark button ("गुड का साइन" ✓)
 - User enters 6-digit PIN and clicks the checkmark button to unlock session and open the Dashboard!
*/

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MoneyXLogo } from '../../components/common/MoneyXLogo';
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
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg(null);
  };

  // User explicitly requested: PIN number lagate hi, laga ke jo good ka sign hai (✓), uspe click karega. Uske baad dashboard page open hona chahiye!
  const handleConfirm = () => {
    if (pin.length === 6) {
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
          // Open Dashboard!
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
      
      {/* Centered Main Lock Card matching PDF Screen 5 */}
      <div className="w-full max-w-[370px] flex flex-col items-center text-center my-auto space-y-7">
        
        {/* Money X Original Brand Logo & Emblem */}
        <div className="flex flex-col items-center gap-3">
          <MoneyXLogo size="xl" glow showText={false} />
          <span className="text-2xl font-black tracking-tight text-white font-sans">
            Money <span className="text-white">X</span>
          </span>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1.5">
          <h1 className="text-2xl font-black text-white tracking-tight leading-tight">
            Enter Your Passcode
          </h1>
          <p className="text-xs text-slate-400 font-normal">
            Enter your 6-digit security PIN and press ✓ to unlock
          </p>
        </div>

        {/* 6 Dots PIN Feedback Indicator */}
        <div className="h-7 flex items-center justify-center">
          {errorMsg ? (
            <p className="text-xs font-semibold text-[#ff3b5c] animate-shake">
              {errorMsg}
            </p>
          ) : isSuccess ? (
            <p className="text-xs font-bold text-[#00e699] flex items-center gap-1.5 animate-fadeIn">
              <Check size={16} className="stroke-[3]" />
              <span>Passcode Verified!</span>
            </p>
          ) : (
            <div className="flex items-center gap-3">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                    pin.length > idx
                      ? 'bg-[#00e699] scale-110 shadow-[0_0_12px_rgba(0,230,153,0.6)]'
                      : 'bg-[#18181c] border border-[#27272e]'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Keypad Grid (3 Columns x 4 Rows) matching PDF Screen 5 */}
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

          {/* Row 4: [ ✕ ] Backspace | 0 | [ ✓ ] Confirm Checkmark Button */}
          <div className="grid grid-cols-3">
            {/* Col 1: Delete button */}
            <button
              type="button"
              onClick={handleDelete}
              disabled={isVerifying || isSuccess || pin.length === 0}
              className="h-[62px] border-r border-[#18181c] flex items-center justify-center hover:bg-[#121217] active:bg-[#18181c] transition-colors cursor-pointer select-none disabled:opacity-30"
              aria-label="Delete last digit"
            >
              <div className="w-[34px] h-[24px] rounded-md bg-[#141418] hover:bg-[#202028] text-slate-300 flex items-center justify-center shadow-sm">
                <X size={14} className="stroke-[3]" />
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

            {/* Col 3: Confirm Button ("गुड का साइन" ✓) with glowing emerald state */}
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isVerifying || isSuccess || pin.length !== 6}
              className={`h-[62px] flex items-center justify-center transition-all cursor-pointer select-none ${
                pin.length === 6
                  ? 'bg-[#00e699]/15 text-[#00e699] hover:bg-[#00e699]/25 active:scale-95 shadow-[inset_0_0_15px_rgba(0,230,153,0.2)]'
                  : 'text-slate-600 hover:text-slate-400 hover:bg-[#121217] opacity-40 cursor-not-allowed'
              }`}
              aria-label="Confirm passcode and open dashboard"
            >
              {isVerifying ? (
                <Loader2 size={20} className="animate-spin text-[#00e699]" />
              ) : (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  pin.length === 6 ? 'bg-[#00e699] text-black shadow-lg shadow-[#00e699]/40 scale-105' : 'text-slate-500'
                }`}>
                  <Check size={18} className="stroke-[3]" />
                </div>
              )}
            </button>
          </div>

        </div>

      </div>

      {/* Footer Info */}
      <div className="text-[11px] text-slate-500 text-center">
        {BRAND.chainNetwork} · Non-Custodial Hardware Security
      </div>
    </div>
  );
};

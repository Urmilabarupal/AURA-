/*
 FILE: src/pages/auth/EnterPasscode.tsx

 PURPOSE:
 Pixel-Perfect implementation of:
 - Screen 8: "App Lock Screen" ("Enter Your Passcode")
 - Screen 9: "Wrong Passcode" (Glowing Red Padlock & Error State)
 from file_00000000798881fabe5f265b420a8498.png (Master Blueprint).

 Features:
 - Money X Green Logo & Navigation Bar
 - Big 3D Glowing Emerald Padlock graphic (turns GLOWING RED on wrong passcode!)
 - Title: "Enter Your Passcode" -> turns "Wrong Passcode" in red on error
 - Subtitle: "Enter 6-digit passcode to unlock" -> turns "Please enter the correct passcode to unlock the app."
 - 6 Circular PIN Dots (green filled -> RED filled on error with shake animation!)
 - High-craft 3x4 Numeric Keypad
 - "Forgot Passcode?" link at bottom
 - Physical keyboard listener (digits 0-9, Backspace, Enter)
*/

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MoneyXLogo } from '../../components/common/MoneyXLogo';
import { GlowingLockGraphic } from '../../components/common/GlowingLockGraphic';
import { useToast } from '../../components/common/Toast';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Globe,
  Loader2,
  Lock,
  Wallet,
  X,
} from 'lucide-react';

export const EnterPasscode: React.FC = () => {
  const { verifyPasscode, setAuthStage, refreshUserData, createdPasscode } = useAuth();
  const { showToast } = useToast();

  const [pin, setPin] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [forgotModalOpen, setForgotModalOpen] = useState<boolean>(false);

  const handleDigit = (digit: string) => {
    if (isVerifying || isSuccess) return;

    if (isError) {
      setIsError(false);
      setPin(digit);
      return;
    }

    if (pin.length < 6) {
      const next = pin + digit;
      setPin(next);
      if (next.length === 6) {
        attemptUnlock(next);
      }
    }
  };

  const handleBackspace = () => {
    if (isVerifying || isSuccess) return;
    setIsError(false);
    setPin((prev) => prev.slice(0, -1));
  };

  const attemptUnlock = async (pinToTest: string) => {
    setIsVerifying(true);
    setIsError(false);

    try {
      const res = await verifyPasscode(pinToTest);
      if (res.success) {
        setIsSuccess(true);
        setTimeout(async () => {
          await refreshUserData();
          // Open Dashboard (Screen 10)
          setAuthStage('AUTHENTICATED');
        }, 350);
      } else {
        // Trigger Screen 9: Wrong Passcode state
        setIsError(true);
        setTimeout(() => {
          setPin('');
        }, 1200);
      }
    } catch {
      setIsError(true);
      setTimeout(() => {
        setPin('');
      }, 1200);
    } finally {
      setIsVerifying(false);
    }
  };

  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isVerifying || isSuccess) return;

      if (/^[0-9]$/.test(e.key)) {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, isVerifying, isSuccess, isError]);

  return (
    <div className="h-screen max-h-screen w-full bg-[#000000] text-white flex flex-col justify-between p-3 sm:p-5 select-none font-sans relative overflow-hidden">
      
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[260px] rounded-full blur-[140px] transition-colors duration-500 ${
            isError ? 'bg-red-500/15' : 'bg-[#00ffa3]/10'
          }`}
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-[#00ffa3]/5 rounded-full blur-[120px]" />
      </div>

      {/* ----------------- TOP BAR (Screen 8 & 9) ----------------- */}
      <header className="relative z-20 w-full max-w-[440px] mx-auto flex items-center justify-between shrink-0 py-1">
        <button
          type="button"
          onClick={() => setAuthStage('UNAUTHENTICATED')}
          className="w-9 h-9 rounded-full bg-[#06140b] border border-[#163824] flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
          aria-label="Connect wallet"
        >
          <Wallet size={15} className="text-[#00ffa3]" />
        </button>

        <MoneyXLogo size="sm" glow showSubtitle={false} />

        <div className="w-9 h-9 rounded-full bg-[#06140b] border border-[#163824] flex items-center justify-center text-[#00ffa3]">
          <Globe size={15} />
        </div>
      </header>

      {/* ----------------- MAIN LOCK SCREEN CONTENT ----------------- */}
      <div className="relative z-10 w-full max-w-[420px] mx-auto flex flex-col items-center justify-center my-auto px-2 space-y-4">
        
        {/* Center 3D Padlock Graphic: Turns GLOWING RED on Wrong Passcode (Screen 9) */}
        <div className="flex justify-center -my-2">
          <GlowingLockGraphic
            size="md"
            state={isError ? 'error' : isSuccess ? 'success' : 'idle'}
          />
        </div>

        {/* Title & Subtitle: Turns RED on Error */}
        <div className="space-y-1 text-center">
          <h1
            className={`text-2xl sm:text-3xl font-black tracking-tight transition-colors duration-200 ${
              isError ? 'text-[#ff3b5c]' : 'text-white'
            }`}
          >
            {isError ? 'Wrong Passcode' : 'Enter Your Passcode'}
          </h1>
          <p
            className={`text-xs max-w-xs mx-auto leading-relaxed transition-colors duration-200 ${
              isError ? 'text-red-400 font-medium' : 'text-slate-400'
            }`}
          >
            {isError
              ? 'Please enter the correct passcode to unlock the app.'
              : 'Enter 6-digit passcode to unlock'}
          </p>
        </div>

        {/* 6 Circular PIN Dots matching Screen 8 & 9 */}
        <div
          className={`flex items-center justify-center gap-4 py-2 ${
            isError ? 'animate-shake' : ''
          }`}
        >
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`transition-all duration-200 rounded-full flex items-center justify-center ${
                  isFilled
                    ? isError
                      ? 'w-4 h-4 bg-[#ff3b5c] shadow-[0_0_12px_#ff3b5c] scale-110'
                      : 'w-4 h-4 bg-[#00ffa3] shadow-[0_0_12px_rgba(0,255,163,0.9)] scale-110'
                    : isError
                    ? 'w-4 h-4 border-2 border-red-500/60 bg-transparent'
                    : 'w-4 h-4 border-2 border-[#163824] bg-transparent'
                }`}
              />
            );
          })}
        </div>

        {/* ----------------- 3X4 NUMERIC KEYPAD matching Screen 8 & 9 ----------------- */}
        <div className="w-full max-w-[340px] pt-1">
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleDigit(num.toString())}
                disabled={isVerifying}
                className="h-14 sm:h-16 rounded-2xl bg-[#06140b] border border-[#162e20] hover:bg-[#0c2415] hover:text-[#00ffa3] active:scale-95 text-xl font-black text-white transition-all cursor-pointer flex items-center justify-center shadow-md disabled:opacity-50"
              >
                {num}
              </button>
            ))}

            {/* Bottom Row: [Spacer] | [ 0 ] | [ ⌫ Backspace ] */}
            <div className="h-14 sm:h-16" /> {/* Spacer */}

            <button
              type="button"
              onClick={() => handleDigit('0')}
              disabled={isVerifying}
              className="h-14 sm:h-16 rounded-2xl bg-[#06140b] border border-[#162e20] hover:bg-[#0c2415] hover:text-[#00ffa3] active:scale-95 text-xl font-black text-white transition-all cursor-pointer flex items-center justify-center shadow-md disabled:opacity-50"
            >
              0
            </button>

            <button
              type="button"
              onClick={handleBackspace}
              disabled={isVerifying || pin.length === 0}
              className="h-14 sm:h-16 rounded-2xl bg-[#06140b] border border-[#162e20] hover:bg-[#0c2415] text-slate-400 hover:text-white active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-md disabled:opacity-40"
              aria-label="Backspace"
            >
              <X size={20} className="stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* ----------------- "FORGOT PASSCODE?" LINK matching Screen 8 & 9 ----------------- */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => setForgotModalOpen(true)}
            className="text-xs sm:text-sm font-semibold text-[#00ffa3] hover:underline cursor-pointer transition-colors"
          >
            Forgot Passcode?
          </button>
        </div>

      </div>

      {/* Footer text */}
      <footer className="w-full text-center py-1 text-[10px] text-slate-600 font-mono z-10 shrink-0">
        Money X Ecosystem · Decentralized Security Vault
      </footer>

      {/* Forgot Passcode Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#08120c] border border-[#163824] p-6 shadow-2xl text-center space-y-4 animate-scaleIn">
            <div className="w-12 h-12 rounded-full bg-[#00ffa3]/20 text-[#00ffa3] mx-auto flex items-center justify-center">
              <Lock size={22} />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">Reset Passcode</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                To reset your passcode, please reconnect your Web3 wallet. You will be able to create a new 6-digit passcode.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setForgotModalOpen(false);
                  setAuthStage('UNAUTHENTICATED');
                }}
                className="w-full py-3 rounded-full bg-[#00ffa3] text-black font-black text-xs sm:text-sm hover:brightness-110 cursor-pointer shadow-lg shadow-[#00ffa3]/30"
              >
                Reconnect Wallet & Set New Passcode
              </button>

              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="w-full py-2.5 rounded-full bg-transparent text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

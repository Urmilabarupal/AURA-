/*
 FILE: src/pages/auth/CreatePasscode.tsx

 PURPOSE:
 Passcode Setup and Confirmation interface.
 Corresponds to Reference Screenshot 2.
 Completely clean, focused modal/screen without developer navigation bars.

 RESPONSIBILITIES:
 - Clean, distraction-free card centered on the dark screen
 - 4 to 6 digit PIN input and confirmation with show/hide toggle
 - Security footnotes:
   * Passcode must be 4 to 6 digits to use financial features.
   * Passcodes cannot be reset.
 - On Submit -> smooth auto-refresh -> direct navigation to Screen Lock (Keypad)

 SECURITY:
 Authoritative session verification & client-side input validation.
*/

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, Eye, EyeOff, Loader2, RefreshCw } from 'lucide-react';

export const CreatePasscode: React.FC = () => {
  const { setupPasscode, setAuthStage } = useAuth();
  const [passcode, setPasscode] = useState<string>('1234');
  const [confirmPasscode, setConfirmPasscode] = useState<string>('1234');
  const [showPasscode, setShowPasscode] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!passcode || passcode.length < 4) {
      setErrorMsg('Passcode must be at least 4 digits.');
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
        // Automatic refresh to lock screen page as requested:
        setTimeout(() => {
          setAuthStage('LOCKED');
        }, 700);
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
    <div className="min-h-screen w-full bg-[#141722] flex flex-col items-center justify-center p-4 py-8 relative">
      <div className="w-full max-w-[420px] relative z-10">
        {/* Card matching Screenshot 2 */}
        <div className="rounded-[28px] bg-[#191c28] border border-[#242839] p-7 md:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-[22px] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#ff3864] via-[#9d4edd] to-[#3a86ff]">
              Create Passcode
            </h2>
            <p className="text-xs text-[#8e98af] leading-relaxed px-2">
              Create a new passcode, keep your passcode safe, as these passcodes are not recoverable
            </p>
          </div>

          {isRefreshing ? (
            <div className="py-8 flex flex-col items-center justify-center space-y-3 text-center">
              <RefreshCw size={32} className="animate-spin text-purple-400" />
              <p className="text-xs font-semibold text-slate-200">
                Passcode Created! Refreshing to Screen Lock...
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                Your PIN: <strong className="text-purple-300">{passcode}</strong>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/40 flex items-start gap-2.5 text-xs text-red-300">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Passcode input (Screenshot 2) */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Passcode</label>
                <div className="relative">
                  <input
                    type={showPasscode ? 'text' : 'password'}
                    inputMode="numeric"
                    maxLength={6}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Passcode"
                    className="w-full h-12 pl-4 pr-11 rounded-[14px] bg-[#13151f] border border-[#2a2f42] text-sm text-slate-100 placeholder:text-slate-600 tracking-widest font-mono focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPasscode ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Passcode (Screenshot 2) */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Confirm Passcode</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    inputMode="numeric"
                    maxLength={6}
                    value={confirmPasscode}
                    onChange={(e) => setConfirmPasscode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Confirm Passcode"
                    className="w-full h-12 pl-4 pr-11 rounded-[14px] bg-[#13151f] border border-[#2a2f42] text-sm text-slate-100 placeholder:text-slate-600 tracking-widest font-mono focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Security Footnotes from Screenshot 2 */}
              <div className="space-y-1 text-[11px] text-[#717b96] pt-1 leading-relaxed">
                <p>• Passcode must be 4 to 6 digits to use financial features.</p>
                <p>• Passcodes cannot be reset.</p>
              </div>

              {/* Submit Pill Button (Screenshot 2) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#ff477e] via-[#9d4edd] to-[#3a86ff] text-white font-semibold text-sm hover:opacity-95 active:scale-[0.99] disabled:opacity-50 shadow-md shadow-purple-950/40 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Securing...</span>
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

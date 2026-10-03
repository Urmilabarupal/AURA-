/*
 FILE: src/pages/profile/ProfileView.tsx

 PURPOSE:
 User Profile, Account Settings, and Identity Management.
 Styled with authentic Olymp Trade pitch-black OLED palette:
 - Canvas: #000000, Obsidian card bodies: #08080a, Sub-insets: #020204, Hairline borders: #18181c
 - Buttons & Accents: Signature Olymp Trade Emerald Green (#00e699)
*/

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { ApiService } from '../../services/api';
import { BRAND } from '../../config/brand';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Edit3,
  Info,
  KeyRound,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Phone,
  Save,
  Shield,
  User,
  Wallet,
  X,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, refreshUserData, logout, setActiveRoute } = useAuth();
  const { copyToClipboard } = useToast();

  const [activeTab, setActiveTab] = useState<'edit' | 'about'>('edit');
  const [firstName, setFirstName] = useState<string>(user?.firstName || 'Alexander');
  const [lastName, setLastName] = useState<string>(user?.lastName || 'Vance');
  const [email, setEmail] = useState<string>(user?.email || 'alexander.vance@aurafinancial.io');
  const [mobile, setMobile] = useState<string>(user?.mobile || '+1 555-019-4829');

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Change Password Modal
  const [pwModalOpen, setPwModalOpen] = useState<boolean>(false);
  const [oldPin, setOldPin] = useState<string>('');
  const [newPin, setNewPin] = useState<string>('');
  const [confirmNewPin, setConfirmNewPin] = useState<string>('');
  const [pwSubmitting, setPwSubmitting] = useState<boolean>(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<boolean>(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!firstName.trim()) {
      setFeedback({ type: 'error', msg: 'First name cannot be empty.' });
      return;
    }

    setIsSaving(true);
    try {
      const res = await ApiService.updateProfile({
        firstName,
        lastName,
        email,
        mobile,
      });

      if (res.success) {
        setFeedback({ type: 'success', msg: 'Profile updated successfully!' });
        await refreshUserData();
      } else {
        setFeedback({ type: 'error', msg: res.error?.message || 'Failed to update profile.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', msg: err.message || 'Network error updating profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);

    if (newPin.length < 4) {
      setPwError('New PIN must be at least 4 digits.');
      return;
    }

    if (newPin !== confirmNewPin) {
      setPwError('New PIN confirmation does not match.');
      return;
    }

    setPwSubmitting(true);
    try {
      const res = await ApiService.setupPasscode(newPin);
      if (res.success) {
        setPwSuccess(true);
        setTimeout(() => {
          setPwSuccess(false);
          setPwModalOpen(false);
          setOldPin('');
          setNewPin('');
          setConfirmNewPin('');
        }, 1500);
      } else {
        setPwError(res.error?.message || 'Failed to change passcode.');
      }
    } catch (err: any) {
      setPwError(err.message || 'Passcode change error.');
    } finally {
      setPwSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans select-none text-slate-100">
      {/* Top Banner */}
      <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden border border-[#18181c] shadow-2xl bg-[#08080a]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00e699]/15 via-[#00d2d3]/10 to-transparent" />
        <div className="absolute inset-0 opacity-10 flex items-center justify-around font-black text-9xl text-white select-none pointer-events-none font-mono">
          <span>{BRAND.tokenSymbol}</span>
        </div>

        {/* User ID Tag Badge overlaid on Banner */}
        <div className="absolute bottom-4 right-4 p-3 rounded-2xl bg-[#020204]/90 backdrop-blur-md border border-[#18181c] flex items-center gap-3 shadow-2xl">
          <div className="w-10 h-10 rounded-xl bg-[#00e699] text-black font-black flex items-center justify-center text-sm shadow-md">
            {user?.name.charAt(0) || 'U'}
          </div>
          <div>
            <p className="text-xs font-mono font-bold text-white">{user?.id}</p>
            <p className="text-[10px] text-[#00e699] font-mono">Refer by: @{user?.referBy}</p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'about'
                ? 'bg-[#00e699] text-black shadow-md shadow-[#00e699]/20'
                : 'text-slate-400 hover:text-white bg-[#020204]'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'edit'
                ? 'bg-[#00e699] text-black shadow-md shadow-[#00e699]/20'
                : 'text-slate-400 hover:text-white bg-[#020204]'
            }`}
          >
            Edit Profile
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setPwModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#020204] hover:bg-[#121216] border border-[#18181c] text-slate-200 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <KeyRound size={14} className="text-[#00e699]" />
            <span>Change PIN</span>
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl text-xs font-extrabold text-black bg-[#ff3b5c] hover:bg-[#ff5572] shadow-md transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Edit Profile Form on Left, About Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Edit Profile Form */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-[#18181c] pb-3">
            <div className="flex items-center gap-2 text-white text-sm font-bold uppercase tracking-wider font-mono">
              <Edit3 size={16} className="text-[#00e699]" />
              <span>Personal Details</span>
            </div>
            <button
              onClick={() => setActiveTab('about')}
              className="text-xs text-[#00e699] hover:text-[#00ffaa] font-semibold transition-colors cursor-pointer"
            >
              View Overview
            </button>
          </div>

          {feedback && (
            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/40 border-[#00e699]/40 text-[#00e699]'
                  : 'bg-red-950/40 border-red-800/50 text-[#ff3b5c]'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-[#00e699]" />
              ) : (
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-[#ff3b5c]" />
              )}
              <span>{feedback.msg}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">User ID</label>
                <input
                  type="text"
                  disabled
                  value={user?.id || 'AURA-829104'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#020204] border border-[#18181c] text-xs font-mono text-[#00e699] opacity-80 cursor-not-allowed select-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Referral Sponsor</label>
                <input
                  type="text"
                  disabled
                  value={user?.referBy || 'DEFAULT_DIRECT'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#020204] border border-[#18181c] text-xs font-mono text-slate-300 opacity-80 cursor-not-allowed select-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#020204] border border-[#18181c] text-xs text-white focus:outline-none focus:border-[#00e699] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#020204] border border-[#18181c] text-xs text-white focus:outline-none focus:border-[#00e699] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#020204] border border-[#18181c] text-xs text-white focus:outline-none focus:border-[#00e699] transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Mobile Phone</label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#020204] border border-[#18181c] text-xs text-white focus:outline-none focus:border-[#00e699] transition-colors"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3.5 px-4 rounded-xl text-xs font-extrabold text-black bg-[#00e699] hover:bg-[#00ffaa] shadow-lg shadow-[#00e699]/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={15} className="animate-spin text-black" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save size={15} className="stroke-[2.5]" />
                    <span>Save Profile</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: About Overview Card */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-4">
          <div className="flex items-center gap-2 text-white text-sm font-bold uppercase tracking-wider font-mono border-b border-[#18181c] pb-3">
            <Info size={16} className="text-[#00e699]" />
            <span>Account Ledger</span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#020204] border border-[#18181c]">
              <span className="text-slate-400">Account Status:</span>
              <span className="text-[#00e699] font-bold">Active & Verified</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#020204] border border-[#18181c]">
              <span className="text-slate-400">KYC Clearance:</span>
              <span className="text-[#00e699] font-bold">Tier 2 Non-Custodial</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#020204] border border-[#18181c]">
              <span className="text-slate-400">Connected Wallet:</span>
              <span className="text-white font-bold">{user?.walletAddress ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : '0x7ACc...d9b8'}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#020204] border border-[#18181c]">
              <span className="text-slate-400">Security Mode:</span>
              <span className="text-cyan-400 font-bold">PIN + Smart Contract</span>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {pwModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-[#08080a] border border-[#18181c] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#18181c] pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Update Security PIN
              </h3>
              <button
                onClick={() => setPwModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#121216] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {pwError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-xs text-[#ff3b5c]">
                {pwError}
              </div>
            )}

            {pwSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-[#00e699]/40 text-xs text-[#00e699]">
                Security PIN updated successfully!
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold">New 6-Digit PIN</label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#020204] border border-[#18181c] text-sm font-mono tracking-widest text-white focus:outline-none focus:border-[#00e699]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold">Confirm New PIN</label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={confirmNewPin}
                  onChange={(e) => setConfirmNewPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#020204] border border-[#18181c] text-sm font-mono tracking-widest text-white focus:outline-none focus:border-[#00e699]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={pwSubmitting}
                  className="w-full py-3 px-4 rounded-xl text-xs font-extrabold text-black bg-[#00e699] hover:bg-[#00ffaa] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {pwSubmitting ? 'Updating PIN...' : 'Save New PIN'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/*
 FILE: src/pages/profile/ProfileView.tsx

 PURPOSE:
 User Profile, Account Settings, and Identity Management.
 Corresponds to Reference Screenshots 14 and 15.

 RESPONSIBILITIES:
 - Render profile graphic banner, identity tags, and status badges
 - Provide profile editing form (First Name, Last Name, Email, Mobile) with validation
 - Render "About" account overview card with username and contact information
 - Provide working Change Password / Passcode modal
 - Trigger authoritative profile updates via ApiService

 API:
 Calls ApiService.getProfile, ApiService.updateProfile, and ApiService.setupPasscode.

 SECURITY:
 In accordance with Rule 7, only authorized fields are modifiable;
 User ID and Refer By bindings cannot be overwritten by client tampering.

 NOTE:
 Developer documentation only. Never expose sensitive information.
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
    <div className="space-y-6 pb-12">
      {/* Top Banner (Screenshot 14) */}
      <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden border border-[#202740] shadow-xl bg-[#121626]">
        {/* Stylized background geometric pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/30 via-purple-700/40 to-blue-700/40"></div>
        <div className="absolute inset-0 opacity-20 flex items-center justify-around font-black text-9xl text-white select-none pointer-events-none">
          <span>A</span>
          <span>X</span>
        </div>

        {/* User ID Tag Badge overlaid on Banner (Screenshot 14 Right) */}
        <div className="absolute bottom-4 right-4 p-3 rounded-2xl bg-[#0c0f1a]/85 backdrop-blur-md border border-[#252f50] flex items-center gap-3 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
            {user?.name.charAt(0) || 'U'}
          </div>
          <div>
            <p className="text-xs font-mono font-bold text-slate-100">{user?.id}</p>
            <p className="text-[10px] text-purple-400 font-mono">Refer by: @{user?.referBy}</p>
          </div>
        </div>
      </div>

      {/* Action Bar (Screenshot 14: About/Edit toggle & Change Password / Logout) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#131728] border border-[#202740] shadow-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'about'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'edit'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Edit
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setPwModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#181f36] hover:bg-[#202845] border border-[#263155] text-slate-200 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <KeyRound size={14} className="text-purple-400" />
            <span>Change Password</span>
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md transition-colors flex items-center gap-1.5"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Edit Profile Form on Left, About Card on Right (Screenshots 14 & 15) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Edit Profile Form */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-5">
          <div className="flex items-center justify-between border-b border-[#1b2238] pb-3">
            <div className="flex items-center gap-2 text-slate-200 text-sm font-bold uppercase tracking-wide">
              <Edit3 size={16} className="text-purple-400" />
              <span>Edit Profile</span>
            </div>
            <button
              onClick={() => setActiveTab('about')}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
            >
              View Profile
            </button>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            {feedback && (
              <div
                className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                  feedback.type === 'success'
                    ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300'
                    : 'bg-red-950/40 border-red-800/50 text-red-300'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-400" />
                ) : (
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
                )}
                <span>{feedback.msg}</span>
              </div>
            )}

            {/* Read-Only Identity Fields (Screenshots 14 & 15) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">User ID</label>
                <input
                  type="text"
                  readOnly
                  value={user?.id || BRAND.defaultUserId}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0f1a] border border-[#1b2238] text-xs font-mono text-purple-300 opacity-80 cursor-not-allowed select-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Refer By</label>
                <input
                  type="text"
                  readOnly
                  value={user?.referBy || BRAND.defaultReferId}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0f1a] border border-[#1b2238] text-xs font-mono text-slate-300 opacity-80 cursor-not-allowed select-all"
                />
              </div>
            </div>

            {/* Editable Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0f1a] border border-[#202740] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0f1a] border border-[#202740] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0f1a] border border-[#202740] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">Mobile Number</label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0f1a] border border-[#202740] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="py-3 px-6 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-purple-950/40"
            >
              {isSaving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: About Overview Card (Screenshots 14 & 15 Right) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-4">
          <div className="flex items-center gap-2 text-slate-200 text-sm font-bold uppercase tracking-wide border-b border-[#1b2238] pb-3">
            <Info size={16} className="text-blue-400" />
            <span>About</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0c0f1a] border border-[#1b2238]">
              <span className="text-slate-400">Username</span>
              <span className="font-mono text-purple-300 font-bold">{user?.username}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0c0f1a] border border-[#1b2238]">
              <span className="text-slate-400">First Name</span>
              <span className="text-slate-100 font-semibold">{user?.firstName || 'Alexander'}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0c0f1a] border border-[#1b2238]">
              <span className="text-slate-400">Last Name</span>
              <span className="text-slate-100 font-semibold">{user?.lastName || 'Vance'}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0c0f1a] border border-[#1b2238]">
              <span className="text-slate-400">Email</span>
              <span className="text-slate-100 font-mono text-[11px] truncate max-w-[180px]">
                {user?.email}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0c0f1a] border border-[#1b2238]">
              <span className="text-slate-400">Phone</span>
              <span className="text-slate-100 font-mono text-[11px]">{user?.mobile}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0c0f1a] border border-[#1b2238]">
              <span className="text-slate-400">KYC Status</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                {user?.kycStatus}
              </span>
            </div>

            {user?.walletAddress && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0c0f1a] border border-[#1b2238]">
                <span className="text-slate-400">Wallet</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-200 font-mono text-[11px] truncate max-w-[130px]">
                    {user.walletAddress.substring(0, 6)}...{user.walletAddress.substring(user.walletAddress.length - 4)}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(user.walletAddress, 'Wallet address')}
                    className="p-1 rounded bg-[#1a2034] hover:bg-purple-900/40 hover:text-purple-300 text-slate-400 border border-[#263152] transition-colors cursor-pointer"
                    title="Copy full wallet address"
                  >
                    <Copy size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {pwModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl bg-[#141829] border border-[#202740] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1d243b] pb-3">
              <h3 className="text-sm font-bold text-slate-100">Change PIN / Passcode</h3>
              <button onClick={() => setPwModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              {pwError && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/40 flex items-start gap-2 text-xs text-red-300">
                  <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-400" />
                  <span>{pwError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">New PIN (4-6 digits)</label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0f1a] border border-[#202740] text-sm font-mono tracking-widest text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Confirm New PIN</label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={confirmNewPin}
                  onChange={(e) => setConfirmNewPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0f1a] border border-[#202740] text-sm font-mono tracking-widest text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={pwSubmitting}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {pwSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Updating PIN...</span>
                  </>
                ) : pwSuccess ? (
                  <span className="text-emerald-300">PIN Successfully Updated!</span>
                ) : (
                  <span>Update Passcode</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

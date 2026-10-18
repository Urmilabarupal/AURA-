/*
 FILE: src/pages/profile/ProfileView.tsx

 PURPOSE:
 User Profile, Account Ledger, and Live User API Management.
 Styled with authentic Olymp Trade pitch-black OLED palette:
 - Canvas: #000000, Obsidian card bodies: #08080a, Sub-insets: #020204, Hairline borders: #18181c
 - Buttons & Accents: Signature Olymp Trade Emerald Green (#00e699)
*/

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { ApiService } from '../../services/api';
import { BRAND } from '../../config/brand';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Code,
  Copy,
  Edit3,
  Globe,
  Info,
  KeyRound,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Phone,
  RefreshCw,
  Save,
  Server,
  Shield,
  Upload,
  User,
  Wallet,
  X,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    user,
    wallets,
    refreshUserData,
    logout,
    setActiveRoute,
    apiConfig,
    setApiModalOpen,
    fetchUserDataFromApi,
  } = useAuth();

  const { copyToClipboard, showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'about' | 'edit' | 'api'>('about');
  const [firstName, setFirstName] = useState<string>(user?.firstName || user?.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState<string>(user?.lastName || user?.name?.split(' ').slice(1).join(' ') || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [mobile, setMobile] = useState<string>(user?.mobile || '');

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSyncingApi, setIsSyncingApi] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  // Sync state whenever user object is updated
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || user.name.split(' ')[0] || '');
      setLastName(user.lastName || user.name.split(' ').slice(1).join(' ') || '');
      setEmail(user.email || '');
      setMobile(user.mobile || '');
    }
  }, [user]);

  // Change Password Modal
  const [pwModalOpen, setPwModalOpen] = useState<boolean>(false);
  const [newPin, setNewPin] = useState<string>('');
  const [confirmNewPin, setConfirmNewPin] = useState<string>('');
  const [pwSubmitting, setPwSubmitting] = useState<boolean>(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<boolean>(false);

  const handleCopyValue = (val: string, label: string) => {
    copyToClipboard(val, label);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

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

  const handleSyncApi = async () => {
    setIsSyncingApi(true);
    try {
      const res = await fetchUserDataFromApi();
      if (res.success) {
        showToast('Live User Data Synchronized from API!', 'success');
      } else {
        showToast(res.error || 'Failed to connect to API.', 'error');
      }
    } finally {
      setIsSyncingApi(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);

    if (newPin.length < 1 || newPin.length > 6) {
      setPwError('Security PIN must be between 1 and 6 numbers.');
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
    <div className="space-y-6 pb-16 font-sans select-none text-slate-100">
      
      {/* Top Banner with User Identity Overlay */}
      <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden border border-[#18181c] shadow-2xl bg-[#08080a]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00e699]/15 via-[#00d2d3]/10 to-transparent" />
        <div className="absolute inset-0 opacity-10 flex items-center justify-around font-black text-9xl text-white select-none pointer-events-none font-mono">
          <span>{BRAND.tokenSymbol}</span>
        </div>

        {/* User ID Tag Badge overlaid on Banner */}
        <div className="absolute bottom-4 left-4 sm:left-6 p-3 rounded-2xl bg-[#020204]/90 backdrop-blur-md border border-[#18181c] flex items-center gap-3 shadow-2xl">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00ffa3] to-[#00b875] text-black font-black flex items-center justify-center text-lg shadow-md">
            {user?.name.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white">{user?.name || 'Money X User'}</h2>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-950/80 border border-[#00ffa3]/40 text-[#00ffa3] text-[9px] font-bold">
                {user?.kycStatus || 'ACTIVE'}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              ID: <span className="text-white font-bold">{user?.id}</span>
              {user?.referBy && (
                <span className="text-[#00e699] ml-1.5">· Sponsor: @{user.referBy}</span>
              )}
            </p>
          </div>
        </div>

        {/* API Status Pill overlaid on Banner top-right */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setApiModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[#020204]/80 backdrop-blur-md border border-[#18181c] hover:border-[#00ffa3]/40 text-xs font-mono text-[#00ffa3] flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
          >
            <Server size={13} />
            <span>API: ?Api=User</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                apiConfig.status === 'CONNECTED'
                  ? 'bg-[#00ffa3] animate-pulse'
                  : apiConfig.status === 'IMPORTED'
                  ? 'bg-purple-400'
                  : 'bg-emerald-500'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Action Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'about'
                ? 'bg-[#00e699] text-black shadow-md shadow-[#00e699]/20'
                : 'text-slate-400 hover:text-white bg-[#020204]'
            }`}
          >
            <Info size={13} />
            <span>About</span>
          </button>

          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'edit'
                ? 'bg-[#00e699] text-black shadow-md shadow-[#00e699]/20'
                : 'text-slate-400 hover:text-white bg-[#020204]'
            }`}
          >
            <Edit3 size={13} />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'api'
                ? 'bg-[#00e699] text-black shadow-md shadow-[#00e699]/20'
                : 'text-slate-400 hover:text-white bg-[#020204]'
            }`}
          >
            <Server size={13} />
            <span>API & Live Data</span>
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

      {/* ---------------- TAB 1: ABOUT & ACCOUNT LEDGER ---------------- */}
      {activeTab === 'about' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Full User Data Showcase */}
          <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#18181c] pb-3">
              <div className="flex items-center gap-2 text-white text-sm font-bold uppercase tracking-wider font-mono">
                <User size={16} className="text-[#00e699]" />
                <span>User Account Ledger</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className="text-xs text-[#00e699] hover:underline font-semibold cursor-pointer"
              >
                Edit Details
              </button>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#020204] border border-[#18181c]">
                <span className="text-slate-400">User ID:</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#00e699] font-bold">{user?.id}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyValue(user?.id || '', 'User ID')}
                    className="text-slate-500 hover:text-white"
                  >
                    {copiedField === 'User ID' ? <Check size={12} className="text-[#00e699]" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#020204] border border-[#18181c]">
                <span className="text-slate-400">Full Name:</span>
                <span className="text-white font-bold">{user?.name}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#020204] border border-[#18181c]">
                <span className="text-slate-400">Mobile Phone:</span>
                <span className="text-white font-bold">{user?.mobile || 'Not configured'}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#020204] border border-[#18181c]">
                <span className="text-slate-400">Email Address:</span>
                <span className="text-white font-bold truncate max-w-[200px]">{user?.email || 'user@moneyx.com'}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#020204] border border-[#18181c]">
                <span className="text-slate-400">Country:</span>
                <span className="text-white font-bold">{user?.country}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#020204] border border-[#18181c]">
                <span className="text-slate-400">Referral ID:</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">{user?.referId}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyValue(user?.referId || '', 'Referral ID')}
                    className="text-slate-500 hover:text-white"
                  >
                    {copiedField === 'Referral ID' ? <Check size={12} className="text-[#00e699]" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#020204] border border-[#18181c]">
                <span className="text-slate-400">Sponsor (Refer By):</span>
                <span className="text-[#00e699] font-bold">@{user?.referBy || 'Direct'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Balances & Security Card */}
          <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#18181c] pb-3">
              <div className="flex items-center gap-2 text-white text-sm font-bold uppercase tracking-wider font-mono">
                <Wallet size={16} className="text-[#00e699]" />
                <span>Balances & Vault</span>
              </div>
              <button
                type="button"
                onClick={() => setApiModalOpen(true)}
                className="text-xs text-[#00ffa3] hover:underline font-semibold cursor-pointer"
              >
                API Sync
              </button>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#020204] border border-[#18181c]">
                <span className="text-slate-400">Total Portfolio:</span>
                <span className="text-white font-black text-sm">{wallets?.totalBalanceUSDT?.toFixed(2) || '0.00'} USDT</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#020204] border border-[#18181c]">
                <span className="text-slate-400">Main Wallet:</span>
                <span className="text-[#00ffa3] font-bold">{wallets?.mainBalanceUSDT?.toFixed(2) || '0.00'} USDT</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#020204] border border-[#18181c]">
                <span className="text-slate-400">Spot Wallet:</span>
                <span className="text-white font-bold">{wallets?.spotBalanceUSDT?.toFixed(2) || '0.00'} USDT</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#020204] border border-[#18181c]">
                <span className="text-slate-400">Funding Wallet:</span>
                <span className="text-white font-bold">{wallets?.fundingBalanceUSDT?.toFixed(2) || '0.00'} USDT</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#020204] border border-[#18181c]">
                <span className="text-slate-400">Connected Wallet:</span>
                <span className="text-slate-300 font-bold truncate max-w-[150px]">
                  {user?.walletAddress ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : '0x7ACc...d9b8'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#020204] border border-[#18181c]">
                <span className="text-slate-400">KYC Status:</span>
                <span className="text-[#00e699] font-bold">{user?.kycStatus || 'Active'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- TAB 2: EDIT PROFILE FORM ---------------- */}
      {activeTab === 'edit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-5">
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
                    value={user?.id || 'MNX633547863'}
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

          <div className="lg:col-span-4 p-5 sm:p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-[#18181c] pb-3">
              Helpful Notes
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Updating your personal profile updates your identity in the Money X ledger. Your User ID and Sponsor cannot be altered once assigned.
            </p>
          </div>
        </div>
      )}

      {/* ---------------- TAB 3: API & LIVE USER DATA ---------------- */}
      {activeTab === 'api' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: API Endpoint and Controls */}
            <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#18181c] pb-3">
                <div className="flex items-center gap-2 text-white text-sm font-bold uppercase tracking-wider font-mono">
                  <Server size={16} className="text-[#00e699]" />
                  <span>API Connection Manager (?Api=User)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setApiModalOpen(true)}
                  className="text-xs text-[#00ffa3] hover:underline font-semibold cursor-pointer"
                >
                  Full Modal
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-[#020204] border border-[#18181c] space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Endpoint URL:</span>
                  <span className="text-[#00ffa3] truncate max-w-[240px]">{apiConfig.endpointUrl}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Connection Status:</span>
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        apiConfig.status === 'CONNECTED'
                          ? 'bg-[#00ffa3] animate-pulse'
                          : apiConfig.status === 'IMPORTED'
                          ? 'bg-purple-400'
                          : 'bg-emerald-500'
                      }`}
                    />
                    <span>{apiConfig.status}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Last Synced:</span>
                  <span className="text-slate-300">
                    {apiConfig.lastSyncTime ? new Date(apiConfig.lastSyncTime).toLocaleTimeString() : 'Current Session'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleSyncApi}
                  disabled={isSyncingApi}
                  className="px-4 py-2.5 rounded-xl bg-[#00ffa3] hover:bg-[#00e699] disabled:opacity-50 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#00ffa3]/20"
                >
                  {isSyncingApi ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Syncing...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw size={14} />
                      <span>Sync Live From API</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setApiModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#020204] hover:bg-[#121216] border border-[#18181c] text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload size={14} />
                  <span>Paste / Import JSON</span>
                </button>

              </div>
            </div>

            {/* Right: Raw JSON Code Preview */}
            <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-[#18181c] pb-3">
                <div className="flex items-center gap-2 text-white text-sm font-bold uppercase tracking-wider font-mono">
                  <Code size={16} className="text-[#00e699]" />
                  <span>Raw API Response</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const payload = apiConfig.rawResponse || user;
                    copyToClipboard(JSON.stringify(payload, null, 2), 'Raw API JSON');
                    setCopiedJson(true);
                    setTimeout(() => setCopiedJson(false), 2000);
                  }}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono cursor-pointer"
                >
                  {copiedJson ? <Check size={12} className="text-[#00ffa3]" /> : <Copy size={12} />}
                  <span>{copiedJson ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <pre className="p-3.5 rounded-xl bg-[#000000] border border-[#18181c] text-[11px] font-mono text-[#00ffa3] overflow-x-auto max-h-72 leading-relaxed select-text">
                {JSON.stringify(apiConfig.rawResponse || user, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Change Password / PIN Modal */}
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
                <label className="text-xs text-slate-300 font-semibold">New 1-6 Digit PIN</label>
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

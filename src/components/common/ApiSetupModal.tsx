/*
 FILE: src/components/common/ApiSetupModal.tsx

 PURPOSE:
 Interactive modal for configuring the User API endpoint (e.g. http://localhost/x.money/?Api=User),
 testing live connectivity, pasting / importing raw JSON responses, and inspecting live user data.
*/

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from './Toast';
import { DEFAULT_API_ENDPOINT } from '../../services/userApiService';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Code,
  Copy,
  ExternalLink,
  Globe,
  HelpCircle,
  Info,
  Loader2,
  RefreshCw,
  Server,
  User,
  Wallet,
  X,
  Zap,
} from 'lucide-react';

export const ApiSetupModal: React.FC = () => {
  const {
    apiModalOpen,
    setApiModalOpen,
    apiConfig,
    updateApiConfig,
    fetchUserDataFromApi,
    user,
    wallets,
  } = useAuth();

  const { showToast, copyToClipboard } = useToast();

  const [urlInput, setUrlInput] = useState<string>(apiConfig.endpointUrl || DEFAULT_API_ENDPOINT);
  const [activeTab, setActiveTab] = useState<'endpoint' | 'preview'>('endpoint');
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [localFeedback, setLocalFeedback] = useState<{ type: 'success' | 'error' | 'info'; msg: string } | null>(null);

  if (!apiModalOpen) return null;

  const handleFetch = async () => {
    setLocalFeedback(null);
    setIsTesting(true);
    try {
      const cleanUrl = urlInput.trim();
      updateApiConfig({ endpointUrl: cleanUrl });
      const res = await fetchUserDataFromApi(cleanUrl);
      if (res.success) {
        setLocalFeedback({
          type: 'success',
          msg: 'User data fetched and synchronized successfully from API!',
        });
        showToast('Live User Data Synchronized!', 'success');
      } else {
        setLocalFeedback({
          type: 'error',
          msg: res.error || 'Failed to fetch from API endpoint.',
        });
      }
    } catch (err: any) {
      setLocalFeedback({
        type: 'error',
        msg: err.message || 'Error occurred while contacting API.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleCopyRawJson = () => {
    const rawToCopy = apiConfig.rawResponse || user;
    if (rawToCopy) {
      copyToClipboard(JSON.stringify(rawToCopy, null, 2), 'Raw API JSON');
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none font-sans">
      <div className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-[#08080a] border border-[#18181c] shadow-2xl overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#18181c] bg-[#030305]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00ffa3]/20 via-[#00e699]/10 to-[#00ffa3]/30 border border-[#00ffa3]/30 flex items-center justify-center text-[#00ffa3] shadow-md">
              <Server size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  User API & Data Setup
                </h2>
                {/* Status Indicator */}
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    apiConfig.status === 'CONNECTED'
                      ? 'bg-emerald-950/80 text-[#00ffa3] border border-[#00ffa3]/40'
                      : apiConfig.status === 'IMPORTED'
                      ? 'bg-purple-950/80 text-purple-300 border border-purple-500/40'
                      : apiConfig.status === 'CONNECTING'
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                      : apiConfig.status === 'ERROR'
                      ? 'bg-red-950/80 text-rose-300 border border-rose-500/40'
                      : 'bg-slate-900 text-slate-400 border border-slate-700'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      apiConfig.status === 'CONNECTED'
                        ? 'bg-[#00ffa3] animate-pulse'
                        : apiConfig.status === 'IMPORTED'
                        ? 'bg-purple-400'
                        : apiConfig.status === 'CONNECTING'
                        ? 'bg-amber-400 animate-ping'
                        : apiConfig.status === 'ERROR'
                        ? 'bg-rose-400'
                        : 'bg-slate-500'
                    }`}
                  />
                  <span>
                    {apiConfig.status === 'CONNECTED'
                      ? 'API Connected'
                      : apiConfig.status === 'IMPORTED'
                      ? 'JSON Imported'
                      : apiConfig.status === 'CONNECTING'
                      ? 'Connecting...'
                      : apiConfig.status === 'ERROR'
                      ? 'Connection Error'
                      : 'Idle'}
                  </span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                API base: <span className="text-[#00ffa3]">{apiConfig.endpointUrl}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setApiModalOpen(false)}
            className="p-2 rounded-xl bg-[#030305] text-slate-400 hover:text-white border border-[#18181c] hover:border-slate-700 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 px-4 sm:px-5 pt-3 pb-2 border-b border-[#141418] bg-[#050507]">
          <button
            type="button"
            onClick={() => setActiveTab('endpoint')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'endpoint'
                ? 'bg-[#00ffa3] text-black shadow-md shadow-[#00ffa3]/20'
                : 'text-slate-400 hover:text-white bg-[#0a0a0e]'
            }`}
          >
            <Globe size={13} />
            <span>API Endpoint</span>
          </button>



          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'bg-[#00ffa3] text-black shadow-md shadow-[#00ffa3]/20'
                : 'text-slate-400 hover:text-white bg-[#0a0a0e]'
            }`}
          >
            <Code size={13} />
            <span>Live Data & JSON</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Feedback Banner */}
          {localFeedback && (
            <div
              className={`p-3 rounded-2xl border text-xs flex items-start gap-2.5 animate-fadeIn ${
                localFeedback.type === 'success'
                  ? 'bg-emerald-950/40 border-[#00ffa3]/40 text-[#00ffa3]'
                  : localFeedback.type === 'error'
                  ? 'bg-rose-950/40 border-rose-800/50 text-rose-300'
                  : 'bg-blue-950/40 border-blue-800/40 text-blue-300'
              }`}
            >
              {localFeedback.type === 'success' ? (
                <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-[#00ffa3]" />
              ) : (
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
              )}
              <span className="leading-relaxed">{localFeedback.msg}</span>
            </div>
          )}

          {/* TAB 1: API ENDPOINT CONFIGURATION */}
          {activeTab === 'endpoint' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#030305] border border-[#18181c] space-y-3">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>x.money API Base URL</span>
                  <span className="text-[10px] text-slate-500 font-mono">GET / JSON</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="http://localhost/x.money/"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#08080a] border border-[#1c1c24] text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-[#00ffa3] transition-colors"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleFetch}
                    disabled={isTesting}
                    className="px-4 py-2.5 rounded-xl bg-[#00ffa3] hover:bg-[#00e699] disabled:opacity-50 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#00ffa3]/20"
                  >
                    {isTesting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw size={14} />
                        <span>Fetch Data</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 items-end">
                  <div className="space-y-1.5">
                    <label htmlFor="xmoney-user-uid" className="text-xs font-semibold text-slate-300">x.money User UID (required)</label>
                    <input
                      id="xmoney-user-uid"
                      type="text"
                      autoComplete="off"
                      spellCheck={false}
                      value={apiConfig.userId || ''}
                      onChange={(e) => updateApiConfig({ userId: e.target.value })}
                      placeholder="Enter the real UID from your x.money database"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#08080a] border border-[#1c1c24] text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-[#00ffa3]"
                    />
                  </div>
                  <p className="text-[10px] text-amber-300 leading-relaxed max-w-xs">Use only your own test account. The legacy API needs server-side access controls before exposing real user data.</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Info size={12} className="text-[#00ffa3]" />
                    <span>Default: <code className="text-slate-300 font-mono">http://localhost/x.money/</code></span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setUrlInput(DEFAULT_API_ENDPOINT)}
                    className="text-[#00ffa3] hover:underline cursor-pointer"
                  >
                    Reset to Default
                  </button>
                </div>
              </div>

              {/* Mixed-Content / Localhost Notice Card */}
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-amber-200/90 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <HelpCircle size={15} />
                  <span>Testing with Localhost (XAMPP / PHP / Apache)?</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-200/80">
                  If this app is running in an online HTTPS preview, modern web browsers block direct calls to insecure HTTP localhost (<code className="font-mono text-amber-100">http://localhost/x.money/</code>) due to <strong>Mixed Content</strong> and <strong>CORS</strong> policies.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">


                </div>
              </div>

              {/* Quick Summary of Current Loaded User */}
              {user && (
                <div className="p-4 rounded-2xl bg-[#030305] border border-[#18181c] space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <User size={14} className="text-[#00ffa3]" />
                      <span>Current Active User Session</span>
                    </span>
                    <span className="font-mono text-[#00ffa3]">ID: {user.id}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-[#08080a] border border-[#141418]">
                      <span className="text-[10px] text-slate-500 block">Name</span>
                      <span className="text-white font-bold truncate block">{user.name}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#08080a] border border-[#141418]">
                      <span className="text-[10px] text-slate-500 block">Mobile</span>
                      <span className="text-white font-bold truncate block">{user.mobile || '—'}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#08080a] border border-[#141418]">
                      <span className="text-[10px] text-slate-500 block">Sponsor (Refer By)</span>
                      <span className="text-[#00ffa3] font-bold truncate block">{user.referBy || 'None'}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#08080a] border border-[#141418]">
                      <span className="text-[10px] text-slate-500 block">Total Balance</span>
                      <span className="text-white font-bold block">{wallets?.totalBalanceUSDT?.toFixed(2) || '0.00'} USDT</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#08080a] border border-[#141418]">
                      <span className="text-[10px] text-slate-500 block">Referral ID</span>
                      <span className="text-white font-bold truncate block">{user.referId}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#08080a] border border-[#141418]">
                      <span className="text-[10px] text-slate-500 block">KYC Status</span>
                      <span className="text-[#00ffa3] font-bold block">{user.kycStatus}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LIVE DATA & RAW JSON VIEWER */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              {/* Formatted User Details Card */}
              <div className="p-4 rounded-2xl bg-[#030305] border border-[#18181c] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <User size={14} className="text-[#00ffa3]" />
                    <span>Authoritative User Ledger Data</span>
                  </h3>
                  <span className="text-[11px] text-[#00ffa3] font-mono">
                    Last Sync: {apiConfig.lastSyncTime ? new Date(apiConfig.lastSyncTime).toLocaleTimeString() : 'Current Session'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#08080a] border border-[#141418]">
                    <span className="text-slate-400">User ID:</span>
                    <span className="text-[#00ffa3] font-bold">{user?.id || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#08080a] border border-[#141418]">
                    <span className="text-slate-400">Full Name:</span>
                    <span className="text-white font-bold">{user?.name || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#08080a] border border-[#141418]">
                    <span className="text-slate-400">Mobile:</span>
                    <span className="text-white font-bold">{user?.mobile || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#08080a] border border-[#141418]">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-white truncate max-w-[160px]">{user?.email || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#08080a] border border-[#141418]">
                    <span className="text-slate-400">Country:</span>
                    <span className="text-white">{user?.country || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#08080a] border border-[#141418]">
                    <span className="text-slate-400">Sponsor / Refer By:</span>
                    <span className="text-[#00ffa3] font-bold">{user?.referBy || 'None'}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#08080a] border border-[#141418]">
                    <span className="text-slate-400">My Referral ID:</span>
                    <span className="text-white font-bold">{user?.referId || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#08080a] border border-[#141418]">
                    <span className="text-slate-400">Wallet Address:</span>
                    <span className="text-white truncate max-w-[160px]">
                      {user?.walletAddress ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : '0x7acc...f2b9'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Raw JSON Code Box */}
              <div className="p-4 rounded-2xl bg-[#030305] border border-[#18181c] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                    <Code size={13} className="text-[#00ffa3]" />
                    <span>Raw API JSON Output</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyRawJson}
                    className="px-2.5 py-1 rounded-lg bg-[#0a0a0e] hover:bg-[#14141a] text-slate-300 hover:text-white border border-[#1c1c24] text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedJson ? <Check size={12} className="text-[#00ffa3]" /> : <Copy size={12} />}
                    <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>

                <pre className="p-3.5 rounded-xl bg-[#000000] border border-[#18181c] text-[11px] font-mono text-[#00ffa3] overflow-x-auto max-h-56 leading-relaxed select-text">
                  {JSON.stringify(apiConfig.rawResponse || user, null, 2)}
                </pre>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#18181c] bg-[#030305]/60 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 font-mono">
            Endpoint: <code className="text-[#00ffa3]">?Api=User</code>
          </div>

          <button
            type="button"
            onClick={() => setApiModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-[#141418] hover:bg-[#1e1e24] text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

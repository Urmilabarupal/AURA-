/*
 FILE: src/pages/community/CommunityShare.tsx

 PURPOSE:
 Referral Invitation Toolkit, QR Code Generation, and Social Sharing.
 Implements Rule 19 (Community Share).

 RESPONSIBILITIES:
 - Render QR Code and custom referral links
 - Support one-click clipboard copying with visual feedback
 - Provide instant share links for Telegram, Twitter, WhatsApp, and Email
 - Guide new affiliates on network growth rewards

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Check, Copy, Globe, Mail, MessageCircle, QrCode, Send, Share2, Users } from 'lucide-react';

export const CommunityShare: React.FC = () => {
  const { user, setActiveRoute } = useAuth();
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const referId = user?.referId || 'HX001';
  const referralUrl = `https://auramoney.com/?r=${referId}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(referId);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Sub-Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#131728] border border-[#202740] shadow-md">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveRoute('community-overview')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            Overview
          </button>
          <button
            onClick={() => setActiveRoute('community-levels')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            Levels
          </button>
          <button
            onClick={() => setActiveRoute('community-transactions')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveRoute('community-income')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            Income
          </button>
          <button
            onClick={() => setActiveRoute('community-share')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-sm"
          >
            Share
          </button>
        </div>
      </div>

      {/* Main Share Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: QR Code & Direct Link */}
        <div className="lg:col-span-6 p-8 rounded-2xl bg-[#131728] border border-[#202740] shadow-xl text-center space-y-6">
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 bg-white rounded-2xl p-3 flex items-center justify-center shadow-2xl shadow-purple-950/40">
              <QrCode size={160} className="text-slate-900" />
            </div>
            <p className="text-xs text-slate-400 mt-4">
              Scan with mobile camera to register with referral code
            </p>
          </div>

          <div className="space-y-3 pt-2 text-left">
            <label className="text-xs font-bold text-slate-300">Your Referral Link</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={referralUrl}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0c0f1a] border border-[#202740] text-xs font-mono text-slate-200 select-all"
              />
              <button
                onClick={copyUrl}
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                title="Copy Link"
              >
                {copiedLink ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div className="space-y-3 text-left">
            <label className="text-xs font-bold text-slate-300">Your Referral Code</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={referId}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0c0f1a] border border-[#202740] text-sm font-mono font-bold text-purple-400 select-all"
              />
              <button
                onClick={copyCode}
                className="p-2.5 rounded-xl bg-[#1c233c] hover:bg-[#252f50] text-slate-200 hover:text-white transition-colors border border-[#2b3558]"
                title="Copy Code"
              >
                {copiedCode ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Social Channels & Incentive Highlights */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-2xl bg-[#131728] border border-[#202740] shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-slate-100">Broadcast to Social Channels</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instantly share your invitation across popular social platforms and community groups.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${encodeURIComponent('Join AURA Financial and earn automated staking rewards!')}`}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-xl bg-[#182038] hover:bg-[#202b4d] border border-[#253259] text-xs font-bold text-slate-200 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <Send size={16} className="text-blue-400" />
                <span>Telegram</span>
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Join AURA Financial and earn automated staking rewards! ' + referralUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-xl bg-[#182038] hover:bg-[#202b4d] border border-[#253259] text-xs font-bold text-slate-200 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <Globe size={16} className="text-purple-400" />
                <span>Twitter (X)</span>
              </a>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Join AURA Financial: ' + referralUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-xl bg-[#182038] hover:bg-[#202b4d] border border-[#253259] text-xs font-bold text-slate-200 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} className="text-emerald-400" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`mailto:?subject=${encodeURIComponent('Invitation to AURA Financial')}&body=${encodeURIComponent('Register with my link: ' + referralUrl)}`}
                className="p-3.5 rounded-xl bg-[#182038] hover:bg-[#202b4d] border border-[#253259] text-xs font-bold text-slate-200 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <Mail size={16} className="text-pink-400" />
                <span>Email</span>
              </a>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-950/50 to-blue-950/50 border border-purple-500/30 shadow-lg space-y-3">
            <h4 className="text-sm font-bold text-purple-300">Affiliate Commission Tiers</h4>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>• <strong>Level 1:</strong> Earn 20% instant bonus on all direct deposit and staking events.</p>
              <p>• <strong>Level 2 - 3:</strong> Earn 10% and 5% recursive downline commission.</p>
              <p>• <strong>Levels 4 - 10:</strong> Unlock up to 10 layers of passive ecosystem royalties.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/*
 FILE: src/pages/info/ContactView.tsx

 PURPOSE:
 User Support, Customer Assistance, and Telegram / Ticket Submission.
 Implements Rule 1 & Section 2.

 RESPONSIBILITIES:
 - Provide direct support form
 - Provide official Telegram and Discord channels
 - Guide users to submit inquiries safely without sharing seed phrases

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React, { useState } from 'react';
import { CheckCircle2, Mail, MessageCircle, Send, ShieldAlert } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [sent, setSent] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setSubject('');
      setMessage('');
    }, 2500);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div className="space-y-1">
        <h1 className="text-xl font-black text-slate-100 uppercase tracking-tight">Contact Us</h1>
        <p className="text-xs text-slate-400">24/7 Global Protocol Support & Help Desk</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-slate-200">Submit Support Ticket</h3>

          {sent && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Ticket submitted successfully! Our desk responds within 2 hours.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">Inquiry Subject</label>
              <input
                type="text"
                placeholder="e.g. Staking question, deposit verification"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#020204] border border-[#18181c] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">Message</label>
              <textarea
                rows={4}
                placeholder="Describe your question or issue in detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#020204] border border-[#18181c] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-[#00ffaa] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Send size={14} />
              <span>Send Ticket</span>
            </button>
          </form>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-md space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Official Telegram Support
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Join our active community Telegram channel for real-time announcements and community moderators.
            </p>
            <a
              href="https://t.me"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#182038] hover:bg-[#202b4d] border border-[#253259] text-xs font-bold text-blue-400 hover:text-white transition-colors"
            >
              <MessageCircle size={15} />
              <span>Open Telegram Group</span>
            </a>
          </div>

          <div className="p-5 rounded-2xl bg-red-950/20 border border-red-800/30 space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
              <ShieldAlert size={16} />
              <span>Anti-Fraud Reminder</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Official support staff will NEVER ask for your private key, seed phrase, or PIN passcode under any circumstance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/*
 FILE: src/components/common/AuthLayoutWrapper.tsx

 PURPOSE:
 Compact, Zero-Scroll Master Shell matching image.png:
 - Fits 100% on a single display viewport without vertical scrolling
 - Deep obsidian atmosphere (#010503) with glowing emerald nebula rings and mountain silhouette
 - Top Bar:
   * Left: "← Back to Ecosystem Overview" pill button
   * Right: "🌐 English ∨" pill language selector
 - Centered Authoritative Money X Logo with glowing infinity emblem, green X, and
   "DECENTRALIZED REWARDS ECOSYSTEM" subtitle
 - Compact 3-node Stepper with connecting line
*/

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MoneyXLogo } from './MoneyXLogo';
import { ArrowLeft, ChevronDown, Globe } from 'lucide-react';

interface AuthLayoutWrapperProps {
  children: React.ReactNode;
  activeStep?: 1 | 2 | 3;
  stepLabels?: {
    step1: { title: string; sub: string };
    step2: { title: string; sub: string };
    step3: { title: string; sub: string };
  };
}

export const AuthLayoutWrapper: React.FC<AuthLayoutWrapperProps> = ({
  children,
  activeStep = 1,
  stepLabels = {
    step1: { title: 'Wallet', sub: 'Connect Wallet' },
    step2: { title: 'Passcode', sub: 'Set 6-digit' },
    step3: { title: 'Complete', sub: 'Start Using' },
  },
}) => {
  const { setAuthStage } = useAuth();
  const [langMenuOpen, setLangMenuOpen] = useState<boolean>(false);
  const [selectedLang, setSelectedLang] = useState<string>('English');

  const languages = ['English', 'Español', 'العربية', 'Français', 'Deutsch'];

  return (
    <div className="h-screen max-h-screen w-full bg-[#010603] text-white flex flex-col justify-between relative overflow-hidden select-none font-sans p-2 sm:p-3">
      
      {/* ----------------- ATMOSPHERIC COSMIC NEBULA & MOUNTAIN BACKGROUND ----------------- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Deep ambient radial glow behind top logo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[260px] bg-[#00ffa3]/10 rounded-full blur-[120px]" />
        
        {/* Left orbital ring highlight */}
        <div className="absolute top-[18%] -left-[160px] w-[440px] h-[440px] rounded-full border border-[#00ffa3]/15 shadow-[0_0_70px_rgba(0,255,163,0.06)] opacity-60" />

        {/* Right orbital ring highlight */}
        <div className="absolute top-[16%] -right-[150px] w-[480px] h-[480px] rounded-full border border-[#00ffa3]/15 shadow-[0_0_70px_rgba(0,255,163,0.06)] opacity-60" />

        {/* Mountain Silhouette Along Bottom */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full h-[140px] opacity-35 text-[#020b06]"
          viewBox="0 0 1440 140"
          fill="currentColor"
          preserveAspectRatio="none"
        >
          <path d="M0,140 L0,70 L120,40 L240,80 L380,30 L500,65 L640,20 L780,75 L920,25 L1060,60 L1200,35 L1320,70 L1440,45 L1440,140 Z" />
          <path
            d="M0,140 L0,90 L160,65 L320,100 L480,55 L640,85 L800,50 L960,90 L1120,60 L1280,95 L1440,75 L1440,140 Z"
            fill="#031109"
            opacity="0.6"
          />
        </svg>

        {/* Subtle grid mesh overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle, #00ffa3 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* ----------------- COMPACT TOP BAR matching image.png ----------------- */}
      <header className="relative z-20 w-full max-w-[1100px] mx-auto flex items-center justify-between shrink-0 py-1">
        
        {/* Left: "Back to Ecosystem Overview" Button */}
        <button
          type="button"
          onClick={() => setAuthStage('LANDING')}
          className="group px-3.5 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-[#06150d]/90 via-[#0a2013]/90 to-[#06150d]/90 hover:from-[#0a2417] hover:to-[#0f3220] text-[#00ffa3] hover:text-white border border-[#00ffa3]/35 hover:border-[#00ffa3] font-bold text-[11px] sm:text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,163,0.18)] hover:shadow-[0_0_25px_rgba(0,255,163,0.4)] transition-all cursor-pointer backdrop-blur-md active:scale-95"
        >
          <span className="w-4 h-4 rounded-full bg-[#00ffa3]/20 flex items-center justify-center text-[#00ffa3] group-hover:bg-[#00ffa3] group-hover:text-black transition-colors">
            <ArrowLeft size={11} className="stroke-[2.5] group-hover:-translate-x-0.5 transition-transform" />
          </span>
          <span className="tracking-wide">Back to Ecosystem Overview</span>
        </button>

        {/* Right: "🌐 English ∨" Button with dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="px-3 py-1.5 rounded-full bg-[#06120a]/80 backdrop-blur-md border border-[#183122] hover:border-[#00ffa3]/50 hover:bg-[#0a1c11] text-[11px] font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
          >
            <Globe size={13} className="text-[#00ffa3]" />
            <span>{selectedLang}</span>
            <ChevronDown size={12} className={`text-slate-400 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-36 rounded-2xl bg-[#07130b] border border-[#1b3425] shadow-2xl py-1 z-50 animate-fadeIn">
              {languages.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => {
                    setSelectedLang(l);
                    setLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    selectedLang === l ? 'text-[#00ffa3] bg-[#00ffa3]/10 font-bold' : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span>{l}</span>
                  {selectedLang === l && <span className="w-1.5 h-1.5 rounded-full bg-[#00ffa3]" />}
                </button>
              ))}
            </div>
          )}
        </div>

      </header>

      {/* ----------------- MAIN AUTH CONTAINER (Flex center, no scroll) ----------------- */}
      <main className="relative z-10 w-full max-w-[760px] mx-auto flex-1 flex flex-col items-center justify-center min-h-0 py-1">
        
        {/* Centered Money X Brand Emblem & Subtitle matching image.png */}
        <div className="mb-2 shrink-0 text-center">
          <MoneyXLogo
            size="md"
            glow
            layout="vertical"
            showSubtitle={true}
            subtitleText="DECENTRALIZED REWARDS ECOSYSTEM"
          />
        </div>

        {/* ----------------- COMPACT THREE STEPPER NODES matching image.png ----------------- */}
        <div className="w-full max-w-[420px] mb-2 sm:mb-3 shrink-0">
          <div className="flex items-center justify-between relative px-2">
            
            {/* Step 1 Node */}
            <div className="flex flex-col items-center text-center z-10">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-xs transition-all duration-300 ${
                  activeStep >= 1
                    ? 'bg-[#00ffa3] text-black shadow-[0_0_18px_rgba(0,255,163,0.75)]'
                    : 'border-2 border-[#1c3325] bg-[#06110a] text-slate-500'
                }`}
              >
                {activeStep > 1 ? '✓' : '1'}
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-white mt-1">
                {stepLabels.step1.title}
              </span>
              <span className={`text-[9px] sm:text-[10px] ${activeStep > 1 ? 'text-[#00ffa3] font-semibold' : 'text-slate-400'}`}>
                {activeStep > 1 ? 'Connected' : stepLabels.step1.sub}
              </span>
            </div>

            {/* Connecting Line 1 to 2 */}
            <div className="flex-1 h-[2px] mx-2 relative -top-3">
              <div
                className={`h-full w-full transition-all duration-500 ${
                  activeStep >= 2
                    ? 'bg-[#00ffa3] shadow-[0_0_10px_rgba(0,255,163,0.8)]'
                    : 'bg-[#152a1d]'
                }`}
              />
            </div>

            {/* Step 2 Node */}
            <div className="flex flex-col items-center text-center z-10">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-xs transition-all duration-300 ${
                  activeStep >= 2
                    ? 'bg-[#00ffa3] text-black shadow-[0_0_18px_rgba(0,255,163,0.75)]'
                    : 'border-2 border-[#1c3325] bg-[#06110a] text-slate-500'
                }`}
              >
                {activeStep > 2 ? '✓' : '2'}
              </div>
              <span className={`text-[11px] sm:text-xs font-bold mt-1 ${activeStep >= 2 ? 'text-white' : 'text-slate-400'}`}>
                {stepLabels.step2.title}
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-400">
                {stepLabels.step2.sub}
              </span>
            </div>

            {/* Connecting Line 2 to 3 */}
            <div className="flex-1 h-[2px] mx-2 relative -top-3">
              <div
                className={`h-full w-full transition-all duration-500 ${
                  activeStep >= 3
                    ? 'bg-[#00ffa3] shadow-[0_0_10px_rgba(0,255,163,0.8)]'
                    : 'bg-[#152a1d]'
                }`}
              />
            </div>

            {/* Step 3 Node */}
            <div className="flex flex-col items-center text-center z-10">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-xs transition-all duration-300 ${
                  activeStep >= 3
                    ? 'bg-[#00ffa3] text-black shadow-[0_0_18px_rgba(0,255,163,0.75)]'
                    : 'border-2 border-[#1c3325] bg-[#06110a] text-slate-500'
                }`}
              >
                {activeStep > 3 ? '✓' : '3'}
              </div>
              <span className={`text-[11px] sm:text-xs font-bold mt-1 ${activeStep >= 3 ? 'text-white' : 'text-slate-400'}`}>
                {stepLabels.step3.title}
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-500">
                {stepLabels.step3.sub}
              </span>
            </div>

          </div>
        </div>

        {/* Content Children (The Main Card - tight fit) */}
        <div className="w-full flex justify-center min-h-0">
          {children}
        </div>

      </main>

      {/* ----------------- COMPACT FOOTER ----------------- */}
      <footer className="relative z-10 w-full py-1 text-center text-[10px] text-slate-600 font-mono shrink-0">
        Money X Ecosystem · Non-Custodial Decentralized Security
      </footer>

    </div>
  );
};

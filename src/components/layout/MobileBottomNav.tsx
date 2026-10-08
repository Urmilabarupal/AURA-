/*
 FILE: src/components/layout/MobileBottomNav.tsx

 PURPOSE:
 Pixel-Perfect Detto Reproduction of the Futuristic Glowing Glass Bottom Navigation Bar
 exactly matching the user uploaded reference specification in:
 file_00000000c6448210af17cee63800fa15.png

 FEATURES:
 1. 5 Core Nodes:
    - Home (Minimalist house outline)
    - Wallets (Minimalist wallet outline)
    - Center Elevated Orb (Raised glowing 3D radial emerald button with 2x2 grid tiles)
    - Earn (3-leaf sprout seedling icon, routes to Staking/Farming/Rewards)
    - Community (Dual-user avatar silhouette, routes to Community/Team)
 2. Active State Styling (matching "Active State" panels in image):
    - Translucent emerald glowing capsule container (border border-[#00e699]/60, bg-gradient-to-b from-[#00e699]/30 to-[#00e699]/10)
    - Neon emerald icon and label glow
 3. Elevated Center Button:
    - Concentric halo rings with intense emerald neon bloom
    - Raised geometry with smooth tactile press feedback
 4. Outer Dock Shell:
    - Rounded 36px capsule pill with deep obsidian glass & backdrop blur
    - Hairline emerald neon border with bottom light reflection curve
    - Centered iOS home indicator line at bottom
 5. Display Rule:
    - Strictly visible on mobile screen widths (< lg:hidden)
    - Strictly hidden on desktop viewports (>= 1024px)
    - Strictly hidden when unauthenticated
*/

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Home, Sprout, Users, Wallet } from 'lucide-react';

interface MobileBottomNavProps {
  onOpenMenu?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenMenu }) => {
  const { authStage, user, activeRoute, setActiveRoute } = useAuth();

  // Guard: unauthenticated sessions never see the bottom nav
  if (authStage !== 'AUTHENTICATED' || !user) {
    return null;
  }

  const handleNav = (route: string) => {
    setActiveRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isHome = activeRoute === 'home' || activeRoute === '';
  const isWallets = activeRoute === 'wallets' || activeRoute === 'deposit' || activeRoute === 'withdraw' || activeRoute === 'single-wallet';
  const isMenu = activeRoute === 'menu' || activeRoute === 'ecosystem';
  const isEarn =
    activeRoute === 'staking' ||
    activeRoute === 'farming' ||
    activeRoute === 'my-staking' ||
    activeRoute === 'stake-wallet' ||
    activeRoute === 'reward' ||
    activeRoute === 'sip-bonus';
  const isCommunity =
    activeRoute === 'community' ||
    activeRoute === 'community-overview' ||
    activeRoute === 'community-share' ||
    activeRoute === 'direct-team' ||
    activeRoute === 'team-overview' ||
    activeRoute === 'level-income';

  return (
    <nav className="block lg:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-2 pt-1 pointer-events-none select-none font-sans">
      <div className="w-full max-w-[420px] mx-auto pointer-events-auto">
        
        {/* Outer Glassmorphic Capsule Dock matching file_00000000c6448210af17cee63800fa15.png */}
        <div className="relative rounded-[36px] bg-[#050e09]/85 backdrop-blur-2xl border border-[#00e699]/30 px-3 py-2 flex items-center justify-between shadow-[0_12px_45px_rgba(0,0,0,0.9),0_0_30px_rgba(0,230,153,0.18)]">
          
          {/* Subtle Ambient Emerald Bottom Edge Reflection Curve */}
          <div className="absolute -bottom-[1px] left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#00ffa3]/80 to-transparent blur-[1px] pointer-events-none" />

          {/* 1. Home Node */}
          <button
            type="button"
            onClick={() => handleNav('home')}
            className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 transition-all duration-200 cursor-pointer ${
              isHome
                ? 'rounded-[22px] bg-gradient-to-b from-[#00e699]/30 via-[#00e699]/15 to-[#00e699]/5 border border-[#00e699]/60 shadow-[0_0_16px_rgba(0,230,153,0.35)] px-3'
                : 'text-slate-400 hover:text-white px-2'
            }`}
            aria-label="Home"
          >
            <div className={`transition-transform duration-200 ${isHome ? 'scale-110 text-[#00ffa3]' : 'text-slate-300'}`}>
              <Home size={22} className={isHome ? 'stroke-[2.5]' : 'stroke-2'} />
            </div>
            <span
              className={`text-[11px] mt-0.5 tracking-tight transition-colors ${
                isHome ? 'font-black text-[#00ffa3] drop-shadow-[0_0_8px_rgba(0,255,163,0.5)]' : 'font-medium text-slate-400'
              }`}
            >
              Home
            </span>
          </button>

          {/* 2. Wallets Node */}
          <button
            type="button"
            onClick={() => handleNav('wallets')}
            className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 transition-all duration-200 cursor-pointer ${
              isWallets
                ? 'rounded-[22px] bg-gradient-to-b from-[#00e699]/30 via-[#00e699]/15 to-[#00e699]/5 border border-[#00e699]/60 shadow-[0_0_16px_rgba(0,230,153,0.35)] px-3'
                : 'text-slate-400 hover:text-white px-2'
            }`}
            aria-label="Wallets"
          >
            <div className={`transition-transform duration-200 ${isWallets ? 'scale-110 text-[#00ffa3]' : 'text-slate-300'}`}>
              {/* Minimalist Wallet with Card Notch matching image */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isWallets ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="15" rx="3" />
                <path d="M16 12h4" />
                <circle cx="18" cy="12" r="1" fill="currentColor" />
                <path d="M6 5V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2" />
              </svg>
            </div>
            <span
              className={`text-[11px] mt-0.5 tracking-tight transition-colors ${
                isWallets ? 'font-black text-[#00ffa3] drop-shadow-[0_0_8px_rgba(0,255,163,0.5)]' : 'font-medium text-slate-400'
              }`}
            >
              Wallets
            </span>
          </button>

          {/* 3. Center Elevated Floating Glowing Orb Button */}
          <div className="relative -top-5 shrink-0 px-1">
            {/* Concentric Halo Ring */}
            <div className="absolute inset-0 -m-2 rounded-full bg-emerald-500/20 blur-md pointer-events-none" />
            
            <button
              type="button"
              onClick={() => handleNav('menu')}
              className={`relative w-15 h-15 sm:w-16 sm:h-16 rounded-full p-1 bg-[#041108] border-2 border-[#00ffa3]/50 shadow-[0_0_30px_rgba(0,255,163,0.7),0_0_60px_rgba(0,230,153,0.35)] active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center group ${
                isMenu ? 'ring-4 ring-[#00ffa3] scale-105' : ''
              }`}
              aria-label="Ecosystem Menu"
            >
              {/* Core Gradient Orb */}
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#00ffa3] via-[#00e699] to-[#009b62] flex items-center justify-center shadow-inner group-hover:brightness-110 transition-all">
                {/* 4 Rounded Squares 2x2 Grid Icon matching image */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="7.5" height="7.5" rx="2.5" fill="#ffffff" />
                  <rect x="13.5" y="3" width="7.5" height="7.5" rx="2.5" fill="#ffffff" />
                  <rect x="3" y="13.5" width="7.5" height="7.5" rx="2.5" fill="#ffffff" />
                  <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2.5" fill="#ffffff" />
                </svg>
              </div>
            </button>
          </div>

          {/* 4. Earn Node (Sprout / Staking / Farming) */}
          <button
            type="button"
            onClick={() => handleNav('staking')}
            className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 transition-all duration-200 cursor-pointer ${
              isEarn
                ? 'rounded-[22px] bg-gradient-to-b from-[#00e699]/30 via-[#00e699]/15 to-[#00e699]/5 border border-[#00e699]/60 shadow-[0_0_16px_rgba(0,230,153,0.35)] px-3'
                : 'text-slate-400 hover:text-white px-2'
            }`}
            aria-label="Earn"
          >
            <div className={`transition-transform duration-200 ${isEarn ? 'scale-110 text-[#00ffa3]' : 'text-slate-300'}`}>
              {/* 3-Leaf Sprout Seedling SVG matching image */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isEarn ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22v-9" />
                <path d="M12 13a4.5 4.5 0 0 0 4.5-4.5c0-2.5-4.5-4.5-4.5-4.5s-4.5 2-4.5 4.5a4.5 4.5 0 0 0 4.5 4.5Z" />
                <path d="M12 17c3 0 6-1 7-4 0 0-2.5-1.5-4.5-.5" />
                <path d="M12 19c-3 0-6-1-7-4 0 0 2.5-1.5 4.5-.5" />
              </svg>
            </div>
            <span
              className={`text-[11px] mt-0.5 tracking-tight transition-colors ${
                isEarn ? 'font-black text-[#00ffa3] drop-shadow-[0_0_8px_rgba(0,255,163,0.5)]' : 'font-medium text-slate-400'
              }`}
            >
              Earn
            </span>
          </button>

          {/* 5. Community Node */}
          <button
            type="button"
            onClick={() => handleNav('community')}
            className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 transition-all duration-200 cursor-pointer ${
              isCommunity
                ? 'rounded-[22px] bg-gradient-to-b from-[#00e699]/30 via-[#00e699]/15 to-[#00e699]/5 border border-[#00e699]/60 shadow-[0_0_16px_rgba(0,230,153,0.35)] px-3'
                : 'text-slate-400 hover:text-white px-2'
            }`}
            aria-label="Community"
          >
            <div className={`transition-transform duration-200 ${isCommunity ? 'scale-110 text-[#00ffa3]' : 'text-slate-300'}`}>
              <Users size={22} className={isCommunity ? 'stroke-[2.5]' : 'stroke-2'} />
            </div>
            <span
              className={`text-[11px] mt-0.5 tracking-tight transition-colors ${
                isCommunity ? 'font-black text-[#00ffa3] drop-shadow-[0_0_8px_rgba(0,255,163,0.5)]' : 'font-medium text-slate-400'
              }`}
            >
              Community
            </span>
          </button>

        </div>

        {/* Centered iOS Home Indicator Bar under Dock matching image */}
        <div className="w-32 h-1 rounded-full bg-white/25 mx-auto mt-2 shadow-sm" />

      </div>
    </nav>
  );
};

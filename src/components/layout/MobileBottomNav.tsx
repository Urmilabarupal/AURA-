/*
 FILE: src/components/layout/MobileBottomNav.tsx

 PURPOSE:
 Mobile-Only Bottom Navigation Bar styled with authentic pitch-black OLED theme.
 STRICT DISPLAY RULES (Per user instructions):
 - ONLY visible on mobile screen widths (< 1024px / lg:hidden)
 - STRICTLY HIDDEN on desktop viewports
 - STRICTLY HIDDEN if user is not authenticated
 - Direct route navigation without dummy bypasses
*/

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Coins, Grid, Home, LineChart, Repeat, Wallet } from 'lucide-react';

interface MobileBottomNavProps {
  onOpenMenu?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenMenu }) => {
  const { authStage, user, activeRoute, setActiveRoute } = useAuth();

  // Without authenticated session, mobile bottom navigation is strictly not rendered!
  if (authStage !== 'AUTHENTICATED' || !user) {
    return null;
  }

  const handleNav = (route: string) => {
    setActiveRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isHome = activeRoute === 'home';
  const isTrade = activeRoute === 'trade';
  const isStaking = activeRoute === 'staking' || activeRoute === 'staking-plan';
  const isConvert = activeRoute === 'convert' || activeRoute === 'hxc-convert' || activeRoute === 'xah-convert';
  const isWallet = activeRoute === 'wallets' || activeRoute === 'wallet-detail' || activeRoute === 'deposit' || activeRoute === 'withdraw';

  return (
    <nav className="block lg:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pt-1 pointer-events-none select-none font-sans">
      <div className="w-full max-w-md mx-auto rounded-2xl bg-[#08080a]/95 backdrop-blur-2xl border border-[#18181c] p-1.5 flex items-center justify-around shadow-[0_10px_40px_rgba(0,0,0,0.85)] pointer-events-auto transition-all">
        
        {/* 1. Home / Terminal */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className={`flex flex-col items-center gap-1 px-2.5 sm:px-3.5 py-1 cursor-pointer transition-all duration-200 group ${
            isHome ? 'text-[#00e699]' : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Home"
        >
          <Home size={18} className={isHome ? 'stroke-[2.5]' : 'stroke-2 group-hover:scale-110 transition-transform'} />
          <span className={`text-[10px] ${isHome ? 'font-black tracking-tight' : 'font-medium'}`}>Home</span>
        </button>

        {/* 2. Trade */}
        <button
          type="button"
          onClick={() => handleNav('trade')}
          className={`flex flex-col items-center gap-1 px-2.5 sm:px-3.5 py-1 cursor-pointer transition-all duration-200 group ${
            isTrade ? 'text-[#00e699]' : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Trading Terminal"
        >
          <LineChart size={18} className={isTrade ? 'stroke-[2.5]' : 'stroke-2 group-hover:scale-110 transition-transform'} />
          <span className={`text-[10px] ${isTrade ? 'font-black tracking-tight' : 'font-medium'}`}>Trade</span>
        </button>

        {/* 3. Staking */}
        <button
          type="button"
          onClick={() => handleNav('staking')}
          className={`flex flex-col items-center gap-1 px-2.5 sm:px-3.5 py-1 cursor-pointer transition-all duration-200 group ${
            isStaking ? 'text-[#00e699]' : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Staking Vaults"
        >
          <Coins size={18} className={isStaking ? 'stroke-[2.5]' : 'stroke-2 group-hover:scale-110 transition-transform'} />
          <span className={`text-[10px] ${isStaking ? 'font-black tracking-tight' : 'font-medium'}`}>Staking</span>
        </button>

        {/* 4. Center Elevated Action Menu */}
        <button
          type="button"
          onClick={() => {
            if (onOpenMenu) {
              onOpenMenu();
            } else {
              setActiveRoute('home');
            }
          }}
          className="w-11 h-11 sm:w-12 sm:h-12 -mt-4 sm:-mt-6 rounded-2xl bg-[#00e699] hover:bg-[#00ffaa] text-black flex items-center justify-center shadow-lg shadow-[#00e699]/35 active:scale-95 transition-all cursor-pointer group"
          aria-label="Open Full Navigation Menu"
        >
          <Grid size={22} className="stroke-[2.5] text-black group-hover:rotate-45 transition-transform duration-200" />
        </button>

        {/* 5. Convert */}
        <button
          type="button"
          onClick={() => handleNav('convert')}
          className={`flex flex-col items-center gap-1 px-2.5 sm:px-3.5 py-1 cursor-pointer transition-all duration-200 group ${
            isConvert ? 'text-[#00e699]' : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Convert / Swap"
        >
          <Repeat size={18} className={isConvert ? 'stroke-[2.5]' : 'stroke-2 group-hover:scale-110 transition-transform'} />
          <span className={`text-[10px] ${isConvert ? 'font-black tracking-tight' : 'font-medium'}`}>Convert</span>
        </button>

        {/* 6. Wallets */}
        <button
          type="button"
          onClick={() => handleNav('wallets')}
          className={`flex flex-col items-center gap-1 px-2.5 sm:px-3.5 py-1 cursor-pointer transition-all duration-200 group ${
            isWallet ? 'text-[#00e699]' : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Wallets & Balances"
        >
          <Wallet size={18} className={isWallet ? 'stroke-[2.5]' : 'stroke-2 group-hover:scale-110 transition-transform'} />
          <span className={`text-[10px] ${isWallet ? 'font-black tracking-tight' : 'font-medium'}`}>Wallets</span>
        </button>

      </div>
    </nav>
  );
};

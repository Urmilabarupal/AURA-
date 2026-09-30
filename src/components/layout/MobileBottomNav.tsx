/*
 FILE: src/components/layout/MobileBottomNav.tsx

 PURPOSE:
 Exact 1:1 reproduction of the Mobile Bottom Navigation Dock
 seen in reference screenshots (Screenshots 3, 4, 5).
 Features:
 - Home (active indicator)
 - Convert
 - Center elevated Grid/Menu button (opens mobile drawer)
 - Trade
 - Wallet
*/

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Grid, Home, LineChart, Repeat, Wallet } from 'lucide-react';

interface MobileBottomNavProps {
  onOpenMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenMenu }) => {
  const { activeRoute, setActiveRoute } = useAuth();

  const handleNav = (route: string) => {
    setActiveRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isHome = activeRoute === 'home';
  const isConvert = activeRoute === 'convert' || activeRoute === 'hxc-convert' || activeRoute === 'xah-convert';
  const isTrade = activeRoute === 'trade';
  const isWallet = activeRoute === 'wallets' || activeRoute === 'wallet-detail' || activeRoute === 'deposit' || activeRoute === 'withdraw';

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 pt-1 pointer-events-none select-none">
      <div className="w-full max-w-md mx-auto rounded-3xl bg-[#12141e]/95 backdrop-blur-md border border-[#222738] p-2 flex items-center justify-around shadow-2xl pointer-events-auto">
        
        {/* Home */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className={`flex flex-col items-center gap-1 px-3 py-1 cursor-pointer transition-colors ${
            isHome ? 'text-[#1c64f2]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Home size={18} />
          <span className="text-[10px] font-semibold">Home</span>
        </button>

        {/* Convert */}
        <button
          type="button"
          onClick={() => handleNav('convert')}
          className={`flex flex-col items-center gap-1 px-3 py-1 cursor-pointer transition-colors ${
            isConvert ? 'text-[#1c64f2]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Repeat size={18} />
          <span className="text-[10px] font-medium">Convert</span>
        </button>

        {/* Center Elevated Menu Icon (Opens Sidebar drawer with ALL pages) */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="w-12 h-12 -mt-5 rounded-2xl bg-[#1a1e2d] border border-[#293248] text-white flex items-center justify-center shadow-xl hover:bg-[#20263a] active:scale-95 transition-all cursor-pointer group"
          aria-label="Open All Pages Menu"
        >
          <Grid size={22} className="text-slate-200 group-hover:text-purple-400 transition-colors" />
        </button>

        {/* Trade */}
        <button
          type="button"
          onClick={() => handleNav('trade')}
          className={`flex flex-col items-center gap-1 px-3 py-1 cursor-pointer transition-colors ${
            isTrade ? 'text-[#1c64f2]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <LineChart size={18} />
          <span className="text-[10px] font-medium">Trade</span>
        </button>

        {/* Wallet */}
        <button
          type="button"
          onClick={() => handleNav('wallets')}
          className={`flex flex-col items-center gap-1 px-3 py-1 cursor-pointer transition-colors ${
            isWallet ? 'text-[#1c64f2]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Wallet size={18} />
          <span className="text-[10px] font-medium">Wallet</span>
        </button>

      </div>
    </div>
  );
};

/*
 FILE: src/components/layout/MobileBottomNav.tsx

 PURPOSE:
 Mobile-Only Bottom Navigation Dock identically matching the phone screen in:
 file_0000000012b082439e9a2fc938785f05.png:
 
 5 Institutional Nav Nodes:
 1. Home (Green active indicator)
 2. Ecosystem (Grid / LayoutGrid icon)
 3. Community (Users icon)
 4. Wallets (Wallet icon)
 5. Profile (User icon)
 
 RULES:
 - Strictly visible ONLY on mobile (< 1024px / lg:hidden)
 - Strictly hidden on desktop viewports
 - Strictly hidden when unauthenticated
*/

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Home, LayoutGrid, Users, Wallet, User } from 'lucide-react';

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
  const isEcosystem = activeRoute === 'trade' || activeRoute === 'convert' || activeRoute === 'farming';
  const isCommunity = activeRoute === 'community' || activeRoute === 'community-share';
  const isWallets = activeRoute === 'wallets' || activeRoute === 'deposit' || activeRoute === 'withdraw';
  const isProfile = activeRoute === 'profile';

  return (
    <nav className="block lg:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pt-1 pointer-events-none select-none font-sans">
      <div className="w-full max-w-md mx-auto rounded-2xl bg-[#080d0a]/95 backdrop-blur-2xl border border-[#18261e] p-1.5 flex items-center justify-around shadow-[0_10px_40px_rgba(0,0,0,0.85)] pointer-events-auto transition-all">
        
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className={`flex flex-col items-center gap-1 px-3 py-1 cursor-pointer transition-all duration-200 group ${
            isHome ? 'text-[#00e699]' : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Home"
        >
          <Home size={18} className={isHome ? 'stroke-[2.5]' : 'stroke-2 group-hover:scale-110 transition-transform'} />
          <span className={`text-[10px] ${isHome ? 'font-black tracking-tight text-[#00e699]' : 'font-medium'}`}>Home</span>
        </button>

        {/* 2. Ecosystem */}
        <button
          type="button"
          onClick={() => handleNav('trade')}
          className={`flex flex-col items-center gap-1 px-3 py-1 cursor-pointer transition-all duration-200 group ${
            isEcosystem ? 'text-[#00e699]' : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Ecosystem"
        >
          <LayoutGrid size={18} className={isEcosystem ? 'stroke-[2.5]' : 'stroke-2 group-hover:scale-110 transition-transform'} />
          <span className={`text-[10px] ${isEcosystem ? 'font-black tracking-tight text-[#00e699]' : 'font-medium'}`}>Ecosystem</span>
        </button>

        {/* 3. Community */}
        <button
          type="button"
          onClick={() => handleNav('community')}
          className={`flex flex-col items-center gap-1 px-3 py-1 cursor-pointer transition-all duration-200 group ${
            isCommunity ? 'text-[#00e699]' : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Community"
        >
          <Users size={18} className={isCommunity ? 'stroke-[2.5]' : 'stroke-2 group-hover:scale-110 transition-transform'} />
          <span className={`text-[10px] ${isCommunity ? 'font-black tracking-tight text-[#00e699]' : 'font-medium'}`}>Community</span>
        </button>

        {/* 4. Wallets */}
        <button
          type="button"
          onClick={() => handleNav('wallets')}
          className={`flex flex-col items-center gap-1 px-3 py-1 cursor-pointer transition-all duration-200 group ${
            isWallets ? 'text-[#00e699]' : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Wallets"
        >
          <Wallet size={18} className={isWallets ? 'stroke-[2.5]' : 'stroke-2 group-hover:scale-110 transition-transform'} />
          <span className={`text-[10px] ${isWallets ? 'font-black tracking-tight text-[#00e699]' : 'font-medium'}`}>Wallets</span>
        </button>

        {/* 5. Profile */}
        <button
          type="button"
          onClick={() => handleNav('profile')}
          className={`flex flex-col items-center gap-1 px-3 py-1 cursor-pointer transition-all duration-200 group ${
            isProfile ? 'text-[#00e699]' : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Profile"
        >
          <User size={18} className={isProfile ? 'stroke-[2.5]' : 'stroke-2 group-hover:scale-110 transition-transform'} />
          <span className={`text-[10px] ${isProfile ? 'font-black tracking-tight text-[#00e699]' : 'font-medium'}`}>Profile</span>
        </button>

      </div>
    </nav>
  );
};

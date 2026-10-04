/*
 FILE: src/components/layout/Sidebar.tsx

 PURPOSE:
 Master Sidebar exactly matching the reference design in file_0000000012b082439e9a2fc938785f05.png:
 - Top: Authentic Money X Green Infinity Logo (∞) + "Money X"
 - Navigation Nodes:
   * Dashboard (Solid Green pill when active)
   * Wallets
   * Staking (with expandable / link indicator >)
   * Farming (with expandable / link indicator >)
   * Rewards (with expandable / link indicator >)
   * Community (with expandable / link indicator >)
   * Jackpot (with expandable / link indicator >)
   * [Divider]
   * Transactions
   * Conversion
   * Profile
   * Support
 - Bottom CTA Card:
   * "Earn Together Grow Bigger"
   * Glowing 3D Emerald Infinity Graphic
   * "Join Community ↗" Green Button
*/

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { MoneyXLogo } from '../common/MoneyXLogo';
import infinitySculptureImg from '../../assets/images/moneyx_infinity_sculpture_1791117317826.jpg';
import {
  ArrowUpRight,
  ChevronRight,
  CreditCard,
  Gift,
  HelpCircle,
  History,
  Home,
  Layers,
  Repeat,
  Sparkles,
  Sprout,
  User,
  Users,
  Wallet,
  X,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activeRoute, setActiveRoute } = useAuth();

  const handleNav = (routeId: string) => {
    setActiveRoute(routeId);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const primaryItems = [
    { id: 'home', label: 'Dashboard', icon: Home, hasArrow: false },
    { id: 'wallets', label: 'Wallets', icon: Wallet, hasArrow: false },
    { id: 'staking', label: 'Staking', icon: Layers, hasArrow: true },
    { id: 'farming', label: 'Farming', icon: Sprout, hasArrow: true },
    { id: 'reward', label: 'Rewards', icon: Gift, hasArrow: true },
    { id: 'community', label: 'Community', icon: Users, hasArrow: true },
    { id: 'jackpot', label: 'Jackpot', icon: Sparkles, hasArrow: true },
  ];

  const secondaryItems = [
    { id: 'transactions', label: 'Transactions', icon: History },
    { id: 'convert', label: 'Conversion', icon: Repeat },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'contact', label: 'Support', icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#050807] border-r border-[#141816] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top: Money X Brand Logo */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          <div className="p-5 flex items-center justify-between border-b border-[#141816] shrink-0">
            <MoneyXLogo size="md" glow />
            {mobileOpen && (
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <div className="p-3.5 space-y-1.5 flex-1">
            {/* Primary Section */}
            {primaryItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeRoute === item.id || (item.id === 'home' && activeRoute === '');
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#00e699] text-black shadow-lg shadow-[#00e699]/30'
                      : 'text-slate-400 hover:text-white hover:bg-[#0c120f]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className={isActive ? 'text-black stroke-[2.5]' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </div>
                  {item.hasArrow && !isActive && (
                    <ChevronRight size={14} className="text-slate-500" />
                  )}
                </button>
              );
            })}

            {/* Divider */}
            <div className="py-2">
              <div className="border-t border-[#141816]" />
            </div>

            {/* Secondary Section */}
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeRoute === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#00e699] text-black shadow-lg shadow-[#00e699]/30'
                      : 'text-slate-400 hover:text-white hover:bg-[#0c120f]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className={isActive ? 'text-black stroke-[2.5]' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom Card: Earn Together Grow Bigger with 3D infinity sculpture */}
          <div className="p-3.5 pt-0 shrink-0">
            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#09120c] to-[#040806] border border-[#18261e] space-y-3 text-left">
              <div>
                <h4 className="text-xs font-extrabold text-white leading-tight">
                  Earn Together <br />
                  Grow Bigger
                </h4>
              </div>

              {/* 3D Infinity Graphic Thumbnail */}
              <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border border-[#1b3124] bg-black">
                <img
                  src={infinitySculptureImg}
                  alt="Money X Infinity Sculpture"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleNav('community')}
                className="w-full py-2 px-3 rounded-xl bg-[#00e699] hover:bg-[#00ffa3] text-black font-extrabold text-xs tracking-tight transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#00e699]/30 cursor-pointer"
              >
                <span>Join Community</span>
                <ArrowUpRight size={14} className="stroke-[2.5]" />
              </button>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};

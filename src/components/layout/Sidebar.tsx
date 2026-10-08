/*
 FILE: src/components/layout/Sidebar.tsx

 PURPOSE:
 Master Sidebar with Desktop Collapsible Arrow Toggle:
 - Top: Authentic Money X Green Infinity Logo (∞) + "Money X"
 - Desktop Collapse Arrow: Next to logo, toggles sidebar width between compact icon-only (w-20) and full width (w-64)
 - Smooth responsive transitions
 - Navigation Nodes: Dashboard, Wallets, Staking, Farming, Rewards, Community, Jackpot, Transactions, Conversion, Profile, Support
 - Bottom CTA Card
*/

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { MoneyXLogo } from '../common/MoneyXLogo';
import infinitySculptureImg from '../../assets/images/moneyx_infinity_sculpture_1791117317826.jpg';
import {
  ArrowUpRight,
  ChevronLeft,
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
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen,
  setMobileOpen,
  collapsed,
  setCollapsed,
}) => {
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
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#050807] border-r border-[#141816] flex flex-col justify-between transition-all duration-300 ease-in-out lg:translate-x-0 ${
          collapsed ? 'lg:w-20' : 'lg:w-64'
        } ${mobileOpen ? 'w-64 translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Top: Money X Brand Logo & Collapse Toggle Arrow */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          <div
            className={`p-4 flex items-center justify-between border-b border-[#141816] shrink-0 gap-2 ${
              collapsed ? 'lg:flex-col lg:gap-3 lg:justify-center' : ''
            }`}
          >
            {!collapsed ? (
              <div className="flex items-center gap-2">
                <MoneyXLogo size="md" glow showText={true} />
              </div>
            ) : (
              <div className="hidden lg:flex items-center justify-center">
                <MoneyXLogo size="sm" glow showText={false} />
              </div>
            )}

            {/* Mobile view fallback logo */}
            {collapsed && (
              <div className="lg:hidden">
                <MoneyXLogo size="md" glow showText={true} />
              </div>
            )}

            {/* Desktop Collapse / Expand Arrow Button (Clicking toggles sidebar width) */}
            <button
              type="button"
              onClick={() => setCollapsed((prev) => !prev)}
              className="hidden lg:flex w-8 h-8 rounded-xl bg-[#0a140e] border border-[#182b1f] hover:border-[#00ffa3] text-slate-300 hover:text-[#00ffa3] hover:bg-[#102417] items-center justify-center transition-all cursor-pointer shrink-0 shadow-md group"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? (
                <ChevronRight size={18} className="stroke-[2.5] text-[#00ffa3] group-hover:translate-x-0.5 transition-transform" />
              ) : (
                <ChevronLeft size={18} className="stroke-[2.5] group-hover:-translate-x-0.5 transition-transform" />
              )}
            </button>

            {/* Mobile Close Button */}
            {mobileOpen && (
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white bg-[#0a140e] border border-[#182b1f]"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <div className={`p-3 space-y-1.5 flex-1 ${collapsed ? 'lg:p-2' : ''}`}>
            {/* Primary Section */}
            {primaryItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeRoute === item.id || (item.id === 'home' && activeRoute === '');
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  title={item.label}
                  className={`w-full flex items-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    collapsed
                      ? 'lg:justify-center lg:p-3 px-3.5 py-2.5 justify-between'
                      : 'justify-between px-3.5 py-2.5'
                  } ${
                    isActive
                      ? 'bg-[#00ffa3] text-black shadow-lg shadow-[#00ffa3]/30'
                      : 'text-slate-400 hover:text-white hover:bg-[#0c120f]'
                  }`}
                >
                  <div className={`flex items-center ${collapsed ? 'lg:gap-0 gap-3' : 'gap-3'}`}>
                    <Icon size={18} className={isActive ? 'text-black stroke-[2.5]' : 'text-slate-400'} />
                    <span className={collapsed ? 'lg:hidden' : 'inline'}>{item.label}</span>
                  </div>
                  {item.hasArrow && !isActive && (
                    <ChevronRight size={14} className={`text-slate-500 ${collapsed ? 'lg:hidden' : 'inline'}`} />
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
                  title={item.label}
                  className={`w-full flex items-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    collapsed
                      ? 'lg:justify-center lg:p-3 px-3.5 py-2.5 justify-between'
                      : 'justify-between px-3.5 py-2.5'
                  } ${
                    isActive
                      ? 'bg-[#00ffa3] text-black shadow-lg shadow-[#00ffa3]/30'
                      : 'text-slate-400 hover:text-white hover:bg-[#0c120f]'
                  }`}
                >
                  <div className={`flex items-center ${collapsed ? 'lg:gap-0 gap-3' : 'gap-3'}`}>
                    <Icon size={18} className={isActive ? 'text-black stroke-[2.5]' : 'text-slate-400'} />
                    <span className={collapsed ? 'lg:hidden' : 'inline'}>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom Card: Earn Together Grow Bigger */}
          <div className="p-3 pt-0 shrink-0">
            {!collapsed ? (
              <div className="p-4 rounded-2xl bg-gradient-to-b from-[#09120c] to-[#040806] border border-[#18261e] space-y-3 text-left">
                <div>
                  <h4 className="text-xs font-extrabold text-white leading-tight">
                    Earn Together <br />
                    Grow Bigger
                  </h4>
                </div>

                <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border border-[#1b3124] bg-black">
                  <img
                    src={infinitySculptureImg}
                    alt="Money X Infinity Sculpture"
                    className="w-full h-full object-cover"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleNav('community')}
                  className="w-full py-2 px-3 rounded-xl bg-[#00ffa3] hover:bg-[#72ff36] text-black font-extrabold text-xs tracking-tight transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#00ffa3]/30 cursor-pointer"
                >
                  <span>Join Community</span>
                  <ArrowUpRight size={14} className="stroke-[2.5]" />
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => handleNav('community')}
                  className="w-10 h-10 rounded-xl bg-[#00ffa3] text-black flex items-center justify-center shadow-lg shadow-[#00ffa3]/30 hover:scale-105 transition-transform cursor-pointer"
                  title="Join Community"
                >
                  <ArrowUpRight size={18} className="stroke-[2.5]" />
                </button>
              </div>
            )}
          </div>

        </div>
      </aside>
    </>
  );
};

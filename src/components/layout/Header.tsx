/*
 FILE: src/components/layout/Header.tsx

 PURPOSE:
 Exact 1:1 reproduction of the Top Bar from xahmoney.com (Screenshots 1 & 3).
 On Mobile: Shows ribbon logo + "XAH CHAIN" with notification bell, dark mode moon, and avatar.
 On Desktop: Clean and transparent, allowing the hero identity bar to shine.
*/

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Moon, Menu } from 'lucide-react';

interface HeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { user, setActiveRoute } = useAuth();

  return (
    <header className="lg:hidden sticky top-0 z-40 w-full bg-[#141622] border-b border-[#1e2334] px-4 py-3 flex items-center justify-between">
      {/* Left: Mobile Toggle & Brand "XAH CHAIN" matching Screenshots 3, 4, 5 */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 text-slate-300 hover:text-white cursor-pointer"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        {/* HX Logo */}
        <div className="relative w-7 h-6 flex items-center justify-center">
          <svg className="w-7 h-6" viewBox="0 0 64 54" fill="none">
            <defs>
              <linearGradient id="hdrRibbonGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff2a6d" />
                <stop offset="48%" stopColor="#9d4edd" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
            <path
              d="M 22 13 C 14 13, 10 20, 10 27 C 10 34, 14 41, 22 41 C 28 41, 32 36, 32 27 C 32 18, 36 13, 42 13 C 50 13, 54 20, 54 27 C 54 34, 50 41, 42 41 C 36 41, 32 36, 32 27"
              stroke="url(#hdrRibbonGrad)"
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 12 27 L 32 27 L 52 27"
              stroke="url(#hdrRibbonGrad)"
              strokeWidth="5.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <span className="font-extrabold text-sm tracking-wider text-white">
          XAH CHAIN
        </span>
      </div>

      {/* Right: Bell, Moon, Avatar matching Screenshots 3, 4, 5 */}
      <div className="flex items-center gap-3">
        <button className="text-slate-400 hover:text-white p-1 cursor-pointer">
          <Bell size={18} />
        </button>
        <button className="text-slate-400 hover:text-white p-1 cursor-pointer">
          <Moon size={18} />
        </button>
        <button
          onClick={() => setActiveRoute('profile')}
          className="w-7 h-7 rounded-full bg-[#1e88e5] flex items-center justify-center text-xs text-white shadow-inner cursor-pointer"
        >
          <span>👦</span>
        </button>
      </div>
    </header>
  );
};

/*
 FILE: src/components/common/ThemeToggle.tsx

 PURPOSE:
 Sleek Olymp Trade inspired Dark/Light theme toggle switch.
 Displays Sun/Moon icon with smooth micro-interaction and clear tooltip.
*/

import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer select-none ${
        isDark
          ? 'bg-[#151c28] hover:bg-[#1c2638] text-emerald-400 border border-[#232f45] shadow-sm shadow-emerald-950/20'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 shadow-sm'
      } ${className}`}
      title={isDark ? 'Switch to White / Light Mode' : 'Switch to Olymp Trade Dark Mode'}
      aria-label="Toggle Dark and Light Mode"
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun size={15} className="text-amber-400 animate-fadeIn" />
        ) : (
          <Moon size={15} className="text-indigo-600 animate-fadeIn" />
        )}
      </div>
      {showLabel && (
        <span className="text-[11px] font-bold tracking-tight">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
};

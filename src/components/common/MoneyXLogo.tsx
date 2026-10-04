/*
 FILE: src/components/common/MoneyXLogo.tsx

 PURPOSE:
 Authoritative, Pixel-Perfect Money X Brand Emblem & Typography:
 - Glowing emerald green infinity icon (∞) with smooth metallic curved ribbon geometry
 - High-craft "Money X" typography in crisp contrast
 - Configurable size, glowing halo effect, and optional subtitle/text
*/

import React from 'react';

interface MoneyXLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  glow?: boolean;
}

export const MoneyXLogo: React.FC<MoneyXLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  glow = false,
}) => {
  const iconDimensions = {
    sm: { width: 28, height: 18, stroke: 3.5, text: 'text-sm' },
    md: { width: 38, height: 24, stroke: 4.2, text: 'text-lg' },
    lg: { width: 50, height: 32, stroke: 4.8, text: 'text-2xl' },
    xl: { width: 72, height: 46, stroke: 5.5, text: 'text-3xl' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Infinity Icon */}
      <div className={`relative flex items-center justify-center shrink-0 ${glow ? 'drop-shadow-[0_0_16px_rgba(0,230,153,0.5)]' : ''}`}>
        <svg
          width={iconDimensions.width}
          height={iconDimensions.height}
          viewBox="0 0 48 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="moneyXGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ffa3" />
              <stop offset="50%" stopColor="#00e699" />
              <stop offset="100%" stopColor="#00b875" />
            </linearGradient>
          </defs>
          <path
            d="M14 6 C7 6 4 10 4 15 C4 20 7 24 14 24 C19 24 22 20 24 15 C26 10 29 6 34 6 C41 6 44 10 44 15 C44 20 41 24 34 24 C29 24 26 20 24 15 C22 10 19 6 14 6 Z"
            stroke="url(#moneyXGrad)"
            strokeWidth={iconDimensions.stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Typography */}
      {showText && (
        <span className={`font-black tracking-tight text-white font-sans ${iconDimensions.text}`}>
          Money <span className="text-white">X</span>
        </span>
      )}
    </div>
  );
};

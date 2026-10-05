/*
 FILE: src/components/common/MoneyXLogo.tsx

 PURPOSE:
 Authoritative, Pixel-Perfect Money X Brand Emblem & Typography:
 - Glowing emerald green infinity icon (∞) with smooth metallic curved ribbon geometry
 - True mathematical lemniscate curve with atmospheric neon gradient
 - High-craft "Money X" typography with glowing accent
 - Configurable size, layout (horizontal / vertical), glowing halo effect, and optional subtitle/text
*/

import React, { useId } from 'react';

interface MoneyXLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  layout?: 'horizontal' | 'vertical';
  className?: string;
  glow?: boolean;
  showSubtitle?: boolean;
  subtitleText?: string;
}

export const MoneyXLogo: React.FC<MoneyXLogoProps> = ({
  size = 'md',
  showText = true,
  layout = 'horizontal',
  className = '',
  glow = false,
  showSubtitle = false,
  subtitleText = 'DECENTRALIZED REWARDS ECOSYSTEM',
}) => {
  const uniqueId = useId().replace(/:/g, '');
  const gradId = `moneyXGrad_${uniqueId}`;
  const glowFilterId = `moneyXGlow_${uniqueId}`;

  const iconDimensions = {
    sm: { width: 32, height: 18, stroke: 3.2, text: 'text-base', gap: 'gap-2' },
    md: { width: 44, height: 25, stroke: 4.2, text: 'text-xl', gap: 'gap-2.5' },
    lg: { width: 58, height: 33, stroke: 5.0, text: 'text-2xl', gap: 'gap-3' },
    xl: { width: 78, height: 44, stroke: 6.0, text: 'text-3xl', gap: 'gap-3.5' },
  }[size];

  // Mathematical smooth lemniscate infinity path
  // Center crossover at (32, 18), left lobe center (17, 18), right lobe center (47, 18)
  const infinityPath =
    'M 32 18 ' +
    'C 26 27, 20 29, 15 29 ' +
    'C 7 29, 3 24, 3 18 ' +
    'C 3 12, 7 7, 15 7 ' +
    'C 20 7, 26 9, 32 18 ' +
    'C 38 27, 44 29, 49 29 ' +
    'C 57 29, 61 24, 61 18 ' +
    'C 61 12, 57 7, 49 7 ' +
    'C 44 7, 38 9, 32 18 Z';

  return (
    <div
      className={`inline-flex items-center select-none ${
        layout === 'vertical' ? 'flex-col justify-center text-center' : 'flex-row'
      } ${iconDimensions.gap} ${className}`}
    >
      {/* Infinity Icon Emblem */}
      <div
        className={`relative flex items-center justify-center shrink-0 ${
          glow ? 'drop-shadow-[0_0_20px_rgba(0,255,163,0.7)]' : ''
        }`}
      >
        <svg
          width={iconDimensions.width}
          height={iconDimensions.height}
          viewBox="0 0 64 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ffa3" />
              <stop offset="50%" stopColor="#00e699" />
              <stop offset="100%" stopColor="#00b875" />
            </linearGradient>
            {glow && (
              <filter id={glowFilterId} x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            )}
          </defs>

          {/* Background Ambient Glow Stroke */}
          {glow && (
            <path
              d={infinityPath}
              stroke="#00ffa3"
              strokeWidth={iconDimensions.stroke * 1.6}
              strokeOpacity="0.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Crisp Primary Ribbon */}
          <path
            d={infinityPath}
            stroke={`url(#${gradId})`}
            strokeWidth={iconDimensions.stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={glow ? `url(#${glowFilterId})` : undefined}
          />
        </svg>
      </div>

      {/* Brand Typography matching image.png */}
      {showText && (
        <div className={`flex flex-col ${layout === 'vertical' ? 'items-center' : 'items-start'}`}>
          <span
            className={`font-black tracking-tight text-white font-sans ${iconDimensions.text} leading-none`}
          >
            Money <span className="text-[#00ffa3] drop-shadow-[0_0_12px_rgba(0,255,163,0.6)]">X</span>
          </span>
          {showSubtitle && (
            <span className="text-[9px] sm:text-[10px] tracking-[0.22em] text-[#00ffa3]/90 font-bold uppercase mt-1.5 leading-tight font-mono">
              {subtitleText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

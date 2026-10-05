/*
 FILE: src/components/common/GlowingLockGraphic.tsx

 PURPOSE:
 Pixel-Perfect 3D Glowing Padlock Graphic matching image.png (Right Screen):
 - Futuristic glowing emerald-glass padlock with metallic shackle
 - Center Money X glowing infinity loop (∞) emblem on lock body
 - Multi-tier glowing orbital pedestals / rings underneath
 - Floating ambient green security shield with neon outline
 - Tonal states: 'idle' (emerald glow), 'success' (bright neon checkmark), 'error' (crimson alert)
*/

import React from 'react';

interface GlowingLockGraphicProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  state?: 'idle' | 'success' | 'error';
}

export const GlowingLockGraphic: React.FC<GlowingLockGraphicProps> = ({
  className = '',
  size = 'md',
  state = 'idle',
}) => {
  const dimensions = {
    sm: { width: 110, height: 110 },
    md: { width: 160, height: 160 },
    lg: { width: 210, height: 210 },
  }[size];

  const isError = state === 'error';
  const isSuccess = state === 'success';

  const primaryColor = isError ? '#ff3b5c' : isSuccess ? '#00ffa3' : '#00ffa3';
  const secondaryColor = isError ? '#dc2626' : isSuccess ? '#00e699' : '#00e699';
  const darkGlass = isError ? '#2a0a10' : '#051b11';

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 220 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          {/* Radial pedestal ambient glow */}
          <radialGradient id="pedestalGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0.45" />
            <stop offset="60%" stopColor={secondaryColor} stopOpacity="0.15" />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
          </radialGradient>

          {/* Shackle metallic gradient */}
          <linearGradient id="shackleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d1fae5" />
            <stop offset="40%" stopColor={primaryColor} />
            <stop offset="85%" stopColor={secondaryColor} />
            <stop offset="100%" stopColor="#022c17" />
          </linearGradient>

          {/* Padlock body glass gradient */}
          <linearGradient id="bodyGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0b3823" stopOpacity="0.9" />
            <stop offset="50%" stopColor={darkGlass} stopOpacity="0.95" />
            <stop offset="100%" stopColor="#020e07" stopOpacity="0.98" />
          </linearGradient>

          {/* Neon border gradient */}
          <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="30%" stopColor={primaryColor} />
            <stop offset="80%" stopColor={secondaryColor} />
            <stop offset="100%" stopColor="#004d2c" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="lockGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Pedestal Glow */}
        <ellipse cx="110" cy="180" rx="90" ry="26" fill="url(#pedestalGlow)" />

        {/* Concentric Neon Pedestal Rings matching image.png */}
        <ellipse
          cx="110"
          cy="180"
          rx="78"
          ry="20"
          stroke={primaryColor}
          strokeWidth="1.6"
          strokeOpacity="0.6"
          fill="none"
        />
        <ellipse
          cx="110"
          cy="180"
          rx="56"
          ry="14"
          stroke={primaryColor}
          strokeWidth="2.2"
          strokeOpacity="0.85"
          filter="url(#lockGlow)"
          fill="none"
        />
        <ellipse
          cx="110"
          cy="180"
          rx="36"
          ry="9"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeOpacity="0.75"
          fill="none"
        />

        {/* Floating Shield on Left Side matching image.png */}
        <g transform="translate(18, 105) scale(0.65)" opacity="0.85">
          <path
            d="M24 4 L44 14 V28 C44 42 24 54 24 54 C24 54 4 42 4 28 V14 Z"
            fill="#062215"
            stroke={primaryColor}
            strokeWidth="2"
            filter="url(#lockGlow)"
          />
          <path
            d="M24 12 L36 19 V28 C36 36 24 44 24 44 C24 44 12 36 12 28 V19 Z"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1"
            strokeOpacity="0.6"
          />
        </g>

        {/* Floating Shield on Right Side */}
        <g transform="translate(162, 95) scale(0.55)" opacity="0.7">
          <path
            d="M24 4 L44 14 V28 C44 42 24 54 24 54 C24 54 4 42 4 28 V14 Z"
            fill="#062215"
            stroke={primaryColor}
            strokeWidth="2"
            filter="url(#lockGlow)"
          />
        </g>

        {/* 3D Curved Padlock Shackle */}
        <g filter="url(#lockGlow)">
          {/* Shackle rear drop */}
          <path
            d="M74 100 V64 C74 44 90 28 110 28 C130 28 146 44 146 64 V100"
            stroke="url(#shackleGrad)"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
          />
          {/* Shackle specular highlight reflection */}
          <path
            d="M80 94 V64 C80 47 93 34 110 34 C127 34 140 47 140 64 V94"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeOpacity="0.7"
            fill="none"
          />
        </g>

        {/* 3D Padlock Body (Rounded Rectangular Glass Block) */}
        <g filter="url(#lockGlow)">
          {/* Main Body */}
          <rect
            x="58"
            y="90"
            width="104"
            height="86"
            rx="20"
            fill="url(#bodyGlassGrad)"
            stroke="url(#borderGrad)"
            strokeWidth="2.5"
          />

          {/* Inner Chamfer Bevel Highlight */}
          <rect
            x="64"
            y="96"
            width="92"
            height="74"
            rx="15"
            fill="none"
            stroke={primaryColor}
            strokeWidth="1"
            strokeOpacity="0.3"
          />

          {/* Center Money X Infinity Loop Emblem (∞) matching image.png */}
          <path
            d="M 110 133 C 104 140, 99 142, 94 142 C 86 142, 82 138, 82 133 C 82 128, 86 124, 94 124 C 99 124, 104 126, 110 133 C 116 140, 121 142, 126 142 C 134 142, 138 138, 138 133 C 138 128, 134 124, 126 124 C 121 124, 116 126, 110 133 Z"
            stroke={primaryColor}
            strokeWidth="4.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Infinity Center Specular Core */}
          <path
            d="M 110 133 C 104 140, 99 142, 94 142 C 86 142, 82 138, 82 133 C 82 128, 86 124, 94 124 C 99 124, 104 126, 110 133 C 116 140, 121 142, 126 142 C 134 142, 138 138, 138 133 C 138 128, 134 124, 126 124 C 121 124, 116 126, 110 133 Z"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.8"
            fill="none"
          />

          {/* Top Edge Glass Reflection Highlight */}
          <path
            d="M 72 96 H 148"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity="0.6"
          />
        </g>
      </svg>
    </div>
  );
};

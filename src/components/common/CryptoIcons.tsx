/*
 FILE: src/components/common/CryptoIcons.tsx

 PURPOSE:
 Bespoke, High-Fidelity Vector SVGs for Wallets, Actions, Crypto Assets, and QR Codes:
 - Wallet Badges: Funding (Emerald), Main (Purple), Reward (Amber)
 - 8 Action Badges matching screenshot: Deposit, Withdraw, Transfer, Stake, Farm, Buy Ticket, Redeem, Convert
 - Crypto Tokens: USDT, ETH, BTC, BNB
 - Vector QR Code with corner anchors and central branding node
*/

import React from 'react';

// 1. Funding Wallet Icon (Emerald gradient rounded box with lock/shield)
export const FundingWalletSvg: React.FC<{ size?: number; className?: string }> = ({ size = 44, className = '' }) => (
  <div
    style={{ width: size, height: size }}
    className={`rounded-2xl bg-gradient-to-br from-[#00ffa3] to-[#00b875] p-2.5 flex items-center justify-center text-black shadow-lg shadow-[#00e699]/30 shrink-0 ${className}`}
  >
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" stroke="#000000" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      <circle cx="12" cy="16.5" r="1.5" fill="#000000" />
    </svg>
  </div>
);

// 2. Main Wallet Icon (Vibrant purple gradient rounded box with wallet fold)
export const MainWalletSvg: React.FC<{ size?: number; className?: string }> = ({ size = 44, className = '' }) => (
  <div
    style={{ width: size, height: size }}
    className={`rounded-2xl bg-gradient-to-br from-[#a855f7] to-[#7c3aed] p-2.5 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 shrink-0 ${className}`}
  >
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
      <circle cx="16" cy="14" r="1" fill="#ffffff" />
    </svg>
  </div>
);

// 3. Reward Wallet Icon (Golden amber gradient rounded box with gift box)
export const RewardWalletSvg: React.FC<{ size?: number; className?: string }> = ({ size = 44, className = '' }) => (
  <div
    style={{ width: size, height: size }}
    className={`rounded-2xl bg-gradient-to-br from-[#fbbf24] to-[#d97706] p-2.5 flex items-center justify-center text-black shadow-lg shadow-amber-500/30 shrink-0 ${className}`}
  >
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" stroke="#000000" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 4.8 0 0 1 12 8a4.8 4.8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </svg>
  </div>
);

// 4. Action Circle SVGs (8 Colorful Circular Buttons matching the design screenshot)
export const ActionButtonDepositSvg: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <div
    style={{ width: size, height: size }}
    className="rounded-full bg-gradient-to-br from-[#00ffa3] to-[#00b875] flex items-center justify-center text-black shadow-lg shadow-[#00e699]/35 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
  >
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v13" />
      <path d="m6 11 6 6 6-6" />
      <path d="M4 20h16" />
    </svg>
  </div>
);

export const ActionButtonWithdrawSvg: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <div
    style={{ width: size, height: size }}
    className="rounded-full bg-gradient-to-br from-[#ff5e7e] to-[#ff2a55] flex items-center justify-center text-white shadow-lg shadow-rose-500/35 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
  >
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20V7" />
      <path d="m18 13-6-6-6 6" />
      <path d="M4 4h16" />
    </svg>
  </div>
);

export const ActionButtonTransferSvg: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <div
    style={{ width: size, height: size }}
    className="rounded-full bg-gradient-to-br from-[#38bdf8] to-[#0284c7] flex items-center justify-center text-white shadow-lg shadow-sky-500/35 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
  >
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  </div>
);

export const ActionButtonStakeSvg: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <div
    style={{ width: size, height: size }}
    className="rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center text-white shadow-lg shadow-emerald-500/35 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
  >
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
      <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6" />
    </svg>
  </div>
);

export const ActionButtonFarmSvg: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <div
    style={{ width: size, height: size }}
    className="rounded-full bg-gradient-to-br from-[#00d2d3] to-[#00a8a8] flex items-center justify-center text-white shadow-lg shadow-cyan-500/35 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
  >
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 20h10" />
      <path d="M10 20c0-4 1-6 2-10" />
      <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7 1.5-.4 3-1.3 3.7-2.6 1.2-2.3.2-4.5-.5-5.5-.9.4-2.8 1.8-3.5 3.5-.2.3-.4.6-.5.9" />
      <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.1-1.4 1.2-1.2 1.4-2.8 1.1-3.6-.8-.1-2.4.2-4.1 1" />
    </svg>
  </div>
);

export const ActionButtonBuyTicketSvg: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <div
    style={{ width: size, height: size }}
    className="rounded-full bg-gradient-to-br from-[#c084fc] to-[#9333ea] flex items-center justify-center text-white shadow-lg shadow-purple-500/35 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
  >
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  </div>
);

export const ActionButtonRedeemSvg: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <div
    style={{ width: size, height: size }}
    className="rounded-full bg-gradient-to-br from-[#fb923c] to-[#ea580c] flex items-center justify-center text-white shadow-lg shadow-orange-500/35 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
  >
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  </div>
);

export const ActionButtonConvertSvg: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <div
    style={{ width: size, height: size }}
    className="rounded-full bg-gradient-to-br from-[#60a5fa] to-[#2563eb] flex items-center justify-center text-white shadow-lg shadow-blue-500/35 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
  >
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 3 4 4-4 4" />
      <path d="M20 7H4" />
      <path d="m8 21-4-4 4-4" />
      <path d="M4 17h16" />
    </svg>
  </div>
);

// 5. High-Resolution Beautiful Vector QR Code
export const VectorQrCodeSvg: React.FC<{ size?: number; className?: string }> = ({ size = 160, className = '' }) => (
  <div
    style={{ width: size, height: size }}
    className={`p-3 bg-white rounded-2xl flex items-center justify-center shadow-xl relative select-none ${className}`}
  >
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
      {/* Top Left Marker */}
      <rect x="8" y="8" width="32" height="32" rx="6" fill="#000000" />
      <rect x="14" y="14" width="20" height="20" rx="3" fill="#ffffff" />
      <rect x="20" y="20" width="8" height="8" rx="2" fill="#000000" />

      {/* Top Right Marker */}
      <rect x="80" y="8" width="32" height="32" rx="6" fill="#000000" />
      <rect x="86" y="14" width="20" height="20" rx="3" fill="#ffffff" />
      <rect x="92" y="20" width="8" height="8" rx="2" fill="#000000" />

      {/* Bottom Left Marker */}
      <rect x="8" y="80" width="32" height="32" rx="6" fill="#000000" />
      <rect x="14" y="86" width="20" height="20" rx="3" fill="#ffffff" />
      <rect x="20" y="92" width="8" height="8" rx="2" fill="#000000" />

      {/* QR Data Pattern Matrix */}
      <rect x="46" y="10" width="6" height="6" rx="1.5" fill="#000000" />
      <rect x="58" y="10" width="6" height="6" rx="1.5" fill="#000000" />
      <rect x="68" y="10" width="6" height="6" rx="1.5" fill="#000000" />

      <rect x="46" y="22" width="6" height="6" rx="1.5" fill="#000000" />
      <rect x="58" y="22" width="6" height="6" rx="1.5" fill="#000000" />
      <rect x="68" y="22" width="6" height="6" rx="1.5" fill="#000000" />

      <rect x="46" y="34" width="6" height="6" rx="1.5" fill="#000000" />
      <rect x="58" y="34" width="6" height="6" rx="1.5" fill="#000000" />

      <rect x="10" y="46" width="6" height="6" rx="1.5" fill="#000000" />
      <rect x="22" y="46" width="6" height="6" rx="1.5" fill="#000000" />
      <rect x="34" y="46" width="6" height="6" rx="1.5" fill="#000000" />
      <rect x="82" y="46" width="6" height="6" rx="1.5" fill="#000000" />
      <rect x="94" y="46" width="6" height="6" rx="1.5" fill="#000000" />
      <rect x="104" y="46" width="6" height="6" rx="1.5" fill="#000000" />

      <rect x="10" y="58" width="6" height="6" rx="1.5" fill="#000000" />
      <rect x="22" y="58" width="6" height="6" rx="1.5" fill="#000000" />
      <rect x="34" y="58" width="6" height="6" rx="1.5" fill="#000000" />
      <rect x="74" y="58" width="6" height="6" rx="1.5" fill="#000000" />
      <rect x="86" y="58" width="6" height="6" rx="1.5" fill="#000000" />
      <rect x="98" y="58" width="6" height="6" rx="1.5" fill="#000000" />

      <rect x="10" y="68" width="6" height="6" rx="1.5" fill="#000000" />
      <rect x="22" y="68" width="6" height="6" rx="1.5" fill="#000000" />
      <rect x="82" y="68" width="6" height="6" rx="1.5" fill="#000000" />
      <rect x="104" y="68" width="6" height="6" rx="1.5" fill="#000000" />

      <rect x="46" y="82" width="6" height="6" rx="1.5" fill="#000000" />
      <rect x="58" y="82" width="6" height="6" rx="1.5" fill="#000000" />
      <rect x="68" y="82" width="6" height="6" rx="1.5" fill="#000000" />
      <rect x="82" y="82" width="6" height="6" rx="1.5" fill="#000000" />
      <rect x="94" y="82" width="6" height="6" rx="1.5" fill="#000000" />

      <rect x="46" y="94" width="6" height="6" rx="1.5" fill="#000000" />
      <rect x="58" y="94" width="6" height="6" rx="1.5" fill="#000000" />
      <rect x="82" y="94" width="6" height="6" rx="1.5" fill="#000000" />
      <rect x="104" y="94" width="6" height="6" rx="1.5" fill="#000000" />

      <rect x="46" y="104" width="6" height="6" rx="1.5" fill="#000000" />
      <rect x="68" y="104" width="6" height="6" rx="1.5" fill="#000000" />
      <rect x="94" y="104" width="6" height="6" rx="1.5" fill="#000000" />

      {/* Center Brand Infinity Badge in QR code */}
      <circle cx="60" cy="60" r="14" fill="#000000" />
      <circle cx="60" cy="60" r="12" fill="#08080a" />
      <path
        d="M56 57 C53 57 51 58 51 60 C51 62 53 63 56 63 C58 63 59 62 60 60 C61 58 62 57 64 57 C67 57 69 58 69 60 C69 62 67 63 64 63 C62 63 61 62 60 60 C59 58 58 57 56 57 Z"
        stroke="#00e699"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

// 6. Token SVGs (USDT, ETH, BTC, BNB)
export const TokenUsdtSvg: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="16" fill="#26A17B" />
    <path
      d="M17.8 17.2v6.6h-3.6v-6.6c-4.4-.2-7.8-1.1-7.8-2.2 0-1.1 3.4-2 7.8-2.2v-3.7h3.6v3.7c4.4.2 7.8 1.1 7.8 2.2 0 1.1-3.4 2-7.8 2.2zm0-3.6c-3.6 0-6.6.6-6.6 1.4s3 1.4 6.6 1.4 6.6-.6 6.6-1.4-3-1.4-6.6-1.4z"
      fill="#ffffff"
    />
  </svg>
);

export const TokenEthSvg: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="16" fill="#627EEA" />
    <path d="M16 4l-6.8 11.3L16 19.3l6.8-4z" fill="#ffffff" fillOpacity="0.8" />
    <path d="M16 4v15.3l6.8-4z" fill="#ffffff" />
    <path d="M16 20.6l-6.8-3.9L16 28l6.8-11.3z" fill="#ffffff" fillOpacity="0.8" />
    <path d="M16 28v-7.4l6.8-3.9z" fill="#ffffff" />
  </svg>
);

export const TokenBtcSvg: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="16" fill="#F7931A" />
    <path
      d="M22.5 13.7c.3-2.1-1.3-3.2-3.5-4l.7-2.9-1.8-.4-.7 2.8c-.5-.1-1-.2-1.5-.3l.7-2.8-1.8-.4-.7 2.9c-.4-.1-.8-.2-1.2-.3l-2.5-.6-.5 1.9s1.3.3 1.3.3c.7.2.8.7.8 1.2l-.8 3.3c.1 0 .1 0 .2.1-.1 0-.2 0-.2-.1l-1.2 4.7c-.1.3-.4.7-1 .5 0 0-1.3-.3-1.3-.3l-.9 2.1 2.3.6c.4.1.9.2 1.3.3l-.7 3 1.8.4.7-2.9c.5.1 1 .2 1.5.3l-.7 2.9 1.8.4.7-2.9c3.1.6 5.4.3 6.4-2.4.8-2.2 0-3.5-1.6-4.3 1.1-.3 2-1 2.2-2.5zm-3.9 5.3c-.6 2.3-4.4 1-5.6.8l1-4c1.2.3 5.2.9 4.6 3.2zm.6-5.4c-.5 2.1-3.7 1-4.7.8l.9-3.7c1 .3 4.3.7 3.8 2.9z"
      fill="#ffffff"
    />
  </svg>
);

export const TokenBnbSvg: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="16" fill="#F0B90B" />
    <path
      d="M16 6.5l3.2 3.2-3.2 3.2-3.2-3.2L16 6.5zm-5.7 5.7l3.2 3.2-3.2 3.2-3.2-3.2 3.2-3.2zm11.4 0l3.2 3.2-3.2 3.2-3.2-3.2 3.2-3.2zM16 17.9l3.2 3.2-3.2 3.2-3.2-3.2 3.2-3.2z"
      fill="#ffffff"
    />
  </svg>
);

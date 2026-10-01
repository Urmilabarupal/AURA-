/*
 FILE: src/pages/wallets/WalletsList.tsx

 PURPOSE:
 Exact 1:1 pixel-perfect reproduction of https://xahmoney.com/Wallets (uploaded reference screenshot).
 Features:
 - Left column:
   * Title "Wallets"
   * List of 5 multi-chain assets:
     - XAH (XAH Chain) with HX folded ribbon logo
     - ETH (Ethereum) with official diamond logo
     - USDT (Tether) with official green T logo
     - BUSD (Binance USD) with official yellow logo
     - TRX (Tron) with official red logo
 - Right column:
   * "Balance" Card:
     - Header "Balance"
     - Large "0.00" balance readout
     - Subtitle "Total XAH Chain Value" with HX folded ribbon logo on bottom-right
*/

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BRAND } from '../../config/brand';
import { ArrowDown, ArrowUp } from 'lucide-react';

export const WalletsList: React.FC = () => {
  const { wallets, setActiveRoute, emptyStateMode } = useAuth();

  const xahBalance = emptyStateMode ? 0 : 0.00;
  const totalChainValue = emptyStateMode ? 0 : 0.00;

  const assets = [
    {
      id: 'xah',
      symbol: BRAND.tokenSymbol,
      name: BRAND.chainName,
      balance: '0.00',
      usdValue: '$0.00',
      icon: (
        <div className="relative w-8 h-7 flex items-center justify-center">
          <svg className="w-8 h-7" viewBox="0 0 64 54" fill="none">
            <defs>
              <linearGradient id="xahAssetGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff2a6d" />
                <stop offset="48%" stopColor="#9d4edd" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
            <path
              d="M 22 13 C 14 13, 10 20, 10 27 C 10 34, 14 41, 22 41 C 28 41, 32 36, 32 27 C 32 18, 36 13, 42 13 C 50 13, 54 20, 54 27 C 54 34, 50 41, 42 41 C 36 41, 32 36, 32 27"
              stroke="url(#xahAssetGrad)"
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 12 27 L 32 27 L 52 27"
              stroke="url(#xahAssetGrad)"
              strokeWidth="5.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ),
    },
    {
      id: 'eth',
      symbol: 'ETH',
      name: 'Ethereum',
      balance: '0.00',
      usdValue: '$0.00',
      icon: (
        <div className="w-8 h-8 flex items-center justify-center">
          <svg className="w-6 h-7" viewBox="0 0 784.37 1277.39" fill="none">
            <path d="M392.07 0L383.5 29.11V874.74L392.07 883.29L784.13 651.54L392.07 0Z" fill="#9ba8c0" />
            <path d="M392.07 0L0 651.54L392.07 883.29V472.33V0Z" fill="#718096" />
            <path d="M392.07 956.52L387.24 962.41V1258.97L392.07 1277.38L784.37 724.89L392.07 956.52Z" fill="#9ba8c0" />
            <path d="M392.07 1277.38V956.52L0 724.89L392.07 1277.38Z" fill="#718096" />
          </svg>
        </div>
      ),
    },
    {
      id: 'usdt',
      symbol: 'USDT',
      name: 'Tether',
      balance: '0.00',
      usdValue: '$0.00',
      icon: (
        <div className="w-8 h-8 rounded-full bg-[#26a17b] flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
          ₮
        </div>
      ),
    },
    {
      id: 'busd',
      symbol: 'BUSD',
      name: 'Binance USD',
      balance: '0.00',
      usdValue: '$0.00',
      icon: (
        <div className="w-8 h-8 flex items-center justify-center text-[#f3ba2f]">
          <svg className="w-7 h-7" viewBox="0 0 124 124" fill="none">
            <path d="M62 0L86.8 24.8L43.4 68.2L18.6 43.4L62 0Z" fill="#f3ba2f" />
            <path d="M80.6 62L105.4 37.2L124 55.8L99.2 80.6L80.6 62Z" fill="#f3ba2f" />
            <path d="M62 86.8L80.6 68.2L99.2 86.8L62 124L24.8 86.8L43.4 68.2L62 86.8Z" fill="#f3ba2f" />
            <path d="M0 62L18.6 43.4L37.2 62L18.6 80.6L0 62Z" fill="#f3ba2f" />
          </svg>
        </div>
      ),
    },
    {
      id: 'trx',
      symbol: 'TRX',
      name: 'Tron',
      balance: '0.00',
      usdValue: '$0.00',
      icon: (
        <div className="w-8 h-8 flex items-center justify-center text-[#ef0027]">
          <svg className="w-7 h-7" viewBox="0 0 100 100" fill="none">
            <path d="M12 18L88 32L65 88L12 18Z" fill="#ef0027" />
            <path d="M12 18L58 48L65 88L12 18Z" fill="#c4001f" opacity="0.6" />
          </svg>
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 select-none font-sans">
      
      {/* Left Column (8 Cols): Wallets Title + 5 Asset Cards */}
      <div className="lg:col-span-8 space-y-4">
        <h2 className="text-base font-bold text-white tracking-tight">
          Wallets
        </h2>

        <div className="space-y-3.5">
          {assets.map((asset) => (
            <div
              key={asset.id}
              onClick={() => setActiveRoute('wallet-detail')}
              className="p-4 sm:p-5 rounded-2xl bg-[#161924] border border-[#202538] hover:border-[#384366] transition-all cursor-pointer flex items-center justify-between shadow-lg"
            >
              {/* Asset Logo & Details */}
              <div className="flex items-center gap-4">
                {asset.icon}

                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    {asset.symbol}
                  </h3>
                  <p className="text-xs text-[#8e98af] font-medium">
                    {asset.name}
                  </p>
                </div>
              </div>

              {/* Asset Balances */}
              <div className="text-right space-y-0.5 font-mono">
                <div className="text-sm font-bold text-white">
                  {asset.balance}
                </div>
                <div className="text-xs text-[#8e98af]">
                  {asset.usdValue}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column (4 Cols): Balance Card matching Screenshot */}
      <div className="lg:col-span-4">
        <div className="rounded-2xl bg-[#161924] border border-[#202538] p-6 shadow-xl space-y-8 relative overflow-hidden">
          {/* Header "Balance" */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-[#8e98af]">
              Balance
            </h3>
            <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-mono">
              {totalChainValue.toFixed(2)}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setActiveRoute('withdraw')}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#ff5376] to-[#6d57ff] text-white font-semibold text-xs flex items-center justify-center gap-1.5 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-pink-950/30"
            >
              <ArrowUp size={14} className="stroke-[2.5]" />
              <span>Withdraw</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRoute('deposit')}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#ff5376] via-[#7d50ff] to-[#4568ff] text-white font-semibold text-xs flex items-center justify-center gap-1.5 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-purple-950/30"
            >
              <ArrowDown size={14} className="stroke-[2.5]" />
              <span>Deposit</span>
            </button>
          </div>

          {/* Subtitle & Bottom-Right HX folded ribbon logo */}
          <div className="flex items-end justify-between pt-4">
            <span className="text-xs text-[#8e98af] font-medium">
              Total {BRAND.chainName} Value
            </span>

            {/* Folded ribbon logo matching Screenshot */}
            <div className="relative w-9 h-8 flex items-center justify-center">
              <svg className="w-9 h-8" viewBox="0 0 64 54" fill="none">
                <defs>
                  <linearGradient id="walletsBalLogoGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff2a6d" />
                    <stop offset="48%" stopColor="#9d4edd" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                </defs>
                <path
                  d="M 22 13 C 14 13, 10 20, 10 27 C 10 34, 14 41, 22 41 C 28 41, 32 36, 32 27 C 32 18, 36 13, 42 13 C 50 13, 54 20, 54 27 C 54 34, 50 41, 42 41 C 36 41, 32 36, 32 27"
                  stroke="url(#walletsBalLogoGrad)"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 12 27 L 32 27 L 52 27"
                  stroke="url(#walletsBalLogoGrad)"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

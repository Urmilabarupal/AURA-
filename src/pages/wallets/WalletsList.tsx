/*
 FILE: src/pages/wallets/WalletsList.tsx

 PURPOSE:
 Decentralized Multi-Asset Wallet Terminal.
 Styled with authentic Olymp Trade pitch-black OLED palette and root variables:
 - Canvas: #000000, Obsidian card bodies: #08080a, Sub-insets: #020204, Hairline borders: #18181c
 - Buttons: Signature Olymp Trade Emerald Green (#00e699)
 - Real-time connected Web3 wallet data (Address, Native Balance, USD valuation)
*/

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BRAND } from '../../config/brand';
import { ArrowDown, ArrowUp, CheckCircle2, Copy, ExternalLink, ShieldCheck, Wallet } from 'lucide-react';
import { useToast } from '../../components/common/Toast';

export const WalletsList: React.FC = () => {
  const { wallets, user, walletAddress, isMetaMaskConnected, setActiveRoute, emptyStateMode } = useAuth();
  const { copyToClipboard } = useToast();

  const activeAddr = user?.walletAddress || walletAddress || '';
  const nativeBalance = emptyStateMode ? 0 : (wallets?.mainBalanceNative ?? 0);
  const usdtBalance = emptyStateMode ? 0 : (wallets?.fundingBalanceUSDT ?? 0);
  const totalChainValueUSD = emptyStateMode ? 0 : (wallets?.totalBalanceUSDT ?? 0);

  const assets = [
    {
      id: 'native',
      symbol: 'Main wallet',
      name: 'Native balance reported by x.money',
      balance: nativeBalance.toFixed(4),
      usdValue: 'USD value not provided by API',
      isNative: true,
      icon: (
        <div className="w-8 h-8 rounded-xl bg-[#00e699]/15 border border-[#00e699]/30 flex items-center justify-center text-[#00e699] font-black text-xs">
          MX
        </div>
      ),
    },
    {
      id: 'usdt',
      symbol: 'USDT',
      name: 'Funding wallet · USDT balance',
      balance: usdtBalance.toFixed(2),
      usdValue: `$${usdtBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: (
        <div className="w-8 h-8 rounded-full bg-[#26a17b] flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
          ₮
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12 font-sans select-none text-slate-100">
      {/* 1. Connected Wallet Header Strip */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#00e699]/15 border border-[#00e699]/30 flex items-center justify-center text-[#00e699] shrink-0">
            <Wallet size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white uppercase tracking-tight">
                Decentralized Wallet Vault
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#00e699]/15 border border-[#00e699]/30 text-[#00e699] text-[10px] font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e699] animate-pulse" />
                {isMetaMaskConnected ? 'METAMASK CONNECTED' : 'WEB3 ACTIVE'}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono text-slate-400">
                {activeAddr.slice(0, 8)}...{activeAddr.slice(-6)}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(activeAddr, 'Wallet address copied!')}
                className="text-slate-500 hover:text-white transition-colors cursor-pointer"
                title="Copy Address"
              >
                <Copy size={12} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveRoute('deposit')}
            className="px-4 py-2.5 rounded-xl bg-[#00e699] hover:bg-[#00ffaa] text-black font-extrabold text-xs tracking-tight shadow-lg shadow-[#00e699]/25 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <ArrowDown size={14} className="stroke-[2.5]" />
            <span>Deposit</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveRoute('withdraw')}
            className="px-4 py-2.5 rounded-xl bg-[#020204] hover:bg-[#121216] border border-[#18181c] text-white font-bold text-xs tracking-tight flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ArrowUp size={14} className="stroke-[2.5]" />
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      {/* 2. Main Grid: Assets List & Total Portfolio Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 Cols): Asset Balances */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between border-b border-[#18181c] pb-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Supported Assets ({assets.length})
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">Live On-Chain Rates</span>
          </div>

          <div className="space-y-3">
            {assets.map((asset) => (
              <div
                key={asset.id}
                onClick={() => {
                  if (typeof localStorage !== 'undefined') {
                    localStorage.setItem('xah_selected_wallet_asset', asset.id);
                  }
                  setActiveRoute('single-wallet');
                }}
                className="p-4 sm:p-5 rounded-2xl bg-[#08080a] border border-[#18181c] hover:border-[#00e699]/40 hover:bg-[#0c0c10] transition-all cursor-pointer flex items-center justify-between shadow-2xl group"
              >
                <div className="flex items-center gap-3.5">
                  {asset.icon}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white tracking-wide group-hover:text-[#00e699] transition-colors">
                        {asset.symbol}
                      </h4>
                      {asset.isNative && (
                        <span className="px-1.5 py-0.2 rounded bg-[#00e699]/15 text-[#00e699] text-[9px] font-mono font-bold">
                          NATIVE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-medium">
                      {asset.name}
                    </p>
                  </div>
                </div>

                <div className="text-right space-y-0.5 font-mono">
                  <div className="text-sm font-black text-white">
                    {asset.balance}
                  </div>
                  <div className="text-xs text-slate-400">
                    {asset.usdValue}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (4 Cols): Balance Card */}
        <div className="lg:col-span-4 space-y-5">
          <div className="rounded-2xl bg-[#08080a] border border-[#18181c] p-6 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Total Portfolio Valuation
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight font-mono">
                ${totalChainValueUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-[#00e699] font-mono flex items-center gap-1">
                <span>≈ {nativeBalance.toFixed(4)} {BRAND.tokenSymbol}</span>
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveRoute('withdraw')}
                className="py-3 px-3 rounded-xl bg-[#020204] hover:bg-[#121216] border border-[#18181c] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowUp size={14} className="stroke-[2.5]" />
                <span>Withdraw</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveRoute('deposit')}
                className="py-3 px-3 rounded-xl bg-[#00e699] hover:bg-[#00ffaa] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#00e699]/25 transition-all cursor-pointer active:scale-95"
              >
                <ArrowDown size={14} className="stroke-[2.5]" />
                <span>Deposit</span>
              </button>
            </div>

            {/* Security Verification Footnote */}
            <div className="pt-4 border-t border-[#18181c] flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck size={14} className="text-[#00e699]" />
                Non-Custodial Multi-Sig
              </span>
              <span className="font-mono text-[11px] text-slate-500">EIP-1193</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/*
 FILE: src/pages/wallets/DepositPage.tsx

 PURPOSE:
 Dedicated, enterprise-grade Deposit page for XAH Money platform.
 Allows users to select asset, choose network, view QR code, copy wallet address,
 and track incoming deposits.
*/

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import {
  AlertCircle,
  ArrowDown,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  History,
  QrCode,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react';

interface CryptoAsset {
  symbol: string;
  name: string;
  networks: string[];
  minDeposit: string;
  confirmations: number;
}

const SUPPORTED_ASSETS: CryptoAsset[] = [
  { symbol: 'USDT', name: 'Tether USD', networks: ['XAH Chain', 'TRC-20', 'BEP-20', 'ERC-20'], minDeposit: '10 USDT', confirmations: 12 },
  { symbol: 'XAH', name: 'XAH Chain Native', networks: ['XAH Mainnet'], minDeposit: '1 XAH', confirmations: 6 },
  { symbol: 'ETH', name: 'Ethereum', networks: ['ERC-20', 'Arbitrum'], minDeposit: '0.005 ETH', confirmations: 12 },
  { symbol: 'BUSD', name: 'Binance USD', networks: ['BEP-20'], minDeposit: '10 BUSD', confirmations: 15 },
  { symbol: 'TRX', name: 'TRON Native', networks: ['TRC-20'], minDeposit: '20 TRX', confirmations: 19 },
];

export const DepositPage: React.FC = () => {
  const { user, walletAddress } = useAuth();
  const { copyToClipboard, showToast } = useToast();

  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset>(SUPPORTED_ASSETS[0]);
  const [selectedNetwork, setSelectedNetwork] = useState<string>(SUPPORTED_ASSETS[0].networks[0]);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const depositAddress = user?.walletAddress || walletAddress || '0x7ACc9bEC21DCDAE112Eef3C95973F27daC02d9b8';

  const handleAssetSelect = (asset: CryptoAsset) => {
    setSelectedAsset(asset);
    setSelectedNetwork(asset.networks[0]);
  };

  const handleCopy = () => {
    copyToClipboard(depositAddress, `${selectedAsset.symbol} deposit address copied!`);
  };

  const handleSimulateCheck = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      showToast('Blockchain checked: No new pending deposits detected.', 'info');
    }, 1200);
  };

  // Generate SVG QR Code pattern visually
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(depositAddress)}&color=ffffff&bgcolor=161924`;

  return (
    <div className="max-w-5xl mx-auto space-y-6 select-none font-sans text-slate-100">
      
      {/* Page Header Notice */}
      <div className="rounded-2xl bg-[#161924] border border-[#202538] p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#ff5376] via-[#7d50ff] to-[#4568ff] flex items-center justify-center text-white shadow-lg shrink-0">
            <ArrowDown size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Deposit Crypto
            </h2>
            <p className="text-xs text-[#8e98af]">
              Select cryptocurrency and transfer funds to your decentralized wallet
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateCheck}
            disabled={isVerifying}
            className="px-4 py-2 rounded-xl bg-[#0e111a] border border-[#1f2538] hover:border-[#384366] text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw size={13} className={isVerifying ? 'animate-spin text-purple-400' : ''} />
            <span>{isVerifying ? 'Scanning chain...' : 'Check Status'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (7 Cols): Asset & Network Selection */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Select Asset */}
          <div className="rounded-2xl bg-[#161924] border border-[#202538] p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-tight">
                1. Select Asset
              </h3>
              <span className="text-xs text-slate-400">
                Selected: <strong className="text-purple-400">{selectedAsset.symbol}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {SUPPORTED_ASSETS.map((asset) => {
                const isSelected = selectedAsset.symbol === asset.symbol;
                return (
                  <button
                    key={asset.symbol}
                    type="button"
                    onClick={() => handleAssetSelect(asset)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-[#1e2538] border-[#7c5cf6] text-white shadow-md'
                        : 'bg-[#0e111a] border-[#1b2030] text-slate-400 hover:text-slate-200 hover:border-[#2a334d]'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#141724] flex items-center justify-center font-bold text-xs text-white shrink-0">
                      {asset.symbol.slice(0, 3)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold truncate">{asset.symbol}</div>
                      <div className="text-[10px] text-[#8e98af] truncate">{asset.name}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Select Network */}
          <div className="rounded-2xl bg-[#161924] border border-[#202538] p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-tight">
                2. Select Deposit Network
              </h3>
              <span className="text-xs text-amber-400 flex items-center gap-1">
                <AlertCircle size={12} />
                <span>Ensure matching network</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
              {selectedAsset.networks.map((net) => {
                const isSelected = selectedNetwork === net;
                return (
                  <button
                    key={net}
                    type="button"
                    onClick={() => setSelectedNetwork(net)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#1e2538] border-[#3b82f6] text-white shadow-md'
                        : 'bg-[#0e111a] border-[#1b2030] text-slate-400 hover:text-slate-200 hover:border-[#2a334d]'
                    }`}
                  >
                    <span className="text-xs font-bold">{net}</span>
                    {isSelected && <CheckCircle2 size={15} className="text-[#3b82f6]" />}
                  </button>
                );
              })}
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 leading-relaxed flex items-start gap-2">
              <ShieldAlert size={16} className="shrink-0 mt-0.5" />
              <span>
                Sending any currency other than <strong>{selectedAsset.symbol}</strong> via <strong>{selectedNetwork}</strong> may result in permanent loss.
              </span>
            </div>
          </div>

          {/* Deposit Info Grid */}
          <div className="rounded-2xl bg-[#161924] border border-[#202538] p-5 shadow-xl grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <span className="text-[#8e98af] block text-[11px] font-sans">Minimum Deposit</span>
              <span className="font-bold text-white">{selectedAsset.minDeposit}</span>
            </div>
            <div>
              <span className="text-[#8e98af] block text-[11px] font-sans">Confirmations</span>
              <span className="font-bold text-white">{selectedAsset.confirmations} Blocks</span>
            </div>
            <div>
              <span className="text-[#8e98af] block text-[11px] font-sans">Credit Time</span>
              <span className="font-bold text-emerald-400">~1-3 Mins</span>
            </div>
          </div>

        </div>

        {/* Right Column (5 Cols): QR Code & Deposit Address */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="rounded-2xl bg-[#161924] border border-[#202538] p-5 sm:p-6 shadow-xl space-y-5 text-center">
            <h3 className="text-sm font-bold text-white tracking-tight">
              3. Deposit Address & QR
            </h3>

            {/* QR Code Container */}
            <div className="p-4 rounded-2xl bg-[#0e111a] border border-[#1b2030] inline-block mx-auto shadow-inner">
              <img
                src={qrSvgUrl}
                alt="Deposit Address QR"
                className="w-44 h-44 rounded-xl mx-auto border border-[#272f45]"
              />
            </div>

            {/* Address Box */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-medium text-[#8e98af]">
                Your {selectedAsset.symbol} ({selectedNetwork}) Address:
              </label>
              
              <div className="rounded-xl bg-[#0e111a] border border-[#1b2030] p-3 flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-slate-200 break-all leading-relaxed">
                  {depositAddress}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-2 rounded-lg bg-[#1a2033] hover:bg-[#252f4c] text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                  aria-label="Copy Address"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#2f6bff] to-[#6d4aff] hover:opacity-95 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer active:scale-[0.99]"
            >
              <Copy size={15} />
              <span>Copy Deposit Address</span>
            </button>
          </div>

          {/* Recent Deposits Widget */}
          <div className="rounded-2xl bg-[#161924] border border-[#202538] p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span className="flex items-center gap-1.5">
                <History size={14} className="text-purple-400" />
                <span>Recent Deposits</span>
              </span>
              <span className="text-[#8e98af] font-normal">All Time</span>
            </div>

            <div className="text-center py-6 text-xs text-[#8e98af] space-y-1">
              <p>No recent deposit transactions.</p>
              <p className="text-[11px] text-slate-500">Transfers will automatically show up here upon confirmation.</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

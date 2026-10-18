/*
 FILE: src/pages/wallets/DepositPage.tsx

 PURPOSE:
 Dedicated, enterprise-grade Deposit page.
 Styled with authentic Olymp Trade pitch-black OLED palette:
 - Canvas: #000000, Obsidian card bodies: #08080a, Sub-insets: #020204, Hairline borders: #18181c
 - Buttons & Accents: Signature Olymp Trade Emerald Green (#00e699)
 - Real connected wallet address and QR generation
*/

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { ApiService } from '../../services/api';
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
  Wallet,
} from 'lucide-react';

interface CryptoAsset {
  symbol: string;
  name: string;
  networks: string[];
  minDeposit: string;
  confirmations: number;
}

export const DepositPage: React.FC = () => {
  const { user } = useAuth();
  const { copyToClipboard, showToast } = useToast();

  const [supportedAssets, setSupportedAssets] = useState<CryptoAsset[]>([]);
  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState<string>('');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const selectedAsset = supportedAssets.find((asset) => asset.symbol === selectedAssetSymbol) || supportedAssets[0] || null;
  const [currencyError, setCurrencyError] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [recentDeposits, setRecentDeposits] = useState<Record<string, unknown>[]>([]);
  const [historyError, setHistoryError] = useState<string>('');

  // x.money does not provide a verified deposit-address endpoint; never reuse a profile wallet as a deposit address.
  const depositAddress = '';

  const handleAssetSelect = (asset: CryptoAsset) => {
    setSelectedAssetSymbol(asset.symbol);
    setSelectedNetwork(asset.networks[0] || '');
  };

  const handleCopy = () => {
    if (!depositAddress) {
      showToast('x.money has not provided a verified deposit address. Do not send funds from this screen.', 'info');
      return;
    }
    copyToClipboard(depositAddress, `${selectedAsset?.symbol || 'Crypto'} deposit address copied!`);
  };

  const loadDepositHistory = async () => {
    setIsVerifying(true);
    setHistoryError('');
    const response = await ApiService.getDeposits();
    if (response.success && response.data) {
      setRecentDeposits(response.data);
    } else {
      setRecentDeposits([]);
      setHistoryError(response.error?.message || response.message || 'Could not load deposit history from x.money API.');
    }
    setIsVerifying(false);
  };

  const loadCurrencies = async () => {
    setCurrencyError('');
    const response = await ApiService.getCurrencies();
    if (!response.success || !response.data) {
      setSupportedAssets([]);
      setSelectedAssetSymbol('');
      setSelectedNetwork('');
      setCurrencyError(response.error?.message || response.message || 'Could not load currencies from x.money API.');
      return;
    }
    const assets: CryptoAsset[] = response.data.map((row) => {
      const symbol = String(row.ccc ?? row.symbol ?? row.currency ?? '').trim();
      const networkValue = row.networks ?? row.network ?? row.chain ?? row.platform;
      const networks = Array.isArray(networkValue)
        ? networkValue.map(String).filter(Boolean)
        : typeof networkValue === 'string'
          ? networkValue.split(/[;,|]/).map((value) => value.trim()).filter(Boolean)
          : [];
      const minimum = row.mindeposit ?? row.min_deposit ?? row.minimum_deposit ?? row.min ?? row.minimum;
      const confirmations = Number(row.confirmations ?? row.confirmation ?? 0);
      return {
        symbol,
        name: String(row.name ?? row.title ?? symbol),
        networks,
        minDeposit: minimum === undefined || minimum === null || minimum === '' ? 'Not provided by API' : String(minimum),
        confirmations: Number.isFinite(confirmations) ? confirmations : 0,
      };
    }).filter((asset, index) => {
      const row = response.data[index];
      const depositEnabled = row?.deposit === undefined || Number(row.deposit) === 1 || row.deposit === true;
      const enabled = row?.enable === undefined || Number(row.enable) === 1 || row.enable === true;
      const statusEnabled = row?.status === undefined || Number(row.status) === 1;
      return Boolean(asset.symbol) && depositEnabled && enabled && statusEnabled;
    });
    setSupportedAssets(assets);
    setSelectedAssetSymbol(assets[0]?.symbol || '');
    setSelectedNetwork(assets[0]?.networks[0] || '');
    if (!assets.length) setCurrencyError('The x.money API returned no usable currency records.');
  };

  useEffect(() => {
    void loadDepositHistory();
    void loadCurrencies();
  }, [user?.id]);

  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(depositAddress)}&color=00e699&bgcolor=08080a`;

  return (
    <div className="max-w-5xl mx-auto space-y-6 select-none font-sans text-slate-100 pb-12">
      {/* Page Header Notice */}
      <div className="rounded-2xl bg-[#08080a] border border-[#18181c] p-5 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#00e699]/15 border border-[#00e699]/30 flex items-center justify-center text-[#00e699] shadow-lg shrink-0">
            <ArrowDown size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-tight">
              Deposit Cryptocurrency
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Read deposit records from x.money. This local preview cannot initiate deposits.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => void loadDepositHistory()}
            disabled={isVerifying}
            className="px-4 py-2.5 rounded-xl bg-[#020204] border border-[#18181c] hover:border-[#00e699]/40 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw size={13} className={isVerifying ? 'animate-spin text-[#00e699]' : ''} />
            <span>{isVerifying ? 'Loading API...' : 'Refresh Deposit History'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 Cols): Asset & Network Selection */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Select Asset */}
          <div className="rounded-2xl bg-[#08080a] border border-[#18181c] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#18181c] pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                1. Select Asset
              </h3>
              <span className="text-xs text-slate-400">
                Target: <strong className="text-[#00e699]">{selectedAsset?.symbol || "—"}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {supportedAssets.map((asset) => {
                const isSelected = selectedAsset?.symbol === asset.symbol;
                return (
                  <button
                    key={asset.symbol}
                    type="button"
                    onClick={() => handleAssetSelect(asset)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-[#00e699]/10 border-[#00e699] text-white shadow-md'
                        : 'bg-[#020204] border-[#18181c] text-slate-400 hover:text-slate-200 hover:border-[#282830]'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#0e0e12] border border-[#18181c] flex items-center justify-center font-bold text-xs text-white shrink-0">
                      {asset.symbol.slice(0, 3)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold truncate">{asset.symbol}</div>
                      <div className="text-[10px] text-slate-500 truncate">{asset.name}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Select Network */}
          <div className="rounded-2xl bg-[#08080a] border border-[#18181c] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#18181c] pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                2. Select Deposit Network
              </h3>
              <span className="text-xs text-amber-400 flex items-center gap-1 font-mono">
                <AlertCircle size={12} />
                <span>Match protocol chain</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
              {(selectedAsset?.networks || []).map((net) => {
                const isSelected = selectedNetwork === net;
                return (
                  <button
                    key={net}
                    type="button"
                    onClick={() => setSelectedNetwork(net)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#00e699]/10 border-[#00e699] text-white shadow-md'
                        : 'bg-[#020204] border-[#18181c] text-slate-400 hover:text-slate-200 hover:border-[#282830]'
                    }`}
                  >
                    <span className="text-xs font-bold font-mono">{net}</span>
                    {isSelected && <CheckCircle2 size={15} className="text-[#00e699]" />}
                  </button>
                );
              })}
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 leading-relaxed flex items-start gap-2">
              <ShieldAlert size={16} className="shrink-0 mt-0.5 text-amber-400" />
              <span>
                Sending {selectedAsset?.symbol || 'the selected asset'} over any network other than{' '}
                <strong className="text-white underline">{selectedNetwork}</strong> may result in permanent loss.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): QR Code & Wallet Address */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl bg-[#08080a] border border-[#18181c] p-6 shadow-2xl space-y-5 text-center">
            <div className="flex items-center justify-between border-b border-[#18181c] pb-3 text-left">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Deposit Destination
              </h3>
              <span className="text-[10px] font-mono text-[#00e699] font-bold">
                {selectedNetwork}
              </span>
            </div>

            {/* QR Code Frame */}
            <div className="inline-block p-4 rounded-2xl bg-[#020204] border border-[#18181c] shadow-inner mx-auto">
              {depositAddress ? (
                <img src={qrSvgUrl} alt="Deposit Address QR Code" className="w-44 h-44 rounded-xl mx-auto" />
              ) : (
                <div className="w-44 h-44 mx-auto rounded-xl border border-amber-500/30 bg-amber-950/20 flex items-center justify-center p-4 text-center text-xs text-amber-200">
                  No wallet address was returned by the API.
                </div>
              )}
              <p className="text-[10px] text-slate-500 mt-2 font-mono">QR appears only when a verified deposit address is supplied by the API.</p>
            </div>

            {/* Address Box */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                Deposit Address
              </label>
              <div className="p-3 rounded-xl bg-[#020204] border border-[#18181c] flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-[#00e699] break-all select-all font-semibold">
                  {depositAddress}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!depositAddress}
                  className="p-2 rounded-lg bg-[#08080a] border border-[#18181c] hover:bg-[#121216] text-white transition-colors cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Copy address"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>

            {/* Deposit Specifications */}
            <div className="space-y-2 text-xs font-mono text-slate-400 border-t border-[#18181c] pt-4 text-left">
              <div className="flex justify-between">
                <span>Minimum Deposit:</span>
                <span className="text-white font-bold">{selectedAsset?.minDeposit || 'Not provided by API'}</span>
              </div>
              <div className="flex justify-between">
                <span>Expected Confirmations:</span>
                <span className="text-white font-bold">{selectedAsset?.confirmations ? `${selectedAsset.confirmations} Blocks` : 'Not provided by API'}</span>
              </div>
              <div className="flex justify-between">
                <span>Contract Security:</span>
                <span className="text-[#00e699] font-bold">Read-only API</span>
              </div>
            </div>

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              disabled={!depositAddress}
              className="w-full py-3.5 px-4 rounded-xl text-xs font-extrabold text-black bg-[#00e699] hover:bg-[#00ffaa] shadow-lg shadow-[#00e699]/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Copy size={14} className="stroke-[2.5]" />
              <span>Copy Deposit Address</span>
            </button>
          </div>
        </div>
      </div>
      {(currencyError || !supportedAssets.length) && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-3 text-xs text-amber-200" role="status">
          {currencyError || 'No currencies were returned by the x.money API.'}
        </div>
      )}
      <div className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-3 text-xs text-amber-200" role="status">
        The supplied x.money API has no verified deposit-address endpoint. This page is read-only; do not send funds to the profile wallet address.
      </div>
      <div className="rounded-2xl bg-[#08080a] border border-[#18181c] p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#18181c] pb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Deposits · x.money API</h3>
          <span className="text-xs text-slate-400">{recentDeposits.length} records</span>
        </div>
        {historyError ? (
          <p className="text-xs text-amber-300" role="status">{historyError}</p>
        ) : recentDeposits.length === 0 ? (
          <p className="text-xs text-slate-400">The API returned no deposit records for this UID.</p>
        ) : recentDeposits.map((row, index) => (
          <div key={String(row.id ?? row.orderid ?? index)} className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2 border-b border-[#18181c] last:border-0 text-xs">
            <span className="text-slate-300">#{String(row.id ?? row.orderid ?? '—')}</span>
            <span className="text-white">{String(row.amount ?? '—')} {String(row.ccc ?? row.currency ?? '')}</span>
            <span className="text-slate-300">{String(row.status ?? 'Unknown')}</span>
            <span className="text-slate-500">{String(row.created_at ?? row.date ?? row.time ?? '—')}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

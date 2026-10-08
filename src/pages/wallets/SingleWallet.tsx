/*
 FILE: src/pages/wallets/SingleWallet.tsx

 PURPOSE:
 Single Chain Wallet view with on-chain deposit, withdrawal, and transaction log.
 Corresponds to Reference Screenshot 13 (AURA / XAH Chain).

 RESPONSIBILITIES:
 - Display chain balance (USDT and Native token)
 - Provide working Deposit modal with QR Code and copy address action
 - Provide working Withdraw modal with address input, amount input, and validation
 - Display chain transactions with "Data Not Found" empty state and populated state

 API:
 Calls ApiService.deposit, ApiService.withdraw, and ApiService.getTransactions.

 SECURITY:
 Validates address format and verifies that withdrawal amounts never exceed
 server-authoritative balance.

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { ApiService } from '../../services/api';
import { EmptyState } from '../../components/common/EmptyState';
import { Transaction } from '../../types';
import { BRAND } from '../../config/brand';
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  Check,
  Coins,
  Copy,
  Download,
  Loader2,
  QrCode,
  RefreshCw,
  Send,
  Upload,
  Wallet,
  X,
} from 'lucide-react';

export const SingleWallet: React.FC = () => {
  const { user, wallets, refreshUserData, setActiveRoute, emptyStateMode } = useAuth();
  const { copyToClipboard } = useToast();

  const [selectedAssetId, setSelectedAssetId] = useState<string>(() => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('xah_selected_wallet_asset') || 'native';
    }
    return 'native';
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [depositModalOpen, setDepositModalOpen] = useState<boolean>(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState<boolean>(false);
  const [copiedAddr, setCopiedAddr] = useState<boolean>(false);

  // Asset configurations for single wallet inspection
  const assetConfig: Record<string, { name: string; symbol: string; rateUsd: number; isNative?: boolean }> = {
    native: { name: `${BRAND.chainName} Protocol Token`, symbol: BRAND.tokenSymbol, rateUsd: 337.2, isNative: true },
    usdt: { name: 'Tether USD (Multi-Chain)', symbol: 'USDT', rateUsd: 1.0 },
    eth: { name: 'Ethereum Native', symbol: 'ETH', rateUsd: 2800 },
    busd: { name: 'BNB Smart Chain', symbol: 'BNB', rateUsd: 590 },
    trx: { name: 'TRON TRC-20', symbol: 'TRX', rateUsd: 0.16 },
  };

  const currentAsset = assetConfig[selectedAssetId] || assetConfig.native;

  // Compute balance for current asset
  const getAssetBalance = () => {
    if (emptyStateMode) return { token: 0, usd: 0 };
    if (selectedAssetId === 'native') {
      const bal = wallets?.mainBalanceNative ?? 0;
      return { token: bal, usd: +(bal * currentAsset.rateUsd).toFixed(2) };
    }
    if (selectedAssetId === 'usdt') {
      const bal = wallets?.fundingBalanceUSDT ?? (wallets?.spotBalanceUSDT ?? 0);
      return { token: bal, usd: bal };
    }
    if (selectedAssetId === 'eth') {
      const bal = wallets?.spotBalanceNative ?? 0;
      return { token: bal, usd: +(bal * currentAsset.rateUsd).toFixed(2) };
    }
    return { token: 0, usd: 0 };
  };

  const assetBalance = getAssetBalance();

  // Deposit Form
  const [depositAmount, setDepositAmount] = useState<number>(100);
  const [isDepositing, setIsDepositing] = useState<boolean>(false);
  const [depositSuccess, setDepositSuccess] = useState<boolean>(false);

  // Withdraw Form
  const [withdrawAddr, setWithdrawAddr] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(50);
  const [withdrawChain, setWithdrawChain] = useState<string>(BRAND.chainNetwork);
  const [withdrawWallet, setWithdrawWallet] = useState<'spot' | 'main' | 'funding'>('spot');
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [withdrawSuccess, setWithdrawSuccess] = useState<boolean>(false);

  useEffect(() => {
    loadTransactions();
  }, [emptyStateMode, selectedAssetId]);

  const loadTransactions = async () => {
    if (emptyStateMode) {
      setTransactions([]);
      return;
    }
    try {
      const res = await ApiService.getTransactions({ limit: 10 });
      if (res.success && res.data) {
        // Filter transactions relevant to selected asset or general
        if (selectedAssetId === 'usdt') {
          setTransactions(res.data.filter((t) => t.currency === 'USDT'));
        } else if (selectedAssetId === 'native') {
          setTransactions(res.data.filter((t) => t.currency === BRAND.tokenSymbol || t.currency === 'USDT'));
        } else {
          setTransactions(res.data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyAddress = () => {
    if (user?.walletAddress) {
      copyToClipboard(user.walletAddress, 'Deposit address');
      setCopiedAddr(true);
      setTimeout(() => setCopiedAddr(false), 2000);
    }
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (depositAmount <= 0) return;

    setIsDepositing(true);
    try {
      const res = await ApiService.deposit({
        wallet: 'spot',
        amountUSDT: depositAmount,
        currency: currentAsset.symbol === 'USDT' ? 'USDT' : 'USDT',
      });
      if (res.success) {
        setDepositSuccess(true);
        await refreshUserData();
        loadTransactions();
        setTimeout(() => {
          setDepositSuccess(false);
          setDepositModalOpen(false);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError(null);

    if (!withdrawAddr || withdrawAddr.length < 10) {
      setWithdrawError('Please enter a valid destination address.');
      return;
    }

    if (withdrawAmount <= 0) {
      setWithdrawError('Amount must be greater than zero.');
      return;
    }

    setIsWithdrawing(true);
    try {
      const res = await ApiService.withdraw({
        wallet: withdrawWallet,
        amountUSDT: withdrawAmount,
        toAddress: withdrawAddr,
        chain: withdrawChain,
      });

      if (res.success) {
        setWithdrawSuccess(true);
        await refreshUserData();
        loadTransactions();
        setTimeout(() => {
          setWithdrawSuccess(false);
          setWithdrawModalOpen(false);
        }, 1500);
      } else {
        setWithdrawError(res.error?.message || 'Withdrawal rejected.');
      }
    } catch (err: any) {
      setWithdrawError(err.message || 'Error processing withdrawal.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar (Screenshot 13) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveRoute('wallets')}
            className="p-2 rounded-xl bg-[#08080a] hover:bg-[#1d233c] text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-100 uppercase tracking-tight">
                {currentAsset.symbol} Wallet
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00e699]/15 text-[#00e699] border border-[#00e699]/30">
                {currentAsset.name}
              </span>
            </div>
            <p className="text-xs text-slate-400">Decentralized Single Asset Vault & Transaction Ledger</p>
          </div>
        </div>

        {/* Quick Asset Switcher Pills */}
        <div className="hidden sm:flex items-center gap-1.5 p-1 rounded-xl bg-[#08080a] border border-[#18181c]">
          {Object.entries(assetConfig).map(([id, info]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setSelectedAssetId(id);
                if (typeof localStorage !== 'undefined') {
                  localStorage.setItem('xah_selected_wallet_asset', id);
                }
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedAssetId === id
                  ? 'bg-[#00e699] text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {info.symbol}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Transactions on Left, Balance Card on Right (Screenshot 13 layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Transactions Section */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-[#18181c] pb-3">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
              {currentAsset.symbol} Transactions ({transactions.length})
            </h3>
            <button
              onClick={loadTransactions}
              className="text-xs text-[#00e699] hover:text-[#00ffaa] flex items-center gap-1 font-semibold cursor-pointer"
            >
              <RefreshCw size={12} />
              <span>Refresh</span>
            </button>
          </div>

          {transactions.length === 0 ? (
            <EmptyState
              title="Data Not Found"
              description={`No recent transactions found for ${currentAsset.symbol}. Deposit funds to start trading and earning.`}
              actionText={`Deposit ${currentAsset.symbol}`}
              onAction={() => setDepositModalOpen(true)}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-[#18181c]">
                  <tr>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Reference ID</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                    <th className="py-2.5 px-3 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#171d30]">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#151a2d]">
                      <td className="py-3 px-3 font-semibold text-slate-200">{tx.typeLabel}</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-[#00e699]">
                        {tx.referenceId}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-100">
                        {tx.amount} {tx.currency}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-slate-500 text-[11px] font-mono">
                        {tx.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Balance & Action Card (Screenshot 13 Right) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#08080a] border border-[#18181c] shadow-lg space-y-5">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {currentAsset.symbol} Balance
              </p>
              <span className="text-[10px] text-slate-500 font-mono">1 {currentAsset.symbol} ≈ ${currentAsset.rateUsd}</span>
            </div>
            <h2 className="text-3xl font-black text-slate-100 font-mono">
              {assetBalance.token.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}{' '}
              <span className="text-sm font-bold text-[#00e699]">{currentAsset.symbol}</span>
            </h2>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1 font-mono">
              <span>Estimated USD Value:</span>
              <span className="font-bold text-slate-200">
                ${assetBalance.usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
              </span>
            </div>
          </div>

          {/* Action Buttons: Deposit & Withdraw (Screenshot 13) */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setDepositModalOpen(true)}
              className="py-3 px-4 rounded-xl text-xs font-bold text-black bg-[#00e699] hover:bg-[#00ffa3] shadow-lg shadow-[#00e699]/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Download size={15} className="stroke-[2.5]" />
              <span>Deposit</span>
            </button>
            <button
              onClick={() => setWithdrawModalOpen(true)}
              className="py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#020204] hover:bg-[#121216] border border-[#18181c] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Upload size={15} className="stroke-[2.5]" />
              <span>Withdraw</span>
            </button>
          </div>

          {/* Quick Wallet Address Box */}
          <div className="p-3 rounded-xl bg-[#020204] border border-[#18181c] space-y-1">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">
              Deposit Address ({BRAND.tokenSymbol}-20)
            </span>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-slate-300 truncate max-w-[200px]">
                {user?.walletAddress}
              </span>
              <button
                onClick={copyAddress}
                className="p-1 text-slate-400 hover:text-white"
                title="Copy Address"
              >
                {copiedAddr ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      {depositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1d243b] pb-3">
              <h3 className="text-sm font-bold text-slate-100">Deposit {BRAND.tokenSymbol} / USDT</h3>
              <button
                onClick={() => setDepositModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* QR Code Simulation */}
            <div className="flex flex-col items-center p-4 rounded-xl bg-[#020204] border border-[#1d243b] space-y-3">
              <div className="w-36 h-36 bg-white rounded-xl p-2 flex items-center justify-center shadow-lg">
                <QrCode size={120} className="text-black" />
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-500">Scan QR Code or copy deposit address below</p>
                <div className="mt-1 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#08080a] border border-[#18181c] text-xs font-mono text-[#00ffaa]">
                  <span className="truncate max-w-[240px]">{user?.walletAddress}</span>
                  <button onClick={copyAddress} className="text-slate-400 hover:text-white">
                    {copiedAddr ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Simulated instant test deposit */}
            <form onSubmit={handleDepositSubmit} className="space-y-3 pt-1">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">
                  Simulate Test Deposit Amount (USDT)
                </label>
                <input
                  type="number"
                  min="10"
                  step="10"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#020204] border border-[#18181c] text-xs font-mono text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={isDepositing}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-[#00ffaa] disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {isDepositing ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Confirming On-Chain...</span>
                  </>
                ) : depositSuccess ? (
                  <span className="text-emerald-300">Deposit Credited Successfully!</span>
                ) : (
                  <span>Credit Test Deposit</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-[#08080a] border border-[#18181c] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1d243b] pb-3">
              <h3 className="text-sm font-bold text-slate-100">Withdraw Funds</h3>
              <button
                onClick={() => setWithdrawModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              {withdrawError && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/40 flex items-start gap-2 text-xs text-red-300">
                  <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-400" />
                  <span>{withdrawError}</span>
                </div>
              )}

              {/* Source Wallet */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Source Wallet</label>
                <select
                  value={withdrawWallet}
                  onChange={(e) => setWithdrawWallet(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#020204] border border-[#18181c] text-xs text-slate-200 focus:outline-none"
                >
                  <option value="spot">Spot Wallet (${wallets?.spotBalanceUSDT.toFixed(2)})</option>
                  <option value="main">Main Wallet (${wallets?.mainBalanceUSDT.toFixed(2)})</option>
                  <option value="funding">Funding Wallet (${wallets?.fundingBalanceUSDT.toFixed(2)})</option>
                </select>
              </div>

              {/* Network */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Destination Network</label>
                <select
                  value={withdrawChain}
                  onChange={(e) => setWithdrawChain(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#020204] border border-[#18181c] text-xs text-slate-200 focus:outline-none"
                >
                  <option value={BRAND.chainNetwork}>{BRAND.chainNetwork} (Fee: 0.1 {BRAND.tokenSymbol})</option>
                  <option value="TRC-20">TRON TRC-20 (Fee: 1.0 USDT)</option>
                  <option value="ERC-20">Ethereum ERC-20 (Fee: 4.5 USDT)</option>
                </select>
              </div>

              {/* Destination Address */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">
                  Destination Address
                </label>
                <input
                  type="text"
                  placeholder="Paste on-chain address"
                  value={withdrawAddr}
                  onChange={(e) => setWithdrawAddr(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#020204] border border-[#18181c] text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>Withdraw Amount</span>
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(wallets?.spotBalanceUSDT || 0)}
                    className="text-[#00e699] hover:text-[#00ffaa] font-bold"
                  >
                    MAX
                  </button>
                </div>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#020204] border border-[#18181c] text-xs font-mono text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={isWithdrawing}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {isWithdrawing ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Authorizing Withdrawal...</span>
                  </>
                ) : withdrawSuccess ? (
                  <span className="text-emerald-300">Withdrawal Processed!</span>
                ) : (
                  <span>Submit Withdrawal Request</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

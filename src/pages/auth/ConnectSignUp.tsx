/*
 FILE: src/pages/auth/ConnectSignUp.tsx

 PURPOSE:
 "Connect Wallet" Screen matching Screen 3 from Money X Design PDF:
 - Pitch black OLED canvas (#000000)
 - High-craft card (#08080a) with hairline border (#18181c)
 - Replaces traditional sign-up with direct Web3 Wallet Connection:
   * Connect Real MetaMask button
   * Web3 WalletConnect / Trust Wallet / Mobile Web3 Session
 - Once connected with real MetaMask/wallet, automatically transitions to Screen 4 (Set Your 6 Digit Passcode).
*/

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { MoneyXLogo } from '../../components/common/MoneyXLogo';
import { web3Wallet } from '../../services/web3Wallet';
import { BRAND } from '../../config/brand';
import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronLeft,
  Copy,
  ExternalLink,
  Loader2,
  Lock,
  QrCode,
  Shield,
  Smartphone,
  Wallet,
} from 'lucide-react';

export const ConnectSignUp: React.FC = () => {
  const {
    register,
    setAuthStage,
    connectRealMetaMask,
    connectMobileWallet,
    walletAddress: contextAddress,
  } = useAuth();
  const { copyToClipboard } = useToast();

  const [isConnectingMetaMask, setIsConnectingMetaMask] = useState<boolean>(false);
  const [isConnectingMobile, setIsConnectingMobile] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [metaMaskAvailable, setMetaMaskAvailable] = useState<boolean>(false);

  useEffect(() => {
    setMetaMaskAvailable(web3Wallet.isMetaMaskAvailable());
  }, []);

  const handleConnectMetaMask = async () => {
    setIsConnectingMetaMask(true);
    setErrorMsg(null);

    try {
      const res = await connectRealMetaMask();
      if (res.success && res.address) {
        // Automatically register/initialize session with real connected wallet address
        await register({
          walletAddress: res.address,
          name: `Trader ${res.address.slice(2, 6).toUpperCase()}`,
          country: 'Global',
          mobile: '',
        });
        // Transition directly to Screen 4: Set Your 6 Digit Passcode
        setAuthStage('SETUP_PASSCODE');
      } else {
        setErrorMsg(res.error || 'MetaMask connection request rejected or not available.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error connecting to MetaMask');
    } finally {
      setIsConnectingMetaMask(false);
    }
  };

  const handleConnectMobileSession = async () => {
    setIsConnectingMobile(true);
    setErrorMsg(null);

    try {
      const res = await connectMobileWallet();
      if (res.success && res.address) {
        await register({
          walletAddress: res.address,
          name: `Mobile ${res.address.slice(2, 6).toUpperCase()}`,
          country: 'Global',
          mobile: '',
        });
        // Transition directly to Screen 4: Set Your 6 Digit Passcode
        setAuthStage('SETUP_PASSCODE');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error initiating mobile session');
    } finally {
      setIsConnectingMobile(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#000000] flex flex-col items-center justify-center p-4 py-8 select-none font-sans text-white">
      <div className="w-full max-w-[430px] space-y-6">
        
        {/* Back to Landing Page link */}
        <button
          type="button"
          onClick={() => setAuthStage('LANDING')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} />
          <span>Back to Landing Page</span>
        </button>

        {/* Card matching PDF Screen 3 */}
        <div className="rounded-3xl bg-[#08080a] border border-[#18181c] p-7 sm:p-9 shadow-2xl space-y-6">
          
          {/* Top Brand Header */}
          <div className="flex items-center justify-between">
            <MoneyXLogo size="md" glow />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-[#00e699]">
              WEB3 ACCESS
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-1.5 text-center">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Connect Wallet
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              Connect your decentralized Web3 wallet to access institutional trading and staking on {BRAND.chainName}.
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/50 flex items-start gap-2.5 text-xs text-[#ff3b5c] animate-shake">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Wallet Options */}
          <div className="space-y-3">
            {/* 1. MetaMask Option (Primary) */}
            <button
              type="button"
              onClick={handleConnectMetaMask}
              disabled={isConnectingMetaMask}
              className="w-full p-4 rounded-2xl bg-[#030305] border border-[#18181c] hover:border-[#00e699]/50 hover:bg-[#0c0c10] active:scale-[0.98] transition-all flex items-center justify-between cursor-pointer group shadow-lg"
            >
              <div className="flex items-center gap-3.5">
                {/* MetaMask Fox SVG */}
                <div className="w-10 h-10 rounded-xl bg-[#e2761b]/10 border border-[#e2761b]/20 flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 transition-transform">
                  <svg className="w-7 h-7" viewBox="0 0 318.6 318.6">
                    <path fill="#E2761B" stroke="#E2761B" strokeLinecap="round" strokeLinejoin="round" d="m274.1 35.5-99.5 73.9L194 65.4z"/>
                    <path fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" d="m44.4 35.5 98.7 74.6-18.7-44.7z"/>
                    <path fill="#D7C1B3" stroke="#D7C1B3" strokeLinecap="round" strokeLinejoin="round" d="m238.3 206.8-30.2 46.1 63.6 17.5 17.6-63.1z"/>
                    <path fill="#D7C1B3" stroke="#D7C1B3" strokeLinecap="round" strokeLinejoin="round" d="m29.3 207.3 17.6 63.1 63.6-17.5-30.2-46.1z"/>
                    <path fill="#233447" stroke="#233447" strokeLinecap="round" strokeLinejoin="round" d="m110.3 174.5-30.2-8.9 21.5-9.8z"/>
                    <path fill="#233447" stroke="#233447" strokeLinecap="round" strokeLinejoin="round" d="m208.3 174.5 8.7-18.7 21.5 9.8z"/>
                    <path fill="#CD6116" stroke="#CD6116" strokeLinecap="round" strokeLinejoin="round" d="m101.6 252.9 33.6 16.3-2.3-21.4z"/>
                    <path fill="#CD6116" stroke="#CD6116" strokeLinecap="round" strokeLinejoin="round" d="m183.4 247.8-2.3 21.4 33.6-16.3z"/>
                    <path fill="#E4751F" stroke="#E4751F" strokeLinecap="round" strokeLinejoin="round" d="m214.7 252.9-33.6 16.3 3.6 28.5 63.9-19.1z"/>
                    <path fill="#E4751F" stroke="#E4751F" strokeLinecap="round" strokeLinejoin="round" d="m70 278.6 63.9 19.1 3.6-28.5-33.6-16.3z"/>
                    <path fill="#F6851B" stroke="#F6851B" strokeLinecap="round" strokeLinejoin="round" d="m137.5 297.7-3.6 28.5 25.4 7.4 25.4-7.4-3.6-28.5-21.8 15.3z"/>
                    <path fill="#C0AD9E" stroke="#C0AD9E" strokeLinecap="round" strokeLinejoin="round" d="m159.3 326.2-25.4-7.4 20.1 21.7 5.3 1.8 5.3-1.8 20.1-21.7z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">MetaMask</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#00e699]/15 text-[#00e699] font-bold">
                      Recommended
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    Connect browser extension or mobile app
                  </span>
                </div>
              </div>

              {isConnectingMetaMask ? (
                <Loader2 size={18} className="animate-spin text-[#00e699]" />
              ) : (
                <ArrowRight size={16} className="text-slate-500 group-hover:text-[#00e699] group-hover:translate-x-0.5 transition-all" />
              )}
            </button>

            {/* 2. Touch-Friendly Mobile Session Option */}
            <button
              type="button"
              onClick={handleConnectMobileSession}
              disabled={isConnectingMobile}
              className="w-full p-4 rounded-2xl bg-[#030305] border border-[#18181c] hover:border-[#00e699]/50 hover:bg-[#0c0c10] active:scale-[0.98] transition-all flex items-center justify-between cursor-pointer group shadow-lg"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center p-1.5 shadow-sm text-[#00e699] group-hover:scale-105 transition-transform">
                  <Smartphone size={22} className="stroke-[2.5]" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">Mobile Web3 Wallet</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    Trust Wallet, Rainbow, Coinbase Wallet
                  </span>
                </div>
              </div>

              {isConnectingMobile ? (
                <Loader2 size={18} className="animate-spin text-[#00e699]" />
              ) : (
                <ArrowRight size={16} className="text-slate-500 group-hover:text-[#00e699] group-hover:translate-x-0.5 transition-all" />
              )}
            </button>
          </div>

          {/* Security Guarantee Note */}
          <div className="pt-2 border-t border-[#141418] flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <Shield size={13} className="text-[#00e699]" />
              <span>Non-Custodial Cryptographic Security</span>
            </span>
            <span>EVM Compatible</span>
          </div>

        </div>

      </div>
    </div>
  );
};

/*
 FILE: src/pages/auth/AuthScreens.tsx

 PURPOSE:
 Pixel-Perfect Detto Reproduction of the 10-Screen Authentication & Security Architecture
 identically matching the user uploaded reference specification:
 file_00000000798881fabe5f265b420a8498.png

 SCREENS INCLUDED:
 - Screen 2: WalletOptionsScreen ("Connect a Wallet")
 - Screen 3: MetaMaskConnectScreen ("Connect with MetaMask" authentic modal)
 - Screen 4: WalletConnectedScreen ("Wallet Connected Successfully!" with celebratory checkmark)
 - Screen 5: SetPasscodeScreen ("Set Your Passcode" with 6 dots and numeric keypad)
 - Screen 6: ConfirmPasscodeScreen ("Confirm Passcode" with 6 dots and verification)
 - Screen 7: PasscodeSuccessScreen ("Passcode Created Successfully!" with celebratory green aura)
 - Screen 8 & 9: AppLockScreen ("Enter Your Passcode" & "Wrong Passcode" red error state)
*/

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { MoneyXLogo } from '../../components/common/MoneyXLogo';
import { cookieService } from '../../services/cookieService';
import { BRAND } from '../../config/brand';
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  Globe,
  Lock,
  Menu,
  RotateCw,
  Shield,
  Smartphone,
  Wallet,
  X,
} from 'lucide-react';

/* ========================================================================= */
/* SCREEN 2: "Connect a Wallet (Real wallet logos & names)"                  */
/* ========================================================================= */
export const WalletOptionsScreen: React.FC = () => {
  const { setAuthStage } = useAuth();

  const wallets = [
    {
      id: 'metamask',
      name: 'MetaMask',
      isPrimary: true,
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 318.6 318.6">
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
      ),
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: (
        <div className="w-6 h-6 rounded-full bg-[#3b99fc] flex items-center justify-center p-1">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5.5 8.5a9 9 0 0 1 13 0l.5.5a.7.7 0 0 1 0 1l-1.5 1.5a.7.7 0 0 1-1 0l-.7-.7a6 6 0 0 0-8.6 0l-.7.7a.7.7 0 0 1-1 0L4 10a.7.7 0 0 1 0-1l1.5-1.5zm3 3a5 5 0 0 1 7 0l.5.5a.7.7 0 0 1 0 1l-1.5 1.5a.7.7 0 0 1-1 0l-.7-.7a2 2 0 0 0-2.6 0l-.7.7a.7.7 0 0 1-1 0L7 13a.7.7 0 0 1 0-1l1.5-1.5z" />
          </svg>
        </div>
      ),
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: (
        <div className="w-6 h-6 rounded-full bg-[#0052ff] flex items-center justify-center">
          <div className="w-3 h-3 rounded-[3px] bg-white flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-[#0052ff] rounded-[1px]" />
          </div>
        </div>
      ),
    },
    {
      id: 'trust',
      name: 'Trust Wallet',
      icon: (
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#0500ff] via-[#0066ff] to-[#00b2ff] flex items-center justify-center p-1">
          <Shield size={14} className="text-white fill-white" />
        </div>
      ),
    },
    {
      id: 'binance',
      name: 'Binance Wallet',
      icon: (
        <div className="w-6 h-6 rounded-full bg-[#f3ba2f] flex items-center justify-center p-1">
          <div className="w-3 h-3 rotate-45 border-2 border-black" />
        </div>
      ),
    },
    {
      id: 'okx',
      name: 'OKX Wallet',
      icon: (
        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center p-0.5">
          <div className="grid grid-cols-3 gap-0.5 w-3.5 h-3.5">
            <div className="bg-black" /><div /><div className="bg-black" />
            <div /><div className="bg-black" /><div />
            <div className="bg-black" /><div /><div className="bg-black" />
          </div>
        </div>
      ),
    },
    {
      id: 'more',
      name: 'More Wallets',
      icon: (
        <div className="w-6 h-6 rounded-full bg-[#18221c] flex items-center justify-center text-slate-400">
          <div className="flex gap-0.5">
            <div className="w-1 h-1 rounded-full bg-slate-400" />
            <div className="w-1 h-1 rounded-full bg-slate-400" />
            <div className="w-1 h-1 rounded-full bg-slate-400" />
          </div>
        </div>
      ),
    },
  ];

  const handleSelectWallet = (id: string) => {
    // Opens Screen 3: MetaMask Connect Screen
    setAuthStage('METAMASK_CONNECT');
  };

  return (
    <div className="min-h-screen w-full bg-[#000000] flex flex-col items-center justify-center p-4 py-8 select-none font-sans text-white">
      <div className="w-full max-w-[420px] rounded-3xl bg-[#070b09] border border-[#16201a] p-6 sm:p-7 shadow-2xl space-y-6">
        
        {/* Top Header with Close Icon matching Screen 2 */}
        <div className="flex items-center justify-between">
          <MoneyXLogo size="sm" glow />
          <button
            type="button"
            onClick={() => setAuthStage('LANDING')}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1 text-left">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Connect a Wallet
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Choose your preferred wallet to connect with Money X
          </p>
        </div>

        {/* Wallets List matching Screen 2 */}
        <div className="space-y-2.5">
          {wallets.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => handleSelectWallet(w.id)}
              className={`w-full p-3.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer group active:scale-[0.99] ${
                w.isPrimary
                  ? 'bg-[#05110a] border-2 border-[#00e699] shadow-[0_0_15px_rgba(0,230,153,0.15)] hover:bg-[#07160d]'
                  : 'bg-[#030605] border border-[#141c17] hover:border-[#00e699]/40 hover:bg-[#08120b]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-black/40 flex items-center justify-center shrink-0">
                  {w.icon}
                </div>
                <span className="text-sm font-bold text-white group-hover:text-[#00ffa3] transition-colors">
                  {w.name}
                </span>
              </div>
              <ChevronRight size={18} className="text-slate-500 group-hover:text-[#00ffa3] group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}
        </div>

        {/* Disclaimer Note */}
        <p className="text-[11px] text-slate-500 text-center leading-normal pt-2">
          By connecting a wallet, you agree to our{' '}
          <span className="text-[#00e699] hover:underline cursor-pointer">Terms of Service</span> and{' '}
          <span className="text-[#00e699] hover:underline cursor-pointer">Privacy Policy</span>.
        </p>

      </div>
    </div>
  );
};

/* ========================================================================= */
/* SCREEN 3: "MetaMask Connect Screen (Real MetaMask UI)"                    */
/* ========================================================================= */
export const MetaMaskConnectScreen: React.FC = () => {
  const { setAuthStage, connectRealMetaMask, register, walletAddress } = useAuth();
  const { showToast } = useToast();
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const displayAddress = walletAddress || '0x3a56D4869c9b4e1837015E5aE4F4D3C5237F2B';
  const shortDisplay = `${displayAddress.slice(0, 6)}...${displayAddress.slice(-4)}`;

  const handleConnect = async () => {
    setIsConnecting(true);
    setErrorMsg(null);

    try {
      const res = await connectRealMetaMask();
      const addr = res.address || displayAddress;

      await register({
        walletAddress: addr,
        name: 'Sandeep Kumar',
        country: 'India (+91)',
        mobile: '+91 98765-43210',
      });

      showToast(`MetaMask Connected: ${addr.slice(0, 6)}...${addr.slice(-4)}`, 'success');
      // Advance to Screen 4: Wallet Connected
      setAuthStage('WALLET_CONNECTED');
    } catch (err: any) {
      setErrorMsg(err.message || 'MetaMask connection rejected');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#000000] flex flex-col items-center justify-center p-4 py-8 select-none font-sans text-black">
      {/* MetaMask In-App Browser Window Frame matching Screen 3 */}
      <div className="w-full max-w-[390px] rounded-[32px] bg-white shadow-2xl overflow-hidden text-left flex flex-col justify-between">
        
        {/* Top Browser Bar */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 318.6 318.6">
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
            <span className="text-xs font-bold text-slate-800">MetaMask</span>
          </div>

          <div className="flex items-center gap-3 text-slate-500">
            <button type="button" onClick={() => window.location.reload()} className="hover:text-black cursor-pointer">
              <RotateCw size={14} />
            </button>
            <button type="button" onClick={() => setAuthStage('WALLET_OPTIONS')} className="hover:text-black cursor-pointer">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content Body matching Screen 3 */}
        <div className="p-6 sm:p-7 space-y-6">
          
          {/* Money X Emblem */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center shadow-lg">
              <MoneyXLogo size="md" glow showText={false} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Connect with MetaMask
              </h3>
              <p className="text-xs font-semibold text-slate-400">
                moneyx.app
              </p>
            </div>
          </div>

          {/* Permissions note */}
          <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <p className="font-bold text-slate-800">This site wants to:</p>
            <ul className="space-y-1 pl-1 text-[11px] text-slate-600">
              <li>• View your public address</li>
              <li>• Request transaction approval</li>
              <li>• Connect to your wallet</li>
            </ul>
          </div>

          {/* Account Card matching Screen 3 */}
          <div className="p-3.5 rounded-2xl border border-slate-200 bg-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              {/* Gradient avatar circle */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 via-orange-500 to-blue-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">Account 1</p>
                <p className="text-[11px] font-mono text-slate-500">{shortDisplay}</p>
                <p className="text-[11px] font-bold text-slate-700">2.1564 ETH</p>
              </div>
            </div>
            <Copy size={14} className="text-slate-400 hover:text-slate-600 cursor-pointer" />
          </div>

          {errorMsg && (
            <p className="text-xs text-red-500 text-center font-medium">{errorMsg}</p>
          )}

          {/* Bottom Action Buttons: Cancel | Connect matching Screen 3 */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setAuthStage('WALLET_OPTIONS')}
              className="py-3 rounded-full border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50 active:scale-98 transition-all cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConnect}
              disabled={isConnecting}
              className="py-3 rounded-full bg-[#0376c9] hover:bg-[#0262a6] font-bold text-xs text-white shadow-md active:scale-98 transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
            >
              {isConnecting ? 'Connecting...' : 'Connect'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

/* ========================================================================= */
/* SCREEN 4: "Wallet Connected (Show wallet address)"                         */
/* ========================================================================= */
export const WalletConnectedScreen: React.FC = () => {
  const { setAuthStage, walletAddress } = useAuth();
  const { copyToClipboard } = useToast();

  const displayAddress = walletAddress || '0x3a56D4869c9b4e1837015E5aE4F4D3C5237F2B';
  const shortAddress = `${displayAddress.slice(0, 6)}...${displayAddress.slice(-4)}`;

  return (
    <div className="min-h-screen w-full bg-[#000000] flex flex-col items-center justify-between p-4 py-8 select-none font-sans text-white">
      {/* Top Header */}
      <div className="w-full max-w-[420px] flex items-center justify-between pt-2">
        <button type="button" onClick={() => setAuthStage('LANDING')} className="text-slate-400 hover:text-white">
          <Menu size={20} />
        </button>
        <MoneyXLogo size="sm" glow />
        <Globe size={18} className="text-slate-400" />
      </div>

      {/* Main Content matching Screen 4 */}
      <div className="w-full max-w-[400px] flex flex-col items-center text-center space-y-6 my-auto">
        
        {/* Large Green Checkmark with Festive Confetti particles */}
        <div className="relative">
          {/* Confetti particles */}
          <div className="absolute -top-4 -left-6 text-xl animate-bounce">🎉</div>
          <div className="absolute -top-3 -right-6 text-lg animate-pulse">✨</div>
          <div className="absolute -bottom-2 -left-4 text-sm animate-pulse text-[#00ffa3]">✦</div>
          <div className="absolute -bottom-2 -right-4 text-sm animate-pulse text-[#00ffa3]">✦</div>

          <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-[#00ffa3] shadow-[0_0_40px_rgba(0,255,163,0.45)] flex items-center justify-center text-[#00ffa3]">
            <Check size={48} className="stroke-[3.5]" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Wallet Connected <br />
            Successfully!
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Your wallet has been connected to Money X.
          </p>
        </div>

        {/* Wallet Address Card matching Screen 4 */}
        <div className="w-full p-4 rounded-2xl bg-[#09110c] border border-[#16221a] flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            {/* MetaMask Logo */}
            <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center shrink-0 p-1">
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
              <span className="text-[11px] text-slate-400 block font-medium">Wallet Address</span>
              <span className="text-sm font-mono font-bold text-white">{shortAddress}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => copyToClipboard(displayAddress, 'Wallet Address')}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <Copy size={16} />
          </button>
        </div>

        {/* Primary Continue Button matching Screen 4 */}
        <button
          type="button"
          onClick={() => setAuthStage('SET_PASSCODE')}
          className="w-full py-4 rounded-2xl bg-[#00e699] hover:bg-[#00ffa3] active:scale-[0.98] text-black font-black text-sm tracking-tight transition-all shadow-xl shadow-[#00e699]/30 cursor-pointer"
        >
          Continue
        </button>

      </div>

      <div className="h-4" />
    </div>
  );
};

/* ========================================================================= */
/* SCREEN 5: "Set Passcode (6 digit)"                                        */
/* ========================================================================= */
export const SetPasscodeScreen: React.FC = () => {
  const { setAuthStage } = useAuth();
  const [pin, setPin] = useState<string>('');

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      const next = pin + num;
      setPin(next);
      if (next.length === 6) {
        // Save temporary first PIN in session and advance to Screen 6: Confirm Passcode
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('temp_first_passcode', next);
        }
        setTimeout(() => {
          setAuthStage('CONFIRM_PASSCODE');
        }, 300);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <div className="min-h-screen w-full bg-[#000000] flex flex-col items-center justify-between p-4 py-8 select-none font-sans text-white">
      {/* Top Header */}
      <div className="w-full max-w-[420px] flex items-center justify-between pt-2">
        <button type="button" onClick={() => setAuthStage('WALLET_CONNECTED')} className="text-slate-400 hover:text-white">
          <Menu size={20} />
        </button>
        <MoneyXLogo size="sm" glow />
        <Globe size={18} className="text-slate-400" />
      </div>

      {/* Main Container matching Screen 5 */}
      <div className="w-full max-w-[360px] flex flex-col items-center text-center space-y-6 my-auto">
        
        {/* Glowing Padlock Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-[#00ffa3]/40 shadow-[0_0_30px_rgba(0,255,163,0.3)] flex items-center justify-center text-[#00ffa3]">
          <Lock size={30} className="stroke-[2.5]" />
        </div>

        {/* Heading */}
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white tracking-tight">
            Set Your Passcode
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Create a 6-digit passcode to secure your account on this device. You will need this to access the app.
          </p>
        </div>

        {/* 6 Dots Indicator matching Screen 5 */}
        <div className="flex items-center gap-3.5 py-2">
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                pin.length > idx
                  ? 'bg-[#00ffa3] scale-110 shadow-[0_0_12px_rgba(0,255,163,0.8)]'
                  : 'border border-slate-600 bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Tactile Keypad matching Screen 5 */}
        <div className="w-full grid grid-cols-3 gap-3 pt-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit.toString())}
              className="h-14 rounded-2xl bg-[#0c140f] border border-[#16241a] text-xl font-bold text-white hover:bg-[#122017] active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-xs"
            >
              {digit}
            </button>
          ))}
          <div />
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="h-14 rounded-2xl bg-[#0c140f] border border-[#16241a] text-xl font-bold text-white hover:bg-[#122017] active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-xs"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-[#0c140f] border border-[#16241a] text-slate-400 hover:text-white hover:bg-[#122017] active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-xs"
            aria-label="Backspace"
          >
            <X size={20} className="stroke-[2.5]" />
          </button>
        </div>

      </div>

      <div className="h-4" />
    </div>
  );
};

/* ========================================================================= */
/* SCREEN 6: "Confirm Passcode"                                              */
/* ========================================================================= */
export const ConfirmPasscodeScreen: React.FC = () => {
  const { setAuthStage, setupPasscode } = useAuth();
  const [pin, setPin] = useState<string>('');
  const [errorShake, setErrorShake] = useState<boolean>(false);

  const handleKeyPress = async (num: string) => {
    if (pin.length < 6) {
      const next = pin + num;
      setPin(next);

      if (next.length === 6) {
        const expected = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('temp_first_passcode') : '';
        if (expected && next === expected) {
          // Success! Save authoritative passcode
          await setupPasscode(next);
          setTimeout(() => {
            setAuthStage('PASSCODE_SUCCESS');
          }, 300);
        } else {
          // Mismatch
          setErrorShake(true);
          setTimeout(() => {
            setPin('');
            setErrorShake(false);
          }, 600);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <div className="min-h-screen w-full bg-[#000000] flex flex-col items-center justify-between p-4 py-8 select-none font-sans text-white">
      {/* Top Header */}
      <div className="w-full max-w-[420px] flex items-center justify-between pt-2">
        <button type="button" onClick={() => setAuthStage('SET_PASSCODE')} className="text-slate-400 hover:text-white">
          <Menu size={20} />
        </button>
        <MoneyXLogo size="sm" glow />
        <Globe size={18} className="text-slate-400" />
      </div>

      {/* Main Container matching Screen 6 */}
      <div className="w-full max-w-[360px] flex flex-col items-center text-center space-y-6 my-auto">
        
        {/* Glowing Padlock Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-[#00ffa3]/40 shadow-[0_0_30px_rgba(0,255,163,0.3)] flex items-center justify-center text-[#00ffa3]">
          <Lock size={30} className="stroke-[2.5]" />
        </div>

        {/* Heading */}
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white tracking-tight">
            Confirm Passcode
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Enter the same 6-digit passcode again to confirm.
          </p>
        </div>

        {/* 6 Dots Indicator matching Screen 6 */}
        <div className={`flex items-center gap-3.5 py-2 ${errorShake ? 'animate-shake' : ''}`}>
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                pin.length > idx
                  ? errorShake
                    ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]'
                    : 'bg-[#00ffa3] scale-110 shadow-[0_0_12px_rgba(0,255,163,0.8)]'
                  : 'border border-slate-600 bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Tactile Keypad matching Screen 6 */}
        <div className="w-full grid grid-cols-3 gap-3 pt-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit.toString())}
              className="h-14 rounded-2xl bg-[#0c140f] border border-[#16241a] text-xl font-bold text-white hover:bg-[#122017] active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-xs"
            >
              {digit}
            </button>
          ))}
          <div />
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="h-14 rounded-2xl bg-[#0c140f] border border-[#16241a] text-xl font-bold text-white hover:bg-[#122017] active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-xs"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-[#0c140f] border border-[#16241a] text-slate-400 hover:text-white hover:bg-[#122017] active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-xs"
            aria-label="Backspace"
          >
            <X size={20} className="stroke-[2.5]" />
          </button>
        </div>

      </div>

      <div className="h-4" />
    </div>
  );
};

/* ========================================================================= */
/* SCREEN 7: "Passcode Success"                                              */
/* ========================================================================= */
export const PasscodeSuccessScreen: React.FC = () => {
  const { setAuthStage, walletAddress, user } = useAuth();

  const handleContinueToDashboard = () => {
    // Save authentication session cookie
    const activeAddr = walletAddress || user?.walletAddress || '0x3a56D4869c9b4e1837015E5aE4F4D3C5237F2B';
    cookieService.saveAuthSession({
      token: `moneyx_sec_${Date.now()}`,
      walletAddress: activeAddr,
      passcodeConfigured: true,
      userId: user?.id || 'MX-829104',
    });

    setAuthStage('AUTHENTICATED');
  };

  return (
    <div className="min-h-screen w-full bg-[#000000] flex flex-col items-center justify-between p-4 py-8 select-none font-sans text-white">
      <div className="w-full max-w-[420px] flex items-center justify-between pt-2">
        <button type="button" onClick={() => setAuthStage('LANDING')} className="text-slate-400 hover:text-white">
          <Menu size={20} />
        </button>
        <MoneyXLogo size="sm" glow />
        <Globe size={18} className="text-slate-400" />
      </div>

      {/* Main Container matching Screen 7 */}
      <div className="w-full max-w-[390px] flex flex-col items-center text-center space-y-6 my-auto">
        
        {/* Large Celebratory Green Checkmark with Green Aura */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-[#00ffa3] shadow-[0_0_45px_rgba(0,255,163,0.5)] flex items-center justify-center text-[#00ffa3]">
            <Check size={48} className="stroke-[3.5]" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Passcode Created <br />
            Successfully!
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Your device is now secured. Use this passcode to access the app.
          </p>
        </div>

        {/* Primary Continue to Dashboard Button matching Screen 7 */}
        <button
          type="button"
          onClick={handleContinueToDashboard}
          className="w-full py-4 rounded-2xl bg-[#00e699] hover:bg-[#00ffa3] active:scale-[0.98] text-black font-black text-sm tracking-tight transition-all shadow-xl shadow-[#00e699]/30 cursor-pointer"
        >
          Continue to Dashboard
        </button>

      </div>

      <div className="h-4" />
    </div>
  );
};

/* ========================================================================= */
/* SCREEN 8 & 9: "App Lock Screen (Next time open)" & "Wrong Passcode"       */
/* ========================================================================= */
export const AppLockScreen: React.FC = () => {
  const { verifyPasscode, setAuthStage } = useAuth();
  const [pin, setPin] = useState<string>('');
  const [isWrongState, setIsWrongState] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const handleKeyPress = async (num: string) => {
    if (isVerifying || pin.length >= 6) return;

    const next = pin + num;
    setPin(next);

    if (next.length === 6) {
      setIsVerifying(true);
      const res = await verifyPasscode(next);
      if (res.success) {
        // Unlocked!
        setAuthStage('AUTHENTICATED');
      } else {
        // Screen 9: Wrong Passcode Error State
        setIsWrongState(true);
        setTimeout(() => {
          setPin('');
          setIsWrongState(false);
          setIsVerifying(false);
        }, 900);
      }
    }
  };

  const handleDelete = () => {
    if (isVerifying) return;
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <div className="min-h-screen w-full bg-[#000000] flex flex-col items-center justify-between p-4 py-8 select-none font-sans text-white">
      {/* Top Header with Money X Logo matching Screen 8 & 9 */}
      <div className="pt-2">
        <MoneyXLogo size="md" glow />
      </div>

      {/* Main Container matching Screen 8 & 9 */}
      <div className="w-full max-w-[360px] flex flex-col items-center text-center space-y-6 my-auto">
        
        {/* Padlock Icon: Green in Screen 8, Red in Screen 9 */}
        <div
          className={`w-16 h-16 rounded-full border flex items-center justify-center transition-all duration-300 ${
            isWrongState
              ? 'bg-rose-500/20 border-rose-500 text-rose-500 shadow-[0_0_35px_rgba(244,63,94,0.6)] animate-shake'
              : 'bg-emerald-500/15 border-[#00ffa3]/40 text-[#00ffa3] shadow-[0_0_30px_rgba(0,255,163,0.3)]'
          }`}
        >
          <Lock size={30} className="stroke-[2.5]" />
        </div>

        {/* Heading */}
        <div className="space-y-1">
          {isWrongState ? (
            <>
              <h2 className="text-2xl font-black text-rose-500 tracking-tight animate-shake">
                Wrong Passcode
              </h2>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Please enter the correct passcode to unlock the app.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Enter Your Passcode
              </h2>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Enter 6-digit passcode to unlock
              </p>
            </>
          )}
        </div>

        {/* 6 Dots Indicator */}
        <div className={`flex items-center gap-3.5 py-2 ${isWrongState ? 'animate-shake' : ''}`}>
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                isWrongState
                  ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.9)]'
                  : pin.length > idx
                  ? 'bg-[#00ffa3] scale-110 shadow-[0_0_12px_rgba(0,255,163,0.8)]'
                  : 'border border-slate-600 bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Tactile Keypad matching Screen 8 & 9 */}
        <div className="w-full grid grid-cols-3 gap-3 pt-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit.toString())}
              className="h-14 rounded-2xl bg-[#0c140f] border border-[#16241a] text-xl font-bold text-white hover:bg-[#122017] active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-xs"
            >
              {digit}
            </button>
          ))}
          <div />
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="h-14 rounded-2xl bg-[#0c140f] border border-[#16241a] text-xl font-bold text-white hover:bg-[#122017] active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-xs"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-[#0c140f] border border-[#16241a] text-slate-400 hover:text-white hover:bg-[#122017] active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-xs"
            aria-label="Backspace"
          >
            <X size={20} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Forgot Passcode Link matching Screen 8 & 9 */}
        <button
          type="button"
          onClick={() => setAuthStage('WALLET_OPTIONS')}
          className="text-xs font-bold text-[#00ffa3] hover:underline pt-1 cursor-pointer"
        >
          Forgot Passcode?
        </button>

      </div>

      <div className="h-4" />
    </div>
  );
};

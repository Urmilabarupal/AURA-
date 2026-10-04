/*
 FILE: src/components/common/AuthFlowNav.tsx

 PURPOSE:
 Dedicated interactive Stage Navigator for:
 1. Wallet Connect (Screenshot 1)
 2. Passcode Setup (Screenshot 2)
 3. Screen Lock / PIN Keypad (Screenshot 3)
 4. Dashboard (Screenshot 6+)

 RESPONSIBILITIES:
 - Allow direct 1-click preview and navigation between all 3 initial security/auth screens
 - Highlight active step in the Master Authentication Flow
 - Provide helpful tooltips and demo quick-action helpers

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React from 'react';
import { useAuth, AuthStage } from '../../context/AuthContext';
import { KeyRound, LayoutDashboard, Lock, ShieldCheck, Wallet } from 'lucide-react';

export const AuthFlowNav: React.FC = () => {
  const { authStage, setAuthStage, refreshUserData } = useAuth();

  const steps: { stage: AuthStage; label: string; icon: React.ElementType; sub: string }[] = [
    { stage: 'UNAUTHENTICATED', label: '1. Wallet Connect', icon: Wallet, sub: 'Connect Web3 Wallet' },
    { stage: 'SETUP_PASSCODE', label: '2. Create Passcode', icon: KeyRound, sub: 'Set 4-6 Digit PIN' },
    { stage: 'LOCKED', label: '3. Screen Lock', icon: Lock, sub: 'Keypad PIN Unlock' },
    { stage: 'AUTHENTICATED', label: '4. Dashboard', icon: LayoutDashboard, sub: 'Financial Portal' },
  ];

  const handleStepClick = async (targetStage: AuthStage) => {
    if (targetStage === 'AUTHENTICATED') {
      await refreshUserData();
    }
    setAuthStage(targetStage);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-6 px-3">
      <div className="p-2 rounded-2xl bg-[#08080a]/90 backdrop-blur-md border border-[#232b45] shadow-xl flex items-center justify-between gap-1 overflow-x-auto">
        {steps.map((s) => {
          const Icon = s.icon;
          const isActive = authStage === s.stage;

          return (
            <button
              key={s.stage}
              onClick={() => handleStepClick(s.stage)}
              className={`flex-1 min-w-[125px] py-2 px-2.5 rounded-xl transition-all text-center flex flex-col items-center gap-1 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-pink-500/20 via-purple-600/30 to-blue-600/20 border border-purple-500/50 shadow-md text-white'
                  : 'hover:bg-[#1a2036] text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Icon size={14} className={isActive ? 'text-[#00e699]' : 'text-slate-500'} />
                <span className="text-[11px] font-bold tracking-tight">{s.label}</span>
              </div>
              <span className="text-[9px] text-slate-400 font-medium truncate max-w-[120px]">
                {s.sub}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

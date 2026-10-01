/*
 FILE: src/App.tsx

 PURPOSE:
 Root Application Component & Top-Level State Orchestrator.
 Coordinates authentication stages, security gating, and layout transitions.

 RESPONSIBILITIES:
 - Provide AuthProvider context wrapper
 - Orchestrate Step 1 through Step 13 of Master Authentication Flow:
   1. Unauthenticated -> Wallet Connect & Sign Up (Screenshot 1)
   2. Setup Passcode -> Create & Confirm PIN (Screenshot 2)
   3. Locked -> Enter PIN Keypad (Screenshot 3)
   4. Authenticated -> MainLayout with Security Advisory Modal & Dashboard (Screenshots 4 - 46)

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import { LandingPage } from './pages/landing/LandingPage';
import { ConnectSignUp } from './pages/auth/ConnectSignUp';
import { CreatePasscode } from './pages/auth/CreatePasscode';
import { EnterPasscode } from './pages/auth/EnterPasscode';
import { MainLayout } from './components/layout/MainLayout';
import { Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { authStage, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#141722] flex flex-col items-center justify-center text-slate-300 space-y-3">
        <Loader2 size={32} className="animate-spin text-purple-500" />
        <span className="text-xs font-mono font-medium text-slate-400">
          Initializing Secure Session...
        </span>
      </div>
    );
  }

  switch (authStage) {
    case 'LANDING':
      return <LandingPage />;
    case 'UNAUTHENTICATED':
      return <ConnectSignUp />;
    case 'SETUP_PASSCODE':
      return <CreatePasscode />;
    case 'LOCKED':
      return <EnterPasscode />;
    case 'AUTHENTICATED':
    default:
      return <MainLayout />;
  }
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

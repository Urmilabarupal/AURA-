/*
 FILE: src/App.tsx

 PURPOSE:
 Root Application Component & Strict Authentication Gatekeeper.
 Coordinates authentication stages, security gating, and layout transitions.

 SECURITY ENFORCEMENT:
 - Without login, the dashboard CANNOT open under any circumstances.
 - Bottom navigation dock is strictly hidden on unauthenticated screens.
 - Only verified, passcode-authenticated sessions are admitted into the MainLayout shell.
*/

import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import { LandingPage } from './pages/landing/LandingPage';
import { ConnectSignUp } from './pages/auth/ConnectSignUp';
import { CreatePasscode } from './pages/auth/CreatePasscode';
import { EnterPasscode } from './pages/auth/EnterPasscode';
import { MainLayout } from './components/layout/MainLayout';
import { Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { authStage, user, isLoading, setAuthStage, refreshUserData } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#000000] dark:bg-[#000000] light:bg-[#f8fafc] flex flex-col items-center justify-center text-slate-300 space-y-3">
        <Loader2 size={32} className="animate-spin text-[#00e699]" />
        <span className="text-xs font-mono font-medium text-slate-400">
          Initializing Secure Protocol Session...
        </span>
      </div>
    );
  }

  // Do not falsely report a disconnected wallet after a successful passcode.
  // Retry the server-backed profile/session read first; only ask for a new
  // wallet signature if the backend says the session is actually unauthenticated.
  if (authStage === 'AUTHENTICATED' && !user) {
    return (
      <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center gap-4 px-6 text-center text-slate-200">
        <p className="text-sm">Your wallet session was accepted, but the dashboard profile is still loading. Please retry before reconnecting your wallet.</p>
        <button
          type="button"
          onClick={() => { void refreshUserData(); }}
          className="rounded-full bg-[#00e699] px-5 py-3 font-semibold text-black"
        >
          Retry dashboard
        </button>
        <button
          type="button"
          onClick={() => setAuthStage('LOCKED')}
          className="rounded-full border border-[#00e699]/50 px-5 py-3 font-semibold text-[#00e699]"
        >
          Return to passcode
        </button>
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
      return <MainLayout />;
    default:
      return <LandingPage />;
  }
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

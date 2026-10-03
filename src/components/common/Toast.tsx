/*
 FILE: src/components/common/Toast.tsx

 PURPOSE:
 High-fidelity, smooth floating toast notification feedback system.
 Supports success, info, and error notifications with icon indicators,
 auto-dismissal, and custom action/message feedback.

 ACCESSIBILITY & SECURITY:
 - Safe text rendering
 - Smooth animate-in/out transitions
 - Fixed z-index layering above modals and headers
*/

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, Copy, X } from 'lucide-react';

interface ToastItem {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'copy';
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'copy', duration?: number) => void;
  copyToClipboard: (text: string, label?: string) => Promise<boolean>;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' | 'copy' = 'success', duration = 3000) => {
      const id = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setToasts((prev) => [...prev, { id, message, type, duration }]);

      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  const copyToClipboard = useCallback(
    async (text: string, label: string = 'Wallet address'): Promise<boolean> => {
      try {
        if (!text) return false;
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          // Fallback for non-secure / restricted environments
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }
        showToast(`${label} copied to clipboard!`, 'copy', 2800);
        return true;
      } catch (err) {
        console.error('Failed to copy text: ', err);
        showToast(`Failed to copy ${label.toLowerCase()}`, 'error', 3000);
        return false;
      }
    },
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, copyToClipboard }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => {
          let bgClass = 'bg-[#181d2e] border-[#2e3754] text-slate-100';
          let icon = <CheckCircle2 className="text-emerald-400 w-4 h-4 shrink-0" />;

          if (toast.type === 'copy') {
            bgClass = 'bg-[#181d30] border-purple-500/40 text-slate-100 shadow-purple-950/40';
            icon = <Copy className="text-[#00e699] w-4 h-4 shrink-0" />;
          } else if (toast.type === 'error') {
            bgClass = 'bg-[#2a1318] border-red-800/60 text-red-200 shadow-red-950/40';
            icon = <AlertCircle className="text-red-400 w-4 h-4 shrink-0" />;
          } else if (toast.type === 'info') {
            bgClass = 'bg-[#141d2f] border-blue-800/60 text-blue-200 shadow-blue-950/40';
            icon = <Info className="text-blue-400 w-4 h-4 shrink-0" />;
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-md transition-all duration-300 animate-slideUp ${bgClass}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {icon}
                <span className="text-xs font-medium tracking-wide truncate">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors shrink-0"
              >
                <X size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

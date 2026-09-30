/*
 FILE: src/components/common/EmptyState.tsx

 PURPOSE:
 Standardized empty state component matching reference screenshots.
 Fulfills Rule 2 (Implement All States) and Section 24 (Data States).

 RESPONSIBILITIES:
 - Render uniform "Data Not Found" empty illustration and message
 - Provide optional action button (e.g. "See More", "Reset", "Deposit")
 - Adapt cleanly to small cards, large tables, and full-screen viewports

 RELATED:
 Used across Transactions, Wallets, Portfolio, Royalty, Blogging, Staking,
 Community, and Jackpot modules.

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React from 'react';
import { Database, FolderSearch, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Data Not Found',
  description = 'The requested information is currently unavailable',
  actionText,
  onAction,
  className = '',
  compact = false,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-[#121626]/80 border border-[#1e253b] ${className}`}
    >
      {/* Visual illustration resembling reference screenshots' cloud/box mascot */}
      <div className="relative mb-5 flex items-center justify-center">
        <div className="w-24 h-20 rounded-3xl bg-gradient-to-b from-[#242b45] to-[#151a2d] border border-[#2b3557] flex items-center justify-center shadow-inner shadow-black/40">
          <div className="relative flex items-center gap-1.5 opacity-60">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
            <div className="w-4 h-1.5 rounded-full bg-slate-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
          </div>
        </div>
        <div className="absolute -bottom-2 w-16 h-2 bg-black/40 rounded-full blur-xs"></div>
      </div>

      <h3 className="text-lg font-semibold text-slate-200 tracking-wide mb-1.5">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-4">{description}</p>

      {actionText && (
        <button
          onClick={onAction}
          className="px-6 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 shadow-md shadow-indigo-900/30 transition-all flex items-center gap-2"
        >
          <RefreshCw size={13} className="animate-spin-slow" />
          {actionText}
        </button>
      )}
    </div>
  );
};

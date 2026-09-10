import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="offline-status-banner"
      className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto z-50 flex items-center gap-2.5 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-medium text-white shadow-lg border border-amber-500/50 backdrop-blur-md animate-in fade-in"
    >
      <WifiOff className="w-4 h-4 shrink-0 animate-pulse" strokeWidth={1.75} />
      <span>Offline Mode — Cached data and local calculators active.</span>
    </div>
  );
};

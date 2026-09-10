import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { WifiOff } from 'lucide-react';

interface DashboardHeaderProps {
  name: string;
  city: string;
  country: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ name, city, country }) => {
  const today = new Date();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return (
    <header className="mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight font-display">
          Good morning, {name}.
        </h1>
        <div className="flex items-center gap-2 mt-1.5 text-stone-500 font-medium text-sm flex-wrap">
          {city && country && (
            <>
              <span className="flex items-center gap-1.5 text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {city}, {country}
              </span>
              <span>·</span>
            </>
          )}
          <span>{format(today, 'd MMM')}</span>
          <span>·</span>
          <span>{format(today, 'HH:mm')} Local</span>
        </div>
      </div>
      
      {isOffline && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 text-stone-600 rounded-lg text-xs font-bold uppercase tracking-wider shrink-0">
          <WifiOff className="w-3.5 h-3.5" />
          Offline Mode
        </div>
      )}
    </header>
  );
};

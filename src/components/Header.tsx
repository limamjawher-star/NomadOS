import React, { useState, useEffect } from 'react';
import {
  Compass,
  Clock,
  MapPin,
  Download,
  Upload,
  RotateCcw,
  Shield,
  Briefcase,
  Layers,
} from 'lucide-react';
import { NomadState } from '../types';
import { getCountryFlag } from '../utils/formatters';

interface HeaderProps {
  state: NomadState;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  schengenUsed: number;
}

export const Header: React.FC<HeaderProps> = ({
  state,
  activeTab,
  setActiveTab,
  onExport,
  onImport,
  onReset,
  schengenUsed,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedUTC = currentTime.toUTCString().slice(17, 25) + ' UTC';
  const localFormatted = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const tabs = [
    { id: 'schengen', label: 'Schengen 90/180', icon: Shield, badge: `${schengenUsed}/90d` },
    { id: 'tax', label: 'Tax Presence', icon: Compass, badge: '183-Day' },
    { id: 'itinerary', label: 'Itinerary & Stays', icon: MapPin, badge: `${state.trips.length}` },
    { id: 'timezones', label: 'Team World Clock', icon: Clock },
    { id: 'expenses', label: 'Nomad Expenses', icon: Briefcase },
    { id: 'vault', label: 'Docs & Vault', icon: Layers, badge: `${state.documents.length}` },
  ];

  return (
    <header className="border-b border-stone-800 bg-stone-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          {/* Logo and Nomad Status */}
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold shadow-inner">
              <Compass className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-stone-100 font-mono">NomadOS</span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  v2.6
                </span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Remote Online</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5">
                <span className="flex items-center gap-1">
                  <span>{getCountryFlag(state.currentCountryCode)}</span>
                  <span className="text-stone-200 font-medium">{state.currentCity}, {state.currentCountry}</span>
                </span>
                <span>•</span>
                <span className="font-mono text-stone-300">{localFormatted} Local</span>
                <span className="text-stone-500">({formattedUTC})</span>
              </div>
            </div>
          </div>

          {/* Quick Actions / Storage Backup */}
          <div className="flex items-center gap-2">
            <button
              id="export-data-btn"
              onClick={onExport}
              title="Export NomadOS state as JSON"
              className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-700 bg-stone-800/80 hover:bg-stone-700 text-stone-300 flex items-center gap-1.5 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Backup</span>
            </button>

            <label
              htmlFor="import-data-input"
              title="Import JSON backup"
              className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-700 bg-stone-800/80 hover:bg-stone-700 text-stone-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Restore</span>
              <input
                id="import-data-input"
                type="file"
                accept=".json"
                onChange={onImport}
                className="hidden"
              />
            </label>

            <button
              id="reset-data-btn"
              onClick={onReset}
              title="Reset to default sample data"
              className="p-1.5 text-xs rounded-lg border border-stone-700 bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-stone-200 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none border-t border-stone-800/80 pt-2" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50 border border-transparent'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold ${
                      isActive
                        ? 'bg-amber-400/20 text-amber-200'
                        : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

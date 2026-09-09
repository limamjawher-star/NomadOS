import React from 'react';
import { Globe, Crown, User, ShieldCheck, Sparkles, Smartphone, Monitor } from 'lucide-react';
import { NomadUser } from '../types';

interface TopBarProps {
  user: NomadUser;
  viewMode: 'landing' | 'app';
  deviceMode: 'web' | 'ios' | 'android';
  onSetViewMode: (mode: 'landing' | 'app') => void;
  onSetDeviceMode: (device: 'web' | 'ios' | 'android') => void;
  onOpenPricing: () => void;
  onOpenAuth: () => void;
  onOpenOnboarding: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  user,
  viewMode,
  deviceMode,
  onSetViewMode,
  onSetDeviceMode,
  onOpenPricing,
  onOpenAuth,
  onOpenOnboarding,
}) => {
  return (
    <header
      id="top-app-header"
      className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-4 py-2.5 transition-all"
    >
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div 
          onClick={() => onSetViewMode('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-orange-600 text-white flex items-center justify-center text-sm shadow-xs group-hover:scale-105 transition-all">
            <Globe className="w-4 h-4" strokeWidth={1.75} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-semibold text-stone-900 tracking-tight">
                Nomad<span className="text-orange-600">OS</span>
              </span>
              <span className="px-1.5 py-0.5 bg-orange-50 border border-orange-200/80 text-orange-700 text-[10px] font-semibold rounded-md uppercase tracking-wider">
                {viewMode === 'landing' ? '2026' : 'App'}
              </span>
            </div>
            <span className="text-[9px] font-medium text-stone-400 uppercase tracking-wider block leading-none">
              Location-Independent Operating System
            </span>
          </div>
        </div>

        {/* Center: Device & Mode Switcher */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200/80 text-xs">
          <button
            onClick={() => onSetViewMode('landing')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'landing'
                ? 'bg-orange-500 text-white shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900 font-medium'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span className="hidden sm:inline">Landing</span>
          </button>

          <button
            onClick={() => {
              onSetViewMode('app');
              onSetDeviceMode('web');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'app' && deviceMode === 'web'
                ? 'bg-orange-500 text-white shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900 font-medium'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span className="hidden sm:inline">Web Workspace</span>
          </button>

          <button
            onClick={() => {
              onSetViewMode('app');
              onSetDeviceMode('ios');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'app' && deviceMode === 'ios'
                ? 'bg-orange-500 text-white shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900 font-medium'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>iPhone 16</span>
          </button>

          <button
            onClick={() => {
              onSetViewMode('app');
              onSetDeviceMode('android');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'app' && deviceMode === 'android'
                ? 'bg-orange-500 text-white shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900 font-medium'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Pixel 9</span>
          </button>
        </div>

        {/* Right Actions: Account & Cloud Sync Status (No duplicate Upgrade Pro button) */}
        <div className="flex items-center gap-2">
          {user.isPro && (
            <span className="px-2.5 py-1 bg-orange-50 border border-orange-200/80 text-orange-700 text-[11px] font-semibold rounded-full flex items-center gap-1">
              <Crown className="w-3 h-3 text-orange-600" strokeWidth={1.75} />
              <span>PRO</span>
            </span>
          )}

          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 p-1 pl-2.5 rounded-full border border-stone-200/80 hover:border-orange-400 bg-white hover:bg-stone-50 transition-all shadow-xs group cursor-pointer"
            title="Account & Cloud Sync"
          >
            <span className="text-xs font-medium text-stone-800 truncate max-w-[80px]">
              {user.name}
            </span>
            <div className="relative">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 group-hover:ring-orange-500 transition-all"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

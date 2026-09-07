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
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-500 via-orange-600 to-amber-500 text-white flex items-center justify-center font-black text-base shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-all">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black text-slate-900 tracking-tight font-display">
                Nomad<span className="text-orange-500">OS</span>
              </span>
              <span className="px-1.5 py-0.5 bg-orange-50 border border-orange-100/80 text-orange-700 text-[10px] font-black rounded-md uppercase tracking-wider">
                {viewMode === 'landing' ? '2026' : 'App'}
              </span>
            </div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block leading-none">
              Location-Independent Operating System
            </span>
          </div>
        </div>

        {/* Center: Device & Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 text-xs shadow-inner">
          <button
            onClick={() => onSetViewMode('landing')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'landing'
                ? 'bg-orange-500 text-white shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Landing</span>
          </button>

          <button
            onClick={() => {
              onSetViewMode('app');
              onSetDeviceMode('web');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'app' && deviceMode === 'web'
                ? 'bg-orange-500 text-white shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Web Workspace</span>
          </button>

          <button
            onClick={() => {
              onSetViewMode('app');
              onSetDeviceMode('ios');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'app' && deviceMode === 'ios'
                ? 'bg-orange-500 text-white shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iPhone 16</span>
          </button>

          <button
            onClick={() => {
              onSetViewMode('app');
              onSetDeviceMode('android');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'app' && deviceMode === 'android'
                ? 'bg-orange-500 text-white shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Pixel 9</span>
          </button>
        </div>

        {/* Right Actions: Account & Cloud Sync Status (No duplicate Upgrade Pro button) */}
        <div className="flex items-center gap-2">
          {user.isPro && (
            <span className="px-2.5 py-1 bg-orange-50 border border-orange-200/80 text-orange-700 text-[11px] font-black rounded-full flex items-center gap-1">
              <Crown className="w-3 h-3 text-orange-600" />
              <span>PRO</span>
            </span>
          )}

          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 p-1 pl-2.5 rounded-full border border-slate-200/90 hover:border-orange-400 bg-white hover:bg-slate-50 transition-all shadow-sm group"
            title="Account & Cloud Sync"
          >
            <span className="text-xs font-bold text-slate-800 truncate max-w-[80px]">
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

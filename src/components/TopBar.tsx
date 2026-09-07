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
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 py-2.5"
    >
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div 
          onClick={() => onSetViewMode('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-purple-600/30 group-hover:scale-105 transition-transform">
            🌐
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black text-stone-900 tracking-tight">NomadOS</span>
              {viewMode === 'app' && (
                <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-black rounded">
                  APP
                </span>
              )}
            </div>
            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block leading-none">
              Remote Worker Operating System
            </span>
          </div>
        </div>

        {/* Center: Device & Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-stone-100/90 p-1 rounded-2xl border border-stone-200/80 text-xs">
          <button
            onClick={() => onSetViewMode('landing')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'landing'
                ? 'bg-white text-purple-700 shadow-sm font-black'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>🌐</span>
            <span className="hidden sm:inline">Landing Page</span>
          </button>

          <button
            onClick={() => {
              onSetViewMode('app');
              onSetDeviceMode('web');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'app' && deviceMode === 'web'
                ? 'bg-purple-600 text-white shadow-sm font-black'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Web App</span>
          </button>

          <button
            onClick={() => {
              onSetViewMode('app');
              onSetDeviceMode('ios');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'app' && deviceMode === 'ios'
                ? 'bg-purple-600 text-white shadow-sm font-black'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iOS</span>
          </button>

          <button
            onClick={() => {
              onSetViewMode('app');
              onSetDeviceMode('android');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'app' && deviceMode === 'android'
                ? 'bg-purple-600 text-white shadow-sm font-black'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>🤖</span>
            <span>Android</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {!user.isPro ? (
            <button
              onClick={onOpenPricing}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-black rounded-full shadow-md shadow-purple-600/20 flex items-center gap-1.5 transition-all transform active:scale-95"
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>Pro</span>
            </button>
          ) : (
            <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black rounded-full flex items-center gap-1">
              👑 PRO
            </span>
          )}

          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 p-1 pl-2.5 rounded-full border border-stone-200 hover:border-purple-400 bg-stone-50 hover:bg-white transition-all shadow-sm"
            title="Account & Auth"
          >
            <span className="text-xs font-bold text-stone-800 truncate max-w-[80px]">
              {user.name}
            </span>
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-purple-500"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { Crown, Sparkles, User, Bell, Globe, Monitor, Smartphone } from 'lucide-react';
import { NomadState } from '../types';
import { Logo } from './Logo';
import { TopSearchBar } from './TopSearchBar';

interface TopHeaderProps {
  state: NomadState;
  onNavigateTab: (tab: 'home' | 'travel' | 'finance' | 'explore' | 'social' | 'me') => void;
  onOpenPricing: () => void;
  onOpenAddExpense?: () => void;
  deviceMode?: 'web' | 'ios' | 'android';
  onSetDeviceMode?: (mode: 'web' | 'ios' | 'android') => void;
  onViewLanding?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  state,
  onNavigateTab,
  onOpenPricing,
  onOpenAddExpense,
  deviceMode = 'web',
  onSetDeviceMode,
  onViewLanding,
}) => {
  return (
    <header
      id="nomados-top-header"
      className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 shadow-xs"
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: NomadOS Brand Logo */}
        <div 
          onClick={() => onNavigateTab('home')}
          className="cursor-pointer shrink-0"
          title="Go to Home"
        >
          <Logo size="sm" showBadge={false} />
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md mx-auto">
          <TopSearchBar
            state={state}
            onNavigateTab={onNavigateTab}
            onOpenAddExpense={onOpenAddExpense}
            onOpenPricing={onOpenPricing}
          />
        </div>

        {/* Right: Actions, Device Toggle, Upgrade & Avatar */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Landing Page Preview Button */}
          {onViewLanding && (
            <button
              id="top-header-landing-btn"
              onClick={onViewLanding}
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-slate-200 hover:border-orange-300 hover:bg-orange-50 text-slate-600 hover:text-orange-600 text-xs font-semibold transition-all shadow-2xs"
              title="Preview Landing Page"
            >
              <Globe className="w-3.5 h-3.5 text-orange-500" />
              <span>Landing Page</span>
            </button>
          )}

          {/* Device Simulator Toggle */}
          {onSetDeviceMode && (
            <div className="hidden lg:flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200 text-xs">
              <button
                onClick={() => onSetDeviceMode('web')}
                className={`p-1.5 rounded-full transition-colors ${
                  deviceMode === 'web' 
                    ? 'bg-white text-orange-600 shadow-2xs font-bold' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Full Web View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onSetDeviceMode('ios')}
                className={`p-1.5 rounded-full transition-colors ${
                  deviceMode === 'ios' 
                    ? 'bg-white text-orange-600 shadow-2xs font-bold' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="iPhone Simulator View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Upgrade to Pro Button */}
          {!state.user.isPro ? (
            <button
              id="top-header-upgrade-btn"
              onClick={onOpenPricing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-full shadow-sm shadow-orange-500/20 transition-all active:scale-95"
            >
              <Crown className="w-3.5 h-3.5 text-orange-200" />
              <span className="hidden sm:inline">Upgrade</span>
            </button>
          ) : (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-orange-50 border border-orange-200 text-orange-700 text-[11px] font-bold rounded-full">
              <Crown className="w-3 h-3 text-orange-600" />
              <span>PRO</span>
            </span>
          )}

          {/* Profile Avatar */}
          <button
            id="top-header-profile-btn"
            onClick={() => onNavigateTab('me')}
            className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-slate-200 hover:ring-orange-500 transition-all shadow-xs shrink-0"
            title="Passport & Settings"
          >
            <img 
              src={state.user.avatarUrl} 
              alt={state.user.name} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover" 
            />
          </button>
        </div>
      </div>
    </header>
  );
};

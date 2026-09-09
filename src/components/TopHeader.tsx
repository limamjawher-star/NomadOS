import React from 'react';
import { Crown, Monitor, Smartphone, Globe, Database } from 'lucide-react';
import { NomadState } from '../types';
import { Logo } from './Logo';
import { TopSearchBar } from './TopSearchBar';
import { isSupabaseConfigured } from '../lib/supabase';

interface TopHeaderProps {
  state: NomadState;
  onNavigateTab: (tab: 'home' | 'travel' | 'finance' | 'explore' | 'social' | 'me') => void;
  onOpenPricing: () => void;
  onOpenAddExpense?: () => void;
  deviceMode?: 'web' | 'ios' | 'android';
  onSetDeviceMode?: (mode: 'web' | 'ios' | 'android') => void;
  onViewLanding?: () => void;
  onOpenWelcomeMobile?: () => void;
  onOpenSupabase?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  state,
  onNavigateTab,
  onOpenPricing,
  onOpenAddExpense,
  deviceMode = 'web',
  onSetDeviceMode,
  onViewLanding,
  onOpenWelcomeMobile,
  onOpenSupabase,
}) => {
  return (
    <header
      id="nomados-top-header"
      className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-3 sm:px-4 py-2 sm:py-2.5 shadow-xs"
      style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top, 0px))' }}
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
          {/* Supabase Cloud Button */}
          {onOpenSupabase && (
            <button
              id="top-header-supabase-btn"
              onClick={onOpenSupabase}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border text-xs font-semibold transition-all shadow-xs cursor-pointer ${
                isSupabaseConfigured()
                  ? 'border-emerald-200/90 bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-700'
                  : 'border-stone-200/80 bg-stone-50 hover:bg-stone-100 text-stone-600'
              }`}
              title="Supabase Cloud Database & OAuth"
            >
              <Database className={`w-3.5 h-3.5 ${isSupabaseConfigured() ? 'text-emerald-600' : 'text-stone-500'}`} strokeWidth={1.75} />
              <span className="hidden sm:inline">Supabase</span>
              {isSupabaseConfigured() && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>
          )}

          {/* Web & Mobile App Button */}
          {onOpenWelcomeMobile && (
            <button
              id="top-header-mobile-btn"
              onClick={onOpenWelcomeMobile}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border border-orange-200/90 bg-orange-50/70 hover:bg-orange-100/80 text-orange-700 text-xs font-semibold transition-all shadow-xs cursor-pointer"
              title="Web App & Mobile App (PWA)"
            >
              <Smartphone className="w-3.5 h-3.5 text-orange-600" strokeWidth={1.75} />
              <span className="hidden sm:inline">Web & Mobile App</span>
              <span className="sm:hidden">App</span>
            </button>
          )}

          {/* Landing Page Preview Button */}
          {onViewLanding && (
            <button
              id="top-header-landing-btn"
              onClick={onViewLanding}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200/80 hover:border-orange-300 hover:bg-orange-50 text-stone-600 hover:text-orange-600 text-xs font-medium transition-all shadow-xs cursor-pointer"
              title="Preview Landing Page"
            >
              <Globe className="w-3.5 h-3.5 text-orange-500" strokeWidth={1.75} />
              <span>Landing Page</span>
            </button>
          )}

          {/* Device Simulator Toggle */}
          {onSetDeviceMode && (
            <div className="hidden lg:flex items-center bg-stone-100 p-0.5 rounded-full border border-stone-200/80 text-xs">
              <button
                onClick={() => onSetDeviceMode('web')}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  deviceMode === 'web' 
                    ? 'bg-white text-orange-600 shadow-xs font-semibold' 
                    : 'text-stone-500 hover:text-stone-900'
                }`}
                title="Full Web View"
              >
                <Monitor className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
              <button
                onClick={() => onSetDeviceMode('ios')}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  deviceMode === 'ios' 
                    ? 'bg-white text-orange-600 shadow-xs font-semibold' 
                    : 'text-stone-500 hover:text-stone-900'
                }`}
                title="iPhone Simulator View"
              >
                <Smartphone className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            </div>
          )}

          {/* Upgrade to Pro Button */}
          {!state.user.isPro ? (
            <button
              id="top-header-upgrade-btn"
              onClick={onOpenPricing}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-full shadow-xs transition-colors cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 text-orange-200" strokeWidth={1.75} />
              <span className="hidden sm:inline">Upgrade</span>
            </button>
          ) : (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-orange-50 border border-orange-200 text-orange-700 text-[11px] font-semibold rounded-full">
              <Crown className="w-3 h-3 text-orange-600" strokeWidth={1.75} />
              <span>PRO</span>
            </span>
          )}

          {/* Profile Avatar */}
          <button
            id="top-header-profile-btn"
            onClick={() => onNavigateTab('me')}
            className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-stone-200 hover:ring-orange-500 transition-all shadow-xs shrink-0 cursor-pointer"
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


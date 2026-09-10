import React from 'react';
import { Crown, User } from 'lucide-react';
import { NomadState } from '../../types';
import { Logo } from '../ui/Logo';
import { TopSearchBar } from '../../features/explore/TopSearchBar';

interface TopHeaderProps {
  state: NomadState;
  onNavigateTab: (tab: 'home' | 'travel' | 'finance' | 'explore' | 'social' | 'me') => void;
  onOpenPricing: () => void;
  onOpenAddExpense?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  state,
  onNavigateTab,
  onOpenPricing,
  onOpenAddExpense,
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
            className="w-8 h-8 rounded-full bg-stone-200 overflow-hidden ring-2 ring-stone-200 hover:ring-orange-500 transition-all shadow-xs shrink-0 cursor-pointer flex items-center justify-center text-stone-500 relative"
            title="Passport & Settings"
          >
            {state.user.avatarUrl && state.user.avatarUrl.trim() !== '' && (
              <img 
                src={state.user.avatarUrl} 
                alt={state.user.name || 'User'} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover absolute inset-0" 
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            )}
            {state.user.name ? (
              <span className="text-[10px] font-bold text-stone-700">{state.user.name.charAt(0).toUpperCase()}</span>
            ) : (
              <User className="w-4 h-4" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};


import React from 'react';
import { Crown, Sparkles, User, Bell } from 'lucide-react';
import { NomadState } from '../types';
import { Logo } from './Logo';
import { TopSearchBar } from './TopSearchBar';

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
      className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 shadow-xs"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Left: NomadOS Brand Logo */}
        <div 
          onClick={() => onNavigateTab('home')}
          className="cursor-pointer shrink-0"
        >
          <Logo size="sm" showBadge={false} />
        </div>

        {/* Center: Centered Search Bar */}
        <div className="flex-1 max-w-md mx-auto">
          <TopSearchBar
            state={state}
            onNavigateTab={onNavigateTab}
            onOpenAddExpense={onOpenAddExpense}
            onOpenPricing={onOpenPricing}
          />
        </div>

        {/* Right: Pro Pill & Profile Avatar */}
        <div className="flex items-center gap-2 shrink-0">
          {!state.user.isPro ? (
            <button
              id="top-header-upgrade-btn"
              onClick={onOpenPricing}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-full shadow-sm shadow-orange-500/20 transition-all active:scale-95"
            >
              <Crown className="w-3.5 h-3.5 text-orange-200" />
              <span>Upgrade</span>
            </button>
          ) : (
            <span className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-orange-50 border border-orange-200 text-orange-700 text-[11px] font-bold rounded-full">
              <Crown className="w-3 h-3 text-orange-600" />
              <span>PRO</span>
            </span>
          )}

          <button
            onClick={() => onNavigateTab('me')}
            className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-slate-200 hover:ring-orange-500 transition-all shadow-xs"
            title="Passport & Settings"
          >
            <img 
              src={state.user.avatarUrl} 
              alt={state.user.name} 
              className="w-full h-full object-cover" 
            />
          </button>
        </div>
      </div>
    </header>
  );
};

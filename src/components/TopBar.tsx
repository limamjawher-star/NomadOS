import React from 'react';
import { Globe, Crown, User, ShieldCheck, Sparkles } from 'lucide-react';
import { NomadUser } from '../types';

interface TopBarProps {
  user: NomadUser;
  onOpenPricing: () => void;
  onOpenAuth: () => void;
  onOpenOnboarding: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  user,
  onOpenPricing,
  onOpenAuth,
  onOpenOnboarding,
}) => {
  return (
    <header
      id="top-app-header"
      className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 py-3"
    >
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <span className="text-base font-black text-stone-900 tracking-tight">NomadOS</span>
            <span className="text-[9px] font-bold text-orange-600 uppercase tracking-widest block leading-none">
              Global Nomad Operating System
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {!user.isPro ? (
            <button
              onClick={onOpenPricing}
              className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black rounded-full shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition-all transform active:scale-95"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Upgrade</span>
            </button>
          ) : (
            <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black rounded-full flex items-center gap-1">
              👑 PRO
            </span>
          )}

          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 p-1 pl-2.5 rounded-full border border-stone-200 hover:border-orange-400 bg-stone-50 hover:bg-white transition-all shadow-sm"
            title="Account & Auth"
          >
            <span className="text-xs font-bold text-stone-800 truncate max-w-[80px]">
              {user.name}
            </span>
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-orange-500"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

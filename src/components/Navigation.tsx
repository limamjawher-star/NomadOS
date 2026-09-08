import React from 'react';
import { 
  Home, 
  Plane, 
  Wallet, 
  Compass, 
  MessageSquare, 
  User,
  Sparkles
} from 'lucide-react';

interface NavigationProps {
  activeTab: 'home' | 'travel' | 'finance' | 'explore' | 'social' | 'me';
  onSelectTab: (tab: 'home' | 'travel' | 'finance' | 'explore' | 'social' | 'me') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'travel', label: 'Travel', icon: Plane, badge: '28d' },
    { id: 'finance', label: 'Finance', icon: Wallet },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'social', label: 'Community', icon: MessageSquare, badge: '1' },
    { id: 'me', label: 'Passport', icon: User },
  ] as const;

  return (
    <div className="sticky bottom-2.5 sm:bottom-4 z-40 px-2 sm:px-4 pointer-events-none w-full max-w-xl mx-auto">
      <nav
        id="bottom-navigation-bar"
        className="pointer-events-auto bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-[0_12px_36px_-6px_rgba(15,23,42,0.12),0_2px_8px_rgba(15,23,42,0.04)] p-1.5 flex items-center justify-between gap-1 transition-all"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const badge = 'badge' in tab ? tab.badge : null;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center flex-1 py-2 px-1.5 rounded-xl sm:rounded-2xl transition-all duration-200 group active:scale-95 font-normal ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 scale-[1.02]'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'stroke-[2] scale-105' : 'stroke-[1.75] group-hover:scale-105'
                  }`}
                />
                
                {/* Micro-badge */}
                {badge && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 px-1 py-0.2 rounded-full text-[9px] font-semibold tracking-tighter shadow-xs ${
                      isActive
                        ? 'bg-white text-orange-600 ring-1 ring-orange-400'
                        : 'bg-orange-500 text-white'
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] mt-1 tracking-tight leading-none truncate max-w-full font-normal ${
                  isActive ? 'text-white' : 'text-slate-600 group-hover:text-slate-900'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

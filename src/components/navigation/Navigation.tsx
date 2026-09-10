import React from 'react';
import { 
  Home, 
  Plane, 
  Wallet, 
  Compass, 
  MessageSquare,
  Sparkles,
  User
} from 'lucide-react';

interface NavigationProps {
  activeTab: 'home' | 'travel' | 'finance' | 'explore' | 'social' | 'me' | 'ai';
  onSelectTab: (tab: 'home' | 'travel' | 'finance' | 'explore' | 'social' | 'me' | 'ai') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'travel', label: 'Travel', icon: Plane, badge: '28d' },
    { id: 'finance', label: 'Finance', icon: Wallet },
    { id: 'ai', label: 'Intelligence', icon: Sparkles },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'social', label: 'Community', icon: MessageSquare, badge: '1' },
    { id: 'me', label: 'Passport', icon: User },
  ] as const;

  return (
    <div 
      className="sticky z-40 px-3 sm:px-4 pointer-events-none w-full max-w-2xl mx-auto"
      style={{ bottom: 'max(0.6rem, env(safe-area-inset-bottom, 0px))' }}
    >
      <nav
        id="bottom-navigation-bar"
        className="pointer-events-auto bg-white/95 backdrop-blur-md border border-stone-200/80 rounded-2xl shadow-lg p-1 sm:p-1.5 flex items-center justify-between gap-0.5 sm:gap-1 transition-all"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const badge = 'badge' in tab ? tab.badge : null;
          
          const isAI = tab.id === 'ai';

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onSelectTab(tab.id as any)}
              className={`relative flex flex-col items-center justify-center flex-1 min-h-[46px] sm:min-h-[48px] py-1.5 px-1 rounded-xl transition-all duration-150 select-none cursor-pointer ${
                isActive
                  ? isAI ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-xs' : 'bg-stone-900 text-white shadow-xs'
                  : isAI ? 'text-orange-500 hover:text-orange-600 hover:bg-orange-50' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100/70 active:bg-stone-100'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  strokeWidth={1.75}
                  className={`w-[19px] h-[19px] sm:w-5 sm:h-5 transition-transform duration-150 ${
                    isActive 
                      ? 'text-white' 
                      : isAI ? 'text-orange-500' : 'text-stone-500'
                  }`}
                />
                
                {/* Micro-badge */}
                {badge && (
                  <span
                    className="absolute -top-1 -right-2.5 px-1.5 py-0.2 rounded-full text-[8.5px] sm:text-[9px] font-semibold tracking-tight shadow-xs bg-orange-500 text-white"
                  >
                    {badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[9.5px] sm:text-[10px] mt-1 tracking-tight leading-none truncate max-w-full font-medium ${
                  isActive ? 'text-white font-semibold' : isAI ? 'text-orange-600' : 'text-stone-500'
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


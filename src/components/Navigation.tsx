import React from 'react';
import { Home, Plane, Wallet, Compass, MessageSquare, User } from 'lucide-react';

interface NavigationProps {
  activeTab: 'home' | 'travel' | 'finance' | 'explore' | 'social' | 'me';
  onSelectTab: (tab: 'home' | 'travel' | 'finance' | 'explore' | 'social' | 'me') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'travel', label: 'Travel', icon: Plane },
    { id: 'finance', label: 'Finance', icon: Wallet },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'social', label: 'Community', icon: MessageSquare },
    { id: 'me', label: 'Passport', icon: User },
  ] as const;

  return (
    <nav
      id="bottom-navigation-bar"
      className="sticky bottom-0 z-40 bg-white/90 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(15,23,42,0.06)] py-2 px-3"
    >
      <div className="max-w-md mx-auto flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-orange-600 font-extrabold'
                  : 'text-slate-400 hover:text-slate-700 font-medium'
              }`}
            >
              <div className={`relative p-1 rounded-xl transition-all ${isActive ? 'bg-orange-50 text-orange-600' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-orange-600 rounded-full border-2 border-white" />
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-extrabold text-orange-600' : 'font-semibold text-slate-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

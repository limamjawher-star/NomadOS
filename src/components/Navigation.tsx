import React from 'react';
import { Home, Plane, Compass, MessageSquare, User } from 'lucide-react';

interface NavigationProps {
  activeTab: 'home' | 'travel' | 'explore' | 'social' | 'me';
  onSelectTab: (tab: 'home' | 'travel' | 'explore' | 'social' | 'me') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'travel', label: 'Travel', icon: Plane },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'social', label: 'Social', icon: MessageSquare },
    { id: 'me', label: 'Me', icon: User },
  ] as const;

  return (
    <nav
      id="bottom-navigation-bar"
      className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 shadow-lg py-1.5 px-4"
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
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive
                  ? 'text-orange-600 font-bold scale-105'
                  : 'text-stone-400 hover:text-stone-600 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-600 rounded-full" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight font-extrabold">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

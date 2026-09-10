import { create } from 'zustand';

interface UIStore {
  viewMode: 'landing' | 'app';
  activeTab: 'home' | 'travel' | 'finance' | 'explore' | 'social' | 'me';
  isOnboardingOpen: boolean;
  isPricingOpen: boolean;
  isAuthOpen: boolean;
  toastMessage: string | null;
  
  setViewMode: (mode: 'landing' | 'app') => void;
  setActiveTab: (tab: 'home' | 'travel' | 'finance' | 'explore' | 'social' | 'me') => void;
  setIsOnboardingOpen: (isOpen: boolean) => void;
  setIsPricingOpen: (isOpen: boolean) => void;
  setIsAuthOpen: (isOpen: boolean) => void;
  showToast: (message: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  viewMode: 'app',
  activeTab: 'home',
  isOnboardingOpen: false,
  isPricingOpen: false,
  isAuthOpen: false,
  toastMessage: null,

  setViewMode: (mode) => set({ viewMode: mode }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setIsOnboardingOpen: (isOpen) => set({ isOnboardingOpen: isOpen }),
  setIsPricingOpen: (isOpen) => set({ isPricingOpen: isOpen }),
  setIsAuthOpen: (isOpen) => set({ isAuthOpen: isOpen }),
  showToast: (message) => {
    set({ toastMessage: message });
    setTimeout(() => {
      set({ toastMessage: null });
    }, 3000);
  }
}));

import React, { useState, useEffect } from 'react';
import { 
  NomadState, 
  NomadUser, 
  NomadCity, 
  TripDestination, 
  SchengenStay, 
  NomadExpense 
} from './types';
import { INITIAL_NOMAD_DATA } from './data/defaultData';
import { TopBar } from './components/TopBar';
import { Navigation } from './components/Navigation';
import { HomeDashboard } from './components/HomeDashboard';
import { ExploreTab } from './components/ExploreTab';
import { ProfileTab } from './components/ProfileTab';
import { TravelTab } from './components/TravelTab';
import { SocialTab } from './components/SocialTab';
import { OnboardingModal } from './components/OnboardingModal';
import { PricingModal } from './components/PricingModal';
import { AuthModal } from './components/AuthModal';

const STORAGE_KEY = 'nomados_state_v2';

export function App() {
  const [state, setState] = useState<NomadState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure user structure exists
        if (parsed && parsed.user) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to load state from localStorage:', err);
    }
    return INITIAL_NOMAD_DATA;
  });

  const [activeTab, setActiveTab] = useState<'home' | 'travel' | 'explore' | 'social' | 'me'>('home');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('Failed to save state:', err);
    }
  }, [state]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // User Profile Handlers
  const handleUpdateUser = (updated: Partial<NomadUser>) => {
    setState((prev) => ({
      ...prev,
      user: { ...prev.user, ...updated },
    }));
    showToast('Profile updated!');
  };

  const handleUpgradePro = (plan: 'yearly' | 'monthly') => {
    setState((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        isPro: true,
        subscriptionPlan: plan,
      },
    }));
    showToast(`Upgraded to NomadOS Pro (${plan})! 👑`);
  };

  const handleSignIn = (userData: Partial<NomadUser>) => {
    setState((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        ...userData,
      },
    }));
    showToast(`Welcome back, ${userData.name || 'Nomad'}!`);
  };

  const handleAddCountryVisited = (code: string) => {
    if (!state.user.countriesVisited.includes(code)) {
      setState((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          countriesVisited: [...prev.user.countriesVisited, code],
        },
      }));
      showToast(`Added ${code} to visited countries! 🌐`);
    }
  };

  // Location and Events
  const handleSetCity = (city: string) => {
    setState((prev) => ({
      ...prev,
      currentCity: city,
    }));
    showToast(`Current location set to ${city} 📍`);
  };

  const handleToggleEventRSVP = (eventId: string) => {
    setState((prev) => ({
      ...prev,
      events: prev.events.map((ev) => {
        if (ev.id === eventId) {
          const isAttending = !ev.isAttending;
          return {
            ...ev,
            isAttending,
            attendeesCount: isAttending ? ev.attendeesCount + 1 : Math.max(0, ev.attendeesCount - 1),
          };
        }
        return ev;
      }),
    }));
    showToast('RSVP status updated!');
  };

  const handleAddEvent = (title: string, date: string, city: string) => {
    const newEvent = {
      id: `ev-${Date.now()}`,
      title,
      city,
      country: state.currentCountry || 'Portugal',
      date,
      time: '18:00',
      location: `${city} Nomad Coworking Cafe`,
      attendeesCount: 1,
      isAttending: true,
      hostName: state.user.name,
      hostAvatar: state.user.avatarUrl,
      category: 'Coffee' as const,
    };
    setState((prev) => ({
      ...prev,
      events: [newEvent, ...prev.events],
    }));
    showToast('Meetup created! Nomads in your city can now join.');
  };

  // Trips & Itinerary
  const handleAddTrip = (trip: TripDestination) => {
    setState((prev) => ({
      ...prev,
      trips: [...prev.trips, trip],
    }));
    showToast(`Added ${trip.city} to your itinerary! ✈️`);
  };

  const handleAddCityToTrip = (city: NomadCity) => {
    const newTrip: TripDestination = {
      id: `trip-${Date.now()}`,
      city: city.name,
      country: city.country,
      countryCode: city.countryCode,
      arrivalDate: '2026-11-01',
      departureDate: '2026-12-01',
      accommodationStatus: 'Searching',
      housingCostUSD: Math.round(city.costPerMonthUSD * 0.6),
      visaType: 'Tourist / Digital Nomad Visa',
      timezone: 'UTC',
      notes: `Discovered from Explore tab. Nomad Score: ${city.nomadScore}/100`,
    };
    setState((prev) => ({
      ...prev,
      trips: [...prev.trips, newTrip],
    }));
    showToast(`Added ${city.name} to your trips!`);
  };

  const handleDeleteTrip = (tripId: string) => {
    setState((prev) => ({
      ...prev,
      trips: prev.trips.filter((t) => t.id !== tripId),
    }));
    showToast('Trip stop removed');
  };

  // Schengen Stays
  const handleAddSchengenStay = (stay: SchengenStay) => {
    setState((prev) => ({
      ...prev,
      schengenStays: [stay, ...prev.schengenStays],
    }));
    showToast(`Recorded stay in ${stay.country}`);
  };

  const handleDeleteSchengenStay = (id: string) => {
    setState((prev) => ({
      ...prev,
      schengenStays: prev.schengenStays.filter((s) => s.id !== id),
    }));
    showToast('Schengen stay removed');
  };

  // Expenses
  const handleAddExpense = (expense: NomadExpense) => {
    setState((prev) => ({
      ...prev,
      expenses: [expense, ...prev.expenses],
    }));
    showToast(`Logged $${expense.amountUSD} for ${expense.description}`);
  };

  const handleDeleteExpense = (id: string) => {
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id),
    }));
    showToast('Expense removed');
  };

  // Tax Presence
  const handleUpdateTaxPresence = (id: string, days: number) => {
    setState((prev) => ({
      ...prev,
      taxPresences: prev.taxPresences.map((p) => (p.id === id ? { ...p, daysSpent: days } : p)),
    }));
    showToast('Updated tax presence days');
  };

  return (
    <div id="nomados-app-root" className="min-h-screen bg-[#f8f9fc] text-stone-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Header */}
      <TopBar
        user={state.user}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full">
        {activeTab === 'home' && (
          <HomeDashboard
            state={state}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenPricing={() => setIsPricingOpen(true)}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
            onToggleEventRSVP={handleToggleEventRSVP}
            onOpenCreateMeetup={() => setActiveTab('social')}
          />
        )}

        {activeTab === 'travel' && (
          <TravelTab
            state={state}
            onAddTrip={handleAddTrip}
            onDeleteTrip={handleDeleteTrip}
            onAddSchengenStay={handleAddSchengenStay}
            onDeleteSchengenStay={handleDeleteSchengenStay}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
            onUpdateTaxPresence={handleUpdateTaxPresence}
            onOpenPricing={() => setIsPricingOpen(true)}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreTab
            onAddCityToTrip={handleAddCityToTrip}
            onOpenPricing={() => setIsPricingOpen(true)}
            isPro={state.user.isPro}
          />
        )}

        {activeTab === 'social' && (
          <SocialTab
            state={state}
            onToggleEventRSVP={handleToggleEventRSVP}
            onAddEvent={handleAddEvent}
            onSetCity={handleSetCity}
          />
        )}

        {activeTab === 'me' && (
          <ProfileTab
            state={state}
            onUpdateUser={handleUpdateUser}
            onOpenPricing={() => setIsPricingOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onAddCountryVisited={handleAddCountryVisited}
          />
        )}
      </main>

      {/* Bottom Tab Bar Navigation */}
      <Navigation activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />

      {/* Modals */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        state={state}
        onUpdateUser={handleUpdateUser}
        onSetCity={handleSetCity}
        onAddEvent={handleAddEvent}
      />

      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        user={state.user}
        onUpgradePro={handleUpgradePro}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={state.user}
        onSignIn={handleSignIn}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          id="global-toast-notification"
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2"
        >
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

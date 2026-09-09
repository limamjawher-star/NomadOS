import React, { useState, useEffect } from 'react';
import { 
  NomadState, 
  NomadUser, 
  NomadCity, 
  TripDestination, 
  SchengenStay, 
  NomadExpense,
  NomadEvent
} from './types';
import { INITIAL_NOMAD_DATA } from './data/defaultData';
import { Navigation } from './components/Navigation';
import { HomeDashboard } from './components/HomeDashboard';
import { ExploreTab } from './components/ExploreTab';
import { ProfileTab } from './components/ProfileTab';
import { TravelTab } from './components/TravelTab';
import { SocialTab } from './components/SocialTab';
import { FinanceTab } from './components/FinanceTab';
import { TopHeader } from './components/TopHeader';
import { OnboardingModal } from './components/OnboardingModal';
import { PricingModal } from './components/PricingModal';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './components/LandingPage';
import { OfflineIndicator } from './components/OfflineIndicator';
import { 
  isSupabaseConfigured, 
  onAuthStateChange, 
  syncNomadStateToSupabase, 
  fetchNomadStateFromSupabase,
  signOutSupabase
} from './lib/supabase';
import { NomadIncomeStream, NomadFinancialGoal } from './types';

const STORAGE_KEY = 'nomados_state_v3';

export function App() {
  const [state, setState] = useState<NomadState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.user) {
          return {
            ...INITIAL_NOMAD_DATA,
            ...parsed,
            user: { ...INITIAL_NOMAD_DATA.user, ...parsed.user },
          };
        }
      }
    } catch (err) {
      console.warn('Failed to load state from localStorage:', err);
    }
    return INITIAL_NOMAD_DATA;
  });

  const [viewMode, setViewMode] = useState<'landing' | 'app'>('app');
  const [activeTab, setActiveTab] = useState<'home' | 'travel' | 'finance' | 'explore' | 'social' | 'me'>('home');
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

  // Supabase Auth State Change Listener & Remote Hydration
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        const metaName = user.user_metadata?.full_name || user.user_metadata?.name;
        const metaAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture;
        const emailTag = user.email ? `@${user.email.split('@')[0]}` : undefined;

        setState((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            name: metaName || prev.user.name,
            avatarUrl: metaAvatar || prev.user.avatarUrl,
            tag: user.user_metadata?.tag || emailTag || prev.user.tag,
          },
        }));

        // Fetch remote state from Supabase if present
        const remote = await fetchNomadStateFromSupabase();
        if (remote) {
          setState((prev) => ({
            ...prev,
            ...remote,
            user: { ...prev.user, ...(remote.user || {}) },
          }));
          setToastMessage('Synced with Supabase Cloud');
          setTimeout(() => setToastMessage(null), 3000);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Debounced auto-sync to Supabase Cloud on changes
  useEffect(() => {
    if (isSupabaseConfigured()) {
      const timer = setTimeout(() => {
        syncNomadStateToSupabase(state);
      }, 1500);
      return () => clearTimeout(timer);
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
    showToast(`Upgraded to NomadOS Pro (${plan})`);
  };

  const handleSignIn = (userData: Partial<NomadUser>) => {
    setState((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        ...userData,
      },
    }));
    showToast(`Welcome, ${userData.name || 'Nomad'}!`);
  };

  const handleSignOut = async () => {
    try {
      await signOutSupabase();
      localStorage.removeItem(STORAGE_KEY);
      setState(INITIAL_NOMAD_DATA);
      setViewMode('landing');
      showToast('Signed out successfully');
    } catch (err) {
      console.error(err);
      showToast('Failed to sign out');
    }
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
      showToast(`Added ${code} to visited countries`);
    }
  };

  // Location and Events
  const handleSetCity = (city: string) => {
    setState((prev) => ({
      ...prev,
      currentCity: city,
    }));
    showToast(`Current location set to ${city}`);
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
            attendeesCount: isAttending ? ev.attendeesCount + 1 : ev.attendeesCount - 1,
          };
        }
        return ev;
      }),
    }));
    const event = state.events.find((e) => e.id === eventId);
    showToast(event?.isAttending ? 'RSVP cancelled' : 'RSVP confirmed');
  };

  const handleAddEvent = (title: string, date: string, city: string) => {
    const newEvent: NomadEvent = {
      id: `ev-${Date.now()}`,
      title,
      city,
      country: state.currentCountry,
      date,
      time: '18:00',
      location: `${city} Digital Nomad Hub`,
      category: 'Coffee',
      attendeesCount: 1,
      isAttending: true,
      hostName: state.user.name,
      hostAvatar: state.user.avatarUrl,
    };
    setState((prev) => ({
      ...prev,
      events: [newEvent, ...prev.events],
    }));
    showToast('Meetup published. Other nomads can now RSVP.');
  };

  // Trips Management
  const handleAddTrip = (newTrip: TripDestination) => {
    setState((prev) => ({
      ...prev,
      trips: [...prev.trips, newTrip],
    }));
    showToast(`Added ${newTrip.city} to your itinerary`);
  };

  const handleDeleteTrip = (tripId: string) => {
    setState((prev) => ({
      ...prev,
      trips: prev.trips.filter((t) => t.id !== tripId),
    }));
    showToast('Trip destination removed');
  };

  const handleAddCityToTrip = (city: NomadCity) => {
    const newTrip: TripDestination = {
      id: `trip-${Date.now()}`,
      city: city.name,
      country: city.country,
      countryCode: city.countryCode,
      arrivalDate: '2026-11-01',
      departureDate: '2026-11-30',
      accommodationStatus: 'Searching',
      housingCostUSD: city.costPerMonthUSD,
      visaType: 'Digital Nomad Visa / Waiver',
      timezone: 'UTC',
      notes: `Planned stop via NomadOS Explore. Internet: ${city.internetSpeedMbps}Mbps`,
    };
    handleAddTrip(newTrip);
    setActiveTab('travel');
    setViewMode('app');
  };

  // Schengen Stays
  const handleAddSchengenStay = (stay: SchengenStay) => {
    setState((prev) => ({
      ...prev,
      schengenStays: [...prev.schengenStays, stay],
    }));
    showToast(`Recorded stay in ${stay.country}`);
  };

  const handleDeleteSchengenStay = (id: string) => {
    setState((prev) => ({
      ...prev,
      schengenStays: prev.schengenStays.filter((s) => s.id !== id),
    }));
    showToast('Schengen stay entry removed');
  };

  // Expenses Management
  const handleAddExpense = (expense: NomadExpense) => {
    setState((prev) => ({
      ...prev,
      expenses: [expense, ...prev.expenses],
    }));
    showToast(`Expense logged: $${expense.amountUSD}`);
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
      taxPresences: prev.taxPresences.map((tp) => (tp.id === id ? { ...tp, daysSpent: days } : tp)),
    }));
    showToast('Tax residency days updated');
  };

  // Financial Planning Handlers
  const handleAddIncome = (income: NomadIncomeStream) => {
    setState((prev) => ({
      ...prev,
      incomes: [income, ...prev.incomes],
    }));
    showToast(`Income stream added: +$${income.monthlyAmountUSD}/mo`);
  };

  const handleDeleteIncome = (id: string) => {
    setState((prev) => ({
      ...prev,
      incomes: prev.incomes.filter((i) => i.id !== id),
    }));
    showToast('Income stream removed');
  };

  const handleUpdateGoal = (goalId: string, addedAmount: number) => {
    setState((prev) => ({
      ...prev,
      financialGoals: prev.financialGoals.map((g) =>
        g.id === goalId ? { ...g, currentUSD: g.currentUSD + addedAmount } : g
      ),
    }));
    showToast(`Deposited $${addedAmount} towards goal`);
  };

  const handleAddGoal = (goal: NomadFinancialGoal) => {
    setState((prev) => ({
      ...prev,
      financialGoals: [goal, ...prev.financialGoals],
    }));
    showToast(`New goal created: ${goal.title}`);
  };

  const handleUpdateTaxBuffer = (percentage: number) => {
    setState((prev) => ({
      ...prev,
      taxBufferPercentage: percentage,
    }));
    showToast(`Tax reserve buffer updated to ${percentage}%`);
  };

  const handleUpdateMonthlyBudget = (budgetUSD: number) => {
    setState((prev) => ({
      ...prev,
      monthlyBudgetUSD: budgetUSD,
    }));
    showToast(`Monthly budget set to $${budgetUSD}`);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">

      {/* Main View: Landing Page OR App Workspace */}
      {viewMode === 'landing' ? (
        <main className="flex-1 w-full">
          <LandingPage
            state={state}
            onLaunchApp={(tab) => {
              setViewMode('app');
              if (tab) setActiveTab(tab);
            }}
            onOpenPricing={() => setIsPricingOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
          />
        </main>
      ) : (
        /* App Workspace - Responsive layout for web and mobile screens */
        <div className="w-full min-h-screen bg-stone-50 flex flex-col">
          {/* Centered Top Search Bar & Header */}
          <TopHeader
            state={state}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenPricing={() => setIsPricingOpen(true)}
          />

          <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-24 sm:pb-28">
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

            {activeTab === 'finance' && (
              <FinanceTab
                state={state}
                onAddExpense={handleAddExpense}
                onDeleteExpense={handleDeleteExpense}
                onAddIncome={handleAddIncome}
                onDeleteIncome={handleDeleteIncome}
                onUpdateGoal={handleUpdateGoal}
                onAddGoal={handleAddGoal}
                onUpdateTaxBuffer={handleUpdateTaxBuffer}
                onUpdateMonthlyBudget={handleUpdateMonthlyBudget}
                onOpenPricing={() => setIsPricingOpen(true)}
              />
            )}

            {activeTab === 'explore' && (
              <ExploreTab
                state={state}
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
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'me' && (
              <ProfileTab
                state={state}
                onUpdateUser={handleUpdateUser}
                onOpenPricing={() => setIsPricingOpen(true)}
                onOpenAuth={() => setIsAuthOpen(true)}
                onSignOut={handleSignOut}
                onAddCountryVisited={handleAddCountryVisited}
                onViewLanding={() => setViewMode('landing')}
              />
            )}
          </main>

          {/* Bottom Tab Bar Navigation */}
          <Navigation activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />
        </div>
      )}

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

      {/* Connectivity Status for PWA / Offline usage */}
      <OfflineIndicator />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div
          id="global-toast-notification"
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-stone-900/95 text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 backdrop-blur-md border border-stone-700/50"
        >
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

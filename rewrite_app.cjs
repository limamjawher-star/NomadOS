const fs = require('fs');

const appTsxContent = `import React, { useEffect, useState } from 'react';
import { useNomadStore } from '../stores/useNomadStore';
import { Navigation } from '../components/navigation/Navigation';
import { HomeDashboard } from '../features/dashboard/HomeDashboard';
import { ExploreTab } from '../features/explore/ExploreTab';
import { ProfileTab } from '../features/profile/ProfileTab';
import { TravelTab } from '../features/travel/TravelTab';
import { SocialTab } from '../features/community/SocialTab';
import { FinanceTab } from '../features/finance/FinanceTab';
import { TopHeader } from '../components/layout/TopHeader';
import { OnboardingModal } from '../components/modals/OnboardingModal';
import { PricingModal } from '../components/modals/PricingModal';
import { AuthModal } from '../components/modals/AuthModal';
import { LandingPage } from './LandingPage';
import { OfflineIndicator } from '../components/feedback/OfflineIndicator';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { useAuth } from '../features/auth/AuthContext';
import { AppServices } from '../services/appServices';
import { SyncService } from '../services/syncService';
import { MigrationService } from '../services/migrationService';

export function App() {
  const storeState = useNomadStore();
  const { user: authUser, signOut } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'home'|'travel'|'finance'|'explore'|'social'|'me'>('home');
  const [viewMode, setViewMode] = useState<'landing'|'app'>(authUser ? 'app' : 'landing');
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Run migration and sync when user logs in
  useEffect(() => {
    if (authUser) {
      setViewMode('app');
      MigrationService.checkAndMigrate(authUser.id).then(() => {
        SyncService.syncAll(authUser.id);
      });
    } else {
      setViewMode('landing');
    }
  }, [authUser]);

  // Read data from Dexie
  const liveTrips = useLiveQuery(() => db.trips.where('deleted_at').equals(null).toArray(), []) || [];
  const liveExpenses = useLiveQuery(() => db.expenses.where('deleted_at').equals(null).toArray(), []) || [];
  const liveIncomes = useLiveQuery(() => db.income.where('deleted_at').equals(null).toArray(), []) || [];
  const liveSchengen = useLiveQuery(() => db.schengenStays.where('deleted_at').equals(null).toArray(), []) || [];
  const liveTax = useLiveQuery(() => db.taxPresence.where('deleted_at').equals(null).toArray(), []) || [];
  const liveGoals = useLiveQuery(() => db.goals.where('deleted_at').equals(null).toArray(), []) || [];

  // Re-map Dexie records back to expected UI types
  const state = {
    ...storeState,
    user: authUser ? { ...storeState.user, id: authUser.id, name: authUser.user_metadata?.first_name || 'Nomad' } : storeState.user,
    trips: liveTrips.map(t => ({ id: t.id, city: t.city, country: t.country, countryCode: t.country_code, arrivalDate: t.arrival_date, departureDate: t.departure_date, accommodationStatus: t.accommodation_status as any, housingCostUSD: t.housing_cost_usd, visaType: t.visa_type || '', timezone: t.timezone || 'UTC', coverUrl: t.cover_url, notes: t.notes })),
    expenses: liveExpenses.map(e => ({ id: e.id, date: e.date, description: e.description, category: e.category as any, amount: e.amount, currency: e.currency, amountUSD: e.amount_usd, isDeductible: e.is_deductible, notes: e.notes, receiptUrl: e.receipt_url })),
    incomes: liveIncomes.map(i => ({ id: i.id, source: i.source, type: i.type as any, monthlyAmountUSD: i.monthly_amount_usd, currency: i.currency, originalAmount: i.original_amount, clientCountry: i.client_country, taxable: i.taxable, notes: i.notes })),
    schengenStays: liveSchengen.map(s => ({ id: s.id, country: s.country, countryCode: s.country_code, entryDate: s.entry_date, exitDate: s.exit_date, notes: s.notes })),
    taxPresences: liveTax.map(t => ({ id: t.id, country: t.country, countryCode: t.country_code, daysSpent: t.days_spent, year: t.year, maxSafeDays: t.max_safe_days, maxDaysAllowed: t.max_days_allowed, taxResidencyRisk: t.tax_residency_risk as any, notes: t.notes })),
    financialGoals: liveGoals.map(g => ({ id: g.id, title: g.title, targetUSD: g.target_usd, currentUSD: g.current_usd, deadline: g.deadline, category: g.category as any, imageUrl: g.image_url || '' }))
  };

  // Handlers (writing to Dexie)
  const handleAddTrip = async (trip: any) => { 
    if(authUser) { await AppServices.addTrip(authUser.id, trip); SyncService.syncAll(authUser.id); }
    else storeState.addTrip(trip);
    showToast('Trip added!'); 
  };
  const handleDeleteTrip = async (id: any) => { 
    if(authUser) { await AppServices.deleteTrip(id); SyncService.syncAll(authUser.id); }
    else storeState.deleteTrip(id);
    showToast('Trip deleted!'); 
  };
  const handleAddExpense = async (exp: any) => { 
    if(authUser) { await AppServices.addExpense(authUser.id, exp); SyncService.syncAll(authUser.id); }
    else storeState.addExpense(exp);
    showToast(\`Expense logged: $\${exp.amountUSD}\`); 
  };
  const handleDeleteExpense = async (id: any) => { 
    if(authUser) { await AppServices.deleteExpense(id); SyncService.syncAll(authUser.id); }
    else storeState.deleteExpense(id);
    showToast('Expense removed'); 
  };
  const handleAddSchengenStay = async (stay: any) => { 
    if(authUser) { await AppServices.addSchengenStay(authUser.id, stay); SyncService.syncAll(authUser.id); }
    else storeState.addSchengenStay(stay);
    showToast(\`Recorded stay in \${stay.country}\`); 
  };
  const handleDeleteSchengenStay = async (id: any) => { 
    if(authUser) { await AppServices.deleteSchengenStay(id); SyncService.syncAll(authUser.id); }
    else storeState.deleteSchengenStay(id);
    showToast('Schengen stay entry removed'); 
  };
  const handleAddIncome = async (inc: any) => { 
    if(authUser) { await AppServices.addIncome(authUser.id, inc); SyncService.syncAll(authUser.id); }
    else storeState.addIncome(inc);
    showToast(\`Income stream added: +$\${inc.monthlyAmountUSD}/mo\`); 
  };
  const handleDeleteIncome = async (id: any) => { 
    if(authUser) { await AppServices.deleteIncome(id); SyncService.syncAll(authUser.id); }
    else storeState.deleteIncome(id);
    showToast('Income stream removed'); 
  };
  const handleUpdateGoal = async (id: any, amount: any) => { 
    if(authUser) { 
      const goal = liveGoals.find(g => g.id === id);
      if(goal) await AppServices.updateGoal(id, Math.min(goal.current_usd + amount, goal.target_usd));
      SyncService.syncAll(authUser.id);
    }
    else storeState.updateGoal(id, amount);
    showToast(\`Deposited $\${amount} towards goal\`); 
  };
  const handleAddGoal = async (goal: any) => { 
    if(authUser) { await AppServices.addGoal(authUser.id, goal); SyncService.syncAll(authUser.id); }
    else storeState.addGoal(goal);
    showToast(\`New goal created: \${goal.title}\`); 
  };
  
  const handleUpdateTaxPresence = async (id: any, days: any) => { 
    if(authUser) {
      const tp = state.taxPresences.find(t => t.id === id);
      if(tp) await AppServices.updateTaxPresence(authUser.id, { ...tp, daysSpent: days });
      SyncService.syncAll(authUser.id);
    }
    else storeState.updateTaxPresence(id, days);
    showToast('Tax residency days updated'); 
  };

  const handleUpdateUser = (updated: any) => { storeState.updateUser(updated); showToast('Profile updated!'); };
  const handleUpgradePro = (plan: any) => { storeState.upgradePro(plan); showToast('Upgraded to Pro!'); setIsPricingOpen(false); };
  const handleAddCityToTrip = (city: any) => { storeState.addCityToTrip(city); setActiveTab('travel'); setViewMode('app'); showToast('Added city to trips!'); };
  const handleUpdateTaxBuffer = (pct: any) => { storeState.updateTaxBuffer(pct); showToast(\`Tax reserve buffer updated to \${pct}%\`); };
  const handleUpdateMonthlyBudget = (bdg: any) => { storeState.updateMonthlyBudget(bdg); showToast(\`Monthly budget set to $\${bdg}\`); };
  
  const handleSignOut = async () => {
    await signOut();
    storeState.signOut();
    setViewMode('landing');
    showToast('Signed out successfully');
  };

  const handleSignIn = (userData: any) => {
    // Auth logic is handled within the modal, just close it
    setIsAuthOpen(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {viewMode === 'landing' ? (
        <main className="flex-1 w-full">
          <LandingPage
            state={state as any}
            onLaunchApp={(tab) => { setViewMode('app'); if (tab) setActiveTab(tab); }}
            onOpenPricing={() => setIsPricingOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
          />
        </main>
      ) : (
        <div className="w-full min-h-screen bg-stone-50 flex flex-col">
          <TopHeader state={state as any} onNavigateTab={setActiveTab} onOpenPricing={() => setIsPricingOpen(true)} />
          <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-24 sm:pb-28">
            {activeTab === 'home' && <HomeDashboard state={state as any} onNavigateTab={setActiveTab} onOpenPricing={() => setIsPricingOpen(true)} onOpenOnboarding={() => setIsOnboardingOpen(true)} onToggleEventRSVP={storeState.toggleEventRSVP} onOpenCreateMeetup={() => setActiveTab('social')} />}
            {activeTab === 'travel' && <TravelTab state={state as any} onAddTrip={handleAddTrip} onDeleteTrip={handleDeleteTrip} onAddSchengenStay={handleAddSchengenStay} onDeleteSchengenStay={handleDeleteSchengenStay} onAddExpense={handleAddExpense} onDeleteExpense={handleDeleteExpense} onUpdateTaxPresence={handleUpdateTaxPresence} onOpenPricing={() => setIsPricingOpen(true)} />}
            {activeTab === 'finance' && <FinanceTab state={state as any} onAddExpense={handleAddExpense} onDeleteExpense={handleDeleteExpense} onAddIncome={handleAddIncome} onDeleteIncome={handleDeleteIncome} onUpdateGoal={handleUpdateGoal} onAddGoal={handleAddGoal} onUpdateTaxBuffer={handleUpdateTaxBuffer} onUpdateMonthlyBudget={handleUpdateMonthlyBudget} onOpenPricing={() => setIsPricingOpen(true)} />}
            {activeTab === 'explore' && <ExploreTab state={state as any} onAddCityToTrip={handleAddCityToTrip} onOpenPricing={() => setIsPricingOpen(true)} isPro={state.user?.isPro || false} />}
            {activeTab === 'social' && <SocialTab state={state as any} onToggleEventRSVP={storeState.toggleEventRSVP} onAddEvent={storeState.addEvent} onSetCity={storeState.setCity} onNavigateTab={setActiveTab} />}
            {activeTab === 'me' && <ProfileTab state={state as any} onUpdateUser={handleUpdateUser} onOpenPricing={() => setIsPricingOpen(true)} onOpenAuth={() => setIsAuthOpen(true)} onSignOut={handleSignOut} onAddCountryVisited={storeState.addCountryVisited} onViewLanding={() => setViewMode('landing')} />}
          </main>
          <Navigation activeTab={activeTab} onSelectTab={setActiveTab} />
        </div>
      )}
      
      <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} onComplete={() => { setIsOnboardingOpen(false); storeState.setHasCompletedOnboarding(true); }} state={state as any} onUpdateUser={handleUpdateUser} onSetCity={storeState.setCity} onAddEvent={storeState.addEvent} />
      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} user={state.user} onUpgradePro={handleUpgradePro} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} currentUser={state.user} onSignIn={handleSignIn} />
      <OfflineIndicator />
      
      {toastMessage && (
        <div id="global-toast-notification" className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-stone-900/95 text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 backdrop-blur-md border border-stone-700/50">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync('src/app/App.tsx', appTsxContent, 'utf8');

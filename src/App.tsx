import React, { useState, useEffect } from 'react';
import { NomadState, SchengenStay, TaxPresence, TripDestination, TeamTimezone, NomadExpense, NomadDocCheck } from './types';
import { INITIAL_NOMAD_DATA } from './data/defaultData';
import { calculateSchengen } from './utils/schengenCalculator';
import { Header } from './components/Header';
import { SchengenTracker } from './components/SchengenTracker';
import { TaxPresenceTracker } from './components/TaxPresenceTracker';
import { ItineraryPlanner } from './components/ItineraryPlanner';
import { TimezoneMatrix } from './components/TimezoneMatrix';
import { ExpenseBurnRate } from './components/ExpenseBurnRate';
import { NomadVault } from './components/NomadVault';
import { MapPin, ShieldCheck, Compass, DollarSign, FileText } from 'lucide-react';
import { formatUSD } from './utils/formatters';

const STORAGE_KEY = 'nomados_state_v1';

export function App() {
  const [state, setState] = useState<NomadState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.warn('Failed to load NomadOS state from localStorage:', err);
    }
    return INITIAL_NOMAD_DATA;
  });

  const [activeTab, setActiveTab] = useState<string>('schengen');
  const [notification, setNotification] = useState<string | null>(null);

  // Save to localStorage on any state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('Failed to persist NomadOS state:', err);
    }
  }, [state]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Schengen Handlers
  const handleAddSchengenStay = (stay: Omit<SchengenStay, 'id'>) => {
    const newStay: SchengenStay = {
      ...stay,
      id: `stay-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      schengenStays: [newStay, ...prev.schengenStays],
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

  // Tax Presence Handlers
  const handleAddTaxPresence = (presence: Omit<TaxPresence, 'id'>) => {
    const newP: TaxPresence = {
      ...presence,
      id: `tax-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      taxPresences: [...prev.taxPresences, newP],
    }));
    showToast(`Tracking tax presence for ${presence.country}`);
  };

  const handleUpdateTaxDays = (id: string, delta: number) => {
    setState((prev) => ({
      ...prev,
      taxPresences: prev.taxPresences.map((p) => {
        if (p.id === id) {
          const newDays = Math.max(0, p.daysSpent + delta);
          let risk: TaxPresence['taxResidencyRisk'] = 'low';
          if (newDays >= p.maxSafeDays) risk = 'exceeded';
          else if (newDays >= p.maxSafeDays * 0.8) risk = 'high';
          else if (newDays >= p.maxSafeDays * 0.5) risk = 'moderate';
          return { ...p, daysSpent: newDays, taxResidencyRisk: risk };
        }
        return p;
      }),
    }));
  };

  const handleDeleteTaxPresence = (id: string) => {
    setState((prev) => ({
      ...prev,
      taxPresences: prev.taxPresences.filter((p) => p.id !== id),
    }));
    showToast('Tax jurisdiction removed');
  };

  // Itinerary Handlers
  const handleAddTrip = (trip: Omit<TripDestination, 'id'>) => {
    const newTrip: TripDestination = {
      ...trip,
      id: `trip-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      trips: [...prev.trips, newTrip],
    }));
    showToast(`Added ${trip.city} to itinerary`);
  };

  const handleSetCurrentBase = (trip: TripDestination) => {
    setState((prev) => ({
      ...prev,
      currentCity: trip.city,
      currentCountry: trip.country,
      currentCountryCode: trip.countryCode,
    }));
    showToast(`Current nomad base updated to ${trip.city}, ${trip.country}`);
  };

  const handleDeleteTrip = (id: string) => {
    setState((prev) => ({
      ...prev,
      trips: prev.trips.filter((t) => t.id !== id),
    }));
    showToast('Destination removed');
  };

  // Timezone Handlers
  const handleAddTimezone = (tz: Omit<TeamTimezone, 'id'>) => {
    const newTz: TeamTimezone = {
      ...tz,
      id: `tz-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      teamTimezones: [...prev.teamTimezones, newTz],
    }));
    showToast(`Added ${tz.label} timezone`);
  };

  const handleDeleteTimezone = (id: string) => {
    setState((prev) => ({
      ...prev,
      teamTimezones: prev.teamTimezones.filter((t) => t.id !== id),
    }));
    showToast('Timezone removed');
  };

  // Expense Handlers
  const handleAddExpense = (expense: Omit<NomadExpense, 'id'>) => {
    const newExp: NomadExpense = {
      ...expense,
      id: `exp-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      expenses: [newExp, ...prev.expenses],
    }));
    showToast(`Logged expense: ${expense.description}`);
  };

  const handleDeleteExpense = (id: string) => {
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id),
    }));
    showToast('Expense removed');
  };

  const handleUpdateBudget = (budget: number) => {
    setState((prev) => ({
      ...prev,
      monthlyBudgetUSD: budget,
    }));
    showToast('Monthly budget updated');
  };

  // Document Handlers
  const handleAddDoc = (doc: Omit<NomadDocCheck, 'id'>) => {
    const newDoc: NomadDocCheck = {
      ...doc,
      id: `doc-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      documents: [...prev.documents, newDoc],
    }));
    showToast(`Registered document: ${doc.title}`);
  };

  const handleDeleteDoc = (id: string) => {
    setState((prev) => ({
      ...prev,
      documents: prev.documents.filter((d) => d.id !== id),
    }));
    showToast('Document removed');
  };

  // Backup & Reset Handlers
  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `NomadOS_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Backup JSON downloaded');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.schengenStays && parsed.trips) {
          setState(parsed);
          showToast('NomadOS state restored successfully!');
        } else {
          alert('Invalid NomadOS backup file.');
        }
      } catch (err) {
        alert('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (confirm('Reset NomadOS to sample expedition data? This will overwrite local changes.')) {
      setState(INITIAL_NOMAD_DATA);
      showToast('Reset to default sample data');
    }
  };

  // Schengen summary calculation
  const schengenResult = calculateSchengen(state.schengenStays);
  const totalSpentUSD = state.expenses.reduce((s, e) => s + e.amountUSD, 0);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      <Header
        state={state}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExport={handleExport}
        onImport={handleImport}
        onReset={handleReset}
        schengenUsed={schengenResult.daysUsedInWindow}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick HUD Metrics Bar */}
        <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-stone-900/60 border border-stone-800 p-3 rounded-xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] text-stone-500 font-mono uppercase">Current Base</div>
              <div className="text-xs font-semibold text-stone-200">
                {state.currentCity}, {state.currentCountry}
              </div>
            </div>
          </div>

          <div className="bg-stone-900/60 border border-stone-800 p-3 rounded-xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] text-stone-500 font-mono uppercase">Schengen Days</div>
              <div className="text-xs font-semibold text-stone-200 font-mono">
                {schengenResult.daysUsedInWindow}/90d ({schengenResult.daysRemainingInWindow} left)
              </div>
            </div>
          </div>

          <div className="bg-stone-900/60 border border-stone-800 p-3 rounded-xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] text-stone-500 font-mono uppercase">Month Spend</div>
              <div className="text-xs font-semibold text-stone-200 font-mono">
                {formatUSD(totalSpentUSD)} / {formatUSD(state.monthlyBudgetUSD)}
              </div>
            </div>
          </div>

          <div className="bg-stone-900/60 border border-stone-800 p-3 rounded-xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] text-stone-500 font-mono uppercase">Docs Valid</div>
              <div className="text-xs font-semibold text-stone-200">
                {state.documents.length} Checked
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'schengen' && (
          <SchengenTracker
            stays={state.schengenStays}
            onAddStay={handleAddSchengenStay}
            onDeleteStay={handleDeleteSchengenStay}
          />
        )}

        {activeTab === 'tax' && (
          <TaxPresenceTracker
            presences={state.taxPresences}
            onAddPresence={handleAddTaxPresence}
            onUpdateDays={handleUpdateTaxDays}
            onDeletePresence={handleDeleteTaxPresence}
          />
        )}

        {activeTab === 'itinerary' && (
          <ItineraryPlanner
            trips={state.trips}
            currentCity={state.currentCity}
            onAddTrip={handleAddTrip}
            onSetCurrentBase={handleSetCurrentBase}
            onDeleteTrip={handleDeleteTrip}
          />
        )}

        {activeTab === 'timezones' && (
          <TimezoneMatrix
            timezones={state.teamTimezones}
            onAddTimezone={handleAddTimezone}
            onDeleteTimezone={handleDeleteTimezone}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpenseBurnRate
            expenses={state.expenses}
            monthlyBudgetUSD={state.monthlyBudgetUSD}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
            onUpdateBudget={handleUpdateBudget}
          />
        )}

        {activeTab === 'vault' && (
          <NomadVault
            documents={state.documents}
            onAddDoc={handleAddDoc}
            onDeleteDoc={handleDeleteDoc}
          />
        )}
      </main>

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 border border-amber-500/40 text-stone-100 text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-stone-800/80 py-4 text-center text-xs text-stone-500 font-mono">
        NomadOS • Mission Control for Global Remote Workers & Digital Nomads • Local Offline-First Storage
      </footer>
    </div>
  );
}

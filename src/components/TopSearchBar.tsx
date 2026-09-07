import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Wallet, 
  Plane, 
  Compass, 
  Users, 
  Calendar, 
  DollarSign, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  Building,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { NomadState } from '../types';

interface TopSearchBarProps {
  state: NomadState;
  onNavigateTab: (tab: 'home' | 'travel' | 'finance' | 'explore' | 'social' | 'me') => void;
  onOpenAddExpense?: () => void;
  onOpenPricing?: () => void;
}

export const TopSearchBar: React.FC<TopSearchBarProps> = ({
  state,
  onNavigateTab,
  onOpenAddExpense,
  onOpenPricing,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Global hotkey: Command/Ctrl + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to dismiss dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter items based on search query
  const q = query.toLowerCase().trim();

  const filteredExpenses = state.expenses.filter(
    (e) => e.description.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)
  );

  const filteredIncomes = state.incomes.filter(
    (inc) => inc.source.toLowerCase().includes(q) || inc.type.toLowerCase().includes(q)
  );

  const filteredTrips = state.trips.filter(
    (t) => t.city.toLowerCase().includes(q) || t.country.toLowerCase().includes(q) || t.visaType.toLowerCase().includes(q)
  );

  const filteredNomads = state.nearbyNomads.filter(
    (n) => n.name.toLowerCase().includes(q) || n.profession.toLowerCase().includes(q) || n.currentCity.toLowerCase().includes(q)
  );

  const filteredGoals = state.financialGoals.filter(
    (g) => g.title.toLowerCase().includes(q) || g.category.toLowerCase().includes(q)
  );

  const hasResults =
    q.length > 0 &&
    (filteredExpenses.length > 0 ||
      filteredIncomes.length > 0 ||
      filteredTrips.length > 0 ||
      filteredNomads.length > 0 ||
      filteredGoals.length > 0);

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto z-40">
      {/* Centered Top Search Bar */}
      <div 
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
        className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/90 hover:bg-white border transition-all duration-200 shadow-xs cursor-text ${
          isOpen 
            ? 'border-orange-500 ring-2 ring-orange-500/20 bg-white' 
            : 'border-slate-200/90 hover:border-slate-300'
        }`}
      >
        <Search className={`w-4 h-4 shrink-0 transition-colors ${isOpen ? 'text-orange-600' : 'text-slate-400'}`} />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          placeholder="Search budgets, expenses, cities, visas, nomads..."
          className="w-full bg-transparent text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
        />

        {query ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setQuery('');
              inputRef.current?.focus();
            }}
            className="w-4 h-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center shrink-0"
          >
            <X className="w-2.5 h-2.5" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-slate-100 border border-slate-200 rounded shrink-0 select-none">
            <span>⌘</span>
            <span>K</span>
          </kbd>
        )}
      </div>

      {/* Floating Centered Results Dropdown Modal */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden animate-in fade-in zoom-in-98 max-h-[80vh] overflow-y-auto">
          {/* Quick Category Action Chips (when query is empty) */}
          {!q && (
            <div className="p-3.5 bg-slate-50/70 border-b border-slate-100 space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Quick Navigation & Jump
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    onNavigateTab('finance');
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold border border-orange-200/60 transition-colors"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Financial Planner</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onNavigateTab('travel');
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  <Plane className="w-3.5 h-3.5" />
                  <span>Travel & Trips</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onNavigateTab('explore');
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Explore Hubs</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onNavigateTab('social');
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Nomad Radar</span>
                </button>
              </div>
            </div>
          )}

          {/* Results Lists */}
          <div className="p-3 space-y-3 divide-y divide-slate-100">
            {/* Financial Incomes & Expenses */}
            {(filteredExpenses.length > 0 || filteredIncomes.length > 0) && (
              <div className="space-y-1.5 pt-1 first:pt-0">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-extrabold text-orange-600 uppercase tracking-wider flex items-center gap-1">
                    <Wallet className="w-3 h-3" />
                    <span>Budget & Financials ({filteredExpenses.length + filteredIncomes.length})</span>
                  </span>
                  <button
                    onClick={() => {
                      onNavigateTab('finance');
                      setIsOpen(false);
                    }}
                    className="text-[11px] font-bold text-orange-600 hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-1">
                  {filteredIncomes.slice(0, 2).map((inc) => (
                    <div
                      key={inc.id}
                      onClick={() => {
                        onNavigateTab('finance');
                        setIsOpen(false);
                      }}
                      className="p-2 rounded-xl hover:bg-orange-50/60 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center text-xs">
                          +
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{inc.source}</p>
                          <span className="text-[10px] text-slate-400 capitalize">{inc.type} income</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-emerald-600 font-display">
                        +${inc.monthlyAmountUSD}/mo
                      </span>
                    </div>
                  ))}

                  {filteredExpenses.slice(0, 3).map((exp) => (
                    <div
                      key={exp.id}
                      onClick={() => {
                        onNavigateTab('finance');
                        setIsOpen(false);
                      }}
                      className="p-2 rounded-xl hover:bg-orange-50/60 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                          <CreditCard className="w-3.5 h-3.5" />
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{exp.description}</p>
                          <span className="text-[10px] text-slate-400">{exp.category}</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-900 font-display">
                        ${exp.amountUSD}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Financial Goals */}
            {filteredGoals.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-1 block">
                  Nomad Savings Goals ({filteredGoals.length})
                </span>
                <div className="space-y-1">
                  {filteredGoals.map((g) => (
                    <div
                      key={g.id}
                      onClick={() => {
                        onNavigateTab('finance');
                        setIsOpen(false);
                      }}
                      className="p-2 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <img src={g.imageUrl} alt={g.title} className="w-7 h-7 rounded-lg object-cover" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{g.title}</p>
                          <span className="text-[10px] text-slate-400">Target: ${g.targetUSD}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-orange-600">
                        ${g.currentUSD} ({Math.round((g.currentUSD / g.targetUSD) * 100)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Travel Trips & Cities */}
            {filteredTrips.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-1 flex items-center gap-1">
                  <Plane className="w-3 h-3" />
                  <span>Destinations & Itinerary ({filteredTrips.length})</span>
                </span>
                <div className="space-y-1">
                  {filteredTrips.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        onNavigateTab('travel');
                        setIsOpen(false);
                      }}
                      className="p-2 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {t.coverUrl && (
                          <img src={t.coverUrl} alt={t.city} className="w-7 h-7 rounded-lg object-cover" />
                        )}
                        <div>
                          <p className="text-xs font-bold text-slate-900">{t.city}, {t.country}</p>
                          <span className="text-[10px] text-slate-400">{t.visaType}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-600">${t.housingCostUSD}/mo</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nearby Nomads & Community */}
            {filteredNomads.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-1 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>Nomads in Community ({filteredNomads.length})</span>
                </span>
                <div className="space-y-1">
                  {filteredNomads.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        onNavigateTab('social');
                        setIsOpen(false);
                      }}
                      className="p-2 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <img src={n.avatarUrl} alt={n.name} className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{n.name}</p>
                          <span className="text-[10px] text-slate-400">{n.profession} · {n.currentCity}</span>
                        </div>
                      </div>
                      <span className="text-[11px] text-orange-600 font-bold">Connect</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No matches */}
            {q && !hasResults && (
              <div className="p-6 text-center text-slate-400 space-y-1">
                <Search className="w-6 h-6 mx-auto opacity-40 text-slate-400" />
                <p className="text-xs font-bold text-slate-600">No results found for "{query}"</p>
                <p className="text-[11px] text-slate-400">Try searching for "Bali", "Salary", "Coworking", or "Flight"</p>
              </div>
            )}
          </div>

          {/* Footer with keyboard tip */}
          <div className="px-3.5 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Press <kbd className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">ESC</kbd> to close</span>
            <span className="font-semibold text-orange-600 cursor-pointer" onClick={() => setIsOpen(false)}>
              Done
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

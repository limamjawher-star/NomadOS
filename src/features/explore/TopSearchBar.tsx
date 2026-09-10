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
  Building2,
  TrendingUp,
  CreditCard,
  Coffee,
  MapPin,
  Wifi,
  Star,
  Utensils
} from 'lucide-react';
import { NomadState } from '../../types';
import { WORK_SPOTS_DATA } from '../../data/workSpotsData';
import { EXPLORE_CITIES } from '../../data/defaultData';

interface TopSearchBarProps {
  state: NomadState;
  onNavigateTab: (tab: 'home' | 'travel' | 'finance' | 'explore' | 'social' | 'me') => void;
  onOpenAddExpense?: () => void;
  onOpenPricing?: () => void;
}

// Smart typo-tolerant and alias-aware search matcher
function matchesSearch(text: string | undefined | null, query: string): boolean {
  if (!text || !query) return false;
  const t = text.toLowerCase();
  const q = query.toLowerCase().trim();
  if (t.includes(q)) return true;

  // Common nomad aliases & stems
  const aliases: Record<string, string[]> = {
    'coffe': ['coffee', 'cafe', 'roast', 'brew', 'espresso', 'cappuccino', 'matcha'],
    'coffee': ['coffe', 'cafe', 'roast', 'brew', 'espresso', 'cappuccino', 'barista'],
    'cafe': ['coffee', 'coffe', 'bakery', 'roastery', 'espresso'],
    'cowork': ['coworking', 'workspace', 'desk', 'office', 'hub'],
    'coworking': ['cowork', 'workspace', 'desk', 'office', 'hub'],
    'workspace': ['coworking', 'cowork', 'desk', 'cafe'],
    'wifi': ['internet', 'fiber', 'speed', 'mbps', 'fast'],
    'net': ['internet', 'wifi', 'fiber'],
    'bali': ['canggu', 'ubud', 'pererenan', 'indonesia'],
    'canggu': ['bali', 'indonesia'],
    'tokyo': ['japan', 'shibuya', 'roppongi'],
    'lisbon': ['portugal'],
    'mexico': ['cdmx', 'roma', 'condesa'],
    'chiang': ['mai', 'thailand'],
    'visa': ['schengen', 'arrival', 'nomad visa', 'waiver', 'exemption'],
    'flight': ['trip', 'travel', 'airport', 'arrival'],
    'money': ['salary', 'income', 'expense', 'budget', 'usd', 'cost'],
    'salary': ['income', 'freelance', 'contract', 'earnings'],
    'budget': ['expense', 'cost', 'housing', 'spend'],
    'meetup': ['event', 'coffee', 'social', 'drink', 'sunset']
  };

  // Check alias synonyms
  for (const [key, syns] of Object.entries(aliases)) {
    if (q.includes(key) || key.includes(q)) {
      if (syns.some((syn) => t.includes(syn))) return true;
    }
  }

  // Multi-term matching (e.g. "bali cafe")
  const words = q.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    return words.every((w) => t.includes(w));
  }

  // Typo tolerance: prefix match or 1 character diff
  if (q.length >= 4) {
    const tokens = t.split(/[\s,./\-_()]+/);
    for (const token of tokens) {
      if (token.startsWith(q) || q.startsWith(token)) return true;
      if (Math.abs(token.length - q.length) <= 1) {
        let diff = 0;
        let i = 0, j = 0;
        while (i < q.length && j < token.length) {
          if (q[i] !== token[j]) {
            diff++;
            if (diff > 1) break;
            if (q.length > token.length) i++;
            else if (token.length > q.length) j++;
            else { i++; j++; }
          } else {
            i++;
            j++;
          }
        }
        if (diff <= 1) return true;
      }
    }
  }

  return false;
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

  // 1. Workspaces & Cafes
  const filteredWorkSpots = q
    ? WORK_SPOTS_DATA.filter(
        (sp) =>
          matchesSearch(sp.name, q) ||
          matchesSearch(sp.category, q) ||
          matchesSearch(sp.city, q) ||
          matchesSearch(sp.country, q) ||
          matchesSearch(sp.address, q) ||
          matchesSearch(sp.foodAndCoffee, q) ||
          sp.tags.some((t) => matchesSearch(t, q))
      )
    : [];

  // 2. Explore Cities
  const filteredCities = q
    ? EXPLORE_CITIES.filter(
        (c) =>
          matchesSearch(c.name, q) ||
          matchesSearch(c.country, q) ||
          matchesSearch(c.region, q) ||
          matchesSearch(c.bestTag, q) ||
          c.highlights.some((h) => matchesSearch(h, q))
      )
    : [];

  // 3. Community Events & Meetups
  const filteredEvents = q
    ? state.events.filter(
        (ev) =>
          matchesSearch(ev.title, q) ||
          matchesSearch(ev.category, q) ||
          matchesSearch(ev.city, q) ||
          matchesSearch(ev.location, q)
      )
    : [];

  // 4. Financial items
  const filteredExpenses = q
    ? state.expenses.filter(
        (e) => matchesSearch(e.description, q) || matchesSearch(e.category, q)
      )
    : [];

  const filteredIncomes = q
    ? state.incomes.filter(
        (inc) => matchesSearch(inc.source, q) || matchesSearch(inc.type, q)
      )
    : [];

  const filteredGoals = q
    ? state.financialGoals.filter(
        (g) => matchesSearch(g.title, q) || matchesSearch(g.category, q)
      )
    : [];

  // 5. Trips & Destinations
  const filteredTrips = q
    ? state.trips.filter(
        (t) =>
          matchesSearch(t.city, q) ||
          matchesSearch(t.country, q) ||
          matchesSearch(t.visaType, q) ||
          matchesSearch(t.notes, q)
      )
    : [];

  // 6. Nearby Nomads
  const filteredNomads = q
    ? state.nearbyNomads.filter(
        (n) =>
          matchesSearch(n.name, q) ||
          matchesSearch(n.profession, q) ||
          matchesSearch(n.currentCity, q) ||
          matchesSearch(n.bio, q)
      )
    : [];

  const totalResultsCount =
    filteredWorkSpots.length +
    filteredCities.length +
    filteredEvents.length +
    filteredExpenses.length +
    filteredIncomes.length +
    filteredGoals.length +
    filteredTrips.length +
    filteredNomads.length;

  const hasResults = q.length > 0 && totalResultsCount > 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto z-40">
      {/* Centered Top Search Bar */}
      <div 
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
        className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white hover:bg-white border transition-all duration-200 shadow-xs cursor-text ${
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
          placeholder="Search cafes, coworking, cities, visas, budgets..."
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
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-stone-400 bg-stone-100 border border-stone-200 rounded shrink-0 select-none">
            <span>⌘</span>
            <span>K</span>
          </kbd>
        )}
      </div>

      {/* Floating Centered Results Dropdown Modal */}
      {isOpen && (
        <>
          {/* Mobile Backdrop */}
          <div 
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-40 sm:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-x-2.5 top-[64px] sm:absolute sm:top-full sm:left-0 sm:right-0 sm:inset-x-auto mt-1 sm:mt-2 bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-[0_16px_50px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in zoom-in-98 max-h-[75vh] overflow-y-auto z-50">
          {/* Quick Category Action Chips (when query is empty) */}
          {!q && (
            <div className="p-3.5 bg-stone-50/70 border-b border-stone-100 space-y-2">
              <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wider block">
                Quick Navigation & Jump
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    onNavigateTab('explore');
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-medium border border-orange-200/60 transition-colors cursor-pointer"
                >
                  <Coffee className="w-3.5 h-3.5 text-orange-500" strokeWidth={1.75} />
                  <span>Workspaces & Cafes</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onNavigateTab('finance');
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
                >
                  <Wallet className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span>Financial Planner</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onNavigateTab('travel');
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
                >
                  <Plane className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span>Travel & Trips</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onNavigateTab('social');
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span>Nomad Radar</span>
                </button>
              </div>
            </div>
          )}

          {/* Results Lists */}
          <div className="p-3 space-y-3 divide-y divide-slate-100">
            {/* 1. Workspaces & Cafes */}
            {filteredWorkSpots.length > 0 && (
              <div className="space-y-1.5 pt-1 first:pt-0">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-semibold text-orange-600 uppercase tracking-wider flex items-center gap-1">
                    <Coffee className="w-3.5 h-3.5" strokeWidth={1.75} />
                    <span>Workspaces & Cafes ({filteredWorkSpots.length})</span>
                  </span>
                  <button
                    onClick={() => {
                      onNavigateTab('explore');
                      setIsOpen(false);
                    }}
                    className="text-[11px] font-medium text-orange-600 hover:underline cursor-pointer"
                  >
                    View in Explore
                  </button>
                </div>

                <div className="space-y-1">
                  {filteredWorkSpots.slice(0, 4).map((spot) => (
                    <div
                      key={spot.id}
                      onClick={() => {
                        onNavigateTab('explore');
                        setIsOpen(false);
                      }}
                      className="p-2.5 rounded-2xl hover:bg-orange-50/50 cursor-pointer flex items-center justify-between transition-colors border border-transparent hover:border-orange-200/50 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={spot.photoUrl}
                          alt={spot.name}
                          className="w-10 h-10 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-900 truncate group-hover:text-orange-600 transition-colors">
                            {spot.name}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 font-normal">
                            <span className="truncate">{spot.city}</span>
                            <span>·</span>
                            <span className="text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.2 rounded shrink-0 flex items-center gap-1">
                              <Wifi className="w-2.5 h-2.5 text-emerald-600" strokeWidth={1.75} />
                              {spot.wifiSpeedMbps} Mbps
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <span className="flex items-center gap-1 text-xs font-semibold text-slate-800">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          {spot.rating}
                        </span>
                        <span className="text-[10px] text-slate-400 capitalize font-normal">
                          {spot.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Community Events & Coffee Meetups */}
            {filteredEvents.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" strokeWidth={1.75} />
                    <span>Meetups & Events ({filteredEvents.length})</span>
                  </span>
                  <button
                    onClick={() => {
                      onNavigateTab('social');
                      setIsOpen(false);
                    }}
                    className="text-[11px] font-medium text-amber-600 hover:underline cursor-pointer"
                  >
                    View in Social
                  </button>
                </div>

                <div className="space-y-1">
                  {filteredEvents.map((ev) => (
                    <div
                      key={ev.id}
                      onClick={() => {
                        onNavigateTab('social');
                        setIsOpen(false);
                      }}
                      className="p-2.5 rounded-xl hover:bg-stone-50 cursor-pointer flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {ev.coverUrl ? (
                          <img
                            src={ev.coverUrl}
                            alt={ev.title}
                            className="w-10 h-10 rounded-xl object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                            <Coffee className="w-5 h-5" strokeWidth={1.75} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-stone-900 truncate group-hover:text-orange-600 transition-colors">
                            {ev.title}
                          </p>
                          <p className="text-[11px] text-stone-500 truncate mt-0.5 font-normal">
                            {ev.location} · {ev.date}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-stone-600 shrink-0 ml-2 bg-stone-100 px-2 py-0.5 rounded-lg">
                        {ev.attendeesCount} nomads
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Explore Cities & Nomad Bases */}
            {filteredCities.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-orange-500" strokeWidth={1.75} />
                    <span>Nomad Destinations ({filteredCities.length})</span>
                  </span>
                  <button
                    onClick={() => {
                      onNavigateTab('explore');
                      setIsOpen(false);
                    }}
                    className="text-[11px] font-medium text-orange-600 hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-1">
                  {filteredCities.slice(0, 3).map((city) => (
                    <div
                      key={city.id}
                      onClick={() => {
                        onNavigateTab('explore');
                        setIsOpen(false);
                      }}
                      className="p-2.5 rounded-xl hover:bg-stone-50 cursor-pointer flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={city.imageUrl}
                          alt={city.name}
                          className="w-10 h-10 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-stone-900 truncate group-hover:text-orange-600 transition-colors">
                            {city.name}, {city.country}
                          </p>
                          <p className="text-[11px] text-stone-500 truncate mt-0.5 font-normal">
                            {city.highlights[0]} · {city.internetSpeedMbps} Mbps
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <span className="text-xs font-semibold text-stone-900">
                          ${city.costPerMonthUSD}/mo
                        </span>
                        <p className="text-[10px] font-medium text-emerald-600">
                          Score {city.nomadScore}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Financial Incomes & Expenses */}
            {(filteredExpenses.length > 0 || filteredIncomes.length > 0) && (
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-semibold text-orange-600 uppercase tracking-wider flex items-center gap-1">
                    <Wallet className="w-3 h-3" strokeWidth={1.75} />
                    <span>Budget & Financials ({filteredExpenses.length + filteredIncomes.length})</span>
                  </span>
                  <button
                    onClick={() => {
                      onNavigateTab('finance');
                      setIsOpen(false);
                    }}
                    className="text-[11px] font-medium text-orange-600 hover:underline cursor-pointer"
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
                        <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 font-semibold flex items-center justify-center text-xs">
                          +
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-stone-900">{inc.source}</p>
                          <span className="text-[10px] text-stone-400 capitalize font-normal">{inc.type} income</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-emerald-600">
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
                          <CreditCard className="w-3.5 h-3.5" strokeWidth={1.75} />
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-stone-900">{exp.description}</p>
                          <span className="text-[10px] text-stone-400 font-normal">{exp.category}</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-stone-900">
                        ${exp.amountUSD}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Financial Goals */}
            {filteredGoals.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider px-1 block">
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
                      className="p-2 rounded-xl hover:bg-stone-50 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <img src={g.imageUrl} alt={g.title} className="w-7 h-7 rounded-lg object-cover" />
                        <div>
                          <p className="text-xs font-semibold text-stone-900">{g.title}</p>
                          <span className="text-[10px] text-stone-400 font-normal">Target: ${g.targetUSD}</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-orange-600">
                        ${g.currentUSD} ({Math.round((g.currentUSD / g.targetUSD) * 100)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Travel Trips & Destinations */}
            {filteredTrips.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider px-1 flex items-center gap-1">
                  <Plane className="w-3 h-3" strokeWidth={1.75} />
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
                      className="p-2 rounded-xl hover:bg-stone-50 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {t.coverUrl && (
                          <img src={t.coverUrl} alt={t.city} className="w-7 h-7 rounded-lg object-cover" />
                        )}
                        <div>
                          <p className="text-xs font-semibold text-stone-900">{t.city}, {t.country}</p>
                          <span className="text-[10px] text-stone-400 font-normal">{t.visaType}</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-stone-600">${t.housingCostUSD}/mo</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. Nearby Nomads & Community */}
            {filteredNomads.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider px-1 flex items-center gap-1">
                  <Users className="w-3 h-3" strokeWidth={1.75} />
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
                          <p className="text-xs font-semibold text-stone-900">{n.name}</p>
                          <span className="text-[10px] text-stone-400">{n.profession} · {n.currentCity}</span>
                        </div>
                      </div>
                      <span className="text-[11px] text-orange-600 font-medium">Connect</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No matches */}
            {q && !hasResults && (
              <div className="p-6 text-center text-stone-400 space-y-1">
                <Search className="w-6 h-6 mx-auto opacity-40 text-stone-400" strokeWidth={1.75} />
                <p className="text-xs font-medium text-stone-600">No results found for "{query}"</p>
                <p className="text-[11px] text-stone-400">Try searching for "Coffee", "Dojo", "Bali", "Salary", "Coworking", or "Flight"</p>
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
        </>
      )}
    </div>
  );
};

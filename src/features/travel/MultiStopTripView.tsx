import React, { useState } from 'react';
import { 
  Calendar, 
  Share2, 
  Trash2, 
  Lock, 
  Users, 
  Briefcase, 
  Edit3, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X, 
  MapPin, 
  Clock, 
  DollarSign, 
  Globe, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { MultiStopTrip } from '../../types';
import { CountryFlag } from '../../components/ui/CountryFlag';
import { DataConfidenceBadge } from '../../components/ui/DataConfidenceBadge';

interface MultiStopTripViewProps {
  trip?: MultiStopTrip;
  onBack?: () => void;
  onAddStop?: (stop: any) => void;
  onDeleteStop?: (stopId: string) => void;
}

export const MultiStopTripView: React.FC<MultiStopTripViewProps> = ({
  trip: propTrip,
  onBack,
  onAddStop,
  onDeleteStop,
}) => {
  const [trip, setTrip] = useState<MultiStopTrip>(
    propTrip || {
      id: 'trip-se-asia',
      title: 'Southeast Asia Workation',
      dateRange: 'Jun 18 – Oct 16, 2026',
      status: 'Planning',
      countriesCount: 3,
      daysCount: 118,
      totalBudgetEUR: 4900,
      stopsCount: 3,
      countries: [
        { name: 'Thailand', code: 'TH', flag: '🇹🇭' },
        { name: 'Vietnam', code: 'VN', flag: '🇻🇳' },
        { name: 'Indonesia', code: 'ID', flag: '🇮🇩' },
      ],
      stops: [
        {
          id: 'stop-1',
          city: 'Bangkok',
          country: 'Thailand',
          flag: '🇹🇭',
          visaName: 'Visa Exemption (Tourist - 30 days)',
          durationDays: 25,
          dates: '2026-06-18 → 2026-07-13',
          coworking: 'Coworking Sukhumvit',
          budgetEUR: 1500,
          spentEUR: 724,
        },
        {
          id: 'stop-2',
          city: 'Hanoi',
          country: 'Vietnam',
          flag: '🇻🇳',
          visaName: 'E-Visa (90 days)',
          durationDays: 29,
          dates: '2026-07-14 → 2026-08-12',
          coworking: 'Old Quarter Hub',
          budgetEUR: 1400,
          spentEUR: 310,
        },
        {
          id: 'stop-3',
          city: 'Bali',
          country: 'Indonesia',
          flag: '🇮🇩',
          visaName: 'Visa on Arrival (B213 - 30 days)',
          durationDays: 64,
          dates: '2026-08-13 → 2026-10-16',
          coworking: 'Dojo Bali Canggu',
          budgetEUR: 2000,
          spentEUR: 450,
        },
      ],
    }
  );

  const [isAddStopModalOpen, setIsAddStopModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isLuggageModalOpen, setIsLuggageModalOpen] = useState(false);
  const [isPrivateTrip, setIsPrivateTrip] = useState(true);
  const [editingStop, setEditingStop] = useState<any | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [tripToast, setTripToast] = useState<string | null>(null);

  // Packing list items
  const [luggageItems, setLuggageItems] = useState([
    { id: 'item-1', name: 'Valid Passport (6+ mo validity)', packed: true },
    { id: 'item-2', name: 'Universal Travel Adapter (EU/UK/US)', packed: true },
    { id: 'item-3', name: '100W GaN Fast Charger & USB-C cables', packed: true },
    { id: 'item-4', name: 'Active Noise Canceling Headphones', packed: true },
    { id: 'item-5', name: 'Foldable Ergonomic Laptop Stand', packed: false },
    { id: 'item-6', name: 'Global Nomad Health Insurance card', packed: true },
    { id: 'item-7', name: 'Local / Regional eSIM activated', packed: false },
  ]);

  const toggleLuggageItem = (id: string) => {
    setLuggageItems(prev => prev.map(item => item.id === id ? { ...item, packed: !item.packed } : item));
  };

  const showTripToast = (msg: string) => {
    setTripToast(msg);
    setTimeout(() => setTripToast(null), 2500);
  };

  // New Stop form
  const [newCity, setNewCity] = useState('');
  const [newCountry, setNewCountry] = useState('Malaysia');
  const [newFlag, setNewFlag] = useState('🇲🇾');
  const [newVisa, setNewVisa] = useState('Tourist 90-day Waiver');
  const [newDuration, setNewDuration] = useState(21);
  const [newDates, setNewDates] = useState('2026-10-17 → 2026-11-07');
  const [newCoworking, setNewCoworking] = useState('Common Ground KL');
  const [newBudget, setNewBudget] = useState(1100);

  const handleCreateStop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCity) return;

    const stop = {
      id: `stop-${Date.now()}`,
      city: newCity,
      country: newCountry,
      flag: newFlag,
      visaName: newVisa,
      durationDays: Number(newDuration),
      dates: newDates,
      coworking: newCoworking,
      budgetEUR: Number(newBudget),
      spentEUR: 0,
    };

    setTrip((prev) => ({
      ...prev,
      stopsCount: prev.stopsCount + 1,
      totalBudgetEUR: prev.totalBudgetEUR + stop.budgetEUR,
      daysCount: prev.daysCount + stop.durationDays,
      stops: [...prev.stops, stop],
    }));

    if (onAddStop) onAddStop(stop);
    setIsAddStopModalOpen(false);
    setNewCity('');
  };

  const handleDeleteStopLocal = (stopId: string) => {
    setTrip((prev) => ({
      ...prev,
      stops: prev.stops.filter((s) => s.id !== stopId),
      stopsCount: Math.max(0, prev.stopsCount - 1),
    }));
    if (onDeleteStop) onDeleteStop(stopId);
  };

  const handleCopyShareLink = () => {
    setCopiedLink(true);
    navigator.clipboard?.writeText(window.location.href);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div id="multi-stop-trip-view" className="space-y-5">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-medium text-stone-600 hover:text-orange-600 transition-colors uppercase tracking-wider cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
          <span>Trip Overview</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-orange-50 border border-orange-100 text-orange-700 text-xs font-medium rounded-full">
            {trip.status}
          </span>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-3 py-1 bg-white hover:bg-stone-50 border border-stone-200/80 text-stone-700 text-xs font-medium rounded-full flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-stone-500" strokeWidth={1.75} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="space-y-1.5">
        <h2 className="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">
          {trip.title}
        </h2>
        <p className="text-xs font-normal text-stone-500">
          {trip.dateRange}
        </p>

        {/* Country Flag Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {trip.countries.map((c) => (
            <span
              key={c.code}
              className="px-3 py-1 bg-white border border-stone-200/80 rounded-full text-xs font-medium text-stone-700 shadow-xs flex items-center gap-1.5"
            >
              <CountryFlag code={c.code} name={c.name} size="xs" />
              <span>{c.name}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Action Strip */}
      <div className="flex items-center justify-between py-1.5 border-y border-stone-200/80">
        <div className="flex items-center gap-1.5">
          <button 
            type="button"
            title="Trip Itinerary Calendar"
            onClick={() => setIsCalendarModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl text-stone-600 hover:text-orange-600 hover:bg-orange-50 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-orange-500" strokeWidth={1.75} />
            <span className="hidden sm:inline">Calendar</span>
          </button>
          <button 
            type="button"
            title={isPrivateTrip ? "Private Trip (Click to Share)" : "Public Trip (Click to Make Private)"}
            onClick={() => {
              const next = !isPrivateTrip;
              setIsPrivateTrip(next);
              showTripToast(next ? 'Trip visibility: Private' : 'Trip visibility: Shared with Community');
            }}
            className={`px-2.5 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
              isPrivateTrip ? 'bg-stone-100 text-stone-700 hover:bg-stone-200' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <Lock className="w-4 h-4" strokeWidth={1.75} />
            <span>{isPrivateTrip ? 'Private' : 'Shared'}</span>
          </button>
          <button 
            type="button"
            title="Collaborators / Partners"
            onClick={() => setIsShareModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl text-stone-600 hover:text-orange-600 hover:bg-orange-50 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          >
            <Users className="w-4 h-4 text-sky-500" strokeWidth={1.75} />
            <span className="hidden sm:inline">Collaborators</span>
          </button>
          <button 
            type="button"
            title="Nomad Gear & Luggage Checklist"
            onClick={() => setIsLuggageModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl text-stone-600 hover:text-orange-600 hover:bg-orange-50 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          >
            <Briefcase className="w-4 h-4 text-amber-500" strokeWidth={1.75} />
            <span>Luggage</span>
          </button>
        </div>

        {tripToast && (
          <span className="text-[11px] font-medium text-orange-600 animate-in fade-in">
            {tripToast}
          </span>
        )}
      </div>

      {/* 4 Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white rounded-xl p-3.5 border border-stone-200/80 shadow-xs">
          <span className="text-stone-400 text-xs font-medium flex items-center gap-1.5 mb-1">
            <Globe className="w-3.5 h-3.5 text-orange-500" strokeWidth={1.75} />
            <span>Countries</span>
          </span>
          <span className="text-xl font-semibold text-stone-900 tabular-nums">{trip.countriesCount}</span>
        </div>
        <div className="bg-white rounded-xl p-3.5 border border-stone-200/80 shadow-xs">
          <span className="text-stone-400 text-xs font-medium flex items-center gap-1.5 mb-1">
            <Calendar className="w-3.5 h-3.5 text-orange-500" strokeWidth={1.75} />
            <span>Days</span>
          </span>
          <span className="text-xl font-semibold text-stone-900 tabular-nums">{trip.daysCount}</span>
                <div className="mt-1"><DataConfidenceBadge status="demo" lastUpdated="Demo Preview" /></div>
        </div>
        <div className="bg-white rounded-xl p-3.5 border border-stone-200/80 shadow-xs">
          <span className="text-stone-400 text-xs font-medium flex items-center gap-1.5 mb-1">
            <DollarSign className="w-3.5 h-3.5 text-orange-500" strokeWidth={1.75} />
            <span>Budget</span>
          </span>
          <span className="text-xl font-semibold text-stone-900 tabular-nums">€{trip.totalBudgetEUR.toLocaleString()}</span>
        </div>
        <div className="bg-white rounded-xl p-3.5 border border-stone-200/80 shadow-xs">
          <span className="text-stone-400 text-xs font-medium flex items-center gap-1.5 mb-1">
            <MapPin className="w-3.5 h-3.5 text-orange-500" strokeWidth={1.75} />
            <span>Stops</span>
          </span>
          <span className="text-xl font-semibold text-stone-900 tabular-nums">{trip.stopsCount}</span>
        </div>
      </div>

      {/* List of Stops */}
      <div className="space-y-3">
        {trip.stops.map((stop) => {
          const budgetPercent = Math.min(100, Math.round((stop.spentEUR / stop.budgetEUR) * 100));
          const leftEUR = Math.max(0, stop.budgetEUR - stop.spentEUR);

          return (
            <div
              key={stop.id}
              className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200/80 shadow-xs space-y-3 hover:border-orange-300 hover:shadow-xs transition-all"
            >
              {/* Stop Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <CountryFlag code={stop.country} name={stop.country} size="md" />
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm sm:text-base flex items-center gap-2">
                      <span>{stop.city}, {stop.country}</span>
                    </h4>
                    <span className="inline-block mt-0.5 px-2.5 py-0.5 bg-orange-50 text-orange-700 text-[11px] font-medium rounded-md border border-orange-200/70">
                      {stop.visaName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button 
                    type="button"
                    title="Edit stop"
                    onClick={() => setEditingStop(stop)}
                    className="w-7 h-7 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleDeleteStopLocal(stop.id)}
                    title="Delete stop"
                    className="w-7 h-7 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                </div>
              </div>

              {/* Timing & Coworking detail */}
              <div className="flex flex-wrap items-center justify-between text-xs text-stone-500 font-normal pt-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-orange-500" strokeWidth={1.75} />
                  <span>{stop.durationDays}d · {stop.dates}</span>
                </span>
                <span className="text-stone-400 italic">
                  {stop.coworking}
                </span>
              </div>

              {/* Budget progress bar */}
              <div className="pt-2 border-t border-stone-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-900 tabular-nums">
                    €{stop.budgetEUR}
                  </span>
                  <span className="text-stone-500 font-normal">
                    Spent: <strong className="font-medium text-stone-800 tabular-nums">€{stop.spentEUR}</strong> · <strong className="font-medium text-emerald-600 tabular-nums">€{leftEUR} left</strong>
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${budgetPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Add Stop Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => setIsAddStopModalOpen(true)}
          id="multi-stop-add-stop-btn"
          className="w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/30 flex items-center justify-center transition-all transform active:scale-95"
          title="Add Stop"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Add Stop Modal */}
      {isAddStopModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateStop} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-stone-200/80 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-stone-900 text-sm">Add Trip Destination</h3>
              <button
                type="button"
                onClick={() => setIsAddStopModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-stone-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="e.g. Kuala Lumpur"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200/80 text-xs font-normal focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-stone-700 mb-1">Country</label>
                <input
                  type="text"
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  placeholder="e.g. Malaysia"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200/80 text-xs font-normal focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-stone-700 mb-1">Duration (Days)</label>
                <input
                  type="number"
                  value={newDuration}
                  onChange={(e) => setNewDuration(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200/80 text-xs font-normal focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-stone-700 mb-1">Stop Budget (€)</label>
                <input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200/80 text-xs font-normal focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-700 mb-1">Visa Requirement Auto-Check</label>
              <input
                type="text"
                value={newVisa}
                onChange={(e) => setNewVisa(e.target.value)}
                placeholder="e.g. Tourist 90-day Waiver"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200/80 text-xs font-normal focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-700 mb-1">Coworking Space</label>
              <input
                type="text"
                value={newCoworking}
                onChange={(e) => setNewCoworking(e.target.value)}
                placeholder="e.g. Common Ground KL"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200/80 text-xs font-normal focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddStopModalOpen(false)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl text-xs shadow-xs cursor-pointer"
              >
                Add Stop
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Collaborative Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-stone-200/80 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-semibold">
                  <Users className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <h4 className="font-semibold text-stone-900 text-sm">Collaborative Trip Planning</h4>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed font-normal">
              Invite travel companions or remote coworkers to co-plan stops, split housing budgets, and sync flight arrival days in real-time.
            </p>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center justify-between gap-2">
              <span className="text-xs text-stone-600 font-mono truncate">
                https://nomados.app/trip/se-asia-workation
              </span>
              <button
                onClick={handleCopyShareLink}
                className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl text-xs shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" strokeWidth={1.75} />
                    <span>Copied!</span>
                  </>
                ) : (
                  'Copy'
                )}
              </button>
            </div>

            <div className="space-y-2 pt-1">
              <span className="text-xs font-medium text-stone-700 block">Collaborators (3)</span>
              <div className="flex items-center gap-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                  alt="You"
                  className="w-8 h-8 rounded-full border-2 border-orange-500 object-cover"
                  title="You (Owner)"
                />
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
                  alt="Eva"
                  className="w-8 h-8 rounded-full border-2 border-stone-200 object-cover"
                  title="Eva Fernandez (Editor)"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                  alt="Alex"
                  className="w-8 h-8 rounded-full border-2 border-stone-200 object-cover"
                  title="Alex Morgan (Viewer)"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Itinerary Modal */}
      {isCalendarModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-xl border border-stone-200/80 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <h4 className="font-semibold text-stone-900 text-sm">Trip Timeline Calendar</h4>
              </div>
              <button
                onClick={() => setIsCalendarModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            </div>

            <p className="text-xs text-stone-500 font-normal">
              Complete {trip.daysCount}-day schedule across {trip.stopsCount} nomad stops.
            </p>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {trip.stops.map((s, idx) => (
                <div key={s.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-orange-500 text-white font-medium flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-medium text-stone-900">{s.city}, {s.country}</p>
                      <p className="text-[11px] text-stone-500 font-mono">{s.dates}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 text-[10px] font-medium">
                    {s.durationDays} days
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsCalendarModalOpen(false)}
              className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl text-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Luggage & Gear Checklist Modal */}
      {isLuggageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-xl border border-stone-200/80 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <h4 className="font-semibold text-stone-900 text-sm">Nomad Gear & Luggage Checklist</h4>
              </div>
              <button
                onClick={() => setIsLuggageModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            </div>

            <p className="text-xs text-stone-500 font-normal">
              Essential gear checklist for long-haul nomad travel:
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {luggageItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleLuggageItem(item.id)}
                  className={`p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-center justify-between ${
                    item.packed
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-stone-50 border-stone-200/80 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className={item.packed ? 'line-through opacity-70' : ''}>{item.name}</span>
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs ${
                    item.packed ? 'bg-emerald-500 text-white' : 'border border-stone-300'
                  }`}>
                    {item.packed && <Check className="w-3 h-3 stroke-[2]" />}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsLuggageModalOpen(false)}
              className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl text-xs transition-colors cursor-pointer"
            >
              Close Checklist
            </button>
          </div>
        </div>
      )}

      {/* Edit Stop Modal */}
      {editingStop && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-xl border border-stone-200/80 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <h4 className="font-semibold text-stone-900 text-sm">Edit Stop: {editingStop.city}</h4>
              </div>
              <button
                onClick={() => setEditingStop(null)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setTrip(prev => ({
                  ...prev,
                  stops: prev.stops.map(s => s.id === editingStop.id ? editingStop : s)
                }));
                setEditingStop(null);
                showTripToast(`Stop "${editingStop.city}" updated successfully!`);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-medium text-stone-700 block mb-1">City Name</label>
                <input
                  type="text"
                  value={editingStop.city}
                  onChange={(e) => setEditingStop({ ...editingStop, city: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200/80 bg-stone-50 font-medium text-stone-900"
                />
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">Coworking Space</label>
                <input
                  type="text"
                  value={editingStop.coworking}
                  onChange={(e) => setEditingStop({ ...editingStop, coworking: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200/80 bg-stone-50 font-medium text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">Budget (€ EUR)</label>
                  <input
                    type="number"
                    value={editingStop.budgetEUR}
                    onChange={(e) => setEditingStop({ ...editingStop, budgetEUR: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-stone-200/80 bg-stone-50 font-medium text-stone-900"
                  />
                </div>
                <div>
                  <label className="font-medium text-stone-700 block mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    value={editingStop.durationDays}
                    onChange={(e) => setEditingStop({ ...editingStop, durationDays: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-stone-200/80 bg-stone-50 font-medium text-stone-900"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStop(null)}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl cursor-pointer shadow-xs"
                >
                  Save Stop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

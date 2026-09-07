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
import { MultiStopTrip } from '../types';

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
  const [copiedLink, setCopiedLink] = useState(false);

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
      {/* Top Header Navigation (matching Screenshot 3) */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-extrabold text-stone-600 hover:text-purple-600 transition-colors uppercase tracking-wider"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>TRIP</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-purple-100/80 text-purple-700 text-xs font-extrabold rounded-full">
            {trip.status}
          </span>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-3 py-1 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-bold rounded-full flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-stone-500" />
            <span>Share</span>
          </button>
          <button
            onClick={() => {}}
            className="w-7 h-7 rounded-full bg-white hover:bg-rose-50 hover:text-rose-600 border border-stone-200 text-stone-400 flex items-center justify-center transition-colors shadow-sm"
            title="Delete trip"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Title Banner (matching Screenshot 3) */}
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
          {trip.title}
        </h2>
        <p className="text-xs font-semibold text-stone-500">
          {trip.dateRange}
        </p>

        {/* Country Flag Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {trip.countries.map((c) => (
            <span
              key={c.code}
              className="px-3 py-1 bg-white border border-stone-200/90 rounded-full text-xs font-bold text-stone-800 shadow-sm flex items-center gap-1.5"
            >
              <span>{c.flag}</span>
              <span>{c.name}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Action Strip (Icons matching Screenshot 3) */}
      <div className="flex items-center gap-2 py-1 border-y border-stone-200/80">
        <button 
          title="Trip Calendar"
          className="p-2 rounded-xl text-stone-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
        >
          <Calendar className="w-4 h-4" />
        </button>
        <button 
          title="Privacy & Lock"
          className="p-2 rounded-xl text-stone-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
        >
          <Lock className="w-4 h-4" />
        </button>
        <button 
          title="Collaborators / Partners"
          onClick={() => setIsShareModalOpen(true)}
          className="p-2 rounded-xl text-stone-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
        >
          <Users className="w-4 h-4" />
        </button>
        <button 
          title="Stops & Luggage"
          className="p-2 rounded-xl text-stone-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
        >
          <Briefcase className="w-4 h-4" />
        </button>
      </div>

      {/* 4 Stats Cards Grid (matching Screenshot 3) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-sm">
          <span className="text-stone-400 text-xs font-bold block mb-1">🌍 Countries</span>
          <span className="text-xl font-black text-stone-900">{trip.countriesCount}</span>
        </div>
        <div className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-sm">
          <span className="text-stone-400 text-xs font-bold block mb-1">📅 Days</span>
          <span className="text-xl font-black text-stone-900">{trip.daysCount}</span>
        </div>
        <div className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-sm">
          <span className="text-stone-400 text-xs font-bold block mb-1">💰 Budget</span>
          <span className="text-xl font-black text-stone-900">€{trip.totalBudgetEUR.toLocaleString()}</span>
        </div>
        <div className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-sm">
          <span className="text-stone-400 text-xs font-bold block mb-1">✈️ Stops</span>
          <span className="text-xl font-black text-stone-900">{trip.stopsCount}</span>
        </div>
      </div>

      {/* List of Stops (Bangkok, Hanoi, Bali from Screenshot 3) */}
      <div className="space-y-3">
        {trip.stops.map((stop, idx) => {
          const budgetPercent = Math.min(100, Math.round((stop.spentEUR / stop.budgetEUR) * 100));
          const leftEUR = Math.max(0, stop.budgetEUR - stop.spentEUR);

          return (
            <div
              key={stop.id}
              className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm space-y-3 hover:border-purple-200 transition-all"
            >
              {/* Stop Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{stop.flag}</span>
                  <div>
                    <h4 className="font-black text-stone-900 text-base flex items-center gap-2">
                      <span>{stop.city}, {stop.country}</span>
                    </h4>
                    <span className="inline-block mt-0.5 px-2.5 py-0.5 bg-purple-50 text-purple-700 text-[11px] font-extrabold rounded-md border border-purple-200/70">
                      {stop.visaName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button 
                    title="Edit stop"
                    className="w-7 h-7 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 flex items-center justify-center transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDeleteStopLocal(stop.id)}
                    title="Delete stop"
                    className="w-7 h-7 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Timing & Coworking detail */}
              <div className="flex flex-wrap items-center justify-between text-xs text-stone-500 font-semibold pt-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-600" />
                  <span>{stop.durationDays}d · {stop.dates}</span>
                </span>
                <span className="text-stone-400 italic">
                  {stop.coworking}
                </span>
              </div>

              {/* Budget progress bar (matching Screenshot 3 Bangkok stop) */}
              <div className="pt-2 border-t border-stone-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-stone-900">
                    €{stop.budgetEUR}
                  </span>
                  <span className="text-stone-500 font-medium">
                    Spent: <strong className="text-stone-800">€{stop.spentEUR}</strong> · <strong className="text-emerald-600">€{leftEUR} left</strong>
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-orange-500 rounded-full transition-all duration-500"
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
          className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-xl shadow-purple-600/30 flex items-center justify-center transition-all transform active:scale-95"
          title="Add Stop"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Add Stop Modal */}
      {isAddStopModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateStop} className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-stone-900 text-base">Add Trip Stop</h3>
              <button
                type="button"
                onClick={() => setIsAddStopModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="e.g. Kuala Lumpur"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Country</label>
                <input
                  type="text"
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  placeholder="e.g. Malaysia"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Duration (Days)</label>
                <input
                  type="number"
                  value={newDuration}
                  onChange={(e) => setNewDuration(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Stop Budget (€)</label>
                <input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Visa Requirement Auto-Check</label>
              <input
                type="text"
                value={newVisa}
                onChange={(e) => setNewVisa(e.target.value)}
                placeholder="e.g. Tourist 90-day Waiver"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Coworking Space</label>
              <input
                type="text"
                value={newCoworking}
                onChange={(e) => setNewCoworking(e.target.value)}
                placeholder="e.g. Common Ground KL"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddStopModalOpen(false)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs shadow-md shadow-purple-600/30"
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
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-stone-900 text-sm">Collaborative Trip Planning</h4>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed">
              Invite travel companions or remote coworkers to co-plan stops, split housing budgets, and sync flight arrival days in real-time.
            </p>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-2">
              <span className="text-xs text-stone-600 font-mono truncate">
                https://nomados.app/trip/se-asia-workation
              </span>
              <button
                onClick={handleCopyShareLink}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs shrink-0 transition-colors"
              >
                {copiedLink ? 'Copied! ✓' : 'Copy'}
              </button>
            </div>

            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-stone-700 block">Collaborators (3)</span>
              <div className="flex items-center gap-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                  alt="You"
                  className="w-8 h-8 rounded-full border-2 border-purple-500 object-cover"
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
    </div>
  );
};

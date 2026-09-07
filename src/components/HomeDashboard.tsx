import React, { useState } from 'react';
import { 
  MapPin, 
  Plane, 
  Clock, 
  DollarSign, 
  ChevronRight, 
  Info, 
  CheckCircle2, 
  Calendar, 
  Users, 
  MessageSquare, 
  Sparkles, 
  Plus, 
  Bell,
  Compass,
  ArrowRight,
  Flame,
  AlertTriangle,
  FileText,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { NomadState, NearbyNomad, NomadEvent } from '../types';

interface HomeDashboardProps {
  state: NomadState;
  onNavigateTab: (tab: 'home' | 'travel' | 'explore' | 'social' | 'me') => void;
  onOpenPricing: () => void;
  onOpenOnboarding: () => void;
  onToggleEventRSVP: (eventId: string) => void;
  onOpenCreateMeetup: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  state,
  onNavigateTab,
  onOpenPricing,
  onOpenOnboarding,
  onToggleEventRSVP,
  onOpenCreateMeetup,
}) => {
  const [selectedNomad, setSelectedNomad] = useState<NearbyNomad | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [showAlertsExpanded, setShowAlertsExpanded] = useState(true);

  // Calculations
  const totalSpent = state.expenses.reduce((acc, exp) => acc + exp.amountUSD, 0);
  const nextTrip = state.trips.find(t => t.id !== 'trip-current') || state.trips[0];
  
  // Calculate Schengen days used
  const schengenDaysUsed = state.schengenStays.reduce((acc, stay) => {
    const entry = new Date(stay.entryDate).getTime();
    const exit = new Date(stay.exitDate).getTime();
    const days = Math.max(1, Math.round((exit - entry) / (1000 * 60 * 60 * 24)));
    return acc + days;
  }, 0);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setSelectedNomad(null);
      setChatMessage('');
    }, 1200);
  };

  // Find founder nomad (Eva) or first nearby nomad
  const founderNomad = state.nearbyNomads.find(n => n.name.includes('Eva')) || state.nearbyNomads[0];

  return (
    <div id="home-dashboard-view" className="space-y-4 pb-24 max-w-2xl mx-auto px-4 pt-3">
      {/* 1. Header bar matching Screenshot 1 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-orange-600/30">
            🌐
          </div>
          <span className="font-extrabold text-stone-900 text-base tracking-tight">
            NomadOS
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!state.user.isPro ? (
            <button
              id="home-upgrade-pill-btn"
              onClick={onOpenPricing}
              className="px-3.5 py-1.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-700 text-white text-xs font-black rounded-full shadow-md shadow-orange-600/25 flex items-center gap-1.5 transition-all transform active:scale-95"
            >
              👑 <span>Upgrade Pro</span>
            </button>
          ) : (
            <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black rounded-full flex items-center gap-1">
              👑 PRO
            </span>
          )}

          <button
            onClick={() => onNavigateTab('me')}
            className="w-8 h-8 rounded-full overflow-hidden border-2 border-orange-500/40 hover:border-orange-600 transition-colors"
          >
            <img src={state.user.avatarUrl} alt={state.user.name} className="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      {/* 2. 4-stat cards 2x2 grid matching Screenshot 1 */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Location Card */}
        <div 
          onClick={() => onNavigateTab('social')}
          className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm hover:border-orange-300 transition-all cursor-pointer flex flex-col justify-between h-28 group"
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            <div className="flex items-center gap-1.5 text-stone-500">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              <span>Location</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-orange-600 transition-colors" />
          </div>
          <div>
            <h4 className="text-lg font-black text-stone-900 leading-tight">{state.currentCity}</h4>
            <p className="text-xs text-stone-400">{state.currentCountry}</p>
          </div>
        </div>

        {/* Next Trip Card */}
        <div 
          onClick={() => onNavigateTab('travel')}
          className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm hover:border-orange-300 transition-all cursor-pointer flex flex-col justify-between h-28 group"
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            <div className="flex items-center gap-1.5 text-stone-500">
              <Plane className="w-3.5 h-3.5 text-orange-600" />
              <span>Next Trip</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-orange-600 transition-colors" />
          </div>
          <div>
            <h4 className="text-lg font-black text-stone-900 leading-tight">28 days</h4>
            <p className="text-xs text-stone-500 font-bold">🇲🇽 Mexico City</p>
          </div>
        </div>

        {/* Visa Card */}
        <div 
          onClick={() => onNavigateTab('travel')}
          className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm hover:border-orange-300 transition-all cursor-pointer flex flex-col justify-between h-28 group"
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            <div className="flex items-center gap-1.5 text-stone-500">
              <Clock className="w-3.5 h-3.5 text-orange-600" />
              <span>Visa</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-orange-600 transition-colors" />
          </div>
          <div>
            <h4 className="text-lg font-black text-rose-600 leading-tight">13 days</h4>
            <p className="text-xs text-stone-400">🔴 e-Visa (90 days)</p>
          </div>
        </div>

        {/* Spent Card */}
        <div 
          onClick={() => onNavigateTab('travel')}
          className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm hover:border-orange-300 transition-all cursor-pointer flex flex-col justify-between h-28 group"
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            <div className="flex items-center gap-1.5 text-stone-500">
              <DollarSign className="w-3.5 h-3.5 text-orange-600" />
              <span>Spent</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-orange-600 transition-colors" />
          </div>
          <div>
            <h4 className="text-lg font-black text-stone-900 leading-tight">€586</h4>
            <p className="text-xs text-orange-600 font-bold group-hover:underline">
              View insights →
            </p>
          </div>
        </div>
      </div>

      {/* 3. 4 days streak widget matching Screenshot 1 */}
      <div className="bg-white rounded-3xl p-3.5 border border-stone-200/80 shadow-sm flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-base font-black">
            🔥
          </div>
          <div>
            <span className="font-extrabold text-stone-900 text-sm block">4 days streak</span>
            <span className="text-[11px] text-stone-400">Daily expenses & compliance active</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-stone-400 text-xs font-semibold">
          <span>Best: 4 days</span>
          <Info className="w-3.5 h-3.5 text-stone-400 cursor-pointer" />
        </div>
      </div>

      {/* 4. Alerts Accordion matching Screenshot 1 */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">⚠️</span>
            <h4 className="text-sm font-extrabold text-stone-900">Alerts</h4>
          </div>
          <button
            onClick={() => setShowAlertsExpanded(!showAlertsExpanded)}
            className="text-xs font-bold text-stone-400 hover:text-stone-600 flex items-center gap-1"
          >
            <span>{showAlertsExpanded ? 'Show less' : 'Show all (4)'}</span>
            {showAlertsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showAlertsExpanded && (
          <div className="space-y-2 pt-1 animate-in fade-in">
            {/* ACTION: Thailand Visa */}
            <div className="p-3 bg-rose-50 border border-rose-200/90 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 bg-rose-600 text-white font-black text-[10px] rounded-md tracking-wider">
                  ACTION
                </span>
                <span className="font-bold text-rose-950 text-xs">
                  Your Thailand Visa Exemption has expired
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-rose-400" />
            </div>

            {/* WARNING: Vietnam e-Visa */}
            <div className="p-3 bg-amber-50 border border-amber-200/90 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 bg-amber-500 text-white font-black text-[10px] rounded-md tracking-wider">
                  WARNING
                </span>
                <span className="font-bold text-amber-950 text-xs">
                  Your Vietnam e-Visa (90 days) expires in 13 days
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
            </div>

            {/* WARNING: IDP */}
            <div className="p-3 bg-amber-50 border border-amber-200/90 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 bg-amber-500 text-white font-black text-[10px] rounded-md tracking-wider">
                  WARNING
                </span>
                <span className="font-bold text-amber-950 text-xs">
                  International Driving Permit expires in 17 days — renew soon!
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
            </div>

            {/* INFO: Mexico trip */}
            <div className="p-3 bg-stone-100 border border-stone-300/90 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 bg-stone-800 text-white font-black text-[10px] rounded-md tracking-wider">
                  INFO
                </span>
                <span className="font-bold text-stone-900 text-xs">
                  Your trip to Mexico City, Mexico starts in 28 days
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            </div>
          </div>
        )}
      </div>

      {/* 5. Nomads in Bali matching Screenshot 1 */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">👋</span>
            <h4 className="text-sm font-extrabold text-stone-900">
              Nomads in {state.currentCity} (1 found)
            </h4>
          </div>
          <button
            onClick={() => onNavigateTab('social')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>Radar map</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {founderNomad && (
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between hover:border-orange-200 transition-all">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={founderNomad.avatarUrl}
                  alt={founderNomad.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-orange-500/40"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div>
                <h5 className="font-black text-stone-900 text-xs">{founderNomad.name}</h5>
                <p className="text-[11px] text-orange-600 font-bold">
                  NomadOS Founder · {founderNomad.currentCity || founderNomad.location}
                </p>
                <p className="text-[10px] text-stone-400 line-clamp-1 mt-0.5">
                  Building the OS for location independent workers
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedNomad(founderNomad)}
              className="w-9 h-9 rounded-full bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center transition-colors shadow-md shadow-orange-600/20"
              title="Chat with Eva"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 6. Quick Launch Shortcuts (Itinerary, Trips, Vault) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
        <button
          onClick={() => onNavigateTab('travel')}
          className="p-3 bg-white rounded-2xl border border-stone-200 hover:border-orange-300 text-left transition-all shadow-sm group"
        >
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition-transform">
            🗺️
          </div>
          <span className="text-xs font-black text-stone-900 block">Multi-Stop Trips</span>
          <span className="text-[11px] text-stone-400">SE Asia & Europe</span>
        </button>

        <button
          onClick={() => onNavigateTab('travel')}
          className="p-3 bg-white rounded-2xl border border-stone-200 hover:border-orange-300 text-left transition-all shadow-sm group"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition-transform">
            📅
          </div>
          <span className="text-xs font-black text-stone-900 block">Day Itinerary AI</span>
          <span className="text-[11px] text-stone-400">Hour-by-hour plans</span>
        </button>

        <button
          onClick={() => onNavigateTab('travel')}
          className="p-3 bg-white rounded-2xl border border-stone-200 hover:border-orange-300 text-left transition-all shadow-sm group col-span-2 sm:col-span-1"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition-transform">
            🛡️
          </div>
          <span className="text-xs font-black text-stone-900 block">Schengen 90/180</span>
          <span className="text-[11px] text-stone-400">80 days remaining</span>
        </button>
      </div>

      {/* Direct Chat Modal */}
      {selectedNomad && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={selectedNomad.avatarUrl}
                  alt={selectedNomad.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-orange-500"
                />
                <div>
                  <h4 className="font-extrabold text-stone-900 text-sm">{selectedNomad.name}</h4>
                  <p className="text-[10px] text-orange-600 font-bold">{selectedNomad.currentCity || selectedNomad.location}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNomad(null)}
                className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {messageSent ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-center text-xs font-bold">
                Message delivered to {selectedNomad.name}! 🚀
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-3">
                <textarea
                  required
                  rows={3}
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder={`Hey ${selectedNomad.name.split(' ')[0]}, want to grab a coffee or cowork today?`}
                  className="w-full p-3 rounded-2xl border border-stone-200 text-xs focus:outline-none focus:border-orange-500"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold rounded-xl text-xs shadow-md shadow-orange-600/30 transition-colors"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

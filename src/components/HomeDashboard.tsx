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
  const currentTrip = state.trips.find(t => t.id === 'trip-current') || state.trips[0];
  
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
    <div id="home-dashboard-view" className="space-y-4 pb-28 max-w-2xl mx-auto px-4 pt-3">
      {/* 1. Header bar with 2026 Sleek Brand Identity */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white flex items-center justify-center font-black text-sm shadow-md shadow-indigo-500/20">
            🌐
          </div>
          <div>
            <span className="font-extrabold text-slate-900 text-base tracking-tight font-display">
              Nomad<span className="text-indigo-600">OS</span>
            </span>
            <span className="text-[10px] text-slate-400 font-semibold block -mt-0.5">
              Live Command Center
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!state.user.isPro ? (
            <button
              id="home-upgrade-pill-btn"
              onClick={onOpenPricing}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black rounded-full shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all transform active:scale-95"
            >
              <span>👑</span>
              <span>Upgrade Pro</span>
            </button>
          ) : (
            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-black rounded-full flex items-center gap-1">
              👑 PRO
            </span>
          )}

          <button
            onClick={() => onNavigateTab('me')}
            className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-indigo-500/30 hover:ring-indigo-600 transition-all shadow-sm"
          >
            <img src={state.user.avatarUrl} alt={state.user.name} className="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      {/* 2. CINEMATIC DESTINATION HERO CARD (High-Res Free Photography) */}
      <div 
        onClick={() => onNavigateTab('social')}
        className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-md group cursor-pointer bg-slate-900"
      >
        <img 
          src={currentTrip?.coverUrl || "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80"}
          alt="Current Destination - Bali"
          className="w-full h-44 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active Base · 🇮🇩 Canggu, Bali</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium">
            <span>☀️ 29°C</span>
            <span className="text-white/40">·</span>
            <span>15:45 WITA</span>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display drop-shadow-sm">
              Bali, Indonesia
            </h3>
            <p className="text-xs text-white/80 font-medium flex items-center gap-2 mt-0.5">
              <span>VoA B213 (Day 28 of 30)</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="text-amber-300 font-bold">2 days to renew</span>
            </p>
          </div>

          <span className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-xs border border-white/30 flex items-center gap-1 group-hover:translate-x-0.5 transition-all">
            <span>Nomad Radar</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* 3. 4-STAT CARDS 2x2 GRID (Graphic Designer Elevation) */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Location Card */}
        <div 
          onClick={() => onNavigateTab('social')}
          className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-28 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-50/60 rounded-full -mr-6 -mt-6 pointer-events-none" />
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <div className="flex items-center gap-1.5 text-indigo-600">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-slate-500 font-bold">Location</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-900 leading-tight font-display">{state.currentCity}</h4>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <span>{state.currentCountry}</span>
              <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1 rounded">UTC+8</span>
            </p>
          </div>
        </div>

        {/* Next Trip Card */}
        <div 
          onClick={() => onNavigateTab('travel')}
          className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-28 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-sky-50/60 rounded-full -mr-6 -mt-6 pointer-events-none" />
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <div className="flex items-center gap-1.5 text-sky-600">
              <Plane className="w-3.5 h-3.5" />
              <span className="text-slate-500 font-bold">Next Trip</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <h4 className="text-lg font-black text-slate-900 leading-tight font-display">28 days</h4>
              <span className="text-[10px] text-sky-600 font-bold bg-sky-50 px-1 rounded">Oct 5</span>
            </div>
            <p className="text-xs text-slate-600 font-bold">🇲🇽 Mexico City</p>
          </div>
        </div>

        {/* Visa Card */}
        <div 
          onClick={() => onNavigateTab('travel')}
          className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm hover:border-amber-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-28 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50/60 rounded-full -mr-6 -mt-6 pointer-events-none" />
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <div className="flex items-center gap-1.5 text-amber-600">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-slate-500 font-bold">Visa Window</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <h4 className="text-lg font-black text-rose-600 leading-tight font-display">13 days</h4>
              <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1 rounded">Action</span>
            </div>
            <p className="text-xs text-slate-500 font-medium truncate">Vietnam e-Visa (90d)</p>
          </div>
        </div>

        {/* Spent Card */}
        <div 
          onClick={() => onNavigateTab('travel')}
          className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-28 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50/60 rounded-full -mr-6 -mt-6 pointer-events-none" />
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <div className="flex items-center gap-1.5 text-emerald-600">
              <DollarSign className="w-3.5 h-3.5" />
              <span className="text-slate-500 font-bold">Spend / Cap</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <h4 className="text-lg font-black text-slate-900 leading-tight font-display">€586</h4>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1 rounded">21%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '21%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 4. 4 DAYS STREAK WIDGET (2026 Solar Flame Glow) */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent rounded-3xl p-3.5 border border-amber-200/80 shadow-sm flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-lg font-black shadow-md shadow-orange-500/25">
            🔥
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-slate-900 text-sm font-display">4-Day Nomad Streak</span>
              <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md">
                Active
              </span>
            </div>
            <span className="text-[11px] text-slate-500">Expenses, taxes & legal compliance verified</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
          <span>Best: 4d</span>
          <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-slate-600" />
        </div>
      </div>

      {/* 5. SMART ALERTS ACCORDION */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-rose-50 text-rose-600 font-bold text-xs">
              ⚠️
            </span>
            <h4 className="text-sm font-black text-slate-900 font-display">
              Smart Nomad Alerts <span className="text-xs text-slate-400 font-medium">(4)</span>
            </h4>
          </div>
          <button
            onClick={() => setShowAlertsExpanded(!showAlertsExpanded)}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1"
          >
            <span>{showAlertsExpanded ? 'Collapse' : 'Expand all'}</span>
            {showAlertsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showAlertsExpanded && (
          <div className="space-y-2 pt-1 animate-in fade-in">
            {/* ACTION: Thailand Visa */}
            <div 
              onClick={() => onNavigateTab('travel')}
              className="p-3 bg-rose-50/70 hover:bg-rose-50 border border-rose-200/80 rounded-2xl flex items-center justify-between text-xs cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 bg-rose-600 text-white font-black text-[10px] rounded-md tracking-wider">
                  ACTION
                </span>
                <span className="font-bold text-rose-950 text-xs">
                  Thailand Visa Exemption expired · Archive or update exit status
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            </div>

            {/* WARNING: Vietnam e-Visa */}
            <div 
              onClick={() => onNavigateTab('travel')}
              className="p-3 bg-amber-50/70 hover:bg-amber-50 border border-amber-200/80 rounded-2xl flex items-center justify-between text-xs cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 bg-amber-500 text-white font-black text-[10px] rounded-md tracking-wider">
                  WARNING
                </span>
                <span className="font-bold text-amber-950 text-xs">
                  Vietnam e-Visa (90 days) expires in 13 days
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            </div>

            {/* WARNING: IDP */}
            <div 
              onClick={() => onNavigateTab('travel')}
              className="p-3 bg-amber-50/70 hover:bg-amber-50 border border-amber-200/80 rounded-2xl flex items-center justify-between text-xs cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 bg-amber-500 text-white font-black text-[10px] rounded-md tracking-wider">
                  WARNING
                </span>
                <span className="font-bold text-amber-950 text-xs">
                  International Driving Permit expires in 17 days — renew soon!
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            </div>

            {/* INFO: Mexico trip */}
            <div 
              onClick={() => onNavigateTab('travel')}
              className="p-3 bg-sky-50/70 hover:bg-sky-50 border border-sky-200/80 rounded-2xl flex items-center justify-between text-xs cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 bg-sky-600 text-white font-black text-[10px] rounded-md tracking-wider">
                  INFO
                </span>
                <span className="font-bold text-sky-950 text-xs">
                  Your trip to Mexico City starts in 28 days
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            </div>
          </div>
        )}
      </div>

      {/* 6. NOMADS IN BALI & FOUNDER RADAR */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">👋</span>
            <h4 className="text-sm font-black text-slate-900 font-display">
              Nomads in {state.currentCity} <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded-full">1 nearby</span>
            </h4>
          </div>
          <button
            onClick={() => onNavigateTab('social')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>Live Radar</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {founderNomad && (
          <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex items-center justify-between hover:border-indigo-300 hover:bg-white transition-all shadow-xs">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={founderNomad.avatarUrl}
                  alt={founderNomad.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/40"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h5 className="font-black text-slate-900 text-xs">{founderNomad.name}</h5>
                  <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-700 text-[9px] font-black rounded">
                    FOUNDER
                  </span>
                </div>
                <p className="text-[11px] text-indigo-600 font-bold">
                  NomadOS Creator · {founderNomad.currentCity || founderNomad.location}
                </p>
                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                  Building the OS for location independent workers
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedNomad(founderNomad)}
              className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm shadow-indigo-600/20"
              title="Chat with Eva"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Say Hi</span>
            </button>
          </div>
        )}
      </div>

      {/* 7. QUICK LAUNCH MODULES WITH VISUAL PHOTOGRAPHY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
        {/* Multi-Stop Trips */}
        <div
          onClick={() => onNavigateTab('travel')}
          className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm group cursor-pointer h-28 bg-slate-900"
        >
          <img 
            src="https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80" 
            alt="Multi-Stop Trips"
            className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-2.5 left-3 right-3">
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">Itinerary</span>
            <h5 className="text-xs font-black text-white leading-tight font-display">Multi-Stop Trips</h5>
            <span className="text-[10px] text-slate-300">TH 🇹🇭 → VN 🇻🇳 → ID 🇮🇩</span>
          </div>
        </div>

        {/* Day Itinerary AI */}
        <div
          onClick={() => onNavigateTab('travel')}
          className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm group cursor-pointer h-28 bg-slate-900"
        >
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80" 
            alt="Day Schedule"
            className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-2.5 left-3 right-3">
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">AI Schedule</span>
            <h5 className="text-xs font-black text-white leading-tight font-display">Day-by-Day AI</h5>
            <span className="text-[10px] text-slate-300">Hour-by-hour focus & fun</span>
          </div>
        </div>

        {/* Schengen 90/180 */}
        <div
          onClick={() => onNavigateTab('travel')}
          className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm group cursor-pointer h-28 bg-slate-900"
        >
          <img 
            src="https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=600&q=80" 
            alt="Schengen Visa"
            className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-2.5 left-3 right-3">
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">Compliance</span>
            <h5 className="text-xs font-black text-white leading-tight font-display">Schengen 90/180</h5>
            <span className="text-[10px] text-emerald-400 font-bold">80 days safe in EU 🇪🇺</span>
          </div>
        </div>
      </div>

      {/* Direct Chat Modal */}
      {selectedNomad && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={selectedNomad.avatarUrl}
                  alt={selectedNomad.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500"
                />
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm font-display">{selectedNomad.name}</h4>
                  <p className="text-[10px] text-indigo-600 font-bold">{selectedNomad.currentCity || selectedNomad.location}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNomad(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {messageSent ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-center text-xs font-bold border border-emerald-200">
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
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs shadow-md shadow-indigo-600/30 transition-all"
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

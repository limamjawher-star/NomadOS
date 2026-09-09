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
  ChevronUp,
  Crown,
  Wifi,
  Coffee,
  Star,
  Zap,
  X,
  Sun
} from 'lucide-react';
import { NomadState, NearbyNomad, NomadEvent } from '../types';
import { Logo } from './Logo';
import { CountryFlag } from './CountryFlag';

interface HomeDashboardProps {
  state: NomadState;
  onNavigateTab: (tab: 'home' | 'travel' | 'finance' | 'explore' | 'social' | 'me') => void;
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

  const totalSpentUSD = state.expenses.reduce((acc, e) => acc + e.amountUSD, 0);
  const budgetPercentage = Math.min(100, Math.round((totalSpentUSD / (state.monthlyBudgetUSD || 2800)) * 100));
  const totalSavingsUSD = state.savingsTotalUSD || 28400;
  const runwayMonths = ((totalSavingsUSD) / (state.monthlyBudgetUSD || 2800)).toFixed(1);

  return (
    <div id="home-dashboard-view" className="space-y-6 pb-28 max-w-2xl mx-auto px-4 pt-4">
      {/* Greeting & Live Base Status */}
      <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight font-display">
            Welcome back, {state.user.name ? state.user.name.split(' ')[0] : 'Nomad'}
          </h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Everything is in order for your nomad journey today.
          </p>
        </div>
        {(state.currentCity || state.currentCountry) && (
          <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full border border-orange-200/60 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{[state.currentCity, state.currentCountry].filter(Boolean).join(', ')}</span>
          </div>
        )}
      </div>

      {/* 2. CINEMATIC DESTINATION HERO CARD (Primary Focal Element) */}
      <div 
        onClick={() => onNavigateTab('social')}
        className="relative rounded-xl overflow-hidden border border-slate-200/90 shadow-md group cursor-pointer bg-slate-900 transition-all hover:shadow-lg"
      >
        <img 
          src={currentTrip?.coverUrl || "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80"}
          alt={`Current Destination - ${currentTrip?.city || 'Unknown'}`}
          className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
        />
        {/* Consistent Photographic Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div className="flex items-center gap-1">
              <span>{currentTrip ? 'Active Base ·' : 'No Active Trip'}</span>
              {currentTrip?.countryCode && <CountryFlag code={currentTrip.countryCode} name={currentTrip.country} size="xs" />}
              {currentTrip && <span>{currentTrip.city}, {currentTrip.country}</span>}
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium">
            <span className="flex items-center gap-1"><Sun className="w-3.5 h-3.5 text-amber-400" /> 29°C</span>
            <span className="text-white/40">·</span>
            <span>Local Time</span>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight font-display drop-shadow-xs">
              {currentTrip ? `${currentTrip.city}, ${currentTrip.country}` : 'Ready for a new adventure?'}
            </h3>
            {currentTrip ? (
              <p className="text-xs text-white/85 font-normal flex items-center gap-2 mt-1">
                <span>{currentTrip.visaType || 'Tourist Visa'}</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-[10px] font-medium">
                  Active Stay
                </span>
              </p>
            ) : (
              <p className="text-xs text-white/85 font-normal flex items-center gap-2 mt-1">
                <span>Add your first trip in the Travel tab</span>
              </p>
            )}
          </div>

          <span className="px-3.5 py-1.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-medium text-xs shadow-xs flex items-center gap-1 group-hover:translate-x-0.5 transition-all">
            <span>Nomad Radar</span>
            <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.75} />
          </span>
        </div>
      </div>

      {/* 3. 4-STAT CARDS 2x2 GRID (Standard Elevation & Strict Type Scale) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Location Card */}
        <div 
          onClick={() => onNavigateTab('social')}
          className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs hover:border-stone-300 transition-all cursor-pointer flex flex-col justify-between min-h-[7.5rem] group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-stone-500">
              Location
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700 group-hover:translate-x-0.5 transition-all" strokeWidth={1.75} />
          </div>
          <div className="mt-2">
            <h4 className="text-2xl sm:text-3xl font-semibold text-stone-900 leading-tight font-display truncate">
              {state.currentCity}
            </h4>
            <p className="text-xs text-stone-500 font-normal flex items-center gap-1.5 mt-1">
              <span>{state.currentCountry}</span>
              <span className="text-[10px] text-stone-600 font-medium bg-stone-100 px-1.5 py-0.2 rounded-full">UTC+8</span>
            </p>
          </div>
        </div>

        {/* Next Trip Card */}
        <div 
          onClick={() => onNavigateTab('travel')}
          className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs hover:border-stone-300 transition-all cursor-pointer flex flex-col justify-between min-h-[7.5rem] group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-stone-500">
              Next Trip
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700 group-hover:translate-x-0.5 transition-all" strokeWidth={1.75} />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl sm:text-3xl font-semibold text-stone-900 leading-tight font-display">
                28 days
              </h4>
              <span className="text-[10px] text-stone-600 font-medium bg-stone-100 px-1.5 py-0.2 rounded-full">Oct 5</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <CountryFlag code="MX" name="Mexico" size="xs" />
              <p className="text-xs text-stone-600 font-normal">Mexico City</p>
            </div>
          </div>
        </div>

        {/* Visa Card */}
        <div 
          onClick={() => onNavigateTab('travel')}
          className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs hover:border-stone-300 transition-all cursor-pointer flex flex-col justify-between min-h-[7.5rem] group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-stone-500">
              Visa Window
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700 group-hover:translate-x-0.5 transition-all" strokeWidth={1.75} />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl sm:text-3xl font-semibold text-stone-900 leading-tight font-display">
                13 days
              </h4>
              <span className="text-[10px] text-amber-800 font-medium bg-amber-50 border border-amber-200/60 px-2 py-0.2 rounded-full">Action</span>
            </div>
            <p className="text-xs text-stone-500 font-normal truncate mt-1">Vietnam e-Visa (90d)</p>
          </div>
        </div>

        {/* Spent Card */}
        <div 
          onClick={() => onNavigateTab('finance')}
          className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs hover:border-stone-300 transition-all cursor-pointer flex flex-col justify-between min-h-[7.5rem] group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-stone-500">
              Spent / Budget
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700 group-hover:translate-x-0.5 transition-all" strokeWidth={1.75} />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline justify-between">
              <h4 className="text-2xl sm:text-3xl font-semibold text-stone-900 leading-tight font-display">
                ${totalSpentUSD.toLocaleString()}
              </h4>
              <span className="text-[10px] text-stone-600 font-medium bg-stone-100 px-2 py-0.2 rounded-full">{budgetPercentage}%</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-orange-500 h-full rounded-full" style={{ width: `${budgetPercentage}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* 4. FINANCIAL PLANNING & RUNWAY SPOTLIGHT (High-Resolution Visual) */}
      <div 
        onClick={() => onNavigateTab('finance')}
        className="group relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-md cursor-pointer bg-slate-900"
      >
        <img 
          src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80" 
          alt="Nomad Financial Planning & Runway"
          className="w-full h-32 sm:h-36 object-cover opacity-75 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-semibold uppercase tracking-wider">
            Financial Freedom Engine
          </span>
          <span className="text-xs font-medium text-emerald-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{runwayMonths} Mo Runway</span>
          </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div>
            <h4 className="text-sm sm:text-base font-semibold leading-tight">
              Nomad Financial Planning & Runway
            </h4>
            <p className="text-[11px] text-white/80 mt-0.5 font-normal">
              Track remote income, full expenses, tax reserves & global runway
            </p>
          </div>

          <button 
            type="button"
            onClick={() => onNavigateTab('finance')}
            className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white text-white hover:text-stone-900 text-xs font-medium backdrop-blur-md transition-all flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <span>Open</span>
            <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* 5. 4 DAYS STREAK WIDGET (Outline Icon & Clean Elevation) */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
            <Flame className="w-4 h-4 text-orange-600" strokeWidth={1.75} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 text-sm font-display">4-Day Nomad Streak</span>
              <span className="px-2 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-medium rounded-full">
                Active
              </span>
            </div>
            <span className="text-xs text-slate-500 font-normal">Expenses, taxes & legal days verified</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
          <span>Best: 4d</span>
          <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-slate-600" />
        </div>
      </div>

      {/* 5. SMART ALERTS ACCORDION */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-50 text-rose-600 font-medium text-xs">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" strokeWidth={1.75} />
            </span>
            <h4 className="text-sm font-semibold text-slate-900 font-display">
              Smart Nomad Alerts <span className="text-xs text-slate-400 font-normal">(4)</span>
            </h4>
          </div>
          <button
            onClick={() => setShowAlertsExpanded(!showAlertsExpanded)}
            className="text-xs font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1"
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
              className="p-3 bg-rose-50/70 hover:bg-rose-50 border border-rose-200/80 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 bg-rose-600 text-white font-medium text-[10px] rounded-full tracking-wider">
                  ACTION
                </span>
                <span className="font-normal text-rose-950 text-xs">
                  Thailand Visa Exemption expired · Archive or update exit status
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            </div>

            {/* WARNING: Vietnam e-Visa */}
            <div 
              onClick={() => onNavigateTab('travel')}
              className="p-3 bg-amber-50/70 hover:bg-amber-50 border border-amber-200/80 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 bg-amber-500 text-white font-medium text-[10px] rounded-full tracking-wider">
                  WARNING
                </span>
                <span className="font-normal text-amber-950 text-xs">
                  Vietnam e-Visa (90 days) expires in 13 days
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            </div>

            {/* WARNING: IDP */}
            <div 
              onClick={() => onNavigateTab('travel')}
              className="p-3 bg-amber-50/70 hover:bg-amber-50 border border-amber-200/80 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 bg-amber-500 text-white font-medium text-[10px] rounded-full tracking-wider">
                  WARNING
                </span>
                <span className="font-normal text-amber-950 text-xs">
                  International Driving Permit expires in 17 days — renew soon!
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            </div>

            {/* INFO: Mexico trip */}
            <div 
              onClick={() => onNavigateTab('travel')}
              className="p-3 bg-orange-50/70 hover:bg-orange-50 border border-orange-200/80 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 bg-orange-500 text-white font-medium text-[10px] rounded-full tracking-wider">
                  INFO
                </span>
                <span className="font-normal text-orange-950 text-xs">
                  Your trip to Mexico City starts in 28 days
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            </div>
          </div>
        )}
      </div>

      {/* 6. NOMADS IN BALI & FOUNDER RADAR */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center font-medium">
              <Users className="w-3.5 h-3.5" strokeWidth={1.75} />
            </div>
            <h4 className="text-sm font-semibold text-slate-900 font-display">
              Nomads in {state.currentCity} <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-0.5 rounded-full">1 nearby</span>
            </h4>
          </div>
          <button
            onClick={() => onNavigateTab('social')}
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>Live Radar</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {founderNomad && (
          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center justify-between hover:border-slate-300 hover:bg-white transition-all shadow-xs">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={founderNomad.avatarUrl}
                  alt={founderNomad.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-orange-500/30"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h5 className="font-semibold text-slate-900 text-xs">{founderNomad.name}</h5>
                  <span className="px-1.5 py-0.2 bg-slate-900 text-white text-[9px] font-medium rounded-full">
                    FOUNDER
                  </span>
                </div>
                <p className="text-[11px] text-orange-600 font-medium">
                  NomadOS Creator · {founderNomad.currentCity || founderNomad.location}
                </p>
                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-normal">
                  {founderNomad.bio}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedNomad(founderNomad)}
              className="px-3.5 py-1.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm"
              title="Chat with Eva"
            >
              <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Chat</span>
            </button>
          </div>
        )}
      </div>

      {/* 7. VISUAL DESTINATION GALLERY */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-orange-500" strokeWidth={1.75} />
            <h4 className="text-sm font-semibold text-slate-900 font-display">
              Upcoming Stops & Trending Nomad Hubs
            </h4>
          </div>
          <button
            onClick={() => onNavigateTab('explore')}
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>Explore All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {/* Mexico City */}
          <div
            onClick={() => onNavigateTab('travel')}
            className="group relative rounded-xl overflow-hidden border border-slate-200 cursor-pointer shadow-xs"
          >
            <div className="h-28 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=600&q=80"
                alt="Mexico City"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-black/20" />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-orange-500 text-white text-[9px] font-medium tracking-wide">
                NEXT STOP
              </span>
              <div className="absolute bottom-2 left-2 right-2 text-white">
                <div className="flex items-center gap-1.5">
                  <CountryFlag code="MX" name="Mexico" size="xs" />
                  <h5 className="font-semibold text-xs leading-tight">Mexico City</h5>
                </div>
                <p className="text-[10px] text-orange-200 font-normal">Oct 5 · Roma Norte</p>
              </div>
            </div>
            <div className="p-2.5 bg-white flex items-center justify-between text-[10px] font-medium text-slate-500">
              <span>$1,450/mo</span>
              <span className="text-emerald-600 flex items-center gap-0.5">
                <Wifi className="w-2.5 h-2.5" strokeWidth={1.75} /> 120 Mbps
              </span>
            </div>
          </div>

          {/* Lisbon */}
          <div
            onClick={() => onNavigateTab('explore')}
            className="group relative rounded-xl overflow-hidden border border-slate-200 cursor-pointer shadow-xs"
          >
            <div className="h-28 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80"
                alt="Lisbon"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-black/20" />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-white text-[9px] font-medium border border-white/20">
                SCHENGEN
              </span>
              <div className="absolute bottom-2 left-2 right-2 text-white">
                <div className="flex items-center gap-1.5">
                  <CountryFlag code="PT" name="Portugal" size="xs" />
                  <h5 className="font-semibold text-xs leading-tight">Lisbon</h5>
                </div>
                <p className="text-[10px] text-amber-200 font-normal">Dec 1 · Alfama Hub</p>
              </div>
            </div>
            <div className="p-2.5 bg-white flex items-center justify-between text-[10px] font-medium text-slate-500">
              <span>€2,100/mo</span>
              <span className="text-emerald-600 flex items-center gap-0.5">
                <Wifi className="w-2.5 h-2.5" strokeWidth={1.75} /> 150 Mbps
              </span>
            </div>
          </div>

          {/* Tokyo */}
          <div
            onClick={() => onNavigateTab('explore')}
            className="group relative rounded-xl overflow-hidden border border-slate-200 cursor-pointer shadow-xs col-span-2 sm:col-span-1"
          >
            <div className="h-28 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80"
                alt="Tokyo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-black/20" />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-900 text-white text-[9px] font-medium tracking-wide">
                POPULAR
              </span>
              <div className="absolute bottom-2 left-2 right-2 text-white">
                <div className="flex items-center gap-1.5">
                  <CountryFlag code="JP" name="Japan" size="xs" />
                  <h5 className="font-semibold text-xs leading-tight">Tokyo</h5>
                </div>
                <p className="text-[10px] text-slate-200 font-normal">Spring 2027 · Shibuya</p>
              </div>
            </div>
            <div className="p-2.5 bg-white flex items-center justify-between text-[10px] font-medium text-slate-500">
              <span>$2,300/mo</span>
              <span className="text-emerald-600 flex items-center gap-0.5">
                <Wifi className="w-2.5 h-2.5" strokeWidth={1.75} /> 220 Mbps
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 8. NOMAD WORKSPACES & LOCAL HOTSPOTS */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 text-orange-500" strokeWidth={1.75} />
            <h4 className="text-sm font-semibold text-slate-900 font-display">
              Nearby Work Spaces & Work-Friendly Cafes
            </h4>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('explore')}
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
          >
            <span>Live GPS Finder</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Dojo Coworking Pool */}
          <div 
            onClick={() => onNavigateTab('explore')}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all group"
            title="Open Live Workspot Recommendations"
          >
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80"
              alt="Coworking space"
              className="w-14 h-14 rounded-lg object-cover shrink-0 shadow-xs group-hover:scale-105 transition-transform"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-semibold text-slate-900 truncate font-display group-hover:text-orange-600 transition-colors">Dojo Garden & Pool</h5>
                <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.2 rounded-full">180 Mbps</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate font-normal">Echo Beach, Canggu · 350m away</p>
              <div className="text-[10px] text-slate-600 font-medium mt-1 flex items-center gap-1.5">
                <span className="flex items-center gap-1">
                  <Coffee className="w-3 h-3 text-slate-500" strokeWidth={1.75} />
                  <span>Dual Fiber</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-500" strokeWidth={1.75} />
                  <span>4.9 (384 reviews)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Specialty Roastery */}
          <div 
            onClick={() => onNavigateTab('explore')}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all group"
            title="Open Live Workspot Recommendations"
          >
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80"
              alt="Coffee shop"
              className="w-14 h-14 rounded-lg object-cover shrink-0 shadow-xs group-hover:scale-105 transition-transform"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-semibold text-slate-900 truncate font-display group-hover:text-orange-600 transition-colors">Batur Roastery & Labs</h5>
                <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.2 rounded-full">140 Mbps</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate font-normal">Pererenan · 650m away</p>
              <div className="text-[10px] text-slate-600 font-medium mt-1 flex items-center gap-1.5">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-slate-500" strokeWidth={1.75} />
                  <span>Power at every seat</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-500" strokeWidth={1.75} />
                  <span>4.8 (219 reviews)</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 9. QUICK LAUNCH MODULES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {/* Multi-Stop Trips */}
        <div
          onClick={() => onNavigateTab('travel')}
          className="relative rounded-xl overflow-hidden border border-slate-200/90 shadow-xs group cursor-pointer h-28 bg-slate-900"
        >
          <img 
            src="https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80" 
            alt="Multi-Stop Trips"
            className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-black/20" />
          <div className="absolute bottom-3 left-3 right-3">
            <span className="text-[10px] font-medium text-orange-300 uppercase tracking-wider block">Itinerary</span>
            <h5 className="text-xs font-semibold text-white leading-tight font-display">Multi-Stop Trips</h5>
            <div className="flex items-center gap-1 text-[10px] text-slate-300 mt-0.5 font-normal">
              <span>TH</span>
              <CountryFlag code="TH" name="Thailand" size="xs" />
              <span>→ VN</span>
              <CountryFlag code="VN" name="Vietnam" size="xs" />
              <span>→ ID</span>
              <CountryFlag code="ID" name="Indonesia" size="xs" />
            </div>
          </div>
        </div>

        {/* Day Itinerary AI */}
        <div
          onClick={() => onNavigateTab('travel')}
          className="relative rounded-xl overflow-hidden border border-slate-200/90 shadow-xs group cursor-pointer h-28 bg-slate-900"
        >
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80" 
            alt="Day Schedule"
            className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-black/20" />
          <div className="absolute bottom-3 left-3 right-3">
            <span className="text-[10px] font-medium text-amber-300 uppercase tracking-wider block">AI Schedule</span>
            <h5 className="text-xs font-semibold text-white leading-tight font-display">Day-by-Day AI</h5>
            <span className="text-[10px] text-slate-300 font-normal">Hour-by-hour focus & fun</span>
          </div>
        </div>

        {/* Schengen 90/180 */}
        <div
          onClick={() => onNavigateTab('travel')}
          className="relative rounded-xl overflow-hidden border border-slate-200/90 shadow-xs group cursor-pointer h-28 bg-slate-900"
        >
          <img 
            src="https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=600&q=80" 
            alt="Schengen Visa"
            className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-black/20" />
          <div className="absolute bottom-3 left-3 right-3">
            <span className="text-[10px] font-medium text-emerald-300 uppercase tracking-wider block">Compliance</span>
            <h5 className="text-xs font-semibold text-white leading-tight font-display">Schengen 90/180</h5>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium mt-0.5">
              <span>80 days safe in EU</span>
              <CountryFlag code="EU" name="European Union" size="xs" />
            </div>
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
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-orange-500"
                />
                <div>
                  <h4 className="font-semibold text-stone-900 text-sm">{selectedNomad.name}</h4>
                  <p className="text-[10px] text-orange-600 font-medium">{selectedNomad.currentCity || selectedNomad.location}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNomad(null)}
                className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 flex items-center justify-center font-medium cursor-pointer"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            {messageSent ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-center text-xs font-medium border border-emerald-200 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" strokeWidth={1.75} />
                <span>Message delivered to {selectedNomad.name}!</span>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-3">
                <textarea
                  required
                  rows={3}
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder={`Hey ${selectedNomad.name.split(' ')[0]}, want to grab a coffee or cowork today?`}
                  className="w-full p-3 rounded-xl border border-stone-200/80 text-xs font-normal focus:outline-none focus:ring-1 focus:ring-orange-500 bg-stone-50 focus:bg-white"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl text-xs shadow-xs transition-all cursor-pointer"
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

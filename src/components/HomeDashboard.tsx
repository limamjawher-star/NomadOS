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
  ArrowRight
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

  // Calculations
  const totalSpent = state.expenses.reduce((acc, exp) => acc + exp.amountUSD, 0);
  const nextTrip = state.trips.find(t => t.id !== 'trip-current') || state.trips[0];
  
  // Calculate Schengen days used in last 180 days
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

  return (
    <div id="home-dashboard-view" className="space-y-6 pb-24 max-w-2xl mx-auto px-4 pt-4">
      {/* User Status Bar matching screenshot */}
      <div 
        id="user-status-card"
        className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm flex items-center justify-between"
      >
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={state.user.avatarUrl}
              alt={state.user.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-orange-500/30 ring-2 ring-orange-500/10"
            />
            {state.user.isPro && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white p-0.5 rounded-full text-[10px]">
                👑
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-stone-900 text-sm">
                {state.user.name} <span className="text-stone-400 font-normal">{state.user.tag}</span>
              </h3>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-semibold text-stone-600">
                {state.user.rank}
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-xs font-medium text-stone-500">
                {state.user.countriesVisited.length} countries
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!state.user.isPro ? (
            <button
              id="home-upgrade-pill-btn"
              onClick={onOpenPricing}
              className="px-3.5 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black rounded-full shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition-all transform active:scale-95"
            >
              👑 <span>Upgrade</span>
            </button>
          ) : (
            <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black rounded-full flex items-center gap-1">
              👑 PRO
            </span>
          )}
        </div>
      </div>

      {/* 2x2 Quick Cards Grid matching screenshot */}
      <div className="grid grid-cols-2 gap-3">
        {/* Location Card */}
        <div 
          onClick={() => onNavigateTab('social')}
          className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm hover:border-orange-300 transition-all cursor-pointer flex flex-col justify-between h-28 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500 uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              <span>Location</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-orange-500 transition-colors" />
          </div>
          <div>
            <h4 className="text-lg font-black text-stone-900">{state.currentCity}</h4>
            <p className="text-xs text-stone-400">{state.currentCountry}</p>
          </div>
        </div>

        {/* Next Trip Card */}
        <div 
          onClick={() => onNavigateTab('travel')}
          className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm hover:border-orange-300 transition-all cursor-pointer flex flex-col justify-between h-28 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500 uppercase tracking-wider">
              <Plane className="w-3.5 h-3.5 text-orange-500" />
              <span>Next Trip</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-orange-500 transition-colors" />
          </div>
          <div>
            <h4 className="text-lg font-black text-stone-900">{nextTrip?.city || 'Plan Trip'}</h4>
            <p className="text-xs text-stone-400">
              {nextTrip ? `Arrives ${nextTrip.arrivalDate}` : 'No upcoming trip'}
            </p>
          </div>
        </div>

        {/* Visa Card */}
        <div 
          onClick={() => onNavigateTab('travel')}
          className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm hover:border-orange-300 transition-all cursor-pointer flex flex-col justify-between h-28 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              <span>Visa</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-orange-500 transition-colors" />
          </div>
          <div>
            <h4 className="text-lg font-black text-stone-900">
              {Math.max(0, 90 - schengenDaysUsed)}d left
            </h4>
            <p className="text-xs text-stone-400">
              {schengenDaysUsed}/90 Schengen days
            </p>
          </div>
        </div>

        {/* Spent Card */}
        <div 
          onClick={() => onNavigateTab('travel')}
          className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm hover:border-orange-300 transition-all cursor-pointer flex flex-col justify-between h-28 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500 uppercase tracking-wider">
              <DollarSign className="w-3.5 h-3.5 text-orange-500" />
              <span>Spent</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-orange-500 transition-colors" />
          </div>
          <div>
            <h4 className="text-lg font-black text-stone-900">${totalSpent.toLocaleString()}</h4>
            <p className="text-xs text-orange-600 font-semibold group-hover:underline">
              View insights →
            </p>
          </div>
        </div>
      </div>

      {/* Adventure Stats Banner */}
      <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/70 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-700">
          <span className="text-base">📈</span>
          <span>
            {state.user.countriesVisited.length} countries · {state.trips.length} trips · 4 months on the road
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-stone-400 font-medium">
          <span>Start your adventure 2026</span>
          <Info className="w-3.5 h-3.5 text-stone-400" />
        </div>
      </div>

      {/* Smart Alerts Card */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-black text-stone-900">Alerts & Compliance</h4>
          </div>
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            All Good
          </span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-100">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-stone-800">No urgent alerts — you're all set! 🎉</p>
            <p className="text-stone-400 mt-0.5">
              Schengen stay is well within legal allowance. Portugal tax presence is 52/183 days.
            </p>
          </div>
        </div>
      </div>

      {/* Nomads Nearby Section matching competitor */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-black text-stone-900">
              Nomads in {state.currentCity} ({state.nearbyNomads.length} found)
            </h4>
          </div>
          <button
            onClick={() => onNavigateTab('social')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            Discover more nomads 📍
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {state.nearbyNomads.map((nomad) => (
            <div
              key={nomad.id}
              className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm flex flex-col justify-between space-y-3 hover:border-orange-300 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <img
                    src={nomad.avatarUrl}
                    alt={nomad.name}
                    className="w-11 h-11 rounded-full object-cover border border-stone-200"
                  />
                  {nomad.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-stone-900 truncate">{nomad.name}</h5>
                  <p className="text-[11px] text-stone-400 truncate">{nomad.tag}</p>
                  <p className="text-[11px] font-semibold text-orange-600 truncate mt-0.5">
                    {nomad.profession}
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                {nomad.bio}
              </p>

              <button
                onClick={() => setSelectedNomad(nomad)}
                className="w-full py-2 bg-stone-100 hover:bg-orange-50 hover:text-orange-600 text-stone-700 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Say Hi</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events / Meetups Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-black text-stone-900">Upcoming Meetups & Events</h4>
          </div>
          <button
            id="home-create-event-btn"
            onClick={onOpenCreateMeetup}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-full"
          >
            <Plus className="w-3.5 h-3.5" /> Create Meetup
          </button>
        </div>

        <div className="space-y-2.5">
          {state.events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm flex items-center justify-between gap-4 hover:border-orange-300 transition-all"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/60 flex flex-col items-center justify-center text-orange-600 shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {new Date(event.date).toLocaleString('default', { month: 'short' })}
                  </span>
                  <span className="text-base font-black leading-none">
                    {new Date(event.date).getDate()}
                  </span>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-stone-900">{event.title}</h5>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    📍 {event.location} · {event.time}
                  </p>
                  <p className="text-[11px] text-orange-600 font-semibold mt-1">
                    👥 {event.attendeesCount} nomads attending
                  </p>
                </div>
              </div>

              <button
                onClick={() => onToggleEventRSVP(event.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  event.isAttending
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20'
                }`}
              >
                {event.isAttending ? 'Attending ✓' : 'RSVP'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Setup Trigger (if user wants to restart onboarding anytime) */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-orange-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-stone-900">Customise your nomad journey</h5>
            <p className="text-[11px] text-stone-500">Update @tag, travel goals and map settings</p>
          </div>
        </div>
        <button
          onClick={onOpenOnboarding}
          className="px-3.5 py-1.5 bg-white border border-stone-200 hover:border-orange-400 text-xs font-bold text-stone-800 rounded-xl transition-all shadow-sm"
        >
          Setup Wizard
        </button>
      </div>

      {/* Direct Message Modal */}
      {selectedNomad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedNomad.avatarUrl}
                  alt={selectedNomad.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">{selectedNomad.name}</h4>
                  <p className="text-[11px] text-stone-400">{selectedNomad.tag}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNomad(null)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-3">
              <textarea
                rows={3}
                required
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder={`Hey ${selectedNomad.name}, are you free for coffee or coworking in ${state.currentCity}?`}
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              {messageSent && (
                <p className="text-xs font-bold text-emerald-600">Message sent! 📬</p>
              )}

              <button
                type="submit"
                disabled={messageSent}
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-md shadow-orange-500/20 transition-all"
              >
                Send Direct Message
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

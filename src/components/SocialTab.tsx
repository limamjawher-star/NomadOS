import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Calendar, 
  Plus, 
  MessageSquare, 
  Coffee, 
  Sparkles, 
  Check, 
  Search,
  Filter,
  Compass
} from 'lucide-react';
import { NomadState, NearbyNomad, NomadEvent } from '../types';

interface SocialTabProps {
  state: NomadState;
  onToggleEventRSVP: (eventId: string) => void;
  onAddEvent: (title: string, date: string, city: string) => void;
  onSetCity: (city: string) => void;
}

export const SocialTab: React.FC<SocialTabProps> = ({
  state,
  onToggleEventRSVP,
  onAddEvent,
  onSetCity,
}) => {
  const [filterRole, setFilterRole] = useState<string>('All');
  const [isCreateMeetupOpen, setIsCreateMeetupOpen] = useState(false);
  const [meetupTitle, setMeetupTitle] = useState(`☕ Nomads meetup in ${state.currentCity}`);
  const [meetupDate, setMeetupDate] = useState('2026-09-15');
  const [meetupTime, setMeetupTime] = useState('18:00');
  const [meetupLocation, setMeetupLocation] = useState('Local Specialty Cafe');
  const [activeNomadMessage, setActiveNomadMessage] = useState<NearbyNomad | null>(null);
  const [msgText, setMsgText] = useState('');
  const [sentNotice, setSentNotice] = useState(false);

  const filteredNomads = state.nearbyNomads.filter((n) => {
    if (filterRole === 'All') return true;
    return n.profession.toLowerCase().includes(filterRole.toLowerCase());
  });

  const handleCreateMeetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetupTitle) return;
    onAddEvent(meetupTitle, meetupDate, state.currentCity);
    setIsCreateMeetupOpen(false);
  };

  const handleSendDirectMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgText.trim()) return;
    setSentNotice(true);
    setTimeout(() => {
      setSentNotice(false);
      setActiveNomadMessage(null);
      setMsgText('');
    }, 1200);
  };

  return (
    <div id="social-view" className="space-y-6 pb-24 max-w-2xl mx-auto px-4 pt-4">
      {/* Top Banner: Nomad Map Status */}
      <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-6 text-white shadow-xl shadow-orange-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-widest text-orange-100">
            Nomad Radar 🗺️
          </span>
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live in {state.currentCity}
          </span>
        </div>

        <div>
          <h3 className="text-2xl font-black">Connected in {state.currentCity}</h3>
          <p className="text-xs text-orange-100 mt-1">
            {state.nearbyNomads.length} nomads active right now in your area ready to cowork or grab food.
          </p>
        </div>

        {/* Map simulation graphic */}
        <div className="bg-black/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center justify-around">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full border-2 border-white mx-auto overflow-hidden shadow-md">
              <img src={state.user.avatarUrl} alt="You" className="w-full h-full object-cover" />
            </div>
            <span className="text-[11px] font-bold text-white mt-1 block">You (Here)</span>
          </div>

          <div className="h-0.5 flex-1 bg-white/20 mx-3 border-dashed border-t border-white/40" />

          {state.nearbyNomads.slice(0, 2).map((n) => (
            <div key={n.id} className="text-center">
              <div className="w-10 h-10 rounded-full border-2 border-orange-200 mx-auto overflow-hidden shadow-md">
                <img src={n.avatarUrl} alt={n.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-[11px] font-bold text-orange-100 mt-1 block">{n.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Meetups & Events */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-black text-stone-900">City Meetups & Gatherings</h4>
          </div>

          <button
            onClick={() => setIsCreateMeetupOpen(true)}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Create Meetup
          </button>
        </div>

        <div className="space-y-3">
          {state.events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm flex items-center justify-between gap-4 hover:border-orange-300 transition-all"
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
                    👥 Hosted by {event.hostName} · {event.attendeesCount} nomads joined
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

      {/* Directory of Nomads */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-black text-stone-900">Nomads Directory</h4>
          </div>

          <div className="flex gap-1">
            {['All', 'Developer', 'Designer', 'Founder'].map((role) => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                  filterRole === role
                    ? 'bg-stone-900 text-white'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredNomads.map((nomad) => (
            <div
              key={nomad.id}
              className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm flex items-center justify-between gap-3 hover:border-orange-300 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={nomad.avatarUrl}
                    alt={nomad.name}
                    className="w-12 h-12 rounded-full object-cover border border-stone-200"
                  />
                  {nomad.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs font-bold text-stone-900">{nomad.name}</h5>
                    <span className="text-[11px] text-stone-400 font-medium">{nomad.tag}</span>
                  </div>
                  <p className="text-[11px] font-semibold text-orange-600">{nomad.profession}</p>
                  <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">{nomad.bio}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveNomadMessage(nomad)}
                className="px-3 py-1.5 bg-stone-100 hover:bg-orange-50 hover:text-orange-600 text-stone-700 font-bold rounded-xl text-xs flex items-center gap-1 shrink-0 transition-colors"
              >
                <Coffee className="w-3.5 h-3.5" /> Say Hi
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Direct Message Modal */}
      {activeNomadMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={activeNomadMessage.avatarUrl}
                  alt={activeNomadMessage.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">{activeNomadMessage.name}</h4>
                  <p className="text-[11px] text-stone-400">{activeNomadMessage.tag}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveNomadMessage(null)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendDirectMessage} className="space-y-3">
              <textarea
                rows={3}
                required
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                placeholder={`Hey ${activeNomadMessage.name}, let's grab coffee or cowork in ${state.currentCity}!`}
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              {sentNotice && (
                <p className="text-xs font-bold text-emerald-600">Message sent! 📬</p>
              )}

              <button
                type="submit"
                disabled={sentNotice}
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-md shadow-orange-500/20 transition-all"
              >
                Send Invite
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Meetup Modal */}
      {isCreateMeetupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-stone-200 shadow-2xl space-y-4">
            <h4 className="text-base font-black text-stone-900">Create a Nomad Meetup 🎉</h4>
            <form onSubmit={handleCreateMeetupSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={meetupTitle}
                  onChange={(e) => setMeetupTitle(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={meetupDate}
                    onChange={(e) => setMeetupDate(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={meetupTime}
                    onChange={(e) => setMeetupTime(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={meetupLocation}
                  onChange={(e) => setMeetupLocation(e.target.value)}
                  placeholder="e.g. Second Home Coworking / Miradouro"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-500 text-white font-bold rounded-xl text-xs shadow-md shadow-orange-500/20"
                >
                  Publish Meetup
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateMeetupOpen(false)}
                  className="px-4 py-2.5 bg-stone-100 text-stone-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

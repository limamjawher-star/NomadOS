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
  Compass, 
  ChevronUp, 
  ChevronDown, 
  ExternalLink,
  Laptop,
  Beer,
  Palmtree,
  PartyPopper
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
  const [socialSubTab, setSocialSubTab] = useState<'people' | 'meet' | 'messages'>('meet');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [eventFilter, setEventFilter] = useState<'all' | 'my' | 'nearby'>('nearby');
  const [isEventsSheetOpen, setIsEventsSheetOpen] = useState(true);
  const [isCreateMeetupOpen, setIsCreateMeetupOpen] = useState(false);
  const [activeNomadMessage, setActiveNomadMessage] = useState<NearbyNomad | null>(null);
  const [msgText, setMsgText] = useState('');
  const [sentNotice, setSentNotice] = useState(false);

  // Meetup Form state
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2026-09-18');
  const [newLocation, setNewLocation] = useState('');
  const [newCategory, setNewCategory] = useState<'Coffee' | 'Coworking' | 'Drinks' | 'Dinner' | 'Outdoor'>('Coffee');

  const CATEGORY_TAGS = [
    { label: 'All', icon: '✨' },
    { label: 'Coffee', icon: '☕' },
    { label: 'Laptop', icon: '💻' },
    { label: 'Drinks', icon: '🍻' },
    { label: 'Party', icon: '🎉' },
    { label: 'Beach', icon: '🌴' },
    { label: 'Yoga', icon: '🧘' },
    { label: 'Co-living', icon: '🌐' },
    { label: 'Meetups', icon: '📍' },
  ];

  const filteredEvents = state.events.filter((ev) => {
    if (selectedTag !== 'All' && !ev.title.toLowerCase().includes(selectedTag.toLowerCase()) && ev.category !== selectedTag) {
      return false;
    }
    if (eventFilter === 'my' && !ev.isAttending) return false;
    return true;
  });

  const handleCreateMeetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    onAddEvent(newTitle, newDate, state.currentCity);
    setIsCreateMeetupOpen(false);
    setNewTitle('');
    setNewLocation('');
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
    <div id="social-view" className="space-y-4 pb-24 max-w-2xl mx-auto px-4 pt-3">
      {/* Top 3 Subtabs matching Screenshot 6 */}
      <div className="flex bg-stone-100 p-1 rounded-2xl border border-stone-200/60">
        <button
          onClick={() => setSocialSubTab('people')}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
            socialSubTab === 'people'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          People
        </button>

        <button
          onClick={() => setSocialSubTab('meet')}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
            socialSubTab === 'meet'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          Meet / Map
        </button>

        <button
          onClick={() => setSocialSubTab('messages')}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
            socialSubTab === 'messages'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          Messages (5)
        </button>
      </div>

      {/* ================= MEET / MAP VIEW (Screenshot 6) ================= */}
      {socialSubTab === 'meet' && (
        <div className="space-y-3.5">
          {/* Category Filter Pills (matching Screenshot 6) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORY_TAGS.map((tag) => (
              <button
                key={tag.label}
                onClick={() => setSelectedTag(tag.label)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  selectedTag === tag.label
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <span>{tag.icon}</span>
                <span>{tag.label}</span>
              </button>
            ))}
          </div>

          {/* Subfilter Pills: All | My Events | 📍 Nearby */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200/60 font-bold">
              <button
                onClick={() => setEventFilter('all')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  eventFilter === 'all' ? 'bg-white text-stone-900 shadow-sm font-black' : 'text-stone-500'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setEventFilter('my')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  eventFilter === 'my' ? 'bg-white text-stone-900 shadow-sm font-black' : 'text-stone-500'
                }`}
              >
                My Events
              </button>
              <button
                onClick={() => setEventFilter('nearby')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  eventFilter === 'nearby' ? 'bg-white text-stone-900 shadow-sm font-black' : 'text-stone-500'
                }`}
              >
                📍 Nearby
              </button>
            </div>

            <span className="text-stone-400 font-bold">
              {filteredEvents.length} events found
            </span>
          </div>

          {/* Visual Interactive Map (matching Screenshot 6) */}
          <div className="relative h-72 sm:h-80 rounded-3xl bg-slate-900 overflow-hidden border border-stone-800 shadow-inner">
            {/* Map styling grid & visual terrain */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

            {/* GPS Header Badge */}
            <div className="absolute top-3 left-3 z-10">
              <span className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live in {state.currentCity} · {state.nearbyNomads.length} Nomads
              </span>
            </div>

            {/* Map Pin 1: Zenita Cafe */}
            <div className="absolute top-12 left-10 z-10 group cursor-pointer">
              <div className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-xl flex items-center gap-1.5 text-xs font-extrabold transition-transform transform group-hover:scale-105">
                <span>☕</span>
                <span>Zenita Specialty Cafe</span>
              </div>
              <div className="w-3 h-3 bg-purple-600 rotate-45 mx-auto -mt-1.5" />
            </div>

            {/* Map Pin 2: Sunset Drinks */}
            <div className="absolute top-28 right-12 z-10 group cursor-pointer">
              <div className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-xl flex items-center gap-1.5 text-xs font-extrabold transition-transform transform group-hover:scale-105">
                <span>🌴</span>
                <span>Echo Beach Sunset</span>
              </div>
              <div className="w-3 h-3 bg-amber-500 rotate-45 mx-auto -mt-1.5" />
            </div>

            {/* Map Pin 3: Coworking Hub Sukhumvit */}
            <div className="absolute bottom-20 left-24 z-10 group cursor-pointer">
              <div className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xl flex items-center gap-1.5 text-xs font-extrabold transition-transform transform group-hover:scale-105">
                <span>💻</span>
                <span>Dojo Coworking Hub</span>
              </div>
              <div className="w-3 h-3 bg-indigo-600 rotate-45 mx-auto -mt-1.5" />
            </div>

            {/* User Location Pulse Center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-4 border-white/60 bg-purple-600/80 shadow-2xl flex items-center justify-center animate-pulse">
                <img src={state.user.avatarUrl} alt="You" className="w-9 h-9 rounded-full object-cover" />
              </div>
              <span className="text-[10px] font-black text-white bg-black/60 px-2 py-0.5 rounded-full mt-1">
                You (Current Base)
              </span>
            </div>

            {/* Bottom floating badge matching Screenshot 6 */}
            <div className="absolute bottom-3 right-3 z-10">
              <span className="px-3 py-1 bg-purple-600/90 backdrop-blur-md text-white rounded-full text-xs font-extrabold shadow-lg">
                👋 12 nearby
              </span>
            </div>
          </div>

          {/* Slide-up Events Sheet matching Screenshot 6 */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm space-y-3">
            <div 
              onClick={() => setIsEventsSheetOpen(!isEventsSheetOpen)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-stone-900">Upcoming Events & Meetups</span>
                <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-black rounded-full">
                  {filteredEvents.length}
                </span>
              </div>
              <button className="text-stone-400 hover:text-stone-600 text-xs font-bold flex items-center gap-1">
                <span>{isEventsSheetOpen ? 'Hide' : 'Expand'}</span>
                {isEventsSheetOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>

            {isEventsSheetOpen && (
              <div className="space-y-3 pt-1 animate-in fade-in">
                {filteredEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 hover:border-purple-200 transition-all flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-black rounded-md">
                          {ev.category}
                        </span>
                        <h5 className="font-extrabold text-stone-900 text-xs">{ev.title}</h5>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-500 font-semibold">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-stone-400" />
                          {ev.date} · {ev.time}
                        </span>
                        <span className="flex items-center gap-1 text-stone-600">
                          <MapPin className="w-3 h-3 text-purple-500" />
                          {ev.location}
                        </span>
                      </div>

                      <p className="text-[10px] text-stone-400">
                        Hosted by {ev.hostName} · {ev.attendeesCount} nomads going
                      </p>
                    </div>

                    <button
                      onClick={() => onToggleEventRSVP(ev.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 ${
                        ev.isAttending
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                      }`}
                    >
                      {ev.isAttending ? 'Attending ✓' : 'Join RSVP'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Floating purple + button to host meetup */}
          <div className="flex justify-end pt-1">
            <button
              onClick={() => setIsCreateMeetupOpen(true)}
              id="social-host-meetup-btn"
              className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-xl shadow-purple-600/30 flex items-center justify-center transition-all transform active:scale-95"
              title="Host Meetup"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* ================= PEOPLE VIEW ================= */}
      {socialSubTab === 'people' && (
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase text-stone-400 tracking-wider">
            Nomads In Your Vicinity
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {state.nearbyNomads.map((nomad) => (
              <div
                key={nomad.id}
                className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <img
                      src={nomad.avatarUrl}
                      alt={nomad.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/30"
                    />
                    {nomad.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                    )}
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-stone-900">{nomad.name}</h5>
                    <p className="text-[11px] text-purple-600 font-bold">{nomad.profession}</p>
                    <p className="text-[10px] text-stone-400">{nomad.currentCity || nomad.location}</p>
                  </div>
                </div>

                <p className="text-xs text-stone-500 line-clamp-2">
                  {nomad.bio}
                </p>

                <button
                  onClick={() => setActiveNomadMessage(nomad)}
                  className="w-full py-2 bg-stone-100 hover:bg-purple-50 hover:text-purple-600 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send Direct Message</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MESSAGES VIEW ================= */}
      {socialSubTab === 'messages' && (
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm space-y-3">
          <h4 className="text-sm font-black text-stone-900">Recent Chats (5)</h4>
          <div className="space-y-2.5">
            {state.nearbyNomads.map((nomad) => (
              <div
                key={nomad.id}
                onClick={() => setActiveNomadMessage(nomad)}
                className="p-3 bg-stone-50 hover:bg-purple-50 rounded-2xl border border-stone-200/80 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img src={nomad.avatarUrl} alt={nomad.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h5 className="font-extrabold text-stone-900 text-xs">{nomad.name}</h5>
                    <p className="text-[11px] text-stone-500 line-clamp-1">
                      "Hey, let's catch up at the coworking space!"
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-stone-400 font-semibold">14m ago</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Host Meetup Modal */}
      {isCreateMeetupOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateMeetupSubmit} className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-stone-900 text-base">Host a Nomad Meetup</h3>
              <button
                type="button"
                onClick={() => setIsCreateMeetupOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Meetup Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. ☕ Sunset Coffee & Cowork at Zenita"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-bold bg-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Coffee">Coffee & Work</option>
                  <option value="Coworking">Coworking Sprint</option>
                  <option value="Drinks">Sunset Drinks</option>
                  <option value="Dinner">Food & Dining</option>
                  <option value="Outdoor">Outdoor / Beach</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Location / Venue</label>
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="e.g. Zenita Specialty Cafe Canggu"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreateMeetupOpen(false)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs shadow-md shadow-purple-600/30"
              >
                Publish Meetup
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Direct Message Modal */}
      {activeNomadMessage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img src={activeNomadMessage.avatarUrl} alt={activeNomadMessage.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="font-extrabold text-stone-900 text-xs">{activeNomadMessage.name}</h4>
                  <p className="text-[10px] text-purple-600 font-bold">{activeNomadMessage.profession}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveNomadMessage(null)}
                className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {sentNotice ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-center text-xs font-bold">
                Message sent! 📬
              </div>
            ) : (
              <form onSubmit={handleSendDirectMessage} className="space-y-3">
                <textarea
                  required
                  rows={3}
                  value={msgText}
                  onChange={(e) => setMsgText(e.target.value)}
                  placeholder={`Hi ${activeNomadMessage.name.split(' ')[0]}, let's connect!`}
                  className="w-full p-3 rounded-2xl border border-stone-200 text-xs focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs shadow-md shadow-purple-600/30"
                >
                  Send
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

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
  PartyPopper,
  Activity,
  Building2,
  CheckCircle2,
  X
} from 'lucide-react';
import { NomadState, NearbyNomad, NomadEvent } from '../types';
import { GoogleNomadMap } from './GoogleNomadMap';

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

  const CATEGORY_TAGS: { label: string; icon: React.ReactNode }[] = [
    { label: 'All', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { label: 'Coffee', icon: <Coffee className="w-3.5 h-3.5" /> },
    { label: 'Laptop', icon: <Laptop className="w-3.5 h-3.5" /> },
    { label: 'Drinks', icon: <Beer className="w-3.5 h-3.5" /> },
    { label: 'Party', icon: <PartyPopper className="w-3.5 h-3.5" /> },
    { label: 'Beach', icon: <Palmtree className="w-3.5 h-3.5" /> },
    { label: 'Yoga', icon: <Activity className="w-3.5 h-3.5" /> },
    { label: 'Co-living', icon: <Building2 className="w-3.5 h-3.5" /> },
    { label: 'Meetups', icon: <MapPin className="w-3.5 h-3.5" /> },
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
    <div id="social-view" className="space-y-4 pb-28 max-w-2xl mx-auto px-4 pt-3">
      {/* Top 3 Subtabs */}
      <div className="flex bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 shadow-inner">
        <button
          onClick={() => setSocialSubTab('people')}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
            socialSubTab === 'people'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          People
        </button>

        <button
          onClick={() => setSocialSubTab('meet')}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
            socialSubTab === 'meet'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Meet / Map
        </button>

        <button
          onClick={() => setSocialSubTab('messages')}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
            socialSubTab === 'messages'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Messages (5)
        </button>
      </div>

      {/* ================= MEET / GOOGLE MAP VIEW ================= */}
      {socialSubTab === 'meet' && (
        <div className="space-y-3.5">
          {/* Real Google Nomad Map Component */}
          <GoogleNomadMap 
            state={state} 
            onRSVPEvent={onToggleEventRSVP} 
          />

          {/* Slide-up Events Sheet */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
            <div 
              onClick={() => setIsEventsSheetOpen(!isEventsSheetOpen)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-900 font-display">Upcoming Events & Meetups</span>
                <span className="px-2 py-0.5 bg-orange-50 text-orange-700 text-[10px] font-black rounded-full border border-orange-100">
                  {filteredEvents.length}
                </span>
              </div>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEventsSheetOpen(!isEventsSheetOpen);
                }}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold flex items-center gap-1"
              >
                <span>{isEventsSheetOpen ? 'Hide' : 'Expand'}</span>
                {isEventsSheetOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>

            {isEventsSheetOpen && (
              <div className="space-y-3 pt-1 animate-in fade-in">
                {filteredEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 hover:border-orange-300 hover:shadow-sm transition-all flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-black rounded-md">
                          {ev.category}
                        </span>
                        <h5 className="font-extrabold text-slate-900 text-xs font-display">{ev.title}</h5>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-semibold">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {ev.date} · {ev.time}
                        </span>
                        <span className="flex items-center gap-1 text-slate-600">
                          <MapPin className="w-3 h-3 text-orange-500" />
                          {ev.location}
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-400">
                        Hosted by {ev.hostName} · {ev.attendeesCount} nomads going
                      </p>
                    </div>

                    <button
                      onClick={() => onToggleEventRSVP(ev.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-1 ${
                        ev.isAttending
                          ? 'bg-orange-500 text-white shadow-sm'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {ev.isAttending ? (
                        <>
                          <Check className="w-3 h-3 text-white" />
                          <span>Attending</span>
                        </>
                      ) : (
                        'Join RSVP'
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Floating Action Button */}
          <div className="flex justify-end pt-1">
            <button
              onClick={() => setIsCreateMeetupOpen(true)}
              id="social-host-meetup-btn"
              className="w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/30 flex items-center justify-center transition-all transform active:scale-95"
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
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
            Nomads In Your Vicinity
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {state.nearbyNomads.map((nomad) => (
              <div
                key={nomad.id}
                className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm space-y-3 flex flex-col justify-between hover:border-orange-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <img
                      src={nomad.avatarUrl}
                      alt={nomad.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-orange-500/30"
                    />
                    {nomad.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                    )}
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-900 font-display">{nomad.name}</h5>
                    <p className="text-[11px] text-orange-600 font-bold">{nomad.profession}</p>
                    <p className="text-[10px] text-slate-400">{nomad.currentCity || nomad.location}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2">
                  {nomad.bio}
                </p>

                <button
                  onClick={() => setActiveNomadMessage(nomad)}
                  className="w-full py-2 bg-slate-100 hover:bg-orange-50 hover:text-orange-600 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
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
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
          <h4 className="text-sm font-black text-slate-900 font-display">Recent Chats (5)</h4>
          <div className="space-y-2.5">
            {state.nearbyNomads.map((nomad) => (
              <div
                key={nomad.id}
                onClick={() => setActiveNomadMessage(nomad)}
                className="p-3 bg-slate-50 hover:bg-orange-50/60 rounded-2xl border border-slate-200/80 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img src={nomad.avatarUrl} alt={nomad.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h5 className="font-extrabold text-slate-900 text-xs font-display">{nomad.name}</h5>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      "Hey, let's catch up at the coworking space!"
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">14m ago</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Host Meetup Modal */}
      {isCreateMeetupOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateMeetupSubmit} className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base font-display">Host a Nomad Meetup</h3>
              <button
                type="button"
                onClick={() => setIsCreateMeetupOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Meetup Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Sunset Coffee & Cowork at Zenita"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none focus:border-orange-500"
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Location / Venue</label>
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="e.g. Zenita Specialty Cafe Canggu"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreateMeetupOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-xl text-xs shadow-md shadow-orange-500/30"
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
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img src={activeNomadMessage.avatarUrl} alt={activeNomadMessage.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs font-display">{activeNomadMessage.name}</h4>
                  <p className="text-[10px] text-orange-600 font-bold">{activeNomadMessage.profession}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveNomadMessage(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {sentNotice ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-center text-xs font-bold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Message delivered!</span>
              </div>
            ) : (
              <form onSubmit={handleSendDirectMessage} className="space-y-3">
                <textarea
                  required
                  rows={3}
                  value={msgText}
                  onChange={(e) => setMsgText(e.target.value)}
                  placeholder={`Hi ${activeNomadMessage.name.split(' ')[0]}, let's connect!`}
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:border-orange-500"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-xl text-xs shadow-md shadow-orange-500/30"
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

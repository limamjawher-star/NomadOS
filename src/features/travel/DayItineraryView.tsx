import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  Plus, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Car, 
  Coffee, 
  Utensils, 
  Compass, 
  Landmark, 
  Check, 
  X,
  ExternalLink,
  Paperclip,
  Share2
} from 'lucide-react';
import { DayItineraryActivity } from '../../types';

interface DayItineraryViewProps {
  activities: DayItineraryActivity[];
  currentCity?: string;
  onAddActivity?: (activity: DayItineraryActivity) => void;
  onDeleteActivity?: (id: string) => void;
}

export const DayItineraryView: React.FC<DayItineraryViewProps> = ({
  activities: initialActivities,
  currentCity = 'Florence / Rome',
  onAddActivity,
  onDeleteActivity,
}) => {
  const [activities, setActivities] = useState<DayItineraryActivity[]>(initialActivities);
  const [selectedDay, setSelectedDay] = useState('Sun, 17 May');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<{ title: string; filename: string } | null>(null);
  
  // AI Generator state
  const [aiCity, setAiCity] = useState(currentCity);
  const [aiPace, setAiPace] = useState<'chill' | 'balanced' | 'packed'>('balanced');
  const [aiFocus, setAiFocus] = useState<'coworking' | 'culture' | 'food'>('culture');
  const [isGenerating, setIsGenerating] = useState(false);

  // New activity form state
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('11:00');
  const [newTimeRange, setNewTimeRange] = useState('11:00 – 12:30');
  const [newCategory, setNewCategory] = useState<DayItineraryActivity['category']>('activity');
  const [newLocation, setNewLocation] = useState('');
  const [hasDoc, setHasDoc] = useState(false);
  const [docName, setDocName] = useState('');

  const handleGenerateAiPlans = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated: DayItineraryActivity[] = [
        {
          id: `ai-${Date.now()}-1`,
          dayDate: '2026-05-18',
          dayLabel: 'Mon, 18 May',
          time: '08:30',
          timeRange: '08:30 – 09:30',
          title: `Espresso & Morning Focus at ${aiCity} Roastery`,
          category: 'food',
          locationName: 'Ditta Artigianale Cafe',
        },
        {
          id: `ai-${Date.now()}-2`,
          dayDate: '2026-05-18',
          dayLabel: 'Mon, 18 May',
          time: '10:00',
          timeRange: '10:00 – 13:30',
          title: 'Deep Work Session · High Speed Fiber',
          category: 'coworking',
          hasAttachment: true,
          attachmentName: 'Coworking_DayPass_QR.pdf',
          attachmentCount: 1,
          locationName: 'The Social Hub Cowork',
        },
        {
          id: 'ai-' + Date.now() + '-3',
          dayDate: '2026-05-18',
          dayLabel: 'Mon, 18 May',
          time: '14:00',
          timeRange: '14:00 – 15:30',
          title: 'Handmade Gnocchi Lunch & Gelato Walk',
          category: 'food',
          locationName: 'Trattoria Mario',
        },
        {
          id: 'ai-' + Date.now() + '-4',
          dayDate: '2026-05-18',
          dayLabel: 'Mon, 18 May',
          time: '16:30',
          timeRange: '16:30 – 18:30',
          title: 'Sunset Viewpoint & Sketching',
          category: 'sightseeing',
          locationName: 'Piazzale Michelangelo',
        },
      ];

      setActivities([...activities, ...generated]);
      setSelectedDay('Mon, 18 May');
      setIsGenerating(false);
      setIsAiModalOpen(false);
    }, 900);
  };

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const item: DayItineraryActivity = {
      id: `act-${Date.now()}`,
      dayDate: '2026-05-17',
      dayLabel: selectedDay,
      time: newTime,
      timeRange: newTimeRange,
      title: newTitle,
      category: newCategory,
      locationName: newLocation,
      hasAttachment: hasDoc,
      attachmentName: hasDoc ? (docName || 'Document_Voucher.pdf') : undefined,
      attachmentCount: hasDoc ? 1 : undefined,
    };

    setActivities((prev) => [...prev, item].sort((a, b) => a.time.localeCompare(b.time)));
    if (onAddActivity) onAddActivity(item);

    setNewTitle('');
    setNewLocation('');
    setHasDoc(false);
    setDocName('');
    setIsAddModalOpen(false);
  };

  // Color border & tag mapping
  const getCategoryColor = (cat: DayItineraryActivity['category']) => {
    switch (cat) {
      case 'transport':
        return 'border-orange-400 bg-orange-50/50';
      case 'activity':
      case 'sightseeing':
        return 'border-amber-400 bg-amber-50/50';
      case 'culture':
        return 'border-emerald-400 bg-emerald-50/50';
      case 'food':
        return 'border-orange-400 bg-orange-50/50';
      case 'coworking':
        return 'border-orange-500 bg-orange-50/50';
      case 'free':
        return 'border-dashed border-stone-300 bg-stone-50/60';
      default:
        return 'border-orange-300 bg-orange-50/30';
    }
  };

  return (
    <div id="day-by-day-itinerary-module" className="space-y-5">
      {/* Date Bar & Controls (matching Screenshot 4) */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200/90 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center font-medium">
            <Calendar className="w-4 h-4" strokeWidth={1.75} />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">Day Plan</span>
            <h3 className="text-base font-semibold text-stone-900">{selectedDay}</h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDay(selectedDay === 'Sun, 17 May' ? 'Mon, 18 May' : 'Sun, 17 May')}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-xl text-xs flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Change date</span>
            <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>

          <button
            onClick={() => setIsAiModalOpen(true)}
            id="itinerary-ai-generate-top-btn"
            className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all transform active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" strokeWidth={1.75} />
            <span>AI Suggest</span>
          </button>
        </div>
      </div>

      {/* Chronological Timeline with side bar (matching Screenshot 4) */}
      <div className="space-y-3 relative before:absolute before:left-14 before:top-4 before:bottom-4 before:w-0.5 before:bg-stone-200">
        {activities.map((act) => {
          if (act.isFreeTime) {
            return (
              <div 
                key={act.id} 
                className="flex items-center gap-4 py-2 relative z-10"
              >
                <div className="w-14 text-right text-xs font-medium text-stone-400">
                  {act.time}
                </div>
                <div className="flex-1 border-2 border-dashed border-stone-200 rounded-2xl py-3 px-4 text-center bg-stone-50/50">
                  <span className="text-xs font-medium text-stone-500">
                    {act.title}
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div key={act.id} className="flex items-start gap-4 relative z-10 group">
              {/* Left Time label */}
              <div className="w-14 pt-3.5 text-right text-xs font-semibold text-stone-700 shrink-0">
                {act.time}
              </div>

              {/* Main Activity Card */}
              <div 
                className={`flex-1 bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs border-l-4 ${getCategoryColor(act.category)} transition-all hover:border-orange-300 hover:shadow-xs`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-stone-900 leading-tight">
                        {act.title}
                      </h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 font-normal">
                      <span className="flex items-center gap-1 font-medium text-stone-600">
                        <Clock className="w-3 h-3 text-stone-400" strokeWidth={1.75} />
                        {act.timeRange}
                      </span>

                      {act.locationName && (
                        <span className="flex items-center gap-1 text-orange-600 font-medium">
                          <MapPin className="w-3 h-3 text-orange-500" strokeWidth={1.75} />
                          {act.locationName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right side Document badge or Pin */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {act.hasAttachment && (
                      <button
                        onClick={() => setSelectedAttachment({ 
                            title: act.title, 
                            filename: act.attachmentName || 'Ticket_Voucher.pdf' 
                          })}
                        title="Attached document/ticket"
                        className="flex items-center gap-1 px-2 py-1 bg-orange-50 hover:bg-orange-100 text-orange-700 text-[11px] font-bold rounded-lg border border-orange-200/80 transition-colors"
                      >
                        <FileText className="w-3 h-3 text-orange-600" />
                        {act.attachmentCount && act.attachmentCount > 1 && (
                          <span>{act.attachmentCount}</span>
                        )}
                      </button>
                    )}

                    {act.locationName && (
                      <div className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-orange-50 text-slate-500 hover:text-orange-600 flex items-center justify-center transition-colors">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Button Bar */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setIsAiModalOpen(true)}
          id="day-itinerary-ai-fab"
          className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold rounded-full text-xs flex items-center gap-2 transition-all shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Generate AI Day Plan</span>
        </button>

        <button
          onClick={() => setIsAddModalOpen(true)}
          id="day-itinerary-add-fab"
          className="w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/30 flex items-center justify-center transition-all transform active:scale-95"
          title="Add activity"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* AI Generator Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-semibold">
                  <Sparkles className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-base">Nomad Day AI Planner</h3>
                  <p className="text-xs text-stone-500 font-normal">Auto-generate the optimal remote worker daily schedule</p>
                </div>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">Destination City</label>
                <input
                  type="text"
                  value={aiCity}
                  onChange={(e) => setAiCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium focus:outline-none focus:border-orange-500"
                  placeholder="e.g. Florence, Lisbon, Bali, Tokyo"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">Focus Balance</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['culture', 'coworking', 'food'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setAiFocus(f)}
                      className={`py-2 rounded-xl text-xs font-medium capitalize transition-all border cursor-pointer ${
                        aiFocus === f
                          ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">Daily Pace</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['chill', 'balanced', 'packed'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setAiPace(p)}
                      className={`py-2 rounded-xl text-xs font-medium capitalize transition-all border cursor-pointer ${
                        aiPace === p
                          ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-orange-50 rounded-2xl border border-orange-100 text-xs text-orange-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" strokeWidth={1.75} />
                <span>Plans auto-include coworking sprint hours, verified specialty cafes with 50+ Mbps wifi, and sunset social breaks.</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerateAiPlans}
                disabled={isGenerating}
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Curating itinerary...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" strokeWidth={1.75} />
                    <span>Generate Day</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Activity Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateActivity} className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-stone-900 text-base">Add Daily Activity</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Activity Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Visit Museum, Coworking sprint, Sunset dinner"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Start Time</label>
                <input
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder="e.g. 14:00"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-medium focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Time Slot Range</label>
                <input
                  type="text"
                  value={newTimeRange}
                  onChange={(e) => setNewTimeRange(e.target.value)}
                  placeholder="e.g. 13:30 – 15:00"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-medium focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Location / Maps Pin</label>
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="e.g. Osteria dei Leoni, Duomo Square"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-medium focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-medium focus:outline-none focus:border-orange-500 bg-white"
              >
                <option value="sightseeing">Sightseeing / Exploration</option>
                <option value="food">Food & Dining</option>
                <option value="culture">Culture / Museum</option>
                <option value="coworking">Coworking / Work</option>
                <option value="transport">Transport / Rental</option>
                <option value="activity">General Activity</option>
              </select>
            </div>

            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                <input
                  type="checkbox"
                  checked={hasDoc}
                  onChange={(e) => setHasDoc(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-stone-300 cursor-pointer"
                />
                <span>Attach Ticket / PDF Voucher</span>
              </label>

              {hasDoc && (
                <input
                  type="text"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. Gallery_FastPass_Ticket.pdf"
                  className="w-full mt-2 px-3.5 py-2 rounded-xl border border-orange-200 bg-orange-50/50 text-xs font-medium focus:outline-none focus:border-orange-500"
                />
              )}
            </div>

            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl text-xs shadow-xs cursor-pointer"
              >
                Save Activity
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Attachment Preview Modal */}
      {selectedAttachment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-medium">
                  <FileText className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <h4 className="font-semibold text-stone-900 text-sm">Attached Document</h4>
              </div>
              <button
                onClick={() => setSelectedAttachment(null)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            </div>

            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-2 text-center">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white mx-auto flex items-center justify-center shadow-xs">
                <FileText className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <h5 className="font-semibold text-stone-900 text-xs truncate">
                {selectedAttachment.filename}
              </h5>
              <p className="text-[11px] text-stone-500 font-normal">
                Linked to: {selectedAttachment.title}
              </p>
              <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-medium rounded-full">
                Verified Barcode / QR Ready
              </span>
            </div>

            <button
              onClick={() => setSelectedAttachment(null)}
              className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl text-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

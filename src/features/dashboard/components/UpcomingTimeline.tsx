import React from 'react';
import { Calendar, MapPin, FileText, ArrowRight } from 'lucide-react';
import { NomadState } from '../../../types';
import { format, isAfter, isToday, isTomorrow, parseISO } from 'date-fns';

interface UpcomingTimelineProps {
  state: NomadState;
  onActionClick: (actionId: string) => void;
}

export const UpcomingTimeline: React.FC<UpcomingTimelineProps> = ({ state, onActionClick }) => {
  const today = new Date();
  
  // Aggregate events, trips, document expiries
  const timelineItems: any[] = [];
  
  state.trips.forEach(trip => {
    if (isAfter(parseISO(trip.arrivalDate), today)) {
      timelineItems.push({
        id: `trip-${trip.id}`,
        date: parseISO(trip.arrivalDate),
        type: 'trip',
        title: `Trip to ${trip.city}, ${trip.countryCode}`,
        icon: <MapPin className="w-3.5 h-3.5 text-orange-500" />
      });
    }
  });

  state.documents.forEach(doc => {
    if (doc.expirationDate && isAfter(parseISO(doc.expirationDate), today)) {
      timelineItems.push({
        id: `doc-${doc.id}`,
        date: parseISO(doc.expirationDate),
        type: 'document',
        title: `${doc.title} expires`,
        icon: <FileText className="w-3.5 h-3.5 text-rose-500" />
      });
    }
  });

  state.events?.forEach(event => {
    if (isAfter(parseISO(event.date), today)) {
      timelineItems.push({
        id: `event-${event.id}`,
        date: parseISO(event.date),
        type: 'event',
        title: event.title,
        icon: <Calendar className="w-3.5 h-3.5 text-blue-500" />
      });
    }
  });

  timelineItems.sort((a, b) => a.date.getTime() - b.date.getTime());
  const upcomingItems = timelineItems.slice(0, 4);

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col">
      <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
        <h3 className="text-[11px] font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-stone-400" />
          Upcoming
        </h3>
      </div>
      
      <div className="p-5 flex-1">
        {upcomingItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Calendar className="w-8 h-8 text-stone-200 mb-2" />
            <p className="text-xs font-medium text-stone-500">Nothing scheduled</p>
          </div>
        ) : (
          <div className="relative border-l border-stone-100 ml-2 space-y-6">
            {upcomingItems.map((item, idx) => (
              <div key={item.id} className="relative pl-5">
                <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-white border border-stone-200 flex items-center justify-center">
                   <div className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-0.5">
                    {isToday(item.date) ? 'Today' : isTomorrow(item.date) ? 'Tomorrow' : format(item.date, 'd MMM')}
                  </div>
                  <div className="text-xs font-medium text-stone-800 flex items-center gap-1.5">
                    {item.icon}
                    <span className="truncate">{item.title}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-3 py-3 bg-stone-50 border-t border-stone-100 mt-auto">
        <button 
          onClick={() => onActionClick('travel')}
          className="w-full py-2 bg-white border border-stone-200 hover:border-stone-300 text-stone-700 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
        >
          View Full Timeline
          <ArrowRight className="w-3 h-3 text-stone-400" />
        </button>
      </div>
    </div>
  );
};

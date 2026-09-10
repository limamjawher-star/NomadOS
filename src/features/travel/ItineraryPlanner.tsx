import React, { useState } from 'react';
import {
  MapPin,
  Plane,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  Home,
  Check,
  Building,
} from 'lucide-react';
import { TripDestination } from '../../types';
import { getCountryFlag, formatUSD } from '../../utils/formatters';
import { differenceInCalendarDays, parseISO } from 'date-fns';

interface ItineraryPlannerProps {
  trips: TripDestination[];
  currentCity: string;
  onAddTrip: (trip: Omit<TripDestination, 'id'>) => void;
  onSetCurrentBase: (trip: TripDestination) => void;
  onDeleteTrip: (id: string) => void;
}

export const ItineraryPlanner: React.FC<ItineraryPlannerProps> = ({
  trips,
  currentCity,
  onAddTrip,
  onSetCurrentBase,
  onDeleteTrip,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [newCity, setNewCity] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [newCountryCode, setNewCountryCode] = useState('');
  const [newArrival, setNewArrival] = useState('');
  const [newDeparture, setNewDeparture] = useState('');
  const [newHousingStatus, setNewHousingStatus] = useState<TripDestination['accommodationStatus']>('Searching');
  const [newCost, setNewCost] = useState(800);
  const [newVisaType, setNewVisaType] = useState('Tourist Visa / Waiver');
  const [newTimezone, setNewTimezone] = useState('UTC+0');
  const [newNotes, setNewNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCity || !newCountry || !newArrival || !newDeparture) return;

    onAddTrip({
      city: newCity.trim(),
      country: newCountry.trim(),
      countryCode: newCountryCode.trim().toUpperCase() || 'UN',
      arrivalDate: newArrival,
      departureDate: newDeparture,
      accommodationStatus: newHousingStatus,
      housingCostUSD: Number(newCost) || 0,
      visaType: newVisaType,
      timezone: newTimezone,
      notes: newNotes,
    });

    setNewCity('');
    setNewCountry('');
    setNewCountryCode('');
    setNewArrival('');
    setNewDeparture('');
    setNewCost(800);
    setNewNotes('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono tracking-wider uppercase text-amber-400 font-semibold">
                Nomad Moves & Accommodation Schedule
              </span>
            </div>
            <h2 className="text-2xl font-bold text-stone-100 mt-1">
              Global Itinerary & Flight Sequence
            </h2>
            <p className="text-stone-400 text-sm max-w-2xl mt-1 leading-relaxed">
              Coordinate your relocation pipeline, coliving reservations, and visa requirements across different hemispheres.
            </p>
          </div>

          <button
            id="add-itinerary-trip-btn"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start md:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Add Destination</span>
          </button>
        </div>

        {/* Add Modal */}
        {showAddForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-6 p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-4"
          >
            <div className="text-sm font-semibold text-stone-200">Plan Next Destination</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">City</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bansko, Chiang Mai, Tokyo"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Country</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bulgaria, Thailand, Japan"
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">2-Letter Code (Flag)</label>
                <input
                  type="text"
                  maxLength={2}
                  placeholder="e.g. BG, TH, JP"
                  value={newCountryCode}
                  onChange={(e) => setNewCountryCode(e.target.value.toUpperCase())}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Arrival Date</label>
                <input
                  type="date"
                  required
                  value={newArrival}
                  onChange={(e) => setNewArrival(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Departure Date</label>
                <input
                  type="date"
                  required
                  value={newDeparture}
                  onChange={(e) => setNewDeparture(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Housing Status</label>
                <select
                  value={newHousingStatus}
                  onChange={(e) =>
                    setNewHousingStatus(
                      e.target.value as TripDestination['accommodationStatus']
                    )
                  }
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Booked">Booked</option>
                  <option value="Searching">Searching</option>
                  <option value="Co-living">Co-living</option>
                  <option value="Friends/Family">Friends / Family</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Monthly Housing ($ USD)</label>
                <input
                  type="number"
                  value={newCost}
                  onChange={(e) => setNewCost(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Visa Type</label>
                <input
                  type="text"
                  placeholder="e.g. Digital Nomad Visa, Schengen, Visa-on-arrival"
                  value={newVisaType}
                  onChange={(e) => setNewVisaType(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Timezone</label>
                <input
                  type="text"
                  placeholder="e.g. Europe/Sofia, Asia/Bangkok"
                  value={newTimezone}
                  onChange={(e) => setNewTimezone(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1">Housing & Coworking Details</label>
              <input
                type="text"
                placeholder="e.g. Airbnb near Yellow Coworking, 500Mbps wifi verified"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 text-xs text-stone-400 hover:text-stone-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg transition-colors"
              >
                Save Destination
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Itinerary Cards */}
      <div className="space-y-4">
        {trips.map((trip, idx) => {
          const isCurrent = trip.city.toLowerCase() === currentCity.toLowerCase();
          let durationDays = 0;
          try {
            durationDays =
              differenceInCalendarDays(
                parseISO(trip.departureDate),
                parseISO(trip.arrivalDate)
              ) + 1;
          } catch {
            durationDays = 30;
          }

          return (
            <div
              key={trip.id}
              className={`rounded-2xl border p-5 transition-all ${
                isCurrent
                  ? 'border-amber-500/50 bg-stone-900/90 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/20'
                  : 'border-stone-800 bg-stone-900/50 hover:border-stone-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="text-3xl p-2 rounded-xl bg-stone-950 border border-stone-800 flex-shrink-0">
                    {getCountryFlag(trip.countryCode)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-stone-100">
                        {trip.city}, {trip.country}
                      </h3>
                      {isCurrent && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          <MapPin className="h-3 w-3" />
                          Current Base
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-stone-800 text-stone-300 border border-stone-700">
                        {trip.visaType}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-stone-400 mt-2 flex-wrap">
                      <span className="flex items-center gap-1.5 font-mono">
                        <Calendar className="h-3.5 w-3.5 text-stone-500" />
                        {trip.arrivalDate} → {trip.departureDate} ({durationDays} days)
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Building className="h-3.5 w-3.5 text-stone-500" />
                        <span
                          className={`font-medium ${
                            trip.accommodationStatus === 'Booked'
                              ? 'text-emerald-400'
                              : 'text-amber-400'
                          }`}
                        >
                          {trip.accommodationStatus}
                        </span>
                      </span>
                      <span className="font-mono text-stone-300">
                        Rent: {formatUSD(trip.housingCostUSD)}/mo
                      </span>
                    </div>

                    {trip.notes && (
                      <p className="text-xs text-stone-400 mt-2.5 bg-stone-950/40 p-2.5 rounded-lg border border-stone-800/80">
                        {trip.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-2 self-end lg:self-center">
                  {!isCurrent && (
                    <button
                      onClick={() => onSetCurrentBase(trip)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors flex items-center gap-1.5"
                    >
                      <MapPin className="h-3.5 w-3.5 text-amber-400" />
                      <span>Set as Base</span>
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteTrip(trip.id)}
                    className="p-2 rounded-lg hover:bg-rose-500/20 text-stone-500 hover:text-rose-400 transition-colors"
                    title="Delete destination"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {trips.length === 0 && (
          <div className="py-12 text-center text-stone-500 text-sm border border-dashed border-stone-800 rounded-xl">
            No destinations planned yet. Click "Add Destination" to begin crafting your itinerary.
          </div>
        )}
      </div>
    </div>
  );
};

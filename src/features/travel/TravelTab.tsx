import React, { useState } from 'react';
import { 
  Plane, 
  FileText, 
  DollarSign, 
  Calculator, 
  Scale, 
  Plus, 
  Calendar, 
  MapPin, Globe, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2,
  SlidersHorizontal,
  ArrowRightLeft,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Building,
  Upload,
  ExternalLink,
  X
} from 'lucide-react';
import { 
  NomadState, 
  TripDestination, 
  SchengenStay, 
  TaxPresence, 
  NomadExpense,
  DayItineraryActivity
} from '../../types';
import { MultiStopTripView } from './MultiStopTripView';
import { DayItineraryView } from './DayItineraryView';
import { CountryFlag } from '../../components/ui/CountryFlag';
import { TripValidationPanel } from '../intelligence/components/TripValidationPanel';
import { validateTrip } from '../intelligence/rules/TripValidator';
import { buildIntelligenceProfile } from '../intelligence/engine/profileBuilder';
import { 
  NOMAD_CURRENCIES, 
  CURRENCY_REGIONS, 
  getCurrency, 
  convertCurrency, 
  formatConvertedAmount 
} from '../../data/currencies';

interface TravelTabProps {
  state: NomadState;
  onAddTrip: (trip: TripDestination) => void;
  onDeleteTrip: (tripId: string) => void;
  onAddSchengenStay: (stay: SchengenStay) => void;
  onDeleteSchengenStay: (id: string) => void;
  onAddExpense: (expense: NomadExpense) => void;
  onDeleteExpense: (id: string) => void;
  onUpdateTaxPresence: (id: string, days: number) => void;
  onOpenPricing: () => void;
}

export const TravelTab: React.FC<TravelTabProps> = ({
  state,
  onAddTrip,
  onDeleteTrip,
  onAddSchengenStay,
  onDeleteSchengenStay,
  onAddExpense,
  onDeleteExpense,
  onUpdateTaxPresence,
  onOpenPricing,
}) => {
  const [subTab, setSubTab] = useState<'trips' | 'day' | 'visas' | 'expenses' | 'converter' | 'tax'>('trips');
  const [visaSegment, setVisaSegment] = useState<'visas' | 'documents'>('visas');
  const [expenseScope, setExpenseScope] = useState<'All' | 'Trip' | 'Stop'>('Trip');
  
  const [isAddTripOpen, setIsAddTripOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddSchengenOpen, setIsAddSchengenOpen] = useState(false);
  const [isAddVisaDocOpen, setIsAddVisaDocOpen] = useState(false);

  // New Trip form state
  const [newCity, setNewCity] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [newArrival, setNewArrival] = useState('2026-10-01');
  const [newDeparture, setNewDeparture] = useState('2026-11-15');
  const [newHousingStatus, setNewHousingStatus] = useState<'Booked' | 'Searching' | 'Friends/Family' | 'Co-living'>('Searching');
  const [newHousingCost, setNewHousingCost] = useState(800);
  const [newVisaType, setNewVisaType] = useState('Tourist Visa Waiver');

  // New Expense form state
  const [expDesc, setExpDesc] = useState('');
  const [expCategory, setExpCategory] = useState<NomadExpense['category']>('Accommodation');
  const [expAmount, setExpAmount] = useState<number>(50);
  const [expCurrency, setExpCurrency] = useState('EUR');

  // New Schengen stay form state
  const [stayCountry, setStayCountry] = useState('Portugal');

  // Intelligence Engine Hook
  const profile = buildIntelligenceProfile(state as any);
  const newTripCode = newCountry === 'Thailand' ? 'TH' : newCountry === 'Portugal' ? 'PT' : newCountry === 'Indonesia' ? 'ID' : newCountry === 'Mexico' ? 'MX' : 'FR';
  const mockTrip = { id: 'temp', city: newCity, country: newCountry, countryCode: newTripCode, arrivalDate: newArrival, departureDate: newDeparture, accommodationStatus: newHousingStatus, housingCostUSD: newHousingCost, visaType: newVisaType };
  const tripValidation = newCity && newArrival && newDeparture ? validateTrip(profile, mockTrip as any) : null;
  const [stayCode, setStayCode] = useState('PT');
  const [stayEntry, setStayEntry] = useState('2026-09-01');
  const [stayExit, setStayExit] = useState('2026-09-30');

  // Currency Converter state
  const [calcAmount, setCalcAmount] = useState<number>(100);
  const [calcFrom, setCalcFrom] = useState('EUR');
  const [calcTo, setCalcTo] = useState('USD');

  const fromCurrency = getCurrency(calcFrom);
  const toCurrency = getCurrency(calcTo);
  const convertedNumeric = convertCurrency(calcAmount, calcFrom, calcTo);
  const formattedConverted = formatConvertedAmount(convertedNumeric, calcTo);
  const unitRate = (toCurrency.ratePerUSD / fromCurrency.ratePerUSD);
  const inverseRate = (fromCurrency.ratePerUSD / toCurrency.ratePerUSD);

  const handleSwapCurrencies = () => {
    const temp = calcFrom;
    setCalcFrom(calcTo);
    setCalcTo(temp);
  };

  // Schengen calculations
  const totalSchengenDays = state.schengenStays.reduce((sum, stay) => {
    const d1 = new Date(stay.entryDate).getTime();
    const d2 = new Date(stay.exitDate).getTime();
    const diff = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
    return sum + diff;
  }, 0);

  const daysRemaining = Math.max(0, 90 - totalSchengenDays);

  const handleSaveTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCity || !newCountry) return;
    onAddTrip({
      id: `trip-${Date.now()}`,
      city: newCity,
      country: newCountry,
      countryCode: newCountry.slice(0, 2).toUpperCase(),
      arrivalDate: newArrival,
      departureDate: newDeparture,
      accommodationStatus: newHousingStatus,
      housingCostUSD: Number(newHousingCost) || 0,
      visaType: newVisaType,
      timezone: 'UTC',
    });
    setNewCity('');
    setNewCountry('');
    setIsAddTripOpen(false);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expDesc || expAmount <= 0) return;
    const curr = getCurrency(expCurrency);
    const amountUSD = Math.round(expAmount * curr.rateInUSD);
    onAddExpense({
      id: `exp-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      description: expDesc,
      category: expCategory,
      amount: expAmount,
      currency: expCurrency,
      amountUSD,
    });
    setExpDesc('');
    setExpAmount(50);
    setIsAddExpenseOpen(false);
  };

  const handleSaveSchengenStay = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSchengenStay({
      id: `stay-${Date.now()}`,
      country: stayCountry,
      countryCode: stayCode,
      entryDate: stayEntry,
      exitDate: stayExit,
      notes: 'Added from Travel tab',
    });
    setIsAddSchengenOpen(false);
  };

  return (
    <div id="travel-view" className="space-y-6 pb-28 max-w-2xl mx-auto px-4 pt-3">
      {/* Subtabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto gap-1 no-scrollbar border border-slate-200/80">
        <button
          onClick={() => setSubTab('trips')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            subTab === 'trips' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Plane className="w-3.5 h-3.5" strokeWidth={1.75} />
          <span>Trips</span>
        </button>

        <button
          onClick={() => setSubTab('day')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            subTab === 'day' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" strokeWidth={1.75} />
          <span>Day Plan</span>
        </button>

        <button
          onClick={() => setSubTab('visas')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            subTab === 'visas' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" strokeWidth={1.75} />
          <span>Visas & Docs</span>
        </button>

        <button
          onClick={() => setSubTab('expenses')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            subTab === 'expenses' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" strokeWidth={1.75} />
          <span>Expenses</span>
        </button>

        <button
          onClick={() => setSubTab('converter')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            subTab === 'converter' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
          <span>FX</span>
        </button>

        <button
          onClick={() => setSubTab('tax')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            subTab === 'tax' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Scale className="w-3.5 h-3.5" strokeWidth={1.75} />
          <span>Tax</span>
        </button>
      </div>

      {/* ================= 1. TRIPS VIEW ================= */}
      {subTab === 'trips' && (
        <div className="space-y-4">
          
          {state.trips.length === 0 && (
            <div className="bg-white rounded-xl p-8 border border-stone-200/80 shadow-xs flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                <Globe className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-900">No upcoming trips</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Start planning your nomad journey by adding your first destination.
                </p>
              </div>
              <button
                onClick={() => setIsAddTripOpen(true)}
                className="mt-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs"
              >
                Add Destination
              </button>
            </div>
          )}

          <div className="pt-2">
            <div className="flex items-center justify-between pb-2">
              <h4 className="text-xs font-semibold uppercase text-stone-400 tracking-wider">
                All Planned Relocations
              </h4>
              {state.trips.length > 0 && (
                <button
                  onClick={() => setIsAddTripOpen(true)}
                  className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span>Add Destination</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {state.trips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex items-center gap-3.5 justify-between group hover:border-orange-200 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {trip.coverUrl ? (
                      <img
                        src={trip.coverUrl}
                        alt={trip.city}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-xs border border-stone-100"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-orange-50 text-orange-600 font-semibold flex items-center justify-center shrink-0">
                        <Plane className="w-6 h-6" strokeWidth={1.75} />
                      </div>
                    )}
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-stone-900 truncate">{trip.city}</h4>
                        <span className="text-xs text-stone-400 font-normal">{trip.country}</span>
                      </div>
                      <p className="text-xs text-stone-500 font-normal">
                        {trip.arrivalDate} → {trip.departureDate} · {trip.visaType}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteTrip(trip.id)}
                    className="p-2 text-stone-300 hover:text-rose-500 rounded-lg shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. DAY PLANNER VIEW (Screenshot 4) ================= */}
      {subTab === 'day' && (
        <div className="space-y-4">
          <DayItineraryView activities={state.dayActivities || []} currentCity={state.currentCity} />
        </div>
      )}

      {/* ================= 3. VISAS & DOCS VIEW (Screenshot 2) ================= */}
      {subTab === 'visas' && (
        <div className="space-y-5">
          {/* Sub-segment toggle: Visas | My Documents */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setVisaSegment('visas')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                visaSegment === 'visas'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Visas & Entry Permits
            </button>
            <button
              onClick={() => setVisaSegment('documents')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                visaSegment === 'documents'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Vault Documents
            </button>
          </div>

          <p className="text-xs text-slate-500 font-normal">
            Monitor real-time visa validity, Schengen 90/180 countdowns, and travel compliance.
          </p>

          {/* 3 Status Cards Grid matching Screenshot 2 */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="bg-white rounded-xl p-3.5 border border-stone-200/90 shadow-xs">
              <span className="text-[10px] font-medium uppercase tracking-wider text-orange-600 block">Active</span>
              <span className="text-2xl font-semibold text-stone-900 font-display">2</span>
            </div>
            <div className="bg-white rounded-xl p-3.5 border border-stone-200/90 shadow-xs">
              <span className="text-[10px] font-medium uppercase tracking-wider text-amber-600 block">Expiring</span>
              <span className="text-2xl font-semibold text-stone-900 font-display">1</span>
            </div>
            <div className="bg-white rounded-xl p-3.5 border border-stone-200/90 shadow-xs">
              <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-600 block">Overstay Risk</span>
              <span className="text-2xl font-semibold text-stone-900 font-display">0</span>
            </div>
          </div>

          {/* Urgent banner */}
          <div className="p-3.5 bg-rose-50 border border-rose-200/90 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" strokeWidth={1.75} />
              <div>
                <span className="font-semibold text-rose-950 block">Indonesia: 2 days left</span>
                <span className="text-[11px] text-rose-700 font-normal">Expires soon on 2026-04-06</span>
              </div>
            </div>
            <span className="text-[10px] font-medium text-rose-700 bg-rose-100/90 px-2.5 py-1 rounded-full border border-rose-200">
              Extend / Exit
            </span>
          </div>

          {/* Pending docs card */}
          <div className="p-4 bg-orange-50/80 border border-orange-200/90 rounded-xl flex items-center justify-between shadow-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-600 shrink-0" strokeWidth={1.75} />
                <h5 className="font-semibold text-orange-950 text-xs uppercase tracking-wider font-display">
                  6 PENDING across 3 visa(s)
                </h5>
              </div>
              <p className="text-[11px] text-orange-700 font-normal">
                Proof of onward travel, vaccination cert, bank statement
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-orange-700" strokeWidth={1.75} />
          </div>

          {/* Schengen 90/180 Calculator Box */}
          <div className="bg-white rounded-xl p-5 border border-stone-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CountryFlag code="EU" name="European Union" size="xs" />
                <h4 className="text-sm font-semibold text-stone-900 font-display">Schengen 90/180 Calculator</h4>
              </div>
              <span className="px-2.5 py-0.5 bg-orange-500 text-white font-medium text-xs rounded-full">
                90/180
              </span>
            </div>

            <div className="flex items-baseline justify-between text-xs">
              <span className="text-base font-semibold text-emerald-600 font-display">{daysRemaining} Days left</span>
              <span className="text-stone-500 font-medium">{totalSchengenDays}/90 used</span>
            </div>

            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (totalSchengenDays / 90) * 100)}%` }}
              />
            </div>

            <div className="pt-1 flex items-center justify-between text-xs text-slate-400">
              <span className="font-normal">Next rolling reset in 48 days</span>
              <button
                onClick={() => setIsAddSchengenOpen(true)}
                className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                + Log Entry Date
              </button>
            </div>
          </div>

          {/* List of Active Visas */}
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
              Tracked Visas
            </h4>

            {/* Indonesia */}
            <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <CountryFlag code="ID" name="Indonesia" size="md" />
                  <div>
                    <h5 className="font-semibold text-slate-900 text-sm font-display">Indonesia</h5>
                    <p className="text-xs text-slate-500 font-normal">Visa on Arrival (B213)</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-rose-50 text-rose-700 font-medium text-[11px] rounded-full border border-rose-200">
                  2d left
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal">
                Entry: 2026-04-06 · <strong className="font-semibold text-slate-700">28/30 days used</strong>
              </p>
              <div className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-600 font-normal">
                2d left — consider extension or exit to avoid overstay penalty.
              </div>
            </div>

            {/* Thailand */}
            <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <CountryFlag code="TH" name="Thailand" size="md" />
                  <div>
                    <h5 className="font-semibold text-slate-900 text-sm font-display">Thailand</h5>
                    <p className="text-xs text-slate-500 font-normal">Visa Exemption (Tourist - 30 days)</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-medium text-[11px] rounded-full border border-emerald-200">
                  Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal">
                Entry scheduled: 2026-06-18 · Valid until 2026-07-18
              </p>
            </div>
          </div>

          {/* Floating Action Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setIsAddTripOpen(true)}
              className="w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 flex items-center justify-center transition-all transform active:scale-95 cursor-pointer"
              title="Add Visa or Document"
            >
              <Plus className="w-6 h-6" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      )}

      {/* ================= 4. EXPENSES VIEW (Screenshot 5) ================= */}
      {subTab === 'expenses' && (
        <div className="space-y-5">
          {/* Scope Filter matching Screenshot 5 */}
          <div className="flex items-center justify-between">
            <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200/80 text-xs">
              {(['All', 'Trip', 'Stop'] as const).map((sc) => (
                <button
                  key={sc}
                  onClick={() => setExpenseScope(sc)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    expenseScope === sc ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-500 font-normal hover:text-stone-800'
                  }`}
                >
                  {sc}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 text-xs font-medium text-stone-800 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-xs cursor-pointer">
              <MapPin className="w-3.5 h-3.5 text-orange-600" strokeWidth={1.75} />
              <span>Europe Summer Workation</span>
            </div>
          </div>

          {/* 4 Stat Cards matching Screenshot 5 */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs space-y-1">
              <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">TRIP TOTAL</span>
              <h4 className="text-xl font-semibold text-stone-900 font-display">€1,890</h4>
              <span className="text-xs text-stone-400 font-normal">12 expenses</span>
            </div>

            <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs space-y-1">
              <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">THIS MONTH</span>
              <h4 className="text-xl font-semibold text-stone-900 font-display">€1,420</h4>
              <span className="text-xs text-stone-400 font-normal">7 expenses</span>
            </div>

            <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs space-y-1">
              <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">BUDGET</span>
              <h4 className="text-xl font-semibold text-emerald-600 font-display">€4,410 left</h4>
              <span className="text-xs text-stone-400 font-normal">30% used</span>
            </div>

            <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs space-y-1">
              <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">COUNTRY</span>
              <h4 className="text-xl font-semibold text-stone-900 font-display">3</h4>
              <span className="text-xs text-orange-600 font-medium">Top: Accommodation</span>
            </div>
          </div>

          {/* Recent Expenses List matching Screenshot 5 */}
          <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-stone-900">Recent Expenses</h4>
              <button
                onClick={() => setIsAddExpenseOpen(true)}
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={1.75} /> Add expense
              </button>
            </div>

            <div className="space-y-3">
              {state.expenses.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between pb-3 border-b border-stone-100 last:border-0 last:pb-0"
                >
                  <div className="space-y-0.5">
                    <h5 className="font-semibold text-stone-900 text-xs">{exp.description}</h5>
                    <p className="text-[11px] text-stone-400 font-normal">
                      {exp.category} · {exp.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-stone-900 text-xs font-display">
                      ${exp.amountUSD}
                    </span>
                    <button
                      onClick={() => onDeleteExpense(exp.id)}
                      className="text-stone-300 hover:text-rose-500 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating orange add button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 flex items-center justify-center transition-all transform active:scale-95 cursor-pointer"
              title="Add Expense"
            >
              <Plus className="w-6 h-6" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      )}

      {/* ================= 5. FX CONVERTER ================= */}
      {subTab === 'converter' && (
        <div className="bg-white rounded-xl p-6 border border-stone-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-semibold">
                <ArrowRightLeft className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="font-semibold text-stone-900 text-base">Nomad Multi-Currency Converter</h3>
                <p className="text-xs text-stone-500 font-normal">Live exchange rates across 45+ nomad hubs & 150+ countries</p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/80 text-[11px] font-medium text-orange-700">
              <Sparkles className="w-3 h-3 text-orange-500" strokeWidth={1.75} />
              {NOMAD_CURRENCIES.length} Currencies
            </span>
          </div>

          <div className="space-y-4">
            {/* Amount input & Quick Chips */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-stone-700">Amount</label>
                <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                  {[20, 50, 100, 500, 1000, 5000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCalcAmount(preset)}
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                        calcAmount === preset
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {preset >= 1000 ? `${preset / 1000}k` : preset}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xl font-semibold text-stone-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-stone-400">
                  {fromCurrency.code} ({fromCurrency.symbol})
                </span>
              </div>
            </div>

            {/* From, Swap, and To Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">From</label>
                <select
                  value={calcFrom}
                  onChange={(e) => setCalcFrom(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium bg-white text-stone-800 focus:outline-none focus:border-orange-500"
                >
                  {CURRENCY_REGIONS.map((reg) => (
                    <optgroup key={reg} label={`— ${reg} —`}>
                      {NOMAD_CURRENCIES.filter((c) => c.region === reg).map((curr) => (
                        <option key={curr.code} value={curr.code}>
                          {curr.flag} {curr.code} ({curr.symbol}) — {curr.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                {fromCurrency.hub && (
                  <p className="text-[10px] text-stone-400 mt-1 truncate font-normal">
                    {fromCurrency.flag} {fromCurrency.hub}
                  </p>
                )}
              </div>

              {/* Swap Button */}
              <div className="flex justify-center pt-2 sm:pt-4">
                <button
                  type="button"
                  onClick={handleSwapCurrencies}
                  title="Swap currencies"
                  className="w-10 h-10 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200/80 text-orange-600 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
                >
                  <ArrowRightLeft className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">To</label>
                <select
                  value={calcTo}
                  onChange={(e) => setCalcTo(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium bg-white text-stone-800 focus:outline-none focus:border-orange-500"
                >
                  {CURRENCY_REGIONS.map((reg) => (
                    <optgroup key={reg} label={`— ${reg} —`}>
                      {NOMAD_CURRENCIES.filter((c) => c.region === reg).map((curr) => (
                        <option key={curr.code} value={curr.code}>
                          {curr.flag} {curr.code} ({curr.symbol}) — {curr.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                {toCurrency.hub && (
                  <p className="text-[10px] text-stone-400 mt-1 truncate font-normal">
                    {toCurrency.flag} {toCurrency.hub}
                  </p>
                )}
              </div>
            </div>

            {/* Popular Nomad Pairs */}
            <div>
              <span className="text-[11px] font-semibold text-stone-500 block mb-1.5">
                Popular Nomad Pairs:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { from: 'USD', to: 'THB', label: 'USD ⇄ THB (Thailand)' },
                  { from: 'USD', to: 'IDR', label: 'USD ⇄ IDR (Bali)' },
                  { from: 'EUR', to: 'USD', label: 'EUR ⇄ USD' },
                  { from: 'USD', to: 'MXN', label: 'USD ⇄ MXN (Mexico)' },
                  { from: 'USD', to: 'VND', label: 'USD ⇄ VND (Vietnam)' },
                  { from: 'EUR', to: 'BGN', label: 'EUR ⇄ BGN (Bansko)' },
                  { from: 'USD', to: 'JPY', label: 'USD ⇄ JPY (Japan)' },
                  { from: 'USD', to: 'COP', label: 'USD ⇄ COP (Colombia)' },
                  { from: 'EUR', to: 'GBP', label: 'EUR ⇄ GBP' },
                  { from: 'USD', to: 'AED', label: 'USD ⇄ AED (Dubai)' },
                ].map((pair) => (
                  <button
                    key={`${pair.from}-${pair.to}`}
                    type="button"
                    onClick={() => {
                      setCalcFrom(pair.from);
                      setCalcTo(pair.to);
                    }}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors cursor-pointer ${
                      calcFrom === pair.from && calcTo === pair.to
                        ? 'bg-orange-500 border-orange-500 text-white'
                        : 'bg-stone-50 border-stone-200/80 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {pair.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Converted Value Card */}
            <div className="p-5 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200 text-center space-y-2">
              <span className="text-xs text-orange-800 font-semibold uppercase tracking-wider block">
                Converted Value
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-semibold text-stone-900 tracking-tight font-display">
                  {formattedConverted}
                </span>
                <span className="text-sm font-semibold text-orange-700 self-end mb-1">
                  {calcTo}
                </span>
              </div>

              {/* Rate equation */}
              <div className="pt-2 border-t border-orange-200/70 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-stone-600 font-normal">
                <span>
                  1 {calcFrom} = <strong className="text-stone-900 font-semibold">{unitRate < 0.001 ? unitRate.toFixed(6) : unitRate < 1 ? unitRate.toFixed(4) : unitRate.toLocaleString('en-US', { maximumFractionDigits: 2 })}</strong> {calcTo}
                </span>
                <span className="text-stone-300">|</span>
                <span>
                  1 {calcTo} = <strong className="text-stone-900 font-semibold">{inverseRate < 0.001 ? inverseRate.toFixed(6) : inverseRate < 1 ? inverseRate.toFixed(4) : inverseRate.toLocaleString('en-US', { maximumFractionDigits: 2 })}</strong> {calcFrom}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 6. TAX VIEW ================= */}
      {subTab === 'tax' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-semibold">
                <Scale className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="font-semibold text-stone-900 text-base">183-Day Tax Residency Tracker</h3>
                <p className="text-xs text-stone-500 font-normal">Ensure compliance and avoid unexpected tax liabilities</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {state.taxPresences.map((tp) => (
                <div key={tp.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900 text-sm">{tp.country}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      tp.daysSpent > 150 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {tp.daysSpent} / {tp.maxSafeDays || 183} days
                    </span>
                  </div>
                  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 rounded-full" 
                      style={{ width: `${(tp.daysSpent / (tp.maxSafeDays || 183)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Trip Modal */}
      {isAddTripOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveTrip} className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl border border-stone-200 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-stone-900 text-base">Add Trip Destination</h3>
              <button
                type="button"
                onClick={() => setIsAddTripOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            {/* 1-Tap Fast Nomad Hub Presets (No manual typing required) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-stone-700">Popular Nomad Hubs</label>
                <button
                  type="button"
                  onClick={() => {
                    if (state.currentCity) {
                      const parts = state.currentCity.split(',').map(s => s.trim());
                      setNewCity(parts[0] || 'Bali');
                      setNewCountry(parts[1] || 'Indonesia');
                      setNewArrival(new Date().toISOString().split('T')[0]);
                    }
                  }}
                  className="text-[11px] text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <MapPin className="w-3 h-3" strokeWidth={1.75} />
                  <span>Use Current Location</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { city: 'Chiang Mai', country: 'Thailand', flag: '🇹🇭', cost: 450, visa: 'DTV 60d' },
                  { city: 'Lisbon', country: 'Portugal', flag: '🇵🇹', cost: 1200, visa: 'Schengen 90d' },
                  { city: 'Bali (Canggu)', country: 'Indonesia', flag: '🇮🇩', cost: 750, visa: 'VoA B213' },
                  { city: 'Mexico City', country: 'Mexico', flag: '🇲🇽', cost: 950, visa: 'FMM 180d' },
                  { city: 'Bansko', country: 'Bulgaria', flag: '🇧🇬', cost: 420, visa: 'Schengen 90d' },
                  { city: 'Barcelona', country: 'Spain', flag: '🇪🇸', cost: 1300, visa: 'Schengen 90d' },
                ].map((preset) => (
                  <button
                    key={preset.city}
                    type="button"
                    onClick={() => {
                      setNewCity(preset.city);
                      setNewCountry(preset.country);
                      setNewHousingCost(preset.cost);
                      setNewVisaType(preset.visa);
                    }}
                    className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-orange-50 hover:text-orange-700 text-stone-700 text-[11px] font-medium border border-stone-200 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{preset.flag}</span>
                    <span>{preset.city}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="e.g. Mexico City"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-normal focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Country</label>
                <input
                  type="text"
                  required
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  placeholder="e.g. Mexico"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-normal focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Arrival Date</label>
                <input
                  type="date"
                  value={newArrival}
                  onChange={(e) => setNewArrival(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-normal focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Departure Date</label>
                <input
                  type="date"
                  value={newDeparture}
                  onChange={(e) => setNewDeparture(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-normal focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddTripOpen(false)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
              >
                Save Trip
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Expense Modal */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveExpense} className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl border border-stone-200 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-stone-900 text-base">Log Travel Expense</h3>
              <button
                type="button"
                onClick={() => setIsAddExpenseOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
              <input
                type="text"
                required
                value={expDesc}
                onChange={(e) => setExpDesc(e.target.value)}
                placeholder="e.g. Flight to BKK, Coworking pass, Dinner"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-normal focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Amount</label>
                <input
                  type="number"
                  required
                  value={expAmount}
                  onChange={(e) => setExpAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-normal focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Currency</label>
                <select
                  value={expCurrency}
                  onChange={(e) => setExpCurrency(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold bg-white focus:outline-none focus:border-orange-500"
                >
                  {CURRENCY_REGIONS.map((reg) => (
                    <optgroup key={reg} label={`— ${reg} —`}>
                      {NOMAD_CURRENCIES.filter((c) => c.region === reg).map((curr) => (
                        <option key={curr.code} value={curr.code}>
                          {curr.flag} {curr.code} ({curr.symbol}) — {curr.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
              <select
                value={expCategory}
                onChange={(e) => setExpCategory(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-medium bg-white focus:outline-none focus:border-orange-500"
              >
                <option value="Accommodation">Accommodation</option>
                <option value="Transport">Transport / Flights</option>
                <option value="Food & Dining">Food & Dining</option>
                <option value="Coworking">Coworking</option>
                <option value="Visa & Legal">Visa & Legal</option>
                <option value="Entertainment">Entertainment</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddExpenseOpen(false)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
              >
                Save Expense
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Schengen Stay Modal */}
      {isAddSchengenOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveSchengenStay} className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl border border-stone-200 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-stone-900 text-base">Record Schengen Entry</h3>
              <button
                type="button"
                onClick={() => setIsAddSchengenOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Country</label>
              <input
                type="text"
                required
                value={stayCountry}
                onChange={(e) => setStayCountry(e.target.value)}
                placeholder="e.g. Portugal, Spain, France"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-normal focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Entry Date</label>
                <input
                  type="date"
                  value={stayEntry}
                  onChange={(e) => setStayEntry(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-normal focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Exit Date</label>
                <input
                  type="date"
                  value={stayExit}
                  onChange={(e) => setStayExit(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-normal focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddSchengenOpen(false)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
              >
                Save Stay
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

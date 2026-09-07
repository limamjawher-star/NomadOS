import React, { useState } from 'react';
import { 
  Plane, 
  FileText, 
  DollarSign, 
  Calculator, 
  Scale, 
  Plus, 
  Calendar, 
  MapPin, 
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
} from '../types';
import { MultiStopTripView } from './MultiStopTripView';
import { DayItineraryView } from './DayItineraryView';
import { CountryFlag } from './CountryFlag';

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
  const [stayCode, setStayCode] = useState('PT');
  const [stayEntry, setStayEntry] = useState('2026-09-01');
  const [stayExit, setStayExit] = useState('2026-09-30');

  // Currency Converter state
  const [calcAmount, setCalcAmount] = useState<number>(100);
  const [calcFrom, setCalcFrom] = useState('EUR');
  const [calcTo, setCalcTo] = useState('USD');

  const RATES: Record<string, number> = {
    USD: 1.0,
    EUR: 1.08,
    GBP: 1.28,
    THB: 0.029,
    IDR: 0.000062,
    BGN: 0.55,
    JPY: 0.0068,
  };

  const convertedValue = ((calcAmount * (RATES[calcFrom] || 1)) / (RATES[calcTo] || 1)).toFixed(2);

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
    const rate = RATES[expCurrency] || 1;
    const amountUSD = Math.round(expAmount * rate);
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
    <div id="travel-view" className="space-y-5 pb-28 max-w-2xl mx-auto px-4 pt-3">
      {/* Subtabs */}
      <div className="flex bg-slate-100/90 p-1.5 rounded-2xl overflow-x-auto gap-1 no-scrollbar border border-slate-200/80 shadow-inner">
        <button
          onClick={() => setSubTab('trips')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            subTab === 'trips' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Plane className="w-3.5 h-3.5" />
          <span>Trips</span>
        </button>

        <button
          onClick={() => setSubTab('day')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            subTab === 'day' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Day Plan</span>
        </button>

        <button
          onClick={() => setSubTab('visas')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            subTab === 'visas' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Visas & Docs</span>
        </button>

        <button
          onClick={() => setSubTab('expenses')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            subTab === 'expenses' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Expenses</span>
        </button>

        <button
          onClick={() => setSubTab('converter')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            subTab === 'converter' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>FX</span>
        </button>

        <button
          onClick={() => setSubTab('tax')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            subTab === 'tax' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Tax</span>
        </button>
      </div>

      {/* ================= 1. TRIPS VIEW (Screenshot 3 Multi-Stop) ================= */}
      {subTab === 'trips' && (
        <div className="space-y-4">
          <MultiStopTripView />

          <div className="pt-2">
            <div className="flex items-center justify-between pb-2">
              <h4 className="text-xs font-extrabold uppercase text-stone-400 tracking-wider">
                All Planned Relocations
              </h4>
              <button
                onClick={() => setIsAddTripOpen(true)}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Destination</span>
              </button>
            </div>

            <div className="space-y-3">
              {state.trips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm flex items-center gap-3.5 justify-between group hover:border-orange-200 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {trip.coverUrl ? (
                      <img
                        src={trip.coverUrl}
                        alt={trip.city}
                        className="w-16 h-16 rounded-2xl object-cover shrink-0 shadow-xs border border-stone-100"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 font-black flex items-center justify-center shrink-0">
                        <Plane className="w-6 h-6" />
                      </div>
                    )}
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-stone-900 truncate">{trip.city}</h4>
                        <span className="text-xs text-stone-400 font-semibold">{trip.country}</span>
                      </div>
                      <p className="text-xs text-stone-500 font-medium">
                        {trip.arrivalDate} → {trip.departureDate} · {trip.visaType}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteTrip(trip.id)}
                    className="p-2 text-stone-300 hover:text-rose-500 rounded-lg shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
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
        <div className="space-y-4">
          {/* Sub-segment toggle: Visas | My Documents */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/80 shadow-inner">
            <button
              onClick={() => setVisaSegment('visas')}
              className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all ${
                visaSegment === 'visas'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Visas & Entry Permits
            </button>
            <button
              onClick={() => setVisaSegment('documents')}
              className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all ${
                visaSegment === 'documents'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Vault Documents
            </button>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            Monitor real-time visa validity, Schengen 90/180 countdowns, and travel compliance.
          </p>

          {/* 3 Status Cards Grid matching Screenshot 2 */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600 block">Active</span>
              <span className="text-2xl font-black text-slate-900 font-display">2</span>
            </div>
            <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 block">Expiring</span>
              <span className="text-2xl font-black text-slate-900 font-display">1</span>
            </div>
            <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 block">Overstay Risk</span>
              <span className="text-2xl font-black text-slate-900 font-display">0</span>
            </div>
          </div>

          {/* Urgent banner */}
          <div className="p-3.5 bg-rose-50 border border-rose-200/90 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <div>
                <span className="font-extrabold text-rose-950 block">Indonesia: 2 days left</span>
                <span className="text-[11px] text-rose-700">Expires soon on 2026-04-06</span>
              </div>
            </div>
            <span className="text-[10px] font-extrabold text-rose-700 bg-rose-100/90 px-2.5 py-1 rounded-full border border-rose-200">
              Extend / Exit
            </span>
          </div>

          {/* Pending docs card */}
          <div className="p-4 bg-orange-50/80 border border-orange-200/90 rounded-3xl flex items-center justify-between shadow-sm">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-600 shrink-0" />
                <h5 className="font-black text-orange-950 text-xs uppercase tracking-wider font-display">
                  6 PENDING across 3 visa(s)
                </h5>
              </div>
              <p className="text-[11px] text-orange-700">
                Proof of onward travel, vaccination cert, bank statement
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-orange-700" />
          </div>

          {/* Schengen 90/180 Calculator Box */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CountryFlag code="EU" name="European Union" size="xs" />
                <h4 className="text-sm font-black text-slate-900 font-display">Schengen 90/180 Calculator</h4>
              </div>
              <span className="px-2.5 py-0.5 bg-orange-500 text-white font-black text-xs rounded-full">
                90/180
              </span>
            </div>

            <div className="flex items-baseline justify-between text-xs">
              <span className="text-base font-black text-emerald-600 font-display">{daysRemaining} Days left</span>
              <span className="text-slate-500 font-bold">{totalSchengenDays}/90 used</span>
            </div>

            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (totalSchengenDays / 90) * 100)}%` }}
              />
            </div>

            <div className="pt-1 flex items-center justify-between text-xs text-slate-400">
              <span>Next rolling reset in 48 days</span>
              <button
                onClick={() => setIsAddSchengenOpen(true)}
                className="text-orange-600 hover:text-orange-700 font-extrabold flex items-center gap-1"
              >
                + Log Entry Date
              </button>
            </div>
          </div>

          {/* List of Active Visas */}
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
              Tracked Visas
            </h4>

            {/* Indonesia */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <CountryFlag code="ID" name="Indonesia" size="md" />
                  <div>
                    <h5 className="font-black text-slate-900 text-sm font-display">Indonesia</h5>
                    <p className="text-xs text-slate-500 font-semibold">Visa on Arrival (B213)</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-rose-50 text-rose-700 font-black text-[11px] rounded-md border border-rose-200">
                  2d left
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Entry: 2026-04-06 · <strong>28/30 days used</strong>
              </p>
              <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600 font-medium">
                2d left — consider extension or exit to avoid overstay penalty.
              </div>
            </div>

            {/* Thailand */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <CountryFlag code="TH" name="Thailand" size="md" />
                  <div>
                    <h5 className="font-black text-slate-900 text-sm font-display">Thailand</h5>
                    <p className="text-xs text-slate-500 font-semibold">Visa Exemption (Tourist - 30 days)</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-black text-[11px] rounded-md border border-emerald-200">
                  Ready
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Entry scheduled: 2026-06-18 · Valid until 2026-07-18
              </p>
            </div>
          </div>

          {/* Floating Action Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setIsAddTripOpen(true)}
              className="w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/30 flex items-center justify-center transition-all transform active:scale-95"
              title="Add Visa or Document"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* ================= 4. EXPENSES VIEW (Screenshot 5) ================= */}
      {subTab === 'expenses' && (
        <div className="space-y-4">
          {/* Scope Filter matching Screenshot 5 */}
          <div className="flex items-center justify-between">
            <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200/60 text-xs font-bold">
              {(['All', 'Trip', 'Stop'] as const).map((sc) => (
                <button
                  key={sc}
                  onClick={() => setExpenseScope(sc)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    expenseScope === sc ? 'bg-white text-stone-900 shadow-sm font-black' : 'text-stone-500'
                  }`}
                >
                  {sc}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 text-xs font-extrabold text-stone-800 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-sm cursor-pointer">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              <span>Europe Summer Workation</span>
              <span className="text-[10px] text-stone-400">▾</span>
            </div>
          </div>

          {/* 4 Stat Cards matching Screenshot 5 */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider block">TRIP TOTAL</span>
              <h4 className="text-xl font-black text-stone-900">€1,890</h4>
              <span className="text-xs text-stone-400">12 expenses</span>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider block">THIS MONTH</span>
              <h4 className="text-xl font-black text-stone-900">€1,420</h4>
              <span className="text-xs text-stone-400">7 expenses</span>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider block">BUDGET</span>
              <h4 className="text-xl font-black text-emerald-600">€4,410 left</h4>
              <span className="text-xs text-stone-400">30% used</span>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider block">COUNTRY</span>
              <h4 className="text-xl font-black text-stone-900">3</h4>
              <span className="text-xs text-orange-600 font-bold">Top: Accommodation</span>
            </div>
          </div>

          {/* Recent Expenses List matching Screenshot 5 */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-stone-900">Recent Expenses</h4>
              <button
                onClick={() => setIsAddExpenseOpen(true)}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add expense
              </button>
            </div>

            <div className="space-y-3">
              {state.expenses.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between pb-3 border-b border-stone-100 last:border-0 last:pb-0"
                >
                  <div className="space-y-0.5">
                    <h5 className="font-extrabold text-stone-900 text-xs">{exp.description}</h5>
                    <p className="text-[11px] text-stone-400 font-medium">
                      {exp.category} · {exp.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-stone-900 text-xs">
                      ${exp.amountUSD}
                    </span>
                    <button
                      onClick={() => onDeleteExpense(exp.id)}
                      className="text-stone-300 hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
              className="w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/30 flex items-center justify-center transition-all transform active:scale-95"
              title="Add Expense"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* ================= 5. FX CONVERTER ================= */}
      {subTab === 'converter' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-stone-900 text-base">Nomad Multi-Currency Converter</h3>
              <p className="text-xs text-stone-500">Live exchange rates across 150+ countries</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Amount</label>
              <input
                type="number"
                value={calcAmount}
                onChange={(e) => setCalcAmount(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-lg font-black focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">From</label>
                <select
                  value={calcFrom}
                  onChange={(e) => setCalcFrom(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold bg-white focus:outline-none focus:border-orange-500"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="THB">THB (฿)</option>
                  <option value="IDR">IDR (Rp)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">To</label>
                <select
                  value={calcTo}
                  onChange={(e) => setCalcTo(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold bg-white focus:outline-none focus:border-orange-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="THB">THB (฿)</option>
                  <option value="IDR">IDR (Rp)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 text-center">
              <span className="text-xs text-orange-700 font-bold block">Converted Value</span>
              <span className="text-2xl font-black text-orange-900 mt-1 block">
                {convertedValue} {calcTo}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ================= 6. TAX VIEW ================= */}
      {subTab === 'tax' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-stone-900 text-base">183-Day Tax Residency Tracker</h3>
                <p className="text-xs text-stone-500">Ensure compliance and avoid unexpected tax liabilities</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {state.taxPresences.map((tp) => (
                <div key={tp.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-stone-900 text-sm">{tp.country}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveTrip} className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-stone-900 text-base">Add Trip Destination</h3>
              <button
                type="button"
                onClick={() => setIsAddTripOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="e.g. Mexico City"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Country</label>
                <input
                  type="text"
                  required
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  placeholder="e.g. Mexico"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Arrival Date</label>
                <input
                  type="date"
                  value={newArrival}
                  onChange={(e) => setNewArrival(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Departure Date</label>
                <input
                  type="date"
                  value={newDeparture}
                  onChange={(e) => setNewDeparture(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddTripOpen(false)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-xl text-xs shadow-md shadow-orange-500/30"
              >
                Save Trip
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Expense Modal */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveExpense} className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-stone-900 text-base">Log Travel Expense</h3>
              <button
                type="button"
                onClick={() => setIsAddExpenseOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Description</label>
              <input
                type="text"
                required
                value={expDesc}
                onChange={(e) => setExpDesc(e.target.value)}
                placeholder="e.g. Flight to BKK, Coworking pass, Dinner"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Amount</label>
                <input
                  type="number"
                  required
                  value={expAmount}
                  onChange={(e) => setExpAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Currency</label>
                <select
                  value={expCurrency}
                  onChange={(e) => setExpCurrency(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-bold bg-white focus:outline-none focus:border-orange-500"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="THB">THB (฿)</option>
                  <option value="IDR">IDR (Rp)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
              <select
                value={expCategory}
                onChange={(e) => setExpCategory(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-bold bg-white focus:outline-none focus:border-orange-500"
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
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-xl text-xs shadow-md shadow-orange-500/30"
              >
                Save Expense
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Schengen Stay Modal */}
      {isAddSchengenOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveSchengenStay} className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-stone-900 text-base">Record Schengen Entry</h3>
              <button
                type="button"
                onClick={() => setIsAddSchengenOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Country</label>
              <input
                type="text"
                required
                value={stayCountry}
                onChange={(e) => setStayCountry(e.target.value)}
                placeholder="e.g. Portugal, Spain, France"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Entry Date</label>
                <input
                  type="date"
                  value={stayEntry}
                  onChange={(e) => setStayEntry(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Exit Date</label>
                <input
                  type="date"
                  value={stayExit}
                  onChange={(e) => setStayExit(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddSchengenOpen(false)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-xl text-xs shadow-md shadow-orange-500/30"
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

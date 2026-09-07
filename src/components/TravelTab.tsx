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
  ArrowRightLeft
} from 'lucide-react';
import { 
  NomadState, 
  TripDestination, 
  SchengenStay, 
  TaxPresence, 
  NomadExpense 
} from '../types';

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
  const [subTab, setSubTab] = useState<'trips' | 'visas' | 'expenses' | 'converter' | 'tax'>('trips');
  const [isAddTripOpen, setIsAddTripOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddSchengenOpen, setIsAddSchengenOpen] = useState(false);

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
    <div id="travel-view" className="space-y-6 pb-24 max-w-2xl mx-auto px-4 pt-4">
      {/* Subtabs matching competitor screenshot */}
      <div className="flex bg-stone-100 p-1.5 rounded-2xl overflow-x-auto gap-1 scrollbar-none">
        <button
          onClick={() => setSubTab('trips')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            subTab === 'trips' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Plane className={`w-3.5 h-3.5 ${subTab === 'trips' ? 'text-orange-500' : 'text-stone-400'}`} />
          <span>Trips</span>
        </button>

        <button
          onClick={() => setSubTab('visas')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            subTab === 'visas' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <FileText className={`w-3.5 h-3.5 ${subTab === 'visas' ? 'text-orange-500' : 'text-stone-400'}`} />
          <span>Visas</span>
        </button>

        <button
          onClick={() => setSubTab('expenses')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            subTab === 'expenses' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <DollarSign className={`w-3.5 h-3.5 ${subTab === 'expenses' ? 'text-orange-500' : 'text-stone-400'}`} />
          <span>Expenses</span>
        </button>

        <button
          onClick={() => setSubTab('converter')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            subTab === 'converter' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Calculator className={`w-3.5 h-3.5 ${subTab === 'converter' ? 'text-orange-500' : 'text-stone-400'}`} />
          <span>Converter</span>
        </button>

        <button
          onClick={() => setSubTab('tax')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            subTab === 'tax' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Scale className={`w-3.5 h-3.5 ${subTab === 'tax' ? 'text-orange-500' : 'text-stone-400'}`} />
          <span>Tax</span>
        </button>
      </div>

      {/* ================= TRIPS VIEW ================= */}
      {subTab === 'trips' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-stone-900">Your Itinerary & Stops</h3>
              <p className="text-xs text-stone-500">Track accommodation, visa limits, and dates</p>
            </div>
            <button
              onClick={() => setIsAddTripOpen(true)}
              className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-md shadow-orange-500/20 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Trip
            </button>
          </div>

          <div className="space-y-3">
            {state.trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm hover:border-orange-300 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-stone-900">{trip.city}</span>
                      <span className="text-xs font-semibold text-stone-400">{trip.country}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-orange-500" />
                      <span>{trip.arrivalDate} → {trip.departureDate}</span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    trip.accommodationStatus === 'Booked'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {trip.accommodationStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-100 text-xs">
                  <div>
                    <span className="text-stone-400 block text-[10px] font-bold uppercase">Estimated Housing</span>
                    <span className="font-bold text-stone-800">${trip.housingCostUSD}/mo</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] font-bold uppercase">Visa Entry</span>
                    <span className="font-bold text-stone-800 truncate block">{trip.visaType}</span>
                  </div>
                </div>

                {trip.notes && (
                  <p className="text-[11px] text-stone-500 bg-stone-50 p-2 rounded-xl">
                    {trip.notes}
                  </p>
                )}

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => onDeleteTrip(trip.id)}
                    className="text-stone-400 hover:text-rose-500 text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove Stop
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= VISAS VIEW ================= */}
      {subTab === 'visas' && (
        <div className="space-y-5">
          {/* Schengen Countdown Banner */}
          <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-6 text-white shadow-xl shadow-orange-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-orange-100">
                Schengen 90/180-Day Rule
              </span>
              <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold">
                {daysRemaining > 15 ? 'Safe Status' : 'Warning'}
              </span>
            </div>

            <div>
              <h3 className="text-4xl font-black">{daysRemaining} Days Left</h3>
              <p className="text-xs text-orange-100 mt-1">
                You have spent {totalSchengenDays} out of 90 legal days across Schengen member countries.
              </p>
            </div>

            <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (totalSchengenDays / 90) * 100)}%` }}
              />
            </div>
          </div>

          {/* Stays list */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-stone-900">Recorded Schengen Stays</h4>
              <button
                onClick={() => setIsAddSchengenOpen(true)}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                + Add Stay
              </button>
            </div>

            <div className="space-y-2.5">
              {state.schengenStays.map((stay) => (
                <div
                  key={stay.id}
                  className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-sm flex items-center justify-between"
                >
                  <div>
                    <h5 className="text-xs font-bold text-stone-900">{stay.country}</h5>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {stay.entryDate} → {stay.exitDate}
                    </p>
                    {stay.notes && <p className="text-[10px] text-stone-400 mt-0.5">{stay.notes}</p>}
                  </div>
                  <button
                    onClick={() => onDeleteSchengenStay(stay.id)}
                    className="text-stone-300 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Nomad Visas Vault */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm space-y-3">
            <h4 className="text-sm font-black text-stone-900">Digital Nomad Visas & Documents</h4>
            <div className="space-y-2.5">
              {state.documents.map((doc) => (
                <div key={doc.id} className="p-3 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-stone-800">{doc.title}</h5>
                    <p className="text-[11px] text-stone-500">Ref: {doc.referenceNumber} · Expires {doc.expirationDate}</p>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= EXPENSES VIEW ================= */}
      {subTab === 'expenses' && (
        <div className="space-y-5">
          {/* Burn rate summary */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  September Burn Rate
                </span>
                <h3 className="text-3xl font-black text-stone-900 mt-0.5">
                  ${state.expenses.reduce((a, b) => a + b.amountUSD, 0).toLocaleString()}
                </h3>
              </div>
              <button
                onClick={() => setIsAddExpenseOpen(true)}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-md shadow-orange-500/20 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Log Expense
              </button>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100">
              <span className="text-stone-500">Monthly Budget: ${state.monthlyBudgetUSD}</span>
              <span className="font-bold text-orange-600">
                {Math.round((state.expenses.reduce((a, b) => a + b.amountUSD, 0) / state.monthlyBudgetUSD) * 100)}% Used
              </span>
            </div>
          </div>

          {/* Expense transactions */}
          <div className="space-y-2.5">
            <h4 className="text-sm font-black text-stone-900">Recent Transactions</h4>
            {state.expenses.map((exp) => (
              <div
                key={exp.id}
                className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-sm flex items-center justify-between hover:border-orange-300 transition-all"
              >
                <div>
                  <h5 className="text-xs font-bold text-stone-900">{exp.description}</h5>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-semibold text-orange-600">{exp.category}</span>
                    <span className="text-stone-300">•</span>
                    <span className="text-[11px] text-stone-400">{exp.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm font-black text-stone-900">${exp.amountUSD}</span>
                    <span className="text-[10px] text-stone-400 block">{exp.amount} {exp.currency}</span>
                  </div>
                  <button
                    onClick={() => onDeleteExpense(exp.id)}
                    className="text-stone-300 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= CONVERTER VIEW ================= */}
      {subTab === 'converter' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-black text-stone-900">Live Currency Converter</h3>
            <p className="text-xs text-stone-500">Real-time nomad exchange rate calculator</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                Amount
              </label>
              <input
                type="number"
                value={calcAmount}
                onChange={(e) => setCalcAmount(Number(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-lg font-black text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 items-center">
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  From
                </label>
                <select
                  value={calcFrom}
                  onChange={(e) => setCalcFrom(e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="THB">THB (฿)</option>
                  <option value="IDR">IDR (Rp)</option>
                  <option value="BGN">BGN (лв)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1">
                  To
                </label>
                <select
                  value={calcTo}
                  onChange={(e) => setCalcTo(e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="THB">THB (฿)</option>
                  <option value="IDR">IDR (Rp)</option>
                  <option value="BGN">BGN (лв)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>
            </div>

            {/* Result display */}
            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-center space-y-1">
              <span className="text-xs text-orange-800 font-medium">Estimated Conversion</span>
              <h4 className="text-2xl font-black text-orange-900">
                {convertedValue} {calcTo}
              </h4>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAX VIEW ================= */}
      {subTab === 'tax' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm space-y-3">
            <h3 className="text-lg font-black text-stone-900">Tax Residency & Physical Presence</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Track days spent per country in 2026 to ensure you stay below the 183-day automatic tax residency trigger.
            </p>
          </div>

          <div className="space-y-3">
            {state.taxPresences.map((tax) => (
              <div
                key={tax.id}
                className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-stone-900">{tax.country}</span>
                    <span className="text-xs font-semibold text-stone-400">({tax.year})</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {tax.daysSpent} / {tax.maxSafeDays} Days
                  </span>
                </div>

                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full"
                    style={{ width: `${Math.min(100, (tax.daysSpent / tax.maxSafeDays) * 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>{tax.notes}</span>
                  <button
                    onClick={() => onUpdateTaxPresence(tax.id, tax.daysSpent + 1)}
                    className="text-orange-600 font-bold hover:underline"
                  >
                    +1 Day
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Action Button (+) */}
      <button
        id="travel-fab-btn"
        onClick={() => {
          if (subTab === 'trips') setIsAddTripOpen(true);
          else if (subTab === 'expenses') setIsAddExpenseOpen(true);
          else if (subTab === 'visas') setIsAddSchengenOpen(true);
          else setIsAddTripOpen(true);
        }}
        className="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-xl shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all z-40"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>

      {/* Add Trip Modal */}
      {isAddTripOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-stone-200 shadow-2xl space-y-4">
            <h4 className="text-base font-black text-stone-900">Add New Trip Stop</h4>
            <form onSubmit={handleSaveTrip} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="e.g. Bansko"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Country</label>
                <input
                  type="text"
                  required
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  placeholder="e.g. Bulgaria"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Arrival Date</label>
                  <input
                    type="date"
                    required
                    value={newArrival}
                    onChange={(e) => setNewArrival(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Departure Date</label>
                  <input
                    type="date"
                    required
                    value={newDeparture}
                    onChange={(e) => setNewDeparture(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Housing Status</label>
                <select
                  value={newHousingStatus}
                  onChange={(e) => setNewHousingStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
                >
                  <option value="Booked">Booked</option>
                  <option value="Searching">Searching</option>
                  <option value="Co-living">Co-living</option>
                  <option value="Friends/Family">Friends/Family</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-500 text-white font-bold rounded-xl text-xs shadow-md shadow-orange-500/20"
                >
                  Add Stop
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddTripOpen(false)}
                  className="px-4 py-2.5 bg-stone-100 text-stone-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-stone-200 shadow-2xl space-y-4">
            <h4 className="text-base font-black text-stone-900">Log Nomad Expense</h4>
            <form onSubmit={handleSaveExpense} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  placeholder="e.g. Coworking desk monthly pass"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Amount</label>
                  <input
                    type="number"
                    required
                    value={expAmount}
                    onChange={(e) => setExpAmount(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Currency</label>
                  <select
                    value={expCurrency}
                    onChange={(e) => setExpCurrency(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="THB">THB (฿)</option>
                    <option value="IDR">IDR (Rp)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Category</label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
                >
                  <option value="Accommodation">Accommodation</option>
                  <option value="Flights & Transit">Flights & Transit</option>
                  <option value="Food & Groceries">Food & Groceries</option>
                  <option value="Coworking & Cafes">Coworking & Cafes</option>
                  <option value="Health & Visas">Health & Visas</option>
                  <option value="Activities">Activities</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-500 text-white font-bold rounded-xl text-xs shadow-md shadow-orange-500/20"
                >
                  Save Expense
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="px-4 py-2.5 bg-stone-100 text-stone-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Schengen Stay Modal */}
      {isAddSchengenOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-stone-200 shadow-2xl space-y-4">
            <h4 className="text-base font-black text-stone-900">Add Schengen Stay</h4>
            <form onSubmit={handleSaveSchengenStay} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Country</label>
                <input
                  type="text"
                  required
                  value={stayCountry}
                  onChange={(e) => {
                    setStayCountry(e.target.value);
                    setStayCode(e.target.value.slice(0, 2).toUpperCase());
                  }}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Entry Date</label>
                  <input
                    type="date"
                    required
                    value={stayEntry}
                    onChange={(e) => setStayEntry(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Exit Date</label>
                  <input
                    type="date"
                    required
                    value={stayExit}
                    onChange={(e) => setStayExit(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-500 text-white font-bold rounded-xl text-xs shadow-md shadow-orange-500/20"
                >
                  Record Stay
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddSchengenOpen(false)}
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

import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Plus,
  Trash2,
  Calendar,
  Info,
  Clock,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { SchengenStay } from '../../types';
import { calculateSchengen, SCHENGEN_COUNTRIES } from '../../utils/schengenCalculator';
import { getCountryFlag } from '../../utils/formatters';
import { differenceInCalendarDays, parseISO, format } from 'date-fns';

interface SchengenTrackerProps {
  stays: SchengenStay[];
  onAddStay: (stay: Omit<SchengenStay, 'id'>) => void;
  onDeleteStay: (id: string) => void;
}

export const SchengenTracker: React.FC<SchengenTrackerProps> = ({
  stays,
  onAddStay,
  onDeleteStay,
}) => {
  const [simulatedDate, setSimulatedDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCountryInfo, setShowCountryInfo] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form State
  const [newCountry, setNewCountry] = useState('Portugal');
  const [newCountryCode, setNewCountryCode] = useState('PT');
  const [newEntryDate, setNewEntryDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [newExitDate, setNewExitDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [newNotes, setNewNotes] = useState('');

  const result = calculateSchengen(stays, simulatedDate);
  const percentUsed = Math.min(100, Math.round((result.daysUsedInWindow / 90) * 100));

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = SCHENGEN_COUNTRIES.find((c) => c.name === e.target.value);
    if (selected) {
      setNewCountry(selected.name);
      setNewCountryCode(selected.code);
    }
  };

  const handleSubmitNewStay = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!newEntryDate || !newExitDate) return;
    if (newEntryDate > newExitDate) {
      setFormError('Entry date cannot be after exit date.');
      return;
    }
    onAddStay({
      country: newCountry,
      countryCode: newCountryCode,
      entryDate: newEntryDate,
      exitDate: newExitDate,
      notes: newNotes,
    });
    setNewNotes('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Summary */}
      <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono tracking-wider uppercase text-amber-400 font-semibold">
                Schengen Zone 90/180-Day Rule Calculator
              </span>
              <button
                onClick={() => setShowCountryInfo(!showCountryInfo)}
                className="text-stone-400 hover:text-stone-200 transition-colors"
                title="View Schengen member countries"
              >
                <HelpCircle className="h-3.5 w-3.5" />
              </button>
            </div>
            <h2 className="text-2xl font-semibold text-stone-100 mt-1">
              Short-Stay Visa Compliance Engine
            </h2>
            <p className="text-stone-400 text-sm max-w-2xl mt-1 leading-relaxed">
              Under Regulation (EU) 2016/399, third-country nationals cannot exceed 90 days of presence in any rolling 180-day window. Both entry and exit dates are counted as full days.
            </p>
          </div>

          {/* Reference date picker for simulation */}
          <div className="flex items-center gap-3 bg-stone-950/80 border border-stone-800 px-4 py-2.5 rounded-xl">
            <Calendar className="h-4 w-4 text-amber-400" strokeWidth={1.75} />
            <div>
              <div className="text-[10px] text-stone-400 uppercase font-mono">Simulate Date</div>
              <input
                id="schengen-sim-date"
                type="date"
                value={simulatedDate}
                onChange={(e) => setSimulatedDate(e.target.value)}
                className="bg-transparent text-sm text-stone-200 font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Big Meter & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-stone-800/80">
          <div className="bg-stone-950/50 border border-stone-800 p-4 rounded-xl">
            <span className="text-xs text-stone-400 font-mono uppercase">Days Used (In 180d)</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-semibold font-mono text-stone-100">
                {result.daysUsedInWindow}
              </span>
              <span className="text-stone-500 font-mono text-sm">/ 90 days</span>
            </div>
            <div className="w-full bg-stone-800 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  result.isOverstay
                    ? 'bg-rose-500'
                    : percentUsed > 80
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${percentUsed}%` }}
              />
            </div>
          </div>

          <div className="bg-stone-950/50 border border-stone-800 p-4 rounded-xl">
            <span className="text-xs text-stone-400 font-mono uppercase">Remaining Allowance</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className={`text-3xl font-semibold font-mono ${
                  result.daysRemainingInWindow === 0
                    ? 'text-rose-400'
                    : result.daysRemainingInWindow < 15
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {result.daysRemainingInWindow}
              </span>
              <span className="text-stone-500 font-mono text-sm">days left</span>
            </div>
            <div className="text-xs text-stone-400 mt-2">
              Window: <span className="font-mono text-stone-300">{result.windowStart}</span> to{' '}
              <span className="font-mono text-stone-300">{result.referenceDate}</span>
            </div>
          </div>

          <div className="bg-stone-950/50 border border-stone-800 p-4 rounded-xl">
            <span className="text-xs text-stone-400 font-mono uppercase">Continuous Stay Limit</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-semibold font-mono text-amber-300">
                {result.maxContinuousFutureDays}
              </span>
              <span className="text-stone-500 font-mono text-sm">days continuous</span>
            </div>
            <div className="text-xs text-stone-400 mt-2">
              Latest legal exit:{' '}
              <span className="font-mono text-amber-200 font-medium">{result.latestExitDate}</span>
            </div>
          </div>

          <div className="bg-stone-950/50 border border-stone-800 p-4 rounded-xl flex flex-col justify-between">
            <span className="text-xs text-stone-400 font-mono uppercase">Compliance Status</span>
            <div className="mt-1">
              {result.isOverstay ? (
                <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                  <span>OVERSTAY RISK! Exceeded by {result.daysUsedInWindow - 90}d</span>
                </div>
              ) : percentUsed > 80 ? (
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                  <span>Approaching Limit (Caution)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <ShieldCheck className="h-5 w-5 flex-shrink-0" />
                  <span>Strictly Compliant (Safe)</span>
                </div>
              )}
            </div>
            <div className="text-[11px] text-stone-400 mt-2">
              No fines, bans, or SIS alerts risk.
            </div>
          </div>
        </div>

        {/* Member Countries Info Box (Collapsible) */}
        {showCountryInfo && (
          <div className="mt-6 p-4 rounded-xl bg-stone-950/90 border border-amber-500/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase text-amber-400 font-semibold flex items-center gap-2">
                <Info className="h-4 w-4" /> 29 Schengen Member Countries
              </span>
              <span className="text-xs text-stone-400">
                Note: UK, Ireland, Cyprus, Albania, Montenegro are NON-Schengen.
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
              {SCHENGEN_COUNTRIES.map((c) => (
                <div
                  key={c.code}
                  className="flex items-center gap-2 bg-stone-900/80 px-2.5 py-1.5 rounded border border-stone-800 text-stone-300"
                >
                  <span>{c.flag}</span>
                  <span className="truncate">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Logged Stays Section */}
      <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-stone-100 flex items-center gap-2">
              <span>Schengen Entry & Exit Log</span>
              <span className="text-xs font-mono font-normal text-stone-400">
                ({stays.length} recorded {stays.length === 1 ? 'stay' : 'stays'})
              </span>
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Log all past, ongoing, and planned trips into Schengen territory.
            </p>
          </div>

          <button
            id="add-schengen-stay-btn"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Record Stay</span>
          </button>
        </div>

        {/* Add Stay Modal/Card */}
        {showAddForm && (
          <form
            onSubmit={handleSubmitNewStay}
            className="mb-6 p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-4"
          >
            <div className="text-sm font-semibold text-stone-200">New Schengen Stay</div>
            {formError && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                {formError}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Country</label>
                <select
                  value={newCountry}
                  onChange={handleCountryChange}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  {SCHENGEN_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Entry Date (Day 1)
                </label>
                <input
                  type="date"
                  required
                  value={newEntryDate}
                  onChange={(e) => setNewEntryDate(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Exit Date (Inclusive)
                </label>
                <input
                  type="date"
                  required
                  value={newExitDate}
                  onChange={(e) => setNewExitDate(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1">
                Trip Notes / Purpose
              </label>
              <input
                type="text"
                placeholder="e.g. Barcelona coliving month, Nomad Summit, work retreat"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
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
                Save Stay
              </button>
            </div>
          </form>
        )}

        {/* Stays Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 font-mono text-xs uppercase">
                <th className="pb-3 font-medium">Country</th>
                <th className="pb-3 font-medium">Dates</th>
                <th className="pb-3 font-medium">Duration</th>
                <th className="pb-3 font-medium">Notes</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {stays.map((stay) => {
                const days =
                  differenceInCalendarDays(
                    parseISO(stay.exitDate),
                    parseISO(stay.entryDate)
                  ) + 1;

                return (
                  <tr key={stay.id} className="hover:bg-stone-800/30 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getCountryFlag(stay.countryCode)}</span>
                        <span className="font-medium text-stone-200">{stay.country}</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 text-stone-300 font-mono text-xs">
                      {stay.entryDate} <span className="text-stone-500">→</span> {stay.exitDate}
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium bg-stone-800 text-amber-300 border border-stone-700">
                        {days} {days === 1 ? 'day' : 'days'}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-stone-400 text-xs truncate max-w-xs">
                      {stay.notes || '—'}
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => onDeleteStay(stay.id)}
                        className="p-1.5 rounded hover:bg-rose-500/20 text-stone-500 hover:text-rose-400 transition-colors"
                        title="Delete stay"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {stays.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-stone-500 text-sm">
                    No Schengen stays recorded yet. Click "Record Stay" above to begin tracking.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

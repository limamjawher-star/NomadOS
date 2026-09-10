import React, { useState } from 'react';
import {
  Compass,
  AlertTriangle,
  ShieldCheck,
  Plus,
  Trash2,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { TaxPresence } from '../../types';
import { getCountryFlag } from '../../utils/formatters';

interface TaxPresenceTrackerProps {
  presences: TaxPresence[];
  onAddPresence: (presence: Omit<TaxPresence, 'id'>) => void;
  onUpdateDays: (id: string, delta: number) => void;
  onDeletePresence: (id: string) => void;
}

export const TaxPresenceTracker: React.FC<TaxPresenceTrackerProps> = ({
  presences,
  onAddPresence,
  onUpdateDays,
  onDeletePresence,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCountry, setNewCountry] = useState('');
  const [newCountryCode, setNewCountryCode] = useState('');
  const [newDays, setNewDays] = useState(1);
  const [newThreshold, setNewThreshold] = useState(183);
  const [newNotes, setNewNotes] = useState('');

  const currentYear = new Date().getFullYear();

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCountry.trim()) return;

    let risk: TaxPresence['taxResidencyRisk'] = 'low';
    if (newDays >= newThreshold) risk = 'exceeded';
    else if (newDays >= newThreshold * 0.8) risk = 'high';
    else if (newDays >= newThreshold * 0.5) risk = 'moderate';

    onAddPresence({
      country: newCountry.trim(),
      countryCode: newCountryCode.trim().toUpperCase() || 'UN',
      daysSpent: Number(newDays),
      year: currentYear,
      maxSafeDays: Number(newThreshold),
      taxResidencyRisk: risk,
      notes: newNotes,
    });

    setNewCountry('');
    setNewCountryCode('');
    setNewDays(1);
    setNewThreshold(183);
    setNewNotes('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Information Header */}
      <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono tracking-wider uppercase text-amber-400 font-semibold">
                Physical Presence & Tax Residency Monitor ({currentYear})
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-stone-100 mt-1">
              The 183-Day Rule & Domicile Guard
            </h2>
            <p className="text-stone-400 text-sm max-w-2xl mt-1 leading-relaxed">
              Most worldwide jurisdictions trigger automatic tax residency and global income reporting once you accumulate 183 days of physical presence in a single tax year.
            </p>
          </div>

          <button
            id="add-tax-presence-btn"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start md:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Track Jurisdiction</span>
          </button>
        </div>

        {/* Add Modal */}
        {showAddForm && (
          <form
            onSubmit={handleAddSubmit}
            className="mt-6 p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-4"
          >
            <div className="text-sm font-semibold text-stone-200">Track New Jurisdiction</div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Country Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Portugal, Cyprus, Thailand"
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  2-Letter Code (Flag)
                </label>
                <input
                  type="text"
                  maxLength={2}
                  placeholder="e.g. PT, CY, TH"
                  value={newCountryCode}
                  onChange={(e) => setNewCountryCode(e.target.value.toUpperCase())}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Days Spent So Far</label>
                <input
                  type="number"
                  min={0}
                  max={366}
                  value={newDays}
                  onChange={(e) => setNewDays(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Safe Threshold (Days)
                </label>
                <input
                  type="number"
                  min={1}
                  max={366}
                  value={newThreshold}
                  onChange={(e) => setNewThreshold(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1">Tax / Visa Notes</label>
              <input
                type="text"
                placeholder="e.g. Target tax domicile, D7 visa, or avoiding statutory residence"
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
                Add Jurisdiction
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Grid of Monitored Countries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {presences.map((p) => {
          const ratio = Math.min(100, Math.round((p.daysSpent / p.maxSafeDays) * 100));
          const remaining = Math.max(0, p.maxSafeDays - p.daysSpent);
          const isWarning = ratio >= 75 && ratio < 100;
          const isTriggered = p.daysSpent >= p.maxSafeDays;

          return (
            <div
              key={p.id}
              className="rounded-xl border border-stone-800 bg-stone-900/60 p-5 flex flex-col justify-between hover:border-stone-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{getCountryFlag(p.countryCode)}</span>
                    <div>
                      <h4 className="font-semibold text-stone-100">{p.country}</h4>
                      <span className="text-xs text-stone-400 font-mono">
                        Tax Year {p.year}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUpdateDays(p.id, -1)}
                      disabled={p.daysSpent <= 0}
                      className="h-7 w-7 rounded bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-300 font-mono text-xs flex items-center justify-center transition-colors cursor-pointer"
                      title="Subtract 1 day"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => onUpdateDays(p.id, 1)}
                      className="h-7 w-7 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 font-mono text-xs flex items-center justify-center transition-colors cursor-pointer"
                      title="Add 1 day"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => onDeletePresence(p.id)}
                      className="p-1.5 rounded hover:bg-rose-500/20 text-stone-500 hover:text-rose-400 transition-colors ml-1 cursor-pointer"
                      title="Remove jurisdiction"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                  </div>
                </div>

                {/* Days Spent & Threshold */}
                <div className="mt-4 flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-semibold font-mono text-stone-100">{p.daysSpent}</span>
                    <span className="text-stone-400 text-xs font-mono">/ {p.maxSafeDays} max safe days</span>
                  </div>
                  <span className="text-xs font-mono text-stone-400">
                    {remaining} days remaining
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-stone-800 h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isTriggered
                        ? 'bg-rose-500'
                        : isWarning
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${ratio}%` }}
                  />
                </div>

                {p.notes && (
                  <div className="text-xs text-stone-400 mt-3 pt-3 border-t border-stone-800/80">
                    {p.notes}
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div className="mt-4 pt-3 border-t border-stone-800/60 flex items-center justify-between">
                <span className="text-[11px] text-stone-500 font-mono uppercase">Status</span>
                {isTriggered ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Residency Triggered ({p.daysSpent}d)
                  </span>
                ) : isWarning ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Approaching Limit ({ratio}%)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Safe Non-Resident ({ratio}%)
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {presences.length === 0 && (
          <div className="col-span-2 py-12 text-center text-stone-500 text-sm border border-dashed border-stone-800 rounded-xl">
            No tax jurisdictions tracked yet. Click "Track Jurisdiction" to monitor the 183-day rule.
          </div>
        )}
      </div>
    </div>
  );
};

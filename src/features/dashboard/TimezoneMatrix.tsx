import React, { useState, useEffect } from 'react';
import {
  Clock,
  Plus,
  Trash2,
  Users,
  Sun,
  Moon,
  Coffee,
} from 'lucide-react';
import { TeamTimezone } from '../../types';

interface TimezoneMatrixProps {
  timezones: TeamTimezone[];
  onAddTimezone: (tz: Omit<TeamTimezone, 'id'>) => void;
  onDeleteTimezone: (id: string) => void;
}

export const TimezoneMatrix: React.FC<TimezoneMatrixProps> = ({
  timezones,
  onAddTimezone,
  onDeleteTimezone,
}) => {
  const [selectedHour, setSelectedHour] = useState(14); // 2:00 PM local slider
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [newLabel, setNewLabel] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newTzString, setNewTzString] = useState('America/New_York');
  const [newStart, setNewStart] = useState(9);
  const [newEnd, setNewEnd] = useState(17);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const COMMON_TIMEZONES = [
    { label: 'London / Lisbon (GMT / UTC+0-1)', val: 'Europe/London' },
    { label: 'Paris / Berlin / Madrid (CET / UTC+1-2)', val: 'Europe/Paris' },
    { label: 'Sofia / Athens / Bucharest (EET / UTC+2-3)', val: 'Europe/Sofia' },
    { label: 'Dubai (GST / UTC+4)', val: 'Asia/Dubai' },
    { label: 'Bangkok / Bali (ICT / UTC+7-8)', val: 'Asia/Bangkok' },
    { label: 'Singapore / Tokyo (SGT / JST / UTC+8-9)', val: 'Asia/Tokyo' },
    { label: 'Sydney (AEST / UTC+10-11)', val: 'Australia/Sydney' },
    { label: 'New York / Toronto (EST / UTC-4-5)', val: 'America/New_York' },
    { label: 'Chicago / Austin (CST / UTC-5-6)', val: 'America/Chicago' },
    { label: 'San Francisco / LA (PST / UTC-7-8)', val: 'America/Los_Angeles' },
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newLocation) return;
    onAddTimezone({
      label: newLabel.trim(),
      location: newLocation.trim(),
      timezone: newTzString,
      targetWorkingStart: Number(newStart),
      targetWorkingEnd: Number(newEnd),
    });
    setNewLabel('');
    setNewLocation('');
    setShowAddForm(false);
  };

  const getTimeInZone = (tzString: string, date: Date = currentTime) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: tzString,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(date);
    } catch {
      return '--:--';
    }
  };

  const getHourInZone = (tzString: string, date: Date = currentTime): number => {
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: tzString,
        hour: 'numeric',
        hourCycle: 'h23',
      }).formatToParts(date);
      const hourPart = parts.find((p) => p.type === 'hour');
      return hourPart ? parseInt(hourPart.value, 10) : 12;
    } catch {
      return 12;
    }
  };

  const hoursArray = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono tracking-wider uppercase text-amber-400 font-semibold">
                Remote Work Matrix & Timezone Overlap
              </span>
            </div>
            <h2 className="text-2xl font-bold text-stone-100 mt-1">
              Synchronous Collaboration Clock
            </h2>
            <p className="text-stone-400 text-sm max-w-2xl mt-1 leading-relaxed">
              Find overlap windows for standups, deep work, and client communication without waking teammates up at 3 AM.
            </p>
          </div>

          <button
            id="add-team-timezone-btn"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start md:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Add Team Timezone</span>
          </button>
        </div>

        {/* Add Modal */}
        {showAddForm && (
          <form
            onSubmit={handleAddSubmit}
            className="mt-6 p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-4"
          >
            <div className="text-sm font-semibold text-stone-200">Add Team / Client Member</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Role / Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Designer, Main Client, Family"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">City / Region</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Berlin, Austin, Sydney"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Timezone</label>
                <select
                  value={newTzString}
                  onChange={(e) => setNewTzString(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  {COMMON_TIMEZONES.map((tz) => (
                    <option key={tz.val} value={tz.val}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
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
                Save Member
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Live Clocks Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {timezones.map((tz) => {
          const currentHour = getHourInZone(tz.timezone, currentTime);
          const isWorkingHours =
            currentHour >= tz.targetWorkingStart && currentHour < tz.targetWorkingEnd;
          const isLateNight = currentHour < 7 || currentHour >= 23;

          return (
            <div
              key={tz.id}
              className="rounded-xl border border-stone-800 bg-stone-900/60 p-4 flex flex-col justify-between hover:border-stone-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400 font-medium truncate">{tz.label}</span>
                <button
                  onClick={() => onDeleteTimezone(tz.id)}
                  className="p-1 text-stone-500 hover:text-rose-400 transition-colors"
                  title="Remove timezone"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="my-2">
                <div className="text-2xl font-bold font-mono text-stone-100">
                  {getTimeInZone(tz.timezone, currentTime)}
                </div>
                <div className="text-xs text-stone-400 font-mono mt-0.5 truncate">
                  {tz.location}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-800/70 flex items-center justify-between">
                {isWorkingHours ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                    <Coffee className="h-3 w-3" />
                    Working Hours
                  </span>
                ) : isLateNight ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-orange-400">
                    <Moon className="h-3 w-3" />
                    Asleep / Off
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] text-amber-400">
                    <Sun className="h-3 w-3" />
                    Available / Evening
                  </span>
                )}
                <span className="text-[10px] font-mono text-stone-500">
                  {tz.targetWorkingStart}:00–{tz.targetWorkingEnd}:00
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 24-Hour Timeline Scrubber & Heatmap */}
      <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-400" />
            <span>24-Hour Working Overlap Matrix</span>
          </h3>
          <div className="flex items-center gap-3 text-xs text-stone-400">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded bg-emerald-500/80 inline-block" /> Working Hours (9–17)
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded bg-stone-800 inline-block" /> Offline
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[640px] space-y-3">
            {timezones.map((tz) => {
              const currentHour = getHourInZone(tz.timezone, currentTime);

              return (
                <div key={tz.id} className="bg-stone-950/60 p-3 rounded-xl border border-stone-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-stone-200">
                      {tz.label}{' '}
                      <span className="text-stone-500 font-normal font-mono">({tz.location})</span>
                    </span>
                    <span className="text-xs font-mono text-amber-400">
                      Now: {getTimeInZone(tz.timezone, currentTime)}
                    </span>
                  </div>

                  {/* 24 hour bar */}
                  <div className="grid grid-cols-24 gap-1">
                    {hoursArray.map((hour) => {
                      const isWorking =
                        hour >= tz.targetWorkingStart && hour < tz.targetWorkingEnd;
                      const isCurrent = hour === currentHour;

                      return (
                        <div
                          key={hour}
                          className={`h-7 rounded flex items-center justify-center text-[10px] font-mono transition-all ${
                            isCurrent
                              ? 'ring-2 ring-amber-400 font-bold z-10'
                              : ''
                          } ${
                            isWorking
                              ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-500/30'
                              : 'bg-stone-900 text-stone-600 border border-stone-800'
                          }`}
                          title={`${hour}:00 - ${isWorking ? 'Working' : 'Off'}`}
                        >
                          {hour}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

import { IntelligenceAlert } from '../types';
import { IntelligenceProfile } from '../engine/profileBuilder';
import { differenceInDays, parseISO, isAfter, isBefore, addDays, subDays } from 'date-fns';

export function calculateSchengenUsage(profile: IntelligenceProfile): { usedDays: number, remainingDays: number, alerts: IntelligenceAlert[] } {
  // Simplified Schengen calculator: 90 days in rolling 180 days.
  // In reality, this requires checking a rolling window. For this engine, we will do a simpler estimation
  // based on stays in the last 180 days.
  
  const today = new Date();
  const windowStart = subDays(today, 180);
  let usedDays = 0;

  profile.schengenStays.forEach(stay => {
    const entry = parseISO(stay.entryDate);
    const exit = parseISO(stay.exitDate);
    if (isAfter(exit, windowStart)) {
      const effectiveEntry = isBefore(entry, windowStart) ? windowStart : entry;
      usedDays += differenceInDays(exit, effectiveEntry);
    }
  });

  const remainingDays = Math.max(0, 90 - usedDays);
  const alerts: IntelligenceAlert[] = [];

  if (remainingDays <= 0) {
    alerts.push({
      id: 'schengen-exceeded',
      type: 'schengen',
      priority: 'critical',
      title: 'Schengen Limit Exceeded',
      message: 'You have exhausted your 90-day Schengen allowance. You must leave the zone immediately.',
    });
  } else if (remainingDays <= 14) {
    alerts.push({
      id: 'schengen-warning',
      type: 'schengen',
      priority: 'high',
      title: 'Schengen Limit Approaching',
      message: `You have ${remainingDays} days remaining in the Schengen area. Start planning your exit.`,
    });
  }

  // Check future trips for schengen impact
  // (Assuming we have a way to know if a country is schengen. We'll hardcode a few for now)
  const schengenCountries = ['ES', 'FR', 'DE', 'IT', 'PT', 'NL', 'GR', 'AT']; 
  
  let plannedSchengenDays = 0;
  profile.trips.forEach(trip => {
    if (schengenCountries.includes(trip.countryCode)) {
      const entry = parseISO(trip.arrivalDate);
      const exit = parseISO(trip.departureDate);
      if (isAfter(entry, today)) {
        plannedSchengenDays += differenceInDays(exit, entry);
      }
    }
  });

  if (plannedSchengenDays > 0) {
    if (plannedSchengenDays > remainingDays) {
      alerts.push({
        id: 'schengen-conflict',
        type: 'schengen',
        priority: 'high',
        title: 'Schengen Trip Conflict',
        message: `Your planned trips use ${plannedSchengenDays} days, but you only have ${remainingDays} remaining.`,
      });
    } else {
      alerts.push({
        id: 'schengen-info',
        type: 'schengen',
        priority: 'info',
        title: 'Schengen Buffer',
        message: `Your planned trips use ${plannedSchengenDays} days, leaving a ${remainingDays - plannedSchengenDays}-day buffer.`,
      });
    }
  }

  return { usedDays, remainingDays, alerts };
}

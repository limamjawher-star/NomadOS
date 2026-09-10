import { expect, test, describe } from 'vitest';
import { calculateSchengenUsage } from '../rules/SchengenRules';
import { IntelligenceProfile } from '../engine/profileBuilder';
import { subDays, addDays } from 'date-fns';

describe('SchengenRules', () => {
  const today = new Date();

  test('calculates 0 days if no stays', () => {
    const profile = {
      schengenStays: [],
      trips: []
    } as unknown as IntelligenceProfile;

    const res = calculateSchengenUsage(profile);
    expect(res.usedDays).toBe(0);
    expect(res.remainingDays).toBe(90);
    expect(res.alerts).toHaveLength(0);
  });

  test('calculates correct days for a 30-day stay', () => {
    const profile = {
      schengenStays: [
        { entryDate: subDays(today, 40).toISOString(), exitDate: subDays(today, 10).toISOString() }
      ],
      trips: []
    } as unknown as IntelligenceProfile;

    const res = calculateSchengenUsage(profile);
    expect(res.usedDays).toBe(30);
    expect(res.remainingDays).toBe(60);
    expect(res.alerts).toHaveLength(0);
  });

  test('emits warning if < 14 days remaining', () => {
    const profile = {
      schengenStays: [
        { entryDate: subDays(today, 90).toISOString(), exitDate: subDays(today, 10).toISOString() } // 80 days
      ],
      trips: []
    } as unknown as IntelligenceProfile;

    const res = calculateSchengenUsage(profile);
    expect(res.usedDays).toBe(80);
    expect(res.remainingDays).toBe(10);
    expect(res.alerts.some(a => a.id === 'schengen-warning')).toBe(true);
  });

  test('detects future trip conflict', () => {
    const profile = {
      schengenStays: [
        { entryDate: subDays(today, 80).toISOString(), exitDate: subDays(today, 10).toISOString() } // 70 days
      ],
      trips: [
        { countryCode: 'FR', arrivalDate: addDays(today, 10).toISOString(), departureDate: addDays(today, 40).toISOString() } // 30 days
      ]
    } as unknown as IntelligenceProfile;

    const res = calculateSchengenUsage(profile);
    // 70 used, 20 remaining. Trip is 30 days. Conflict!
    expect(res.alerts.some(a => a.id === 'schengen-conflict')).toBe(true);
  });
});

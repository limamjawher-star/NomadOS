import { expect, test, describe } from 'vitest';
import { validateTrip } from '../rules/TripValidator';
import { IntelligenceProfile } from '../engine/profileBuilder';

describe('TripValidator', () => {
  test('returns SAFE for valid trip', () => {
    const profile = {
      budgetUSD: 3000,
      trips: [],
      schengenStays: []
    } as unknown as IntelligenceProfile;

    const trip = {
      id: '1',
      housingCostUSD: 1000,
      countryCode: 'TH',
      arrivalDate: '2026-10-01',
      departureDate: '2026-10-30'
    };

    const res = validateTrip(profile, trip);
    expect(res.status).toBe('SAFE');
    expect(res.issues).toHaveLength(0);
  });

  test('returns WARNING for high budget', () => {
    const profile = {
      budgetUSD: 2000,
      trips: [],
      schengenStays: []
    } as unknown as IntelligenceProfile;

    const trip = {
      id: '1',
      housingCostUSD: 1500, // > 60% of 2000
      countryCode: 'TH',
      arrivalDate: '2026-10-01',
      departureDate: '2026-10-30'
    };

    const res = validateTrip(profile, trip);
    expect(res.status).toBe('WARNING');
    expect(res.issues.some(i => i.type === 'finance')).toBe(true);
  });

  test('returns CONFLICT for overlapping dates', () => {
    const profile = {
      budgetUSD: 3000,
      trips: [
        { id: '2', city: 'Paris', arrivalDate: '2026-10-15', departureDate: '2026-11-05' }
      ],
      schengenStays: []
    } as unknown as IntelligenceProfile;

    const trip = {
      id: '1',
      housingCostUSD: 1000,
      countryCode: 'TH',
      arrivalDate: '2026-10-01',
      departureDate: '2026-10-20'
    };

    const res = validateTrip(profile, trip);
    expect(res.status).toBe('CONFLICT');
    expect(res.issues.some(i => i.type === 'itinerary')).toBe(true);
  });
});

import { describe, it, expect } from 'vitest';
import { calculateSchengen, isDateInStays } from './schengenCalculator';

describe('Schengen Calculator', () => {
  it('calculates 90 days used correctly', () => {
    const stays = [
      { id: '1', country: 'FR', countryCode: 'FR', entryDate: '2026-01-01', exitDate: '2026-03-31' } // 90 days (leap year? 2026 is not a leap year. Jan 31 + Feb 28 + Mar 31 = 90)
    ];
    
    const result = calculateSchengen(stays, '2026-04-01');
    expect(result.daysUsedInWindow).toBe(90);
    expect(result.daysRemainingInWindow).toBe(0);
    expect(result.isOverstay).toBe(false);
  });

  it('detects 91 days as overstay', () => {
    const stays = [
      { id: '1', country: 'FR', countryCode: 'FR', entryDate: '2026-01-01', exitDate: '2026-04-01' } // 91 days
    ];
    
    const result = calculateSchengen(stays, '2026-04-01');
    expect(result.daysUsedInWindow).toBe(91);
    expect(result.daysRemainingInWindow).toBe(0);
    expect(result.isOverstay).toBe(true);
  });

  it('handles overlapping stays by counting the day only once', () => {
    const stays = [
      { id: '1', country: 'FR', countryCode: 'FR', entryDate: '2026-01-01', exitDate: '2026-01-10' },
      { id: '2', country: 'ES', countryCode: 'ES', entryDate: '2026-01-05', exitDate: '2026-01-15' }
    ];
    
    const result = calculateSchengen(stays, '2026-01-20');
    // Jan 1 to Jan 15 inclusive is 15 days
    expect(result.daysUsedInWindow).toBe(15);
  });
  
  it('ignores stays outside the 180 day window', () => {
    const stays = [
      { id: '1', country: 'FR', countryCode: 'FR', entryDate: '2025-01-01', exitDate: '2025-01-10' }
    ];
    
    const result = calculateSchengen(stays, '2026-01-01');
    expect(result.daysUsedInWindow).toBe(0);
  });
});

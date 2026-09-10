import { TripValidationResult, IntelligenceAlert } from '../types';
import { IntelligenceProfile } from '../engine/profileBuilder';
import { calculateSchengenUsage } from './SchengenRules';

export function validateTrip(profile: IntelligenceProfile, trip: any): TripValidationResult {
  const issues: IntelligenceAlert[] = [];
  let status: 'SAFE' | 'WARNING' | 'CONFLICT' = 'SAFE';

  // 1. Check budget
  if (profile.budgetUSD > 0 && trip.housingCostUSD > profile.budgetUSD * 0.6) {
    status = 'WARNING';
    issues.push({
      id: `val-budget-${trip.id}`,
      type: 'finance',
      priority: 'medium',
      title: 'High Accommodation Cost',
      message: `The housing cost for this trip is >60% of your total monthly budget.`
    });
  }

  // 2. Check overlap
  const newArrival = new Date(trip.arrivalDate).getTime();
  const newDeparture = new Date(trip.departureDate).getTime();
  
  for (const existing of profile.trips) {
    if (existing.id === trip.id) continue;
    
    const exArr = new Date(existing.arrivalDate).getTime();
    const exDep = new Date(existing.departureDate).getTime();
    
    // Check overlap
    if (newArrival < exDep && newDeparture > exArr) {
      status = 'CONFLICT';
      issues.push({
        id: `val-overlap-${trip.id}`,
        type: 'itinerary',
        priority: 'high',
        title: 'Dates Overlap',
        message: `This trip overlaps with your existing trip to ${existing.city}.`
      });
    }
  }

  // 3. Schengen Check if applicable (just simulating by adding the trip to profile and running schengen rules)
  const schengenCountries = ['ES', 'FR', 'DE', 'IT', 'PT', 'NL', 'GR', 'AT'];
  if (schengenCountries.includes(trip.countryCode)) {
      const mockProfile = { ...profile, trips: [...profile.trips, trip] };
      const schengenInfo = calculateSchengenUsage(mockProfile);
      
      const schengenConflicts = schengenInfo.alerts.filter(a => a.priority === 'critical' || (a.priority === 'high' && a.id === 'schengen-conflict'));
      
      if (schengenConflicts.length > 0) {
        status = 'CONFLICT';
        issues.push(...schengenConflicts);
      }
  }

  return { status, issues };
}

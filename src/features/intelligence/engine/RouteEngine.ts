import { RouteOptimizationConstraints, RouteOptimizationPreferences } from '../services/aiService';

export const CITIES = [
  { city: 'Chiang Mai', country: 'Thailand', costUSD: 900, climate: 'Warm', internet: true, region: 'Asia' },
  { city: 'Bali', country: 'Indonesia', costUSD: 1200, climate: 'Warm', internet: true, region: 'Asia' },
  { city: 'Lisbon', country: 'Portugal', costUSD: 2100, climate: 'Temperate', internet: true, region: 'Europe' },
  { city: 'Valencia', country: 'Spain', costUSD: 1800, climate: 'Warm', internet: true, region: 'Europe' },
  { city: 'Medellin', country: 'Colombia', costUSD: 1100, climate: 'Temperate', internet: true, region: 'South America' },
  { city: 'Buenos Aires', country: 'Argentina', costUSD: 1000, climate: 'Temperate', internet: true, region: 'South America' },
  { city: 'Cape Town', country: 'South Africa', costUSD: 1500, climate: 'Warm', internet: true, region: 'Africa' },
  { city: 'Bansko', country: 'Bulgaria', costUSD: 900, climate: 'Cool', internet: true, region: 'Europe' },
  { city: 'Tbilisi', country: 'Georgia', costUSD: 1100, climate: 'Temperate', internet: true, region: 'Asia' },
];

export function findCandidateDestinations(
  constraints: RouteOptimizationConstraints,
  preferences: RouteOptimizationPreferences
) {
  // Hard Constraint: Budget
  let candidates = CITIES.filter(c => c.costUSD <= constraints.budgetUSD);
  
  // Hard Constraint: Internet (mocked as true for all top nomad hubs anyway)
  if (preferences.internetRequirement) {
    candidates = candidates.filter(c => c.internet);
  }

  // Soft Constraint: Climate (just for scoring, but we can filter or sort)
  if (preferences.climate && preferences.climate !== 'Any') {
    const ideal = candidates.filter(c => c.climate === preferences.climate);
    if (ideal.length > 0) {
       // if we have exact matches, prefer them
       candidates = ideal;
    }
  }
  
  return candidates;
}

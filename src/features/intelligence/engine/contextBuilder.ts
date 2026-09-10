import { NomadState } from '../../../types';
import { calculateSchengenUsage } from '../rules/SchengenRules';
import { buildIntelligenceProfile } from './profileBuilder';

export function buildNomadAIContext(state: NomadState) {
  const profile = buildIntelligenceProfile(state);
  const schengen = calculateSchengenUsage(profile);

  return {
    location: {
      currentCity: state.currentCity,
      currentCountry: state.currentCountry
    },
    today: new Date().toISOString(),
    schengen: {
      usedDays: schengen.usedDays,
      remainingDays: schengen.remainingDays,
      alerts: schengen.alerts
    },
    finances: {
      budgetUSD: state.monthlyBudgetUSD,
      totalIncomeUSD: profile.totalIncomeUSD,
      totalSavingsUSD: profile.totalSavingsUSD,
      runwayMonths: profile.currentRunwayMonths
    },
    work: {
      teamTimezones: state.teamTimezones
    },
    upcomingTrips: state.trips.filter(t => new Date(t.arrivalDate) >= new Date()).slice(0, 5),
    expiringDocuments: state.documents.filter(d => {
      if (!d.expirationDate) return false;
      return new Date(d.expirationDate) > new Date();
    }).slice(0, 3)
  };
}

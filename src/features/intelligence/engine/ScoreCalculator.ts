import { NomadScore } from '../types';
import { IntelligenceProfile } from './profileBuilder';
import { calculateSchengenUsage } from '../rules/SchengenRules';
import { calculateFinanceAlerts } from '../rules/FinanceRules';

export function calculateNomadScore(profile: IntelligenceProfile): NomadScore {
  let travelScore = 100;
  let financeScore = 100;
  let documentsScore = 100;
  let workScore = 100;
  
  const factors: string[] = [];
  
  // 1. Travel (Schengen, upcoming trips)
  const schengen = calculateSchengenUsage(profile);
  if (schengen.alerts.some(a => a.priority === 'critical')) {
    travelScore -= 40;
    factors.push('Critical Schengen violation');
  } else if (schengen.alerts.some(a => a.priority === 'high')) {
    travelScore -= 20;
    factors.push('Approaching Schengen limits');
  } else {
    factors.push('Healthy Schengen allowance');
  }
  
  if (profile.trips.length === 0) {
    travelScore -= 10;
    factors.push('No upcoming travel planned');
  } else {
    factors.push(`${profile.trips.length} upcoming trips planned`);
  }

  // 2. Finance
  const finance = calculateFinanceAlerts(profile);
  if (finance.alerts.some(a => a.id === 'runway-critical')) {
    financeScore -= 40;
    factors.push('Critically low runway (<3 months)');
  } else if (finance.alerts.some(a => a.id === 'runway-warning')) {
    financeScore -= 20;
    factors.push('Low runway (<6 months)');
  } else if (profile.currentRunwayMonths > 12) {
    factors.push('Excellent financial runway (>12 months)');
  }

  if (finance.alerts.some(a => a.id === 'trip-budget-warning')) {
    financeScore -= 15;
    factors.push('Upcoming trips exceed budget');
  }

  // 3. Documents
  // For now, documents are somewhat static, let's just base it on having them
  if (profile.documents.length === 0) {
    documentsScore -= 20;
    factors.push('No travel documents uploaded');
  } else {
    factors.push('Travel documents are organized');
  }

  // 4. Work
  // Hard to score work without more context, but if they are Pro, maybe they have better setups? Or if they have high income?
  if (profile.totalIncomeUSD === 0) {
    workScore -= 30;
    factors.push('No recorded income streams');
  } else {
    factors.push('Active income streams recorded');
  }

  // Clamp scores
  travelScore = Math.max(0, travelScore);
  financeScore = Math.max(0, financeScore);
  documentsScore = Math.max(0, documentsScore);
  workScore = Math.max(0, workScore);

  const total = Math.round((travelScore + financeScore + documentsScore + workScore) / 4);

  return {
    total,
    dimensions: {
      travel: travelScore,
      finance: financeScore,
      documents: documentsScore,
      work: workScore
    },
    factors
  };
}

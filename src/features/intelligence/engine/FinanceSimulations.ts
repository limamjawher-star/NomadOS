import { IntelligenceProfile } from './profileBuilder';

export interface FinanceScenario {
  id: string;
  title: string;
  runwayBefore: number;
  runwayAfter: number;
  impact: 'positive' | 'negative' | 'neutral';
}

export function generateFinanceScenarios(profile: IntelligenceProfile): FinanceScenario[] {
  const scenarios: FinanceScenario[] = [];
  const currentSavings = profile.totalSavingsUSD;
  const currentBurn = profile.budgetUSD;
  
  if (currentBurn <= 0 || currentSavings <= 0) return scenarios;
  
  const currentRunway = currentSavings / currentBurn;

  // Scenario 1: Spending increases by $300
  const increasedBurn = currentBurn + 300;
  const runwayAfterIncrease = currentSavings / increasedBurn;
  scenarios.push({
    id: 'inc-300',
    title: 'If monthly spending increases by $300',
    runwayBefore: currentRunway,
    runwayAfter: runwayAfterIncrease,
    impact: 'negative'
  });

  // Scenario 2: Reduce housing cost by 20%
  // Assume housing is 40% of budget normally
  const housingCost = currentBurn * 0.4;
  const reducedHousingBurn = currentBurn - (housingCost * 0.2);
  const runwayAfterReduction = currentSavings / reducedHousingBurn;
  scenarios.push({
    id: 'dec-housing-20',
    title: 'If you reduce accommodation costs by 20%',
    runwayBefore: currentRunway,
    runwayAfter: runwayAfterReduction,
    impact: 'positive'
  });

  return scenarios;
}

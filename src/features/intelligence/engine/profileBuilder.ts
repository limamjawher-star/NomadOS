import { NomadState } from '../../../types';

export interface IntelligenceProfile {
  nationalityCode: string;
  isPro: boolean;
  budgetUSD: number;
  totalIncomeUSD: number;
  totalSavingsUSD: number;
  currentRunwayMonths: number;
  schengenUsedDays: number;
  trips: NomadState['trips'];
  schengenStays: NomadState['schengenStays'];
  documents: NomadState['documents'];
  taxPresences: NomadState['taxPresences'];
  preferences: any;
}

export function buildIntelligenceProfile(state: NomadState): IntelligenceProfile {
  const totalIncomeUSD = state.incomes?.reduce((acc, inc) => acc + inc.monthlyAmountUSD, 0) || 0;
  
  const currentRunwayMonths = state.monthlyBudgetUSD > 0 
    ? (state.savingsTotalUSD || 0) / state.monthlyBudgetUSD 
    : 0;

  return {
    nationalityCode: state.user?.nationalityCode || 'US',
    isPro: state.user?.isPro || false,
    budgetUSD: state.monthlyBudgetUSD || 0,
    totalIncomeUSD,
    totalSavingsUSD: state.savingsTotalUSD || 0,
    currentRunwayMonths,
    schengenUsedDays: 0,
    trips: state.trips || [],
    schengenStays: state.schengenStays || [],
    documents: state.documents || [],
    taxPresences: state.taxPresences || [],
    preferences: {}
  };
}

import { TaxPresence } from '../types';

export interface TaxAssessment {
  countryCode: string;
  daysSpent: number;
  maxSafeDays: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'exceeded';
  isLegalAdvice: boolean;
  notes: string;
}

export function evaluateTaxPresence(presence: TaxPresence): TaxAssessment {
  const { daysSpent, maxSafeDays, maxDaysAllowed = 183 } = presence;
  let riskLevel: 'low' | 'moderate' | 'high' | 'exceeded' = 'low';

  if (daysSpent > maxDaysAllowed) {
    riskLevel = 'exceeded';
  } else if (daysSpent > maxSafeDays) {
    riskLevel = 'high';
  } else if (daysSpent > (maxSafeDays * 0.8)) {
    riskLevel = 'moderate';
  }

  return {
    countryCode: presence.countryCode,
    daysSpent,
    maxSafeDays,
    riskLevel,
    isLegalAdvice: false,
    notes: "This is a days-based signal only. Legal tax residency determination depends on permanent home, center of vital interests, and local treaties."
  };
}

export function getOverallTaxRisk(presences: TaxPresence[]): 'low' | 'moderate' | 'high' | 'exceeded' {
  if (presences.some(p => evaluateTaxPresence(p).riskLevel === 'exceeded')) return 'exceeded';
  if (presences.some(p => evaluateTaxPresence(p).riskLevel === 'high')) return 'high';
  if (presences.some(p => evaluateTaxPresence(p).riskLevel === 'moderate')) return 'moderate';
  return 'low';
}

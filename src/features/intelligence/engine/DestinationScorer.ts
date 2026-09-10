import { DestinationScore } from '../types';
import { IntelligenceProfile } from './profileBuilder';

export function calculateDestinationScore(profile: IntelligenceProfile, destination: any): DestinationScore {
  let score = 100;
  const factors: { label: string, isPositive: boolean }[] = [];

  // 1. Budget Fit
  if (profile.budgetUSD > 0) {
    if (destination.estimatedMonthlyCost < profile.budgetUSD * 0.7) {
      factors.push({ label: 'Well within budget', isPositive: true });
    } else if (destination.estimatedMonthlyCost > profile.budgetUSD) {
      score -= 30;
      factors.push({ label: 'Exceeds monthly budget', isPositive: false });
    } else {
      score -= 10;
      factors.push({ label: 'Near budget limit', isPositive: false });
    }
  }

  // 2. Internet / Work Quality (assuming destination has internetScore 0-10)
  if (destination.internetScore >= 8) {
    factors.push({ label: 'Excellent internet reliability', isPositive: true });
  } else if (destination.internetScore < 5) {
    score -= 20;
    factors.push({ label: 'Poor internet connectivity', isPositive: false });
  }

  // 3. Climate
  if (profile.preferences?.preferredClimate && destination.climate === profile.preferences.preferredClimate) {
    factors.push({ label: 'Matches climate preference', isPositive: true });
  }

  // 4. Timezone overlap (mocking this logic)
  if (destination.timezoneOffset >= -2 && destination.timezoneOffset <= 2) {
    factors.push({ label: 'Excellent timezone overlap', isPositive: true });
  } else if (destination.timezoneOffset < -6 || destination.timezoneOffset > 6) {
    score -= 15;
    factors.push({ label: 'Poor timezone overlap', isPositive: false });
  }

  score = Math.max(0, Math.min(100, score));

  return {
    score,
    factors
  };
}

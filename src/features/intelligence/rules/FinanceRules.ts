import { IntelligenceAlert } from '../types';
import { IntelligenceProfile } from '../engine/profileBuilder';

export function calculateFinanceAlerts(profile: IntelligenceProfile): { alerts: IntelligenceAlert[] } {
  const alerts: IntelligenceAlert[] = [];
  const burnRate = profile.budgetUSD;
  const income = profile.totalIncomeUSD;
  
  // Calculate variance (income vs burn rate)
  const netCashflow = income - burnRate;
  
  if (burnRate > 0) {
    if (netCashflow < 0) {
      if (profile.currentRunwayMonths < 3) {
        alerts.push({
          id: 'runway-critical',
          type: 'finance',
          priority: 'critical',
          title: 'Critical Runway',
          message: `At your current burn rate, your savings provide only ${profile.currentRunwayMonths.toFixed(1)} months of runway.`,
        });
      } else if (profile.currentRunwayMonths < 6) {
        alerts.push({
          id: 'runway-warning',
          type: 'finance',
          priority: 'medium',
          title: 'Runway Warning',
          message: `At your current burn rate, your savings provide ${profile.currentRunwayMonths.toFixed(1)} months of runway.`,
        });
      } else {
        alerts.push({
          id: 'runway-info',
          type: 'finance',
          priority: 'info',
          title: 'Runway Healthy',
          message: `At your current burn rate, your savings provide ${profile.currentRunwayMonths.toFixed(1)} months of runway.`,
        });
      }
    } else {
      alerts.push({
        id: 'cashflow-positive',
        type: 'finance',
        priority: 'info',
        title: 'Positive Cashflow',
        message: `You are saving $${netCashflow.toFixed(0)} per month based on current income and budget.`,
      });
    }
  }

  // Budget validation for trips
  let upcomingTripCosts = 0;
  const today = new Date();
  
  profile.trips.forEach(trip => {
    if (new Date(trip.arrivalDate) > today) {
       upcomingTripCosts += trip.housingCostUSD;
    }
  });

  if (burnRate > 0 && upcomingTripCosts > burnRate * 1.5) {
    alerts.push({
      id: 'trip-budget-warning',
      type: 'finance',
      priority: 'high',
      title: 'Upcoming Trips Exceed Budget',
      message: `Your planned accommodation costs ($${upcomingTripCosts}) are significantly higher than your monthly budget.`,
    });
  }

  return { alerts };
}

import { DailyBrief, IntelligenceAlert, Recommendation } from '../types';
import { IntelligenceProfile } from './profileBuilder';
import { calculateSchengenUsage } from '../rules/SchengenRules';
import { calculateFinanceAlerts } from '../rules/FinanceRules';
import { v4 as uuidv4 } from 'uuid';

export class DecisionEngine {
  
  static generateAlerts(profile: IntelligenceProfile): IntelligenceAlert[] {
    const alerts: IntelligenceAlert[] = [];
    
    // Schengen Rules
    const schengen = calculateSchengenUsage(profile);
    alerts.push(...schengen.alerts);
    
    // Finance Rules
    const finance = calculateFinanceAlerts(profile);
    alerts.push(...finance.alerts);
    
    // Tax Rules
    profile.taxPresences.forEach(tp => {
      if (tp.taxResidencyRisk === 'exceeded' || tp.daysSpent > tp.maxSafeDays) {
         alerts.push({
           id: `tax-${tp.countryCode}`,
           type: 'tax',
           priority: tp.taxResidencyRisk === 'exceeded' ? 'critical' : 'high',
           title: `Tax Risk in ${tp.country}`,
           message: `You have spent ${tp.daysSpent} days in ${tp.country}, exceeding the safe threshold. Review your tax residency status.`
         });
      }
    });

    return alerts;
  }

  static generateRecommendations(profile: IntelligenceProfile, alerts: IntelligenceAlert[]): Recommendation[] {
    const recs: Recommendation[] = [];
    
    // 1. Runway recommendation
    const lowRunway = alerts.find(a => a.id === 'runway-critical' || a.id === 'runway-warning');
    if (lowRunway) {
      recs.push({
        id: uuidv4(),
        type: 'finance',
        priority: lowRunway.priority,
        title: 'Reduce Upcoming Housing Costs',
        explanation: 'Your current burn rate is depleting your savings quickly. Consider adjusting accommodation on future trips.',
        actionText: 'Review Trips',
        actionId: 'nav-travel',
        confidence: 'Verified',
        explainability: [
          `Current runway is ${profile.currentRunwayMonths.toFixed(1)} months`,
          `Monthly budget is $${profile.budgetUSD}`
        ]
      });
    }

    // 2. Schengen recommendation
    const schengenAlert = alerts.find(a => a.type === 'schengen' && (a.priority === 'critical' || a.priority === 'high'));
    if (schengenAlert) {
      recs.push({
        id: uuidv4(),
        type: 'travel',
        priority: schengenAlert.priority,
        title: 'Plan a Non-Schengen Stay',
        explanation: 'To recover your Schengen days, you should plan your next destination outside of the zone (e.g., UK, Balkans, Asia).',
        actionText: 'Explore Destinations',
        actionId: 'nav-explore',
        confidence: 'Verified',
        explainability: [
          schengenAlert.message
        ]
      });
    }
    
    // 3. Pro recommendation
    if (!profile.isPro) {
      recs.push({
        id: uuidv4(),
        type: 'lifestyle',
        priority: 'info',
        title: 'Unlock Advanced Intelligence',
        explanation: 'Get future financial simulations, advanced trip validation, and deep destination scoring with NomadOS Pro.',
        actionText: 'Upgrade to Pro',
        actionId: 'open-pricing',
        confidence: 'High confidence',
        explainability: [
          'You are currently on the Free plan'
        ]
      });
    }

    return recs;
  }

  static generateDailyBrief(profile: IntelligenceProfile): DailyBrief {
    const alerts = this.generateAlerts(profile);
    const sortedAlerts = alerts.sort((a, b) => {
       const priorityScore = { critical: 4, high: 3, medium: 2, low: 1, info: 0 };
       return priorityScore[b.priority] - priorityScore[a.priority];
    });

    const recommendations = this.generateRecommendations(profile, alerts);
    
    const now = new Date();
    let greeting = 'Good evening';
    if (now.getHours() < 12) greeting = 'Good morning';
    else if (now.getHours() < 18) greeting = 'Good afternoon';

    // Summary text
    const importantAlerts = sortedAlerts.filter(a => ['critical', 'high', 'medium'].includes(a.priority));
    let summaryText = 'Everything looks solid.';
    if (importantAlerts.length > 0) {
       summaryText = `${importantAlerts.length} ${importantAlerts.length === 1 ? 'item needs' : 'things need'} your attention.`;
    }

    return {
      greeting,
      summaryText,
      alerts: sortedAlerts,
      topRecommendation: recommendations[0]
    };
  }
}

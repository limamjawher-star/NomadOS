const fs = require('fs');

const content = `import React from 'react';
import { NomadState } from '../../types';
import { DashboardHeader } from './components/DashboardHeader';
import { AttentionModule } from './components/AttentionModule';
import { NomadScorePanel } from '../intelligence/components/NomadScorePanel';
import { SchengenStatusCard } from './components/SchengenStatusCard';
import { FinancialStatusCard } from './components/FinancialStatusCard';
import { UpcomingTimeline } from './components/UpcomingTimeline';
import { WorkIntelligenceCard } from './components/WorkIntelligenceCard';
import { RecommendationCard } from './components/RecommendationCard';
import { buildIntelligenceProfile } from '../intelligence/engine/profileBuilder';
import { DecisionEngine } from '../intelligence/engine/DecisionEngine';
import { calculateNomadScore } from '../intelligence/engine/ScoreCalculator';

interface HomeDashboardProps {
  state: NomadState;
  onNavigateTab: (tab: 'home' | 'travel' | 'finance' | 'explore' | 'social' | 'me') => void;
  onOpenPricing: () => void;
  onOpenOnboarding: () => void;
  onToggleEventRSVP: (eventId: string) => void;
  onOpenCreateMeetup: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  state,
  onNavigateTab
}) => {
  const profile = buildIntelligenceProfile(state as any);
  const brief = DecisionEngine.generateDailyBrief(profile);
  const score = calculateNomadScore(profile);

  return (
    <div id="home-dashboard-view" className="space-y-6 pb-28 max-w-5xl mx-auto px-4 pt-4 sm:pt-6 animate-in fade-in duration-500">
      <DashboardHeader 
        name={state.user?.name ? state.user.name.split(' ')[0] : 'Nomad'} 
        city={state.currentCity} 
        country={state.currentCountry} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Priority / Status */}
        <div className="lg:col-span-8 space-y-6">
          <AttentionModule brief={brief} onActionClick={onNavigateTab as any} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <SchengenStatusCard profile={profile} onActionClick={onNavigateTab as any} />
             <FinancialStatusCard profile={profile} onActionClick={onNavigateTab as any} />
          </div>

          <RecommendationCard recommendation={brief.topRecommendation} onActionClick={onNavigateTab as any} />
        </div>

        {/* Right Column - Context / Upcoming */}
        <div className="lg:col-span-4 space-y-6">
          <NomadScorePanel score={score} />
          
          <div className="h-[320px]">
             <UpcomingTimeline state={state} onActionClick={onNavigateTab as any} />
          </div>
          
          <div className="h-[280px]">
             <WorkIntelligenceCard state={state} onActionClick={onNavigateTab as any} />
          </div>
        </div>
      </div>
    </div>
  );
};
`;

fs.writeFileSync('src/features/dashboard/HomeDashboard.tsx', content, 'utf8');

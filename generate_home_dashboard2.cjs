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
    <div id="home-dashboard-view" className="space-y-6 pb-28 max-w-[1200px] mx-auto px-4 pt-4 sm:pt-6 animate-in fade-in duration-500">
      <DashboardHeader 
        name={state.user?.name ? state.user.name.split(' ')[0] : 'Nomad'} 
        city={state.currentCity} 
        country={state.currentCountry} 
      />

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
        
        {/* 1. Attention (Left Desktop, Order 1 Mobile) */}
        <div className="order-1 lg:order-none lg:col-start-1 lg:col-span-8">
          <AttentionModule brief={brief} onActionClick={onNavigateTab as any} />
        </div>

        {/* 2. Status Score (Right Desktop, Order 2 Mobile) */}
        <div className="order-2 lg:order-none lg:col-start-9 lg:col-span-4">
          <NomadScorePanel score={score} />
        </div>

        {/* 3. Upcoming Timeline (Right Desktop, Order 3 Mobile) */}
        <div className="order-3 lg:order-none lg:col-start-9 lg:col-span-4">
          <div className="lg:h-[320px]">
             <UpcomingTimeline state={state} onActionClick={onNavigateTab as any} />
          </div>
        </div>

        {/* 4. Finance & Travel (Left Desktop, Order 4 Mobile) */}
        <div className="order-4 lg:order-none lg:col-start-1 lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <FinancialStatusCard profile={profile} onActionClick={onNavigateTab as any} />
             <SchengenStatusCard profile={profile} onActionClick={onNavigateTab as any} />
          </div>
        </div>

        {/* 5. Work (Right Desktop, Order 5 Mobile) */}
        <div className="order-5 lg:order-none lg:col-start-9 lg:col-span-4">
          <div className="lg:h-[280px]">
             <WorkIntelligenceCard state={state} onActionClick={onNavigateTab as any} />
          </div>
        </div>

        {/* 6. Intelligence Recommendation (Left Desktop, Order 6 Mobile) */}
        <div className="order-6 lg:order-none lg:col-start-1 lg:col-span-8">
          <RecommendationCard recommendation={brief.topRecommendation} onActionClick={onNavigateTab as any} />
        </div>

      </div>
    </div>
  );
};
`;

fs.writeFileSync('src/features/dashboard/HomeDashboard.tsx', content, 'utf8');

import React from 'react';
import { Compass, ArrowRight } from 'lucide-react';
import { IntelligenceProfile } from '../../intelligence/engine/profileBuilder';
import { calculateSchengenUsage } from '../../intelligence/rules/SchengenRules';

interface SchengenStatusCardProps {
  profile: IntelligenceProfile;
  onActionClick: (actionId: string) => void;
}

export const SchengenStatusCard: React.FC<SchengenStatusCardProps> = ({ profile, onActionClick }) => {
  const { usedDays, remainingDays, alerts } = calculateSchengenUsage(profile);
  
  const percentage = Math.min(100, Math.round((usedDays / 90) * 100));
  
  // Choose color based on remaining days
  const progressColor = remainingDays <= 14 ? 'bg-rose-500' : remainingDays <= 30 ? 'bg-amber-500' : 'bg-emerald-500';
  const textColor = remainingDays <= 14 ? 'text-rose-600' : remainingDays <= 30 ? 'text-amber-600' : 'text-emerald-600';

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
        <h3 className="text-[11px] font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-stone-400" />
          Schengen Area
        </h3>
      </div>
      
      <div className="p-5 flex-1 flex flex-col justify-center items-center text-center">
        {/* Progress Ring Alternative - Just clean numbers */}
        <div className="mb-2">
          <span className={`text-4xl font-display font-bold ${textColor} leading-none tracking-tight`}>
            {remainingDays}
          </span>
          <span className="text-sm font-semibold text-stone-400 ml-1">days left</span>
        </div>
        
        <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden my-3">
          <div className={`h-full ${progressColor} transition-all duration-1000 ease-out`} style={{ width: `${percentage}%` }} />
        </div>
        
        <div className="flex justify-between w-full text-[10px] font-bold text-stone-400 uppercase tracking-wider">
          <span>{usedDays} Used</span>
          <span>90 Limit</span>
        </div>
      </div>
      
      <div className="px-3 py-3 bg-stone-50 border-t border-stone-100 mt-auto">
        <button 
          onClick={() => onActionClick('travel')}
          className="w-full py-2 bg-white border border-stone-200 hover:border-stone-300 text-stone-700 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
        >
          Simulate Next Trip
          <ArrowRight className="w-3 h-3 text-stone-400" />
        </button>
      </div>
    </div>
  );
};

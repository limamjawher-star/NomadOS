import React from 'react';
import { Briefcase, ArrowRight, Clock, MapPin } from 'lucide-react';
import { NomadState } from '../../../types';

interface WorkIntelligenceCardProps {
  state: NomadState;
  onActionClick: (actionId: string) => void;
}

export const WorkIntelligenceCard: React.FC<WorkIntelligenceCardProps> = ({ state, onActionClick }) => {
  // Mock logic based on state
  const hasTeams = state.teamTimezones && state.teamTimezones.length > 0;
  
  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col">
      <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
        <h3 className="text-[11px] font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-stone-400" />
          Work Intelligence
        </h3>
      </div>
      
      <div className="p-5 flex-1 flex flex-col justify-center space-y-4">
        {hasTeams ? (
          <>
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Best Work Window</p>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-semibold text-stone-800">14:00 – 18:00</span>
              </div>
              <p className="text-[10px] text-stone-500 mt-1">4h overlap with {state.teamTimezones[0].label}</p>
            </div>
            
            <div className="pt-3 border-t border-stone-100">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Recommended Workspace</p>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-semibold text-stone-800 truncate">Nomad Base</span>
              </div>
              <p className="text-[10px] text-stone-500 mt-1">Excellent internet · Near you</p>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Clock className="w-8 h-8 text-stone-200 mb-2" />
            <p className="text-xs font-medium text-stone-500 mb-2">No team timezones configured</p>
            <button 
              onClick={() => onActionClick('me')}
              className="text-[10px] font-bold text-orange-600 uppercase tracking-wider hover:text-orange-700"
            >
              Add Team
            </button>
          </div>
        )}
      </div>
      
      <div className="px-3 py-3 bg-stone-50 border-t border-stone-100 mt-auto">
        <button 
          onClick={() => onActionClick('explore')}
          className="w-full py-2 bg-white border border-stone-200 hover:border-stone-300 text-stone-700 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
        >
          Find Workspots
          <ArrowRight className="w-3 h-3 text-stone-400" />
        </button>
      </div>
    </div>
  );
};

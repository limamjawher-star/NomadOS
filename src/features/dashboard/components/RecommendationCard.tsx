import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Recommendation } from '../../intelligence/types';

interface RecommendationCardProps {
  recommendation?: Recommendation;
  onActionClick: (actionId: string) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, onActionClick }) => {
  if (!recommendation) return null;

  return (
    <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-2xl shadow-sm overflow-hidden p-6 relative group">
      <div className="absolute top-0 right-0 p-6 opacity-10">
        <Sparkles className="w-24 h-24 text-white" />
      </div>
      
      <div className="relative z-10">
        <h3 className="text-[10px] font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          NomadOS Intelligence
        </h3>
        
        <h4 className="text-base font-bold text-white leading-tight mb-2">
          {recommendation.title}
        </h4>
        
        <p className="text-xs text-stone-300 leading-relaxed mb-6 max-w-sm">
          {recommendation.explanation}
        </p>
        
        {recommendation.actionText && recommendation.actionId && (
          <button 
            onClick={() => onActionClick(recommendation.actionId!)}
            className="inline-flex py-2 px-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-colors items-center justify-center gap-1.5 backdrop-blur-sm"
          >
            {recommendation.actionText}
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};

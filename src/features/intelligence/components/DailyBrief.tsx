import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2, ArrowRight } from 'lucide-react';
import { DailyBrief as DailyBriefType, IntelligenceAlert, Recommendation } from '../types';

interface DailyBriefProps {
  brief: DailyBriefType;
  onActionClick: (actionId: string) => void;
}

export const DailyBrief: React.FC<DailyBriefProps> = ({ brief, onActionClick }) => {
  
  const getAlertIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertCircle className="w-4 h-4 text-rose-500" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      default: return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  const getAlertColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-rose-50/50 border-rose-100 text-rose-900';
      case 'high': return 'bg-orange-50/50 border-orange-100 text-orange-900';
      case 'medium': return 'bg-amber-50/50 border-amber-100 text-amber-900';
      case 'info': return 'bg-blue-50/50 border-blue-100 text-blue-900';
      default: return 'bg-slate-50/50 border-slate-100 text-slate-900';
    }
  };

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl shadow-sm overflow-hidden mb-4">
      <div className="px-4 py-4 sm:px-5">
        <h2 className="text-lg font-bold text-stone-900 tracking-tight font-display uppercase tracking-wider">{brief.greeting.toUpperCase()}</h2>
        <p className="text-[13px] text-stone-500 mt-1">{brief.summaryText}</p>
        
        {brief.alerts.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            {brief.alerts.slice(0, 3).map((alert, i) => (
              <div key={i} className={`flex gap-3 p-3 rounded-xl border ${getAlertColor(alert.priority)}`}>
                <div className="shrink-0 mt-0.5">{getAlertIcon(alert.priority)}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider mb-0.5">{alert.title}</h4>
                  <p className="text-xs font-medium opacity-90">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {brief.topRecommendation && (
          <div className="mt-4 pt-4 border-t border-stone-100">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-semibold text-[9px] uppercase tracking-wider mb-2">
                  <CheckCircle2 className="w-3 h-3" />
                  Recommended Action
                </span>
                <h3 className="text-[13px] font-bold text-stone-900 leading-tight">{brief.topRecommendation.title}</h3>
                <p className="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">{brief.topRecommendation.explanation}</p>
              </div>
              
              {brief.topRecommendation.actionText && brief.topRecommendation.actionId && (
                <button
                  onClick={() => onActionClick(brief.topRecommendation!.actionId!)}
                  className="shrink-0 mt-1 text-[10px] font-bold uppercase tracking-wider bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  {brief.topRecommendation.actionText}
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
            
            {brief.topRecommendation.confidence !== 'Estimated' && (
              <div className="mt-2 text-[9px] font-medium text-stone-400">
                Confidence: <span className="text-stone-600">{brief.topRecommendation.confidence}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

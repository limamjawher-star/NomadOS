import React from 'react';
import { AlertCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { DailyBrief } from '../../intelligence/types';

interface AttentionModuleProps {
  brief: DailyBrief;
  onActionClick: (actionId: string) => void;
}

export const AttentionModule: React.FC<AttentionModuleProps> = ({ brief, onActionClick }) => {
  const importantAlerts = brief.alerts.filter(a => ['critical', 'high', 'medium'].includes(a.priority)).slice(0, 3);
  
  if (importantAlerts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-rose-200/60 rounded-2xl shadow-sm overflow-hidden relative group">
      <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
      <div className="px-5 py-5 sm:px-6">
        <h2 className="text-sm font-bold text-stone-900 tracking-tight font-display mb-1">
          Attention Required
        </h2>
        <p className="text-[13px] text-stone-500 mb-5">
          You have {importantAlerts.length} {importantAlerts.length === 1 ? 'important item' : 'important items'} today.
        </p>

        <div className="space-y-4">
          {importantAlerts.map((alert, idx) => (
            <div key={idx} className="flex gap-4 items-start">
              <span className="text-lg font-display font-bold text-stone-300 mt-0.5">
                {idx + 1}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-stone-800 leading-snug">
                  {alert.message}
                </p>
                {alert.action && (
                  <button 
                    onClick={() => onActionClick(alert.action!.actionId)}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-700 uppercase tracking-wider mt-2 flex items-center gap-1 transition-colors"
                  >
                    {alert.action.label}
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

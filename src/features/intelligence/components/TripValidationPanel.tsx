import React from 'react';
import { TripValidationResult } from '../types';
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface TripValidationPanelProps {
  validation: TripValidationResult;
}

export const TripValidationPanel: React.FC<TripValidationPanelProps> = ({ validation }) => {
  if (validation.status === 'SAFE') {
    return (
      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-2 animate-in fade-in zoom-in duration-300">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
        <div>
          <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Trip Looks Good</h4>
          <p className="text-[11px] font-medium text-emerald-700 mt-0.5">No conflicts detected with your budget, itinerary, or Schengen allowance.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-3 rounded-xl border ${validation.status === 'CONFLICT' ? 'bg-rose-50 border-rose-200' : 'bg-orange-50 border-orange-200'} animate-in fade-in zoom-in duration-300 space-y-2`}>
      <div className="flex items-center gap-1.5">
        {validation.status === 'CONFLICT' ? (
          <AlertCircle className="w-4 h-4 text-rose-600" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-orange-600" />
        )}
        <h4 className={`text-xs font-bold uppercase tracking-wider ${validation.status === 'CONFLICT' ? 'text-rose-900' : 'text-orange-900'}`}>
          {validation.status === 'CONFLICT' ? 'Action Required' : 'Trip Warnings'}
        </h4>
      </div>
      
      <div className="space-y-1.5">
        {validation.issues.map(issue => (
          <div key={issue.id} className="flex gap-2">
            <span className="w-1.5 h-1.5 rounded-full mt-1 shrink-0 bg-current opacity-40" />
            <div>
              <span className="text-[11px] font-bold block">{issue.title}</span>
              <span className="text-[10px] font-medium opacity-80 block leading-snug">{issue.message}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

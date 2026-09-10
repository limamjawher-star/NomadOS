import React from 'react';
import { NomadScore } from '../types';
import { ShieldCheck, Activity, FileText, Briefcase, ChevronRight } from 'lucide-react';

interface NomadScorePanelProps {
  score: NomadScore;
}

export const NomadScorePanel: React.FC<NomadScorePanelProps> = ({ score }) => {
  
  const getScoreColor = (value: number) => {
    if (value >= 90) return 'text-emerald-500';
    if (value >= 70) return 'text-orange-500';
    return 'text-rose-500';
  };

  const getScoreBg = (value: number) => {
    if (value >= 90) return 'bg-emerald-50';
    if (value >= 70) return 'bg-orange-50';
    return 'bg-rose-50';
  };

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl shadow-sm overflow-hidden mb-4">
      <div className="px-4 py-4 sm:px-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-stone-900 tracking-tight uppercase tracking-wider">Nomad Readiness</h2>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-display font-bold ${getScoreColor(score.total)} leading-none`}>{score.total}</span>
            <span className="text-[10px] text-stone-400 font-semibold uppercase">/100</span>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-2 mb-4">
          <ScoreItem icon={<Activity className="w-4 h-4" />} label="Travel" value={score.dimensions.travel} />
          <ScoreItem icon={<ShieldCheck className="w-4 h-4" />} label="Finance" value={score.dimensions.finance} />
          <ScoreItem icon={<FileText className="w-4 h-4" />} label="Docs" value={score.dimensions.documents} />
          <ScoreItem icon={<Briefcase className="w-4 h-4" />} label="Work" value={score.dimensions.work} />
        </div>

        <div className="space-y-1.5 pt-4 border-t border-stone-100">
          <h4 className="text-[9px] font-bold text-stone-400 uppercase tracking-wider mb-2">Key Factors</h4>
          {score.factors.slice(0, 3).map((factor, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] font-medium text-stone-600">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
              <span className="truncate">{factor}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const ScoreItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) => {
  const color = value >= 90 ? 'text-emerald-500' : value >= 70 ? 'text-orange-500' : 'text-rose-500';
  const bg = value >= 90 ? 'bg-emerald-50' : value >= 70 ? 'bg-orange-50' : 'bg-rose-50';

  return (
    <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-stone-50 border border-stone-100">
      <div className={`p-1.5 rounded-lg ${bg} ${color}`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold text-stone-900 leading-none">{value}</span>
      <span className="text-[9px] font-medium text-stone-500 uppercase tracking-wide">{label}</span>
    </div>
  );
};

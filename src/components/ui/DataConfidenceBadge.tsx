import React from 'react';
import { CheckCircle2, AlertCircle, Clock, Database } from 'lucide-react';

type ConfidenceStatus = 'verified' | 'estimate' | 'community' | 'demo';

interface DataConfidenceBadgeProps {
  status: ConfidenceStatus;
  source?: string;
  lastUpdated?: string;
}

export const DataConfidenceBadge: React.FC<DataConfidenceBadgeProps> = ({ status, source, lastUpdated }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'verified':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'estimate':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'community':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'demo':
        return 'bg-stone-100 text-stone-600 border-stone-200';
      default:
        return 'bg-stone-100 text-stone-600 border-stone-200';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'verified': return <CheckCircle2 className="w-3 h-3" />;
      case 'estimate': return <AlertCircle className="w-3 h-3" />;
      case 'community': return <Database className="w-3 h-3" />;
      case 'demo': return <Clock className="w-3 h-3" />;
      default: return null;
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'verified': return 'Verified';
      case 'estimate': return 'Estimate';
      case 'community': return 'Community Data';
      case 'demo': return 'Demo Data';
      default: return 'Unknown';
    }
  };

  return (
    <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] font-medium leading-none ${getBadgeStyle()}`} title={source ? `Source: ${source}` : undefined}>
      {getIcon()}
      <span>{getLabel()}</span>
      {lastUpdated && <span className="opacity-75 ml-0.5 font-normal">({lastUpdated})</span>}
    </div>
  );
};

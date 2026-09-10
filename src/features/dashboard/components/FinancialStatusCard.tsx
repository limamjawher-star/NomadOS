import React from 'react';
import { DollarSign, ArrowRight, TrendingDown, TrendingUp } from 'lucide-react';
import { IntelligenceProfile } from '../../intelligence/engine/profileBuilder';

interface FinancialStatusCardProps {
  profile: IntelligenceProfile;
  onActionClick: (actionId: string) => void;
}

export const FinancialStatusCard: React.FC<FinancialStatusCardProps> = ({ profile, onActionClick }) => {
  const formatMoney = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  
  const isHealthyRunway = profile.currentRunwayMonths >= 6;
  const runwayColor = profile.currentRunwayMonths < 3 ? 'text-rose-600' : profile.currentRunwayMonths < 6 ? 'text-amber-600' : 'text-emerald-600';
  
  // Mock budget variance - we could calculate this strictly by looking at expenses in current month
  // but for the dashboard, let's just use totalIncome vs budget if available, or just mock 4% under
  const cashflow = profile.totalIncomeUSD - profile.budgetUSD;
  const isUnderBudget = cashflow >= 0;

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
        <h3 className="text-[11px] font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-stone-400" />
          Financial Health
        </h3>
      </div>
      
      <div className="p-5 flex-1 flex flex-col justify-center">
        <div className="mb-4">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-0.5">Current Balance</p>
          <div className="text-3xl font-display font-bold text-stone-900 tracking-tight">
            {formatMoney(profile.totalSavingsUSD)}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Monthly Burn</p>
            <div className="text-sm font-semibold text-stone-700">
              {formatMoney(profile.budgetUSD)}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Runway</p>
            <div className={`text-sm font-semibold ${runwayColor}`}>
              {profile.currentRunwayMonths.toFixed(1)} months
            </div>
          </div>
        </div>

        {profile.budgetUSD > 0 && (
          <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-2">
             {isUnderBudget ? (
               <TrendingDown className="w-4 h-4 text-emerald-500" />
             ) : (
               <TrendingUp className="w-4 h-4 text-rose-500" />
             )}
             <span className="text-[11px] font-medium text-stone-600">
               {isUnderBudget ? 'Trending under budget' : 'Trending over budget'}
             </span>
          </div>
        )}
      </div>

      <div className="px-3 py-3 bg-stone-50 border-t border-stone-100 mt-auto">
        <button 
          onClick={() => onActionClick('finance')}
          className="w-full py-2 bg-white border border-stone-200 hover:border-stone-300 text-stone-700 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
        >
          Review Finances
          <ArrowRight className="w-3 h-3 text-stone-400" />
        </button>
      </div>
    </div>
  );
};

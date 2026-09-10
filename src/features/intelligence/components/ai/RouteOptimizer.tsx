import React, { useState } from 'react';
import { NomadState } from '../../../../types';
import { AIProvider, RouteResponse } from '../../services/aiService';
import { MapPin, Calendar, DollarSign, Cloud, Wifi, ArrowRight, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface RouteOptimizerProps {
  state: NomadState;
  onActionClick: (actionId: string) => void;
}

export const RouteOptimizer: React.FC<RouteOptimizerProps> = ({ state, onActionClick }) => {
  const [durationDays, setDurationDays] = useState('90');
  const [budgetUSD, setBudgetUSD] = useState(state.monthlyBudgetUSD?.toString() || '2000');
  const [climate, setClimate] = useState('Warm');
  const [internet, setInternet] = useState(true);
  
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [route, setRoute] = useState<RouteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setError(null);
    try {
      const response = await AIProvider.optimizeRoute(
        state,
        {
          durationDays: parseInt(durationDays),
          budgetUSD: parseInt(budgetUSD)
        },
        {
          climate,
          internetRequirement: internet
        }
      );
      setRoute(response);
    } catch (err: any) {
      setError(err.message || 'Failed to optimize route');
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-stone-50">
      {!route && !isOptimizing && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-stone-900 font-display">Smart Route Optimizer</h3>
              <p className="text-xs text-stone-500 mt-1">
                Tell us your constraints, and our AI will build the perfect itinerary balancing Schengen limits, budget, and weather.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm space-y-4">
              <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5 block flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Duration (Days)
                </label>
                <select 
                  value={durationDays}
                  onChange={e => setDurationDays(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium"
                >
                  <option value="30">1 Month (30 days)</option>
                  <option value="60">2 Months (60 days)</option>
                  <option value="90">3 Months (90 days)</option>
                  <option value="180">6 Months (180 days)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5 block flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" /> Monthly Budget (USD)
                </label>
                <input 
                  type="number"
                  value={budgetUSD}
                  onChange={e => setBudgetUSD(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5 block flex items-center gap-1.5">
                  <Cloud className="w-3.5 h-3.5" /> Preferred Climate
                </label>
                <select 
                  value={climate}
                  onChange={e => setClimate(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium"
                >
                  <option value="Warm">Warm & Sunny</option>
                  <option value="Temperate">Mild / Temperate</option>
                  <option value="Cool">Cool / Mountain</option>
                  <option value="Any">Any Climate</option>
                </select>
              </div>

              <div className="pt-2">
                 <button 
                   onClick={handleOptimize}
                   className="w-full py-3 bg-stone-900 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors shadow-md"
                 >
                   <Sparkles className="w-4 h-4" />
                   Generate Optimal Route
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isOptimizing && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <div className="w-16 h-16 relative mb-6">
            <div className="absolute inset-0 border-4 border-stone-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
            <Sparkles className="w-6 h-6 text-orange-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 font-display">Crunching the numbers...</h3>
          <p className="text-xs text-stone-500 mt-2 max-w-xs">
            Analyzing Schengen limits, calculating budget burn, and matching weather patterns.
          </p>
        </div>
      )}

      {route && !isOptimizing && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-50">
          <div className="max-w-2xl mx-auto space-y-6">
            
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setRoute(null)}
                className="text-[10px] font-bold text-stone-500 uppercase tracking-wider hover:text-stone-900"
              >
                ← Back to Planner
              </button>
              <div className="flex gap-2">
                <span className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-xs font-bold text-stone-700">
                  {route.score.overall}/100 Score
                </span>
              </div>
            </div>

            {!route.validRouteFound ? (
              <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-rose-900 mb-1">Constraints Impossible</h3>
                  <div className="text-xs text-rose-700 leading-relaxed markdown-body">
                    <ReactMarkdown>{route.explanation}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-sm">
                  <h3 className="text-sm font-bold text-stone-900 mb-2">Why this route?</h3>
                  <div className="text-xs text-stone-600 leading-relaxed markdown-body">
                    <ReactMarkdown>{route.explanation}</ReactMarkdown>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-stone-100">
                    <div>
                      <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Budget Fit</div>
                      <div className="text-sm font-bold text-stone-900">{route.score.budgetFit}/100</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Work Fit</div>
                      <div className="text-sm font-bold text-stone-900">{route.score.workFit}/100</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Climate</div>
                      <div className="text-sm font-bold text-stone-900">{route.score.climate}/100</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-1">Proposed Itinerary</h4>
                  {route.destinations.map((dest, i) => (
                    <div key={i} className="bg-white border border-stone-200/80 rounded-2xl p-4 flex gap-4 items-start shadow-sm relative overflow-hidden">
                      {i !== route.destinations.length - 1 && (
                        <div className="absolute left-[31px] top-12 bottom-0 w-0.5 bg-stone-100 -mb-4 z-0" />
                      )}
                      
                      <div className="relative z-10 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0 border-2 border-white shadow-sm font-bold text-xs text-stone-500">
                        {i + 1}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                            {dest.city}, {dest.country}
                          </h4>
                          <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                            {dest.durationDays} days
                          </span>
                        </div>
                        <p className="text-[11px] font-medium text-stone-500 mb-2">Est. ${dest.estimatedCostUSD}</p>
                        <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                          {dest.reasoning}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

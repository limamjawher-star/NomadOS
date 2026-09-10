import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  Globe, 
  Sparkles, 
  FileText, 
  Laptop, 
  Plane, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { NomadState, NomadExpense } from '../../types';
import { CountryFlag } from '../../components/ui/CountryFlag';
import { evaluateTaxPresence, TaxAssessment } from '../../utils/taxCalculator';
import { DataConfidenceBadge } from '../../components/ui/DataConfidenceBadge';

interface TaxOptimizationHubProps {
  state: NomadState;
  onOpenPricing?: () => void;
}

interface TaxRegime {
  country: string;
  flag: string;
  visaName: string;
  taxRate: string;
  qualifyingRule: string;
  description: string;
  savingsScore: string;
  officialLink?: string;
}

const GLOBAL_TAX_REGIMES: TaxRegime[] = [
  {
    country: 'United Arab Emirates',
    flag: 'AE',
    visaName: 'Dubai Remote Work Visa (1 Year)',
    taxRate: '0% Personal Tax',
    qualifyingRule: '$3,500/mo remote income proof',
    description: 'Zero personal income tax, zero capital gains tax, and world-class digital infrastructure.',
    savingsScore: 'Max 100%'
  },
  {
    country: 'Georgia',
    flag: 'GE',
    visaName: 'Individual Entrepreneur Status',
    taxRate: '1% Flat Turnover Tax',
    qualifyingRule: 'Annual revenue up to $180,000 USD',
    description: 'One of the world’s lowest legal taxes for freelance devs, consultants, and online agency founders.',
    savingsScore: 'High 99%'
  },
  {
    country: 'Spain',
    flag: 'ES',
    visaName: 'Digital Nomad Visa / Beckham Law',
    taxRate: '24% Flat Rate',
    qualifyingRule: 'Up to €600,000/yr for first 5 years',
    description: 'Capped flat rate instead of progressive 47% brackets. Full Schengen mobility throughout Europe.',
    savingsScore: 'Moderate 48%'
  },
  {
    country: 'Portugal',
    flag: 'PT',
    visaName: 'D8 Digital Nomad Visa / IFICI',
    taxRate: '20% Flat Rate',
    qualifyingRule: 'Remote income of at least €3,280/mo',
    description: 'Replaced NHR with targeted innovation rates. Foreign capital gains often exempt under tax treaties.',
    savingsScore: 'Moderate 55%'
  },
  {
    country: 'Thailand',
    flag: 'TH',
    visaName: 'Destination Thailand Visa (DTV)',
    taxRate: '0% on Unremitted Foreign Income',
    qualifyingRule: '5-year multiple entry visa (180 days/stay)',
    description: 'Foreign-sourced earnings not remitted into Thailand within the same calendar year remain untaxed.',
    savingsScore: 'High 90%'
  },
  {
    country: 'Bulgaria',
    flag: 'BG',
    visaName: 'EU Flat Tax Residency (Bansko Hub)',
    taxRate: '10% Flat Personal & Corporate',
    qualifyingRule: 'EU freedom of movement or D-Visa',
    description: 'Lowest flat income tax rate within the European Union. Popular hub for European remote builders.',
    savingsScore: 'High 80%'
  },
];

export const TaxOptimizationHub: React.FC<TaxOptimizationHubProps> = ({ state, onOpenPricing }) => {
  // FEIE 330-Day Physical Presence Calculation
  const [feieDaysAbroad, setFeieDaysAbroad] = useState<number>(294);
  const [homeCountryAnnualIncome, setHomeCountryAnnualIncome] = useState<number>(115000);
  const [taxBracketRate, setTaxBracketRate] = useState<number>(28);

  const feieMaxExclusion2026 = 126500;
  const feieQualifies = feieDaysAbroad >= 330;
  const daysNeededToQualify = Math.max(0, 330 - feieDaysAbroad);

  // Estimated tax saved under FEIE
  const estimatedFeieTaxSaved = useMemo(() => {
    const excludableAmount = Math.min(homeCountryAnnualIncome, feieMaxExclusion2026);
    return Math.round(excludableAmount * (taxBracketRate / 100));
  }, [homeCountryAnnualIncome, taxBracketRate]);

  // Tax Deductible Expenses Calculation from state
  const deductibleExpenses = useMemo(() => {
    return state.expenses.filter((exp) => exp.isDeductible);
  }, [state.expenses]);

  const totalDeductibleUSD = useMemo(() => {
    return deductibleExpenses.reduce((sum, exp) => sum + exp.amountUSD, 0);
  }, [deductibleExpenses]);

  const estimatedDeductionRefund = Math.round(totalDeductibleUSD * (taxBracketRate / 100));

  // Tax presence assessment
  const currentCityParts = (state.currentCity || 'Canggu, Bali').split(',');
  const currentCountry = currentCityParts[1]?.trim() || 'Indonesia';
  
  const taxAssessment: TaxAssessment = evaluateTaxPresence({
    id: 'mock',
    country: currentCountry,
    countryCode: currentCountry.substring(0, 2).toUpperCase(),
    daysSpent: 68,
    year: new Date().getFullYear(),
    maxSafeDays: 120, // Country specific
    maxDaysAllowed: 183,
    taxResidencyRisk: 'low'
  });

  return (
    <div className="space-y-4 animate-in fade-in">
      {/* Visual Header Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-stone-200/90 shadow-xs bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-semibold border border-orange-500/30 uppercase tracking-wider">
                Digital Nomad Tax Engine
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>Legally Compliant Geo-Arbitrage</span>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-semibold font-display leading-tight">
              Tax Optimization & FEIE Presence
            </h3>

            <p className="text-xs text-stone-300 max-w-xl">
              Track physical presence abroad, calculate Foreign Earned Income Exclusion (FEIE), audit write-off deductible expenses, and compare global nomad tax regimes.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/15 shrink-0 text-center sm:text-right">
            <span className="text-[10px] text-white/70 block uppercase font-medium">Total Potential Tax Saved</span>
            <span className="text-2xl font-semibold text-emerald-400 font-display">
              ${(estimatedFeieTaxSaved + estimatedDeductionRefund).toLocaleString()}
            </span>
            <span className="text-[10px] text-white/80 block mt-0.5">FEIE + Business Write-offs</span>
          </div>
        </div>
      </div>

      {/* 2-Column: FEIE Calculator & Deductions Audit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Module 1: FEIE 330-Day Physical Presence */}
        <div className="bg-white rounded-xl p-5 border border-stone-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-semibold">
                <Calendar className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-stone-900 leading-tight">
                  FEIE 330-Day Presence Tracker
                </h4>
                <p className="text-[11px] text-stone-500">
                  Foreign Earned Income Exclusion ($126,500 Cap)
                </p>
              </div>
            </div>

            <span className={`px-2.5 py-1 rounded-xl text-xs font-medium ${
              feieQualifies 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {feieQualifies ? 'Qualified Safe' : `${daysNeededToQualify}d to Qualify`}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-600 font-medium">Physical Days Outside Home Country</span>
              <span className="font-semibold text-stone-900">{feieDaysAbroad} / 330 days</span>
            </div>
            <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (feieDaysAbroad / 330) * 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-stone-400">
              <span>Day 0</span>
              <span>330 Days Threshold</span>
              <span>365 Days</span>
            </div>
          </div>

          {/* Simulation Controls */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-600">Simulate Days Abroad in 365d Window:</span>
              <span className="font-semibold text-orange-600">{feieDaysAbroad} days</span>
            </div>
            <input
              type="range"
              min="180"
              max="365"
              step="1"
              value={feieDaysAbroad}
              onChange={(e) => setFeieDaysAbroad(parseInt(e.target.value))}
              className="w-full accent-orange-500 h-2 bg-stone-200 rounded-lg cursor-pointer"
            />
            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-stone-600">Estimated Federal Tax Excluded:</span>
              <span className="font-semibold text-emerald-600 font-display">
                +${estimatedFeieTaxSaved.toLocaleString()} USD
              </span>
            </div>
          </div>

          <p className="text-[11px] text-stone-500 leading-relaxed font-normal">
            💡 Remote workers who reside abroad for at least 330 full days in a 12-month period can exclude up to $126,500 of earned foreign wages from federal taxes.
          </p>
        </div>

        {/* Module 2: Business Deductions & Write-Offs Audit */}
        <div className="bg-white rounded-xl p-5 border border-stone-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-semibold">
                <FileText className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-stone-900 leading-tight">
                  Business Deductions & Write-Offs
                </h4>
                <p className="text-[11px] text-stone-500">
                  Coworking, Tech Gear, Hub Flights, eSIM Data
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-stone-400 block font-medium">Logged Deductible</span>
              <span className="text-sm font-semibold text-stone-900 font-display">
                ${totalDeductibleUSD.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200/60 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-900 block">
                Estimated Tax Shield Savings ({taxBracketRate}% bracket)
              </span>
              <span className="text-[11px] text-emerald-700 font-normal">
                Direct write-off against gross self-employment/remote income
              </span>
            </div>
            <span className="text-xl font-semibold text-emerald-600 font-display">
              ${estimatedDeductionRefund.toLocaleString()}
            </span>
          </div>

          {/* Deductible items quick summary */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-stone-700">Qualifying Logged Business Expenses:</div>
            {deductibleExpenses.length > 0 ? (
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {deductibleExpenses.map((exp) => (
                  <div 
                    key={exp.id}
                    className="p-2 bg-stone-50 rounded-xl border border-stone-200/60 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-medium text-stone-800">{exp.description}</span>
                    </div>
                    <span className="font-semibold text-stone-900">${exp.amountUSD} USD</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 italic font-normal">
                Check the "Tax Deductible Business Expense" box when logging coworking, gear, or transit to automatically audit write-offs here.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 183-Day Worldwide Residency Alert */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-semibold shrink-0">
            <AlertTriangle className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-stone-900">
                183-Day Tax Residency Gauge: {currentCountry}
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-medium border border-emerald-200">
                Safe (Day {taxAssessment.daysSpent} of 183)
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5 font-normal">
              Spending over 183 days in {currentCountry} within 12 months may trigger unintended local tax residency on global income. You have {taxAssessment.maxSafeDays - taxAssessment.daysSpent} safe days remaining.
            </p>
          </div>
        </div>
      </div>

      {/* Global Digital Nomad Tax Regimes Comparison Table */}
      <div className="bg-white rounded-xl p-5 border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-semibold">
              <Globe className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-900 leading-tight">
                Top Digital Nomad Tax Regimes & Visas
              </h4>
              <p className="text-[11px] text-stone-500">
                Compare official territorial and flat tax incentives worldwide
              </p>
            </div>
          </div>
          <span className="text-[11px] text-stone-400 font-medium">Updated 2026</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {GLOBAL_TAX_REGIMES.map((regime) => (
            <div
              key={regime.country}
              className="p-4 rounded-xl border border-stone-200/80 bg-stone-50/70 hover:bg-white hover:border-orange-300 hover:shadow-xs transition-all space-y-2.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CountryFlag code={regime.flag} className="w-5 h-3.5 rounded shadow-xs" />
                    <span className="font-semibold text-xs text-stone-900">{regime.country}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200/60">
                    {regime.taxRate}
                  </span>
                </div>

                <h5 className="text-xs font-medium text-orange-600 mt-2">
                  {regime.visaName}
                </h5>

                <p className="text-[11px] text-stone-500 mt-1 leading-relaxed font-normal">
                  {regime.description}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] text-stone-400">
                <span className="font-medium">Rule: {regime.qualifyingRule}</span>
                <span className="font-semibold text-emerald-600">{regime.savingsScore}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

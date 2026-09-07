import React, { useState } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  Plus, 
  DollarSign, 
  CreditCard, 
  Calendar, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck, 
  Building, 
  Plane, 
  Coffee, 
  Laptop, 
  Wifi, 
  Sparkles, 
  ChevronRight, 
  Trash2, 
  X, 
  CheckCircle2, 
  Compass, 
  Sliders, 
  Info,
  Layers,
  HeartPulse,
  Tag,
  HelpCircle,
  PiggyBank,
  Target,
  Check
} from 'lucide-react';
import { 
  NomadState, 
  NomadExpense, 
  NomadIncomeStream, 
  NomadFinancialGoal, 
  NomadCostEstimate 
} from '../types';
import { CountryFlag } from './CountryFlag';

interface FinanceTabProps {
  state: NomadState;
  onAddExpense: (expense: NomadExpense) => void;
  onDeleteExpense: (id: string) => void;
  onAddIncome: (income: NomadIncomeStream) => void;
  onDeleteIncome: (id: string) => void;
  onUpdateGoal: (goalId: string, addedAmount: number) => void;
  onAddGoal: (goal: NomadFinancialGoal) => void;
  onUpdateTaxBuffer: (percentage: number) => void;
  onUpdateMonthlyBudget: (budgetUSD: number) => void;
  onOpenPricing: () => void;
}

// Curated destinations for Nomad Runway Planner
const NOMAD_RUNWAY_DESTINATIONS: NomadCostEstimate[] = [
  {
    city: 'Bali (Canggu)',
    country: 'Indonesia',
    flag: 'ID',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
    monthlyBurnUSD: 1450,
    rentUSD: 750,
    coworkingUSD: 180,
    foodUSD: 350,
    visasUSD: 60,
    leisureUSD: 110,
  },
  {
    city: 'Lisbon (Alfama)',
    country: 'Portugal',
    flag: 'PT',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
    monthlyBurnUSD: 2200,
    rentUSD: 1250,
    coworkingUSD: 230,
    foodUSD: 500,
    visasUSD: 40,
    leisureUSD: 180,
  },
  {
    city: 'Chiang Mai (Nimman)',
    country: 'Thailand',
    flag: 'TH',
    imageUrl: 'https://images.unsplash.com/photo-1512553353614-82a7370096dc?auto=format&fit=crop&w=600&q=80',
    monthlyBurnUSD: 920,
    rentUSD: 420,
    coworkingUSD: 120,
    foodUSD: 260,
    visasUSD: 50,
    leisureUSD: 70,
  },
  {
    city: 'Mexico City (Roma)',
    country: 'Mexico',
    flag: 'MX',
    imageUrl: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=600&q=80',
    monthlyBurnUSD: 1650,
    rentUSD: 900,
    coworkingUSD: 190,
    foodUSD: 380,
    visasUSD: 30,
    leisureUSD: 150,
  },
  {
    city: 'Tokyo (Shibuya)',
    country: 'Japan',
    flag: 'JP',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
    monthlyBurnUSD: 2400,
    rentUSD: 1350,
    coworkingUSD: 250,
    foodUSD: 580,
    visasUSD: 40,
    leisureUSD: 180,
  },
  {
    city: 'Medellín (El Poblado)',
    country: 'Colombia',
    flag: 'CO',
    imageUrl: 'https://images.unsplash.com/photo-1599818818581-2292f750d7ca?auto=format&fit=crop&w=600&q=80',
    monthlyBurnUSD: 1250,
    rentUSD: 650,
    coworkingUSD: 160,
    foodUSD: 310,
    visasUSD: 30,
    leisureUSD: 100,
  },
];

export const FinanceTab: React.FC<FinanceTabProps> = ({
  state,
  onAddExpense,
  onDeleteExpense,
  onAddIncome,
  onDeleteIncome,
  onUpdateGoal,
  onAddGoal,
  onUpdateTaxBuffer,
  onUpdateMonthlyBudget,
  onOpenPricing,
}) => {
  const [subView, setSubView] = useState<'overview' | 'income' | 'expenses' | 'planner'>('overview');
  const [expenseFilter, setExpenseFilter] = useState<string>('All');
  
  // Modals
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [fundingGoalId, setFundingGoalId] = useState<string | null>(null);
  const [fundingAmount, setFundingAmount] = useState<number>(250);

  // Runway Interactive Simulator State
  const [customBurnUSD, setCustomBurnUSD] = useState<number>(state.monthlyBudgetUSD || 2800);
  const [selectedCityForRunway, setSelectedCityForRunway] = useState<string>('Bali (Canggu)');

  // Form states for Expense
  const [expDescription, setExpDescription] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCurrency, setExpCurrency] = useState('USD');
  const [expCategory, setExpCategory] = useState<NomadExpense['category']>('Accommodation');
  const [expDeductible, setExpDeductible] = useState(false);
  const [expNotes, setExpNotes] = useState('');

  // Form states for Income
  const [incSource, setIncSource] = useState('');
  const [incType, setIncType] = useState<NomadIncomeStream['type']>('salary');
  const [incAmount, setIncAmount] = useState('');
  const [incCurrency, setIncCurrency] = useState('USD');
  const [incCountry, setIncCountry] = useState('United States');
  const [incTaxable, setIncTaxable] = useState(true);
  const [incNotes, setIncNotes] = useState('');

  // Form states for Goal
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalCurrent, setGoalCurrent] = useState('0');
  const [goalCategory, setGoalCategory] = useState<NomadFinancialGoal['category']>('emergency');
  const [goalDeadline, setGoalDeadline] = useState('2026-12-31');

  // Calculations
  const totalIncomeUSD = state.incomes.reduce((acc, inc) => acc + inc.monthlyAmountUSD, 0);
  const totalExpensesUSD = state.expenses.reduce((acc, exp) => acc + exp.amountUSD, 0);
  const taxReserveUSD = Math.round(totalIncomeUSD * ((state.taxBufferPercentage || 20) / 100));
  const netTakeHomeUSD = totalIncomeUSD - taxReserveUSD;
  const netMonthlySavingsUSD = netTakeHomeUSD - (state.monthlyBudgetUSD || 2800);
  const savingsRatePercentage = totalIncomeUSD > 0 ? Math.round((netMonthlySavingsUSD / totalIncomeUSD) * 100) : 0;
  
  // Runway calculation
  const totalSavings = state.savingsTotalUSD || 28400;
  const currentRunwayMonths = customBurnUSD > 0 ? (totalSavings / customBurnUSD).toFixed(1) : '0';

  // Handlers
  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expDescription || !expAmount) return;

    const parsedAmount = parseFloat(expAmount);
    let amountUSD = parsedAmount;
    if (expCurrency === 'EUR') amountUSD = Math.round(parsedAmount * 1.08);
    if (expCurrency === 'GBP') amountUSD = Math.round(parsedAmount * 1.28);
    if (expCurrency === 'IDR') amountUSD = Math.round(parsedAmount / 16000);
    if (expCurrency === 'THB') amountUSD = Math.round(parsedAmount / 36);

    const newExpense: NomadExpense = {
      id: `exp-${Date.now()}`,
      description: expDescription,
      amount: parsedAmount,
      currency: expCurrency,
      amountUSD,
      category: expCategory,
      isDeductible: expDeductible,
      date: new Date().toISOString().split('T')[0],
      notes: expNotes,
    };

    onAddExpense(newExpense);
    setIsAddExpenseOpen(false);
    setExpDescription('');
    setExpAmount('');
    setExpNotes('');
  };

  const handleSaveIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incSource || !incAmount) return;

    const parsedAmount = parseFloat(incAmount);
    let amountUSD = parsedAmount;
    if (incCurrency === 'EUR') amountUSD = Math.round(parsedAmount * 1.08);
    if (incCurrency === 'GBP') amountUSD = Math.round(parsedAmount * 1.28);

    const newIncome: NomadIncomeStream = {
      id: `inc-${Date.now()}`,
      source: incSource,
      type: incType,
      monthlyAmountUSD: amountUSD,
      currency: incCurrency,
      originalAmount: parsedAmount,
      clientCountry: incCountry,
      taxable: incTaxable,
      notes: incNotes,
    };

    onAddIncome(newIncome);
    setIsAddIncomeOpen(false);
    setIncSource('');
    setIncAmount('');
    setIncNotes('');
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle || !goalTarget) return;

    const categoryImages: Record<NomadFinancialGoal['category'], string> = {
      emergency: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
      visa: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
      gear: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
      flights: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80',
      tax: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    };

    const newGoal: NomadFinancialGoal = {
      id: `goal-${Date.now()}`,
      title: goalTitle,
      targetUSD: parseFloat(goalTarget),
      currentUSD: parseFloat(goalCurrent) || 0,
      deadline: goalDeadline,
      category: goalCategory,
      imageUrl: categoryImages[goalCategory],
    };

    onAddGoal(newGoal);
    setIsAddGoalOpen(false);
    setGoalTitle('');
    setGoalTarget('');
    setGoalCurrent('0');
  };

  const handleFundGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fundingGoalId || fundingAmount <= 0) return;
    onUpdateGoal(fundingGoalId, fundingAmount);
    setFundingGoalId(null);
    setFundingAmount(250);
  };

  // Filtered expenses
  const filteredExpensesList = expenseFilter === 'All'
    ? state.expenses
    : state.expenses.filter((exp) => exp.category === expenseFilter);

  return (
    <div id="finance-planning-view" className="space-y-4 pb-28 max-w-2xl mx-auto px-4 pt-3">
      {/* 1. SECTION TITLE & SUB-NAV TABS */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight font-display">
                Financial Planning & Runway
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Income streams, digital nomad budget, all remote expenses & runway planner
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold rounded-2xl shadow-sm shadow-orange-500/20 flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Log Expense</span>
          </button>
        </div>

        {/* 4 Segmented Subtabs */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100/90 rounded-2xl text-xs font-extrabold">
          <button
            onClick={() => setSubView('overview')}
            className={`py-2 rounded-xl transition-all ${
              subView === 'overview'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSubView('income')}
            className={`py-2 rounded-xl transition-all ${
              subView === 'income'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Income ({state.incomes.length})
          </button>
          <button
            onClick={() => setSubView('expenses')}
            className={`py-2 rounded-xl transition-all ${
              subView === 'expenses'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Expenses ({state.expenses.length})
          </button>
          <button
            onClick={() => setSubView('planner')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              subView === 'planner'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Planner</span>
            <Sparkles className="w-3 h-3 text-orange-500" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: OVERVIEW & CASH FLOW PULSE
         ========================================================================= */}
      {subView === 'overview' && (
        <div className="space-y-4 animate-in fade-in">
          {/* High-Resolution Hero Visual: Digital Nomad Financial Command */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-md bg-slate-900">
            <img 
              src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80" 
              alt="Remote Worker Financial Freedom"
              className="w-full h-44 sm:h-48 object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent" />
            
            <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-[11px] font-extrabold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Financial Freedom Score: 94/100 · Elite Buffer</span>
              </span>

              <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold">
                {state.currentCity} Hub
              </span>
            </div>

            <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between">
              <div>
                <span className="text-[10px] uppercase font-black text-orange-300 tracking-wider block">
                  Net Monthly Free Cash Flow
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-display leading-none mt-1">
                  +${netMonthlySavingsUSD.toLocaleString()} / mo
                </h3>
                <p className="text-xs text-white/80 font-medium mt-1">
                  Saving <strong className="text-emerald-300 font-bold">{savingsRatePercentage}%</strong> of income after {state.taxBufferPercentage}% tax reserve
                </p>
              </div>

              <button
                onClick={() => setSubView('planner')}
                className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/30 flex items-center gap-1"
              >
                <span>Runway Plan</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 4-Stat Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* 1. Gross Income */}
            <div 
              onClick={() => setSubView('income')}
              className="bg-white rounded-3xl p-3.5 border border-slate-200/90 shadow-sm cursor-pointer hover:border-orange-300 transition-all"
            >
              <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400 tracking-wider">
                <span>Gross Income</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <h4 className="text-lg font-black text-slate-900 font-display mt-1">
                ${totalIncomeUSD.toLocaleString()}
              </h4>
              <p className="text-[11px] text-emerald-600 font-bold mt-0.5">
                {state.incomes.length} Active Streams
              </p>
            </div>

            {/* 2. Monthly Budget Burn */}
            <div 
              onClick={() => setSubView('expenses')}
              className="bg-white rounded-3xl p-3.5 border border-slate-200/90 shadow-sm cursor-pointer hover:border-orange-300 transition-all"
            >
              <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400 tracking-wider">
                <span>Monthly Budget</span>
                <CreditCard className="w-3.5 h-3.5 text-orange-500" />
              </div>
              <h4 className="text-lg font-black text-slate-900 font-display mt-1">
                ${state.monthlyBudgetUSD.toLocaleString()}
              </h4>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Spent: ${totalExpensesUSD.toLocaleString()}
              </p>
            </div>

            {/* 3. Liquid Savings */}
            <div 
              onClick={() => setSubView('planner')}
              className="bg-white rounded-3xl p-3.5 border border-slate-200/90 shadow-sm cursor-pointer hover:border-orange-300 transition-all"
            >
              <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400 tracking-wider">
                <span>Liquid Cushion</span>
                <PiggyBank className="w-3.5 h-3.5 text-orange-500" />
              </div>
              <h4 className="text-lg font-black text-slate-900 font-display mt-1">
                ${totalSavings.toLocaleString()}
              </h4>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Safe Emergency Fund
              </p>
            </div>

            {/* 4. Total Freedom Runway */}
            <div 
              onClick={() => setSubView('planner')}
              className="bg-white rounded-3xl p-3.5 border border-slate-200/90 shadow-sm cursor-pointer hover:border-orange-300 transition-all"
            >
              <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400 tracking-wider">
                <span>Nomad Runway</span>
                <Compass className="w-3.5 h-3.5 text-orange-500" />
              </div>
              <h4 className="text-lg font-black text-slate-900 font-display mt-1">
                {currentRunwayMonths} Mo
              </h4>
              <p className="text-[11px] text-emerald-600 font-bold mt-0.5">
                @ current burn rate
              </p>
            </div>
          </div>

          {/* Budget vs Actual Spend Gauge */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-slate-900 font-display">
                  Monthly Nomad Budget Tracker
                </h4>
                <p className="text-xs text-slate-500">
                  ${totalExpensesUSD} spent of ${state.monthlyBudgetUSD} monthly cap
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-orange-50 text-orange-700 text-xs font-black border border-orange-200/60">
                {Math.round((totalExpensesUSD / state.monthlyBudgetUSD) * 100)}% Used
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-orange-400 to-orange-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((totalExpensesUSD / state.monthlyBudgetUSD) * 100))}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>Remaining: ${(state.monthlyBudgetUSD - totalExpensesUSD).toLocaleString()} USD</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>On track for budget goals</span>
              </span>
            </div>
          </div>

          {/* Quick Category Breakdown with High-Resolution Photography */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900 font-display flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-orange-500" />
                <span>Major Nomad Expense Allocations</span>
              </h4>
              <button
                onClick={() => setSubView('expenses')}
                className="text-xs font-bold text-orange-600 hover:underline"
              >
                View Details
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Accommodation */}
              <div 
                onClick={() => {
                  setExpenseFilter('Accommodation');
                  setSubView('expenses');
                }}
                className="group relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs cursor-pointer h-28"
              >
                <img 
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80" 
                  alt="Coliving & Villa"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <span className="text-[10px] font-bold text-orange-300 uppercase tracking-wider block">Housing</span>
                  <h5 className="text-xs font-black leading-tight">Villas & Coliving</h5>
                  <span className="text-[11px] font-extrabold text-white mt-0.5 block">$950/mo</span>
                </div>
              </div>

              {/* Coworking & Tech */}
              <div 
                onClick={() => {
                  setExpenseFilter('Coworking & Cafes');
                  setSubView('expenses');
                }}
                className="group relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs cursor-pointer h-28"
              >
                <img 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80" 
                  alt="Coworking space"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">Workspaces</span>
                  <h5 className="text-xs font-black leading-tight">Coworking & Cafes</h5>
                  <span className="text-[11px] font-extrabold text-white mt-0.5 block">$185/mo</span>
                </div>
              </div>

              {/* Flights & Visas */}
              <div 
                onClick={() => {
                  setExpenseFilter('Flights & Transit');
                  setSubView('expenses');
                }}
                className="group relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs cursor-pointer h-28"
              >
                <img 
                  src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80" 
                  alt="Flights & Relocations"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">Transit</span>
                  <h5 className="text-xs font-black leading-tight">Flights & Scooters</h5>
                  <span className="text-[11px] font-extrabold text-white mt-0.5 block">$915/mo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: INCOME STREAMS & REMOTE EARNINGS
         ========================================================================= */}
      {subView === 'income' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Income Header Visual */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-md bg-slate-900">
            <img 
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80" 
              alt="Remote Software Engineering & SaaS Income"
              className="w-full h-36 object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
            
            <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between">
              <div>
                <span className="text-[10px] uppercase font-black text-orange-300 tracking-wider block">
                  Total Monthly Inflow
                </span>
                <h3 className="text-2xl font-black text-white font-display leading-tight">
                  ${totalIncomeUSD.toLocaleString()} USD / mo
                </h3>
                <p className="text-xs text-white/80 font-medium">
                  {state.incomes.length} diversified location-independent income streams
                </p>
              </div>

              <button
                onClick={() => setIsAddIncomeOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/30 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Stream</span>
              </button>
            </div>
          </div>

          {/* Tax Buffer Allocation Card */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Automated Tax & Entity Reserve ({state.taxBufferPercentage}%)
                </h4>
              </div>
              <span className="text-xs font-black text-slate-900 font-display">
                ${taxReserveUSD.toLocaleString()} USD / mo
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Allocated into separate holding account for home country taxes, LLC entity filings, and digital nomad visa compliance.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <input
                type="range"
                min="0"
                max="35"
                step="5"
                value={state.taxBufferPercentage || 20}
                onChange={(e) => onUpdateTaxBuffer(parseInt(e.target.value))}
                className="w-full accent-orange-500 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-black text-orange-600 w-10 text-right">
                {state.taxBufferPercentage}%
              </span>
            </div>
          </div>

          {/* List of Income Streams */}
          <div className="space-y-2.5">
            {state.incomes.map((inc) => (
              <div
                key={inc.id}
                className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm flex items-center justify-between hover:border-orange-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-black text-slate-900 font-display">{inc.source}</h5>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold capitalize">
                        {inc.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Client: {inc.clientCountry || 'Global'} · {inc.notes}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-base font-black text-emerald-600 font-display">
                      +${inc.monthlyAmountUSD.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {inc.currency !== 'USD' && `(${inc.originalAmount} ${inc.currency})`} /mo
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteIncome(inc.id)}
                    className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors"
                    title="Remove income stream"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: ALL DIGITAL NOMAD EXPENSES
         ========================================================================= */}
      {subView === 'expenses' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Expenses Visual Header */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-md bg-slate-900">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80" 
              alt="Digital Nomad Lifestyle & Coworking"
              className="w-full h-36 object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
            
            <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between">
              <div>
                <span className="text-[10px] uppercase font-black text-orange-300 tracking-wider block">
                  Logged Incurred Expenses
                </span>
                <h3 className="text-2xl font-black text-white font-display leading-tight">
                  ${totalExpensesUSD.toLocaleString()} USD Total
                </h3>
                <p className="text-xs text-white/80 font-medium">
                  {state.expenses.length} verified transactions across coliving, flights, coworking & visas
                </p>
              </div>

              <button
                onClick={() => setIsAddExpenseOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/30 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Log Expense</span>
              </button>
            </div>
          </div>

          {/* Filter Categories Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
            {[
              'All', 
              'Accommodation', 
              'Flights & Transit', 
              'Coworking & Cafes', 
              'Food & Groceries', 
              'Health & Visas', 
              'Tech & Subscriptions', 
              'Wellness & Leisure'
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setExpenseFilter(cat)}
                className={`px-3 py-1.5 rounded-xl shrink-0 transition-all border ${
                  expenseFilter === cat
                    ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Expenses List */}
          <div className="space-y-2.5">
            {filteredExpensesList.map((exp) => (
              <div
                key={exp.id}
                className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm flex items-center justify-between hover:border-orange-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm shrink-0">
                    {exp.category === 'Accommodation' && <Building className="w-5 h-5" />}
                    {exp.category === 'Flights & Transit' && <Plane className="w-5 h-5" />}
                    {exp.category === 'Coworking & Cafes' && <Laptop className="w-5 h-5" />}
                    {exp.category === 'Food & Groceries' && <Coffee className="w-5 h-5" />}
                    {exp.category === 'Health & Visas' && <HeartPulse className="w-5 h-5" />}
                    {exp.category === 'Tech & Subscriptions' && <Wifi className="w-5 h-5" />}
                    {exp.category === 'Wellness & Leisure' && <Sparkles className="w-5 h-5" />}
                    {!['Accommodation', 'Flights & Transit', 'Coworking & Cafes', 'Food & Groceries', 'Health & Visas', 'Tech & Subscriptions', 'Wellness & Leisure'].includes(exp.category) && (
                      <CreditCard className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs sm:text-sm font-black text-slate-900 font-display">
                        {exp.description}
                      </h5>
                      {exp.isDeductible && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 text-[9px] font-black tracking-wide border border-emerald-200/60">
                          TAX DEDUCTIBLE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {exp.category} · {exp.date} {exp.notes ? `· ${exp.notes}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-base font-black text-slate-900 font-display">
                      ${exp.amountUSD.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {exp.currency !== 'USD' && `(${exp.amount} ${exp.currency})`}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteExpense(exp.id)}
                    className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors"
                    title="Delete expense"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 4: DIGITAL NOMAD RUNWAY & FREEDOM PLANNER
         ========================================================================= */}
      {subView === 'planner' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Planner Visual Header */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-md bg-slate-900">
            <img 
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80" 
              alt="Nomad Freedom & Runway Planning"
              className="w-full h-44 sm:h-48 object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            
            <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-orange-500/30 backdrop-blur-md border border-orange-400/50 text-orange-200 text-[11px] font-extrabold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Nomad Freedom & Runway Engine</span>
              </span>

              <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold">
                Total Savings: ${totalSavings.toLocaleString()} USD
              </span>
            </div>

            <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between">
              <div>
                <span className="text-[10px] uppercase font-black text-orange-300 tracking-wider block">
                  Simulated Freedom Runway
                </span>
                <h3 className="text-3xl font-black text-white font-display leading-tight">
                  {currentRunwayMonths} Months of Freedom
                </h3>
                <p className="text-xs text-white/85 font-medium">
                  Zero client work needed with ${customBurnUSD}/mo spending cushion
                </p>
              </div>

              <button
                onClick={() => setIsAddGoalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/30 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Goal</span>
              </button>
            </div>
          </div>

          {/* Interactive Runway Burn Simulator Slider */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-slate-900 font-display">
                  Interactive Monthly Burn Simulator
                </h4>
                <p className="text-xs text-slate-500">
                  Drag slider to see how long your savings last at different lifestyle spending tiers
                </p>
              </div>
              <span className="text-base font-black text-orange-600 font-display">
                ${customBurnUSD} / mo
              </span>
            </div>

            <input
              type="range"
              min="800"
              max="5000"
              step="50"
              value={customBurnUSD}
              onChange={(e) => setCustomBurnUSD(parseInt(e.target.value))}
              className="w-full accent-orange-500 h-2.5 bg-slate-100 rounded-lg cursor-pointer"
            />

            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
              <span>$800 (Frugal Asia)</span>
              <span>$2,000 (Balanced Europe)</span>
              <span>$3,500+ (Luxury US/Tokyo)</span>
            </div>
          </div>

          {/* Country-by-Country Cost of Living Comparison Planner */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-orange-500" />
                <span>City-by-City Nomad Runway Comparison</span>
              </h4>
              <span className="text-[11px] text-slate-400">Based on ${totalSavings.toLocaleString()} savings</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {NOMAD_RUNWAY_DESTINATIONS.map((dest) => {
                const cityRunwayMonths = (totalSavings / dest.monthlyBurnUSD).toFixed(1);

                return (
                  <div
                    key={dest.city}
                    onClick={() => {
                      setSelectedCityForRunway(dest.city);
                      setCustomBurnUSD(dest.monthlyBurnUSD);
                    }}
                    className={`bg-white rounded-3xl p-3 border transition-all cursor-pointer shadow-sm hover:shadow-md ${
                      selectedCityForRunway === dest.city
                        ? 'border-orange-500 ring-2 ring-orange-500/20'
                        : 'border-slate-200/90 hover:border-orange-200'
                    }`}
                  >
                    <div className="relative rounded-2xl overflow-hidden h-28 mb-3">
                      <img
                        src={dest.imageUrl}
                        alt={dest.city}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      
                      <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-bold border border-white/20">
                        <CountryFlag code={dest.flag} name={dest.country} size="xs" />
                        <span>{dest.country}</span>
                      </div>

                      <div className="absolute bottom-2 left-2 right-2 flex items-baseline justify-between text-white">
                        <h5 className="font-black text-sm">{dest.city}</h5>
                        <span className="text-xs font-extrabold text-orange-300">
                          {cityRunwayMonths} Mo Runway
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-slate-600 bg-slate-50 p-2 rounded-xl">
                      <div>
                        <span className="text-slate-400 block text-[9px]">Burn/mo</span>
                        <span className="text-slate-900 font-black">${dest.monthlyBurnUSD}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">Rent</span>
                        <span className="text-slate-900 font-black">${dest.rentUSD}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">Coworking</span>
                        <span className="text-slate-900 font-black">${dest.coworkingUSD}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Nomad Financial Milestones & Goals */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <PiggyBank className="w-3.5 h-3.5 text-orange-500" />
                <span>Nomad Savings Milestones & Proof of Funds</span>
              </h4>
              <button
                onClick={() => setIsAddGoalOpen(true)}
                className="text-xs font-bold text-orange-600 hover:underline"
              >
                + Add Goal
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {state.financialGoals.map((goal) => {
                const percent = Math.min(100, Math.round((goal.currentUSD / goal.targetUSD) * 100));

                return (
                  <div
                    key={goal.id}
                    className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={goal.imageUrl}
                        alt={goal.title}
                        className="w-12 h-12 rounded-2xl object-cover shrink-0 shadow-xs"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-black text-slate-900 truncate font-display">
                          {goal.title}
                        </h5>
                        <p className="text-[10px] text-slate-400 capitalize">
                          Target by {goal.deadline}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="font-black text-slate-900 font-display">
                          ${goal.currentUSD.toLocaleString()} / ${goal.targetUSD.toLocaleString()}
                        </span>
                        <span className="font-extrabold text-orange-600">{percent}%</span>
                      </div>

                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-orange-500 h-full rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => setFundingGoalId(goal.id)}
                      className="w-full py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Deposit to Goal</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODALS: Add Expense, Add Income, Add Goal, Fund Goal
         ========================================================================= */}

      {/* 1. Modal: Log Nomad Expense */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form 
            onSubmit={handleSaveExpense}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200/60 shadow-xs">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base font-display">
                  Log Nomad Expense
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddExpenseOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={expDescription}
                  onChange={(e) => setExpDescription(e.target.value)}
                  placeholder="e.g. Selina Coliving Canggu (1 Month), Starlink Mini, Flight to Tokyo"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Amount</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="any"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    placeholder="950"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Currency</label>
                  <select
                    value={expCurrency}
                    onChange={(e) => setExpCurrency(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="IDR">IDR (Rp)</option>
                    <option value="THB">THB (฿)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-orange-500"
                >
                  <option value="Accommodation">Accommodation (Coliving, Airbnb, Villa)</option>
                  <option value="Flights & Transit">Flights & Transit (Airlines, Scooters, Rail)</option>
                  <option value="Coworking & Cafes">Coworking & Work Cafes</option>
                  <option value="Food & Groceries">Food & Dining</option>
                  <option value="Health & Visas">Health & Visas (SafetyWing, Visa extensions)</option>
                  <option value="Tech & Subscriptions">Tech & Subscriptions (eSIM, VPN, Cloud)</option>
                  <option value="Gear & Equipment">Gear & Equipment (Laptops, Cameras, Tech)</option>
                  <option value="Wellness & Leisure">Wellness & Leisure (Surfing, Gym, Retreats)</option>
                  <option value="Taxes & Legal">Taxes & Legal (Accounting, Entity fees)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Location</label>
                <input
                  type="text"
                  value={expNotes}
                  onChange={(e) => setExpNotes(e.target.value)}
                  placeholder="e.g. Canggu Echo Beach, 150 Mbps fiber included"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={expDeductible}
                    onChange={(e) => setExpDeductible(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
                  />
                  <span>Tax Deductible Business Expense</span>
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddExpenseOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-xl text-xs shadow-md shadow-orange-500/30"
              >
                Save Expense
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Modal: Add Income Stream */}
      {isAddIncomeOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form 
            onSubmit={handleSaveIncome}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/60 shadow-xs">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base font-display">
                  Add Remote Income Stream
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddIncomeOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Source Name / Client</label>
                <input
                  type="text"
                  required
                  value={incSource}
                  onChange={(e) => setIncSource(e.target.value)}
                  placeholder="e.g. Remote Staff Engineer, UX Retainer, Micro-SaaS"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Amount</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="any"
                    value={incAmount}
                    onChange={(e) => setIncAmount(e.target.value)}
                    placeholder="5400"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Currency</label>
                  <select
                    value={incCurrency}
                    onChange={(e) => setIncCurrency(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Income Type</label>
                  <select
                    value={incType}
                    onChange={(e) => setIncType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="salary">Full-time Remote Salary</option>
                    <option value="retainer">Monthly Client Retainer</option>
                    <option value="freelance">Freelance / Hourly</option>
                    <option value="saas">SaaS & Digital Products</option>
                    <option value="passive">Investments / Passive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Client Country</label>
                  <input
                    type="text"
                    value={incCountry}
                    onChange={(e) => setIncCountry(e.target.value)}
                    placeholder="e.g. United States, Germany"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes</label>
                <input
                  type="text"
                  value={incNotes}
                  onChange={(e) => setIncNotes(e.target.value)}
                  placeholder="e.g. Billed via Wise semi-monthly"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddIncomeOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-xl text-xs shadow-md shadow-orange-500/30"
              >
                Add Stream
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Modal: Add Financial Goal */}
      {isAddGoalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form 
            onSubmit={handleSaveGoal}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200/60 shadow-xs">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base font-display">
                  Create Nomad Financial Goal
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddGoalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Goal Title</label>
                <input
                  type="text"
                  required
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="e.g. 6-Month Emergency Cushion, Spain Visa Proof of Funds"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Amount ($)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    placeholder="15000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Starting Amount ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={goalCurrent}
                    onChange={(e) => setGoalCurrent(e.target.value)}
                    placeholder="3000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="emergency">Emergency Runway</option>
                    <option value="visa">Nomad Visa Proof of Funds</option>
                    <option value="gear">Remote Gear Upgrade</option>
                    <option value="flights">RTW Flight Cushion</option>
                    <option value="tax">Tax Entity Cushion</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={goalDeadline}
                    onChange={(e) => setGoalDeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddGoalOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-xl text-xs shadow-md shadow-orange-500/30"
              >
                Save Goal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. Modal: Deposit / Fund Goal */}
      {fundingGoalId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form 
            onSubmit={handleFundGoalSubmit}
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-slate-900 text-base font-display">Deposit to Goal</h4>
              <button
                type="button"
                onClick={() => setFundingGoalId(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contribution Amount ($ USD)</label>
              <input
                type="number"
                required
                min="1"
                value={fundingAmount}
                onChange={(e) => setFundingAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-black focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFundingGoalId(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-xl text-xs shadow-md shadow-orange-500/30"
              >
                Confirm Deposit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  Trash2,
  TrendingDown,
  DollarSign,
  ArrowRightLeft,
  Calendar,
  Layers,
} from 'lucide-react';
import { NomadExpense } from '../types';
import { formatUSD, formatCurrency } from '../utils/formatters';
import { 
  NOMAD_CURRENCIES, 
  CURRENCY_REGIONS, 
  getCurrency, 
  convertCurrency 
} from '../data/currencies';

interface ExpenseBurnRateProps {
  expenses: NomadExpense[];
  monthlyBudgetUSD: number;
  onAddExpense: (expense: Omit<NomadExpense, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
  onUpdateBudget: (budget: number) => void;
}

export const ExpenseBurnRate: React.FC<ExpenseBurnRateProps> = ({
  expenses,
  monthlyBudgetUSD,
  onAddExpense,
  onDeleteExpense,
  onUpdateBudget,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState(50);
  const [newCurrency, setNewCurrency] = useState('EUR');
  const [newCategory, setNewCategory] = useState<NomadExpense['category']>('Food & Groceries');
  const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 10));

  // Currency Converter State
  const [convAmount, setConvAmount] = useState<number>(100);
  const [convFrom, setConvFrom] = useState<string>('USD');
  const [convTo, setConvTo] = useState<string>('EUR');

  const convertCurrencies = (amount: number, from: string, to: string) => {
    return convertCurrency(amount, from, to);
  };

  const totalSpentUSD = expenses.reduce((sum, e) => sum + e.amountUSD, 0);
  const budgetRatio = Math.min(100, Math.round((totalSpentUSD / monthlyBudgetUSD) * 100));
  const remainingBudgetUSD = Math.max(0, monthlyBudgetUSD - totalSpentUSD);

  // Approximate day of month for daily burn rate
  const currentDayOfMonth = new Date().getDate();
  const dailyBurnRate = currentDayOfMonth > 0 ? totalSpentUSD / currentDayOfMonth : totalSpentUSD;
  const daysInCurrentMonth = 30;
  const daysLeft = Math.max(1, daysInCurrentMonth - currentDayOfMonth);
  const safeDailyAllowanceRemaining = remainingBudgetUSD / daysLeft;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim()) return;

    // Convert to USD
    const curr = getCurrency(newCurrency);
    const amountInUSD = Math.round(newAmount * curr.rateInUSD);

    onAddExpense({
      date: newDate,
      description: newDesc.trim(),
      category: newCategory,
      amount: Number(newAmount),
      currency: newCurrency,
      amountUSD: amountInUSD,
    });

    setNewDesc('');
    setNewAmount(50);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono tracking-wider uppercase text-amber-400 font-semibold">
                Monthly Nomad Runway & Burn Rate
              </span>
            </div>
            <h2 className="text-2xl font-bold text-stone-100 mt-1">
              Nomad Financial Health & Multi-Currency Engine
            </h2>
            <p className="text-stone-400 text-sm max-w-2xl mt-1 leading-relaxed">
              Track global living expenses, daily burn rates, and exchange rates across colivings, visas, and travel logistics.
            </p>
          </div>

          <button
            id="add-nomad-expense-btn"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start md:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Log Expense</span>
          </button>
        </div>

        {/* Burn Rate Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-stone-800/80">
          <div className="bg-stone-950/50 border border-stone-800 p-4 rounded-xl">
            <span className="text-xs text-stone-400 font-mono uppercase">Month Spend</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-stone-100">
                {formatUSD(totalSpentUSD)}
              </span>
              <span className="text-xs text-stone-500 font-mono">/ {formatUSD(monthlyBudgetUSD)}</span>
            </div>
            <div className="w-full bg-stone-800 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  budgetRatio > 90 ? 'bg-rose-500' : budgetRatio > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${budgetRatio}%` }}
              />
            </div>
          </div>

          <div className="bg-stone-950/50 border border-stone-800 p-4 rounded-xl">
            <span className="text-xs text-stone-400 font-mono uppercase">Current Daily Burn</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold font-mono text-amber-300">
                {formatUSD(dailyBurnRate)}
              </span>
              <span className="text-xs text-stone-500 font-mono">/ day</span>
            </div>
            <div className="text-xs text-stone-400 mt-2 font-mono">
              Day {currentDayOfMonth} of {daysInCurrentMonth}
            </div>
          </div>

          <div className="bg-stone-950/50 border border-stone-800 p-4 rounded-xl">
            <span className="text-xs text-stone-400 font-mono uppercase">Safe Remaining Cap</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold font-mono text-emerald-400">
                {formatUSD(safeDailyAllowanceRemaining)}
              </span>
              <span className="text-xs text-stone-500 font-mono">/ day</span>
            </div>
            <div className="text-xs text-stone-400 mt-2 font-mono">
              {daysLeft} days remaining this month
            </div>
          </div>

          <div className="bg-stone-950/50 border border-stone-800 p-4 rounded-xl flex flex-col justify-between">
            <span className="text-xs text-stone-400 font-mono uppercase">Monthly Target</span>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                value={monthlyBudgetUSD}
                onChange={(e) => onUpdateBudget(Number(e.target.value))}
                className="w-full bg-stone-900 border border-stone-700 rounded px-2.5 py-1 text-sm font-mono text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              Adjust your monthly burn ceiling.
            </div>
          </div>
        </div>

        {/* Add Modal */}
        {showAddForm && (
          <form
            onSubmit={handleAddSubmit}
            className="mt-6 p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-4"
          >
            <div className="text-sm font-semibold text-stone-200">Record Nomad Expense</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-stone-400 mb-1">Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Second Home Coworking, Flight to Sofia"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as NomadExpense['category'])}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Accommodation">Accommodation</option>
                  <option value="Coworking & Cafes">Coworking & Cafes</option>
                  <option value="Flights & Transit">Flights & Transit</option>
                  <option value="Food & Groceries">Food & Groceries</option>
                  <option value="Health & Visas">Health & Visas</option>
                  <option value="Activities">Activities</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">Amount & FX</label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    step="any"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(Number(e.target.value))}
                    className="w-2/3 bg-stone-900 border border-stone-700 rounded-l-lg px-2.5 py-2 text-sm text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                  <select
                    value={newCurrency}
                    onChange={(e) => setNewCurrency(e.target.value)}
                    className="w-1/3 bg-stone-900 border border-stone-700 rounded-r-lg px-1 py-2 text-xs font-mono text-stone-200 focus:outline-none focus:border-amber-500"
                  >
                    {NOMAD_CURRENCIES.map((cur) => (
                      <option key={cur.code} value={cur.code}>
                        {cur.flag} {cur.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 text-xs text-stone-400 hover:text-stone-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg transition-colors"
              >
                Save Expense
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Two Column: Currency Converter + Expenses List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Converter Tool */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ArrowRightLeft className="h-4 w-4 text-amber-400" />
              <h3 className="font-bold text-stone-100 text-sm">Nomad FX Fast Converter</h3>
            </div>
            <p className="text-xs text-stone-400 mb-4">
              Real-time exchange comparison for local SIM, meals, and rent payments.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-stone-400 mb-1">Convert Amount</label>
                <input
                  type="number"
                  value={convAmount}
                  onChange={(e) => setConvAmount(Number(e.target.value))}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm font-mono text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-mono text-stone-400 mb-1">From</label>
                  <select
                    value={convFrom}
                    onChange={(e) => setConvFrom(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-2.5 py-2 text-xs font-mono text-stone-200"
                  >
                    {CURRENCY_REGIONS.map((reg) => (
                      <optgroup key={reg} label={`— ${reg} —`} className="bg-stone-900 text-stone-300">
                        {NOMAD_CURRENCIES.filter((c) => c.region === reg).map((c) => (
                          <option key={c.code} value={c.code} className="bg-stone-950 text-stone-100">
                            {c.flag} {c.code} ({c.symbol})
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-stone-400 mb-1">To</label>
                  <select
                    value={convTo}
                    onChange={(e) => setConvTo(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-2.5 py-2 text-xs font-mono text-stone-200"
                  >
                    {CURRENCY_REGIONS.map((reg) => (
                      <optgroup key={reg} label={`— ${reg} —`} className="bg-stone-900 text-stone-300">
                        {NOMAD_CURRENCIES.filter((c) => c.region === reg).map((c) => (
                          <option key={c.code} value={c.code} className="bg-stone-950 text-stone-100">
                            {c.flag} {c.code} ({c.symbol})
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-xl bg-stone-950 border border-stone-800">
                <div className="text-xs text-stone-400 font-mono">Calculated Result</div>
                <div className="text-2xl font-bold font-mono text-amber-300 mt-1">
                  {formatCurrency(convertCurrencies(convAmount, convFrom, convTo), convTo)}
                </div>
                <div className="text-[11px] text-stone-500 font-mono mt-1">
                  {(() => {
                    const fromCurr = getCurrency(convFrom);
                    const toCurr = getCurrency(convTo);
                    const rate = toCurr.ratePerUSD / fromCurr.ratePerUSD;
                    return `1 ${convFrom} ≈ ${rate < 0.001 ? rate.toFixed(6) : rate < 1 ? rate.toFixed(4) : rate.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${convTo}`;
                  })()}
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-stone-500 mt-4 pt-3 border-t border-stone-800">
            Rates updated for 45+ international remote hubs & currencies across Europe, Asia, Americas, and beyond.
          </div>
        </div>

        {/* Expenses List */}
        <div className="lg:col-span-2 rounded-2xl border border-stone-800 bg-stone-900/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-stone-100 text-sm flex items-center gap-2">
              <Layers className="h-4 w-4 text-amber-400" />
              <span>Logged Transactions</span>
            </h3>
            <span className="text-xs text-stone-400 font-mono">
              {expenses.length} items logged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-stone-800 text-stone-400 font-mono text-xs uppercase">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Description</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium text-right">Amount</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-stone-800/30 transition-colors">
                    <td className="py-3 text-stone-400 font-mono text-xs whitespace-nowrap">
                      {exp.date}
                    </td>
                    <td className="py-3 font-medium text-stone-200">{exp.description}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-stone-800 text-stone-300 border border-stone-700">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono">
                      <span className="text-stone-200 font-semibold">
                        {formatCurrency(exp.amount, exp.currency)}
                      </span>
                      {exp.currency !== 'USD' && (
                        <div className="text-[10px] text-stone-500 font-mono">
                          ≈ {formatUSD(exp.amountUSD)}
                        </div>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => onDeleteExpense(exp.id)}
                        className="p-1 rounded hover:bg-rose-500/20 text-stone-500 hover:text-rose-400 transition-colors"
                        title="Delete expense"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}

                {expenses.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-stone-500 text-sm">
                      No expenses logged yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

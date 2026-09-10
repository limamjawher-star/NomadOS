import { NomadExpense, NomadIncomeStream, NomadFinancialGoal } from '../types';

export function calculateTotalExpenses(expenses: NomadExpense[]): number {
  return expenses.reduce((sum, exp) => sum + exp.amountUSD, 0);
}

export function calculateMonthlyBurn(expenses: NomadExpense[], currentMonth: string): number {
  return expenses
    .filter((exp) => exp.date.startsWith(currentMonth))
    .reduce((sum, exp) => sum + exp.amountUSD, 0);
}

export function calculateTotalIncome(incomes: NomadIncomeStream[]): number {
  return incomes.reduce((sum, inc) => sum + inc.monthlyAmountUSD, 0);
}

export function calculateBalance(totalIncome: number, totalExpenses: number): number {
  return totalIncome - totalExpenses;
}

export function calculateRunway(balanceUSD: number, monthlyBurnUSD: number): number {
  if (monthlyBurnUSD <= 0) return 999;
  if (balanceUSD <= 0) return 0;
  return balanceUSD / monthlyBurnUSD;
}

export function calculateProjectedRunway(balanceUSD: number, monthlyBurnUSD: number, expectedIncomeUSD: number): number {
  const netBurn = monthlyBurnUSD - expectedIncomeUSD;
  if (netBurn <= 0) return 999;
  if (balanceUSD <= 0) return 0;
  return balanceUSD / netBurn;
}

export function calculateBudgetVariance(budgetUSD: number, actualSpendUSD: number): number {
  return budgetUSD - actualSpendUSD;
}

export function calculateGoalProgress(goal: NomadFinancialGoal): number {
  if (goal.targetUSD <= 0) return 100;
  return Math.min(100, Math.max(0, (goal.currentUSD / goal.targetUSD) * 100));
}

export interface ForecastResult {
  month: string;
  projectedBalance: number;
}

export function calculateFinancialForecast(
  startingBalance: number,
  monthlyIncome: number,
  monthlyBurn: number,
  months: number
): ForecastResult[] {
  const results: ForecastResult[] = [];
  let currentBalance = startingBalance;
  const now = new Date();
  
  for (let i = 0; i < months; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    currentBalance += (monthlyIncome - monthlyBurn);
    results.push({
      month: d.toISOString().substring(0, 7), // YYYY-MM
      projectedBalance: currentBalance
    });
  }
  
  return results;
}

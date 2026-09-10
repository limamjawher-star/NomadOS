const fs = require('fs');

let content = fs.readFileSync('src/features/finance/FinanceTab.tsx', 'utf8');

if (!content.includes('financeCalculator')) {
  content = content.replace(
    "import { SmartExpenseQuickLogger } from './SmartExpenseQuickLogger';",
    "import { SmartExpenseQuickLogger } from './SmartExpenseQuickLogger';\nimport { calculateTotalExpenses, calculateMonthlyBurn, calculateTotalIncome, calculateBalance, calculateRunway, calculateProjectedRunway, calculateGoalProgress } from '../../utils/financeCalculator';\nimport { CurrencyService } from '../../services/currency/currencyService';\nimport { DataConfidenceBadge } from '../../components/ui/DataConfidenceBadge';"
  );
}

// Replace calculations if possible, or just add DataConfidenceBadge.
if (content.includes('<span className="text-xl font-bold text-stone-900 tracking-tight font-display">{runwayMonths.toFixed(1)} Months</span>')) {
  content = content.replace(
    /<span className="text-xl font-bold text-stone-900 tracking-tight font-display">\{runwayMonths.toFixed\(1\)\} Months<\/span>/g,
    `<span className="text-xl font-bold text-stone-900 tracking-tight font-display">{runwayMonths.toFixed(1)} Months</span>\n              <DataConfidenceBadge status="estimate" />`
  );
}

fs.writeFileSync('src/features/finance/FinanceTab.tsx', content, 'utf8');

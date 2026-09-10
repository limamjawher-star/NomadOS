const fs = require('fs');
let content = fs.readFileSync('src/features/finance/FinanceTab.tsx', 'utf8');

content = content.replace(/import \{ calculateTotalExpenses.*?\} from '\.\.\/\.\.\/utils\/financeCalculator';\nimport \{ CurrencyService \} from '\.\.\/\.\.\/services\/currency\/currencyService';\nimport \{ DataConfidenceBadge \} from '\.\.\/\.\.\/components\/ui\/DataConfidenceBadge';\n/g, '');

content = content.replace(
  "import { SmartExpenseQuickLogger } from './SmartExpenseQuickLogger';",
  "import { SmartExpenseQuickLogger } from './SmartExpenseQuickLogger';\nimport { calculateTotalExpenses, calculateMonthlyBurn, calculateTotalIncome, calculateBalance, calculateRunway, calculateProjectedRunway, calculateGoalProgress } from '../../utils/financeCalculator';\nimport { CurrencyService } from '../../services/currency/currencyService';\nimport { DataConfidenceBadge } from '../../components/ui/DataConfidenceBadge';"
);

fs.writeFileSync('src/features/finance/FinanceTab.tsx', content, 'utf8');

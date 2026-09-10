const fs = require('fs');
let content = fs.readFileSync('src/features/tax/TaxOptimizationHub.tsx', 'utf8');

if (!content.includes('evaluateTaxPresence')) {
  content = content.replace(
    "import { CountryFlag } from '../../components/ui/CountryFlag';",
    "import { CountryFlag } from '../../components/ui/CountryFlag';\nimport { evaluateTaxPresence, TaxAssessment } from '../../utils/taxCalculator';\nimport { DataConfidenceBadge } from '../../components/ui/DataConfidenceBadge';"
  );
}

// Fix undefined 'daysInCurrentCountry'
content = content.replace(/\{183 - daysInCurrentCountry\}/g, '{taxAssessment.maxSafeDays - taxAssessment.daysSpent}');
content = content.replace(/Day \{daysInCurrentCountry\}/g, 'Day {taxAssessment.daysSpent}');

fs.writeFileSync('src/features/tax/TaxOptimizationHub.tsx', content, 'utf8');

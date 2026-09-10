const fs = require('fs');
let content = fs.readFileSync('src/features/tax/TaxOptimizationHub.tsx', 'utf8');

// Add imports
if (!content.includes('DataConfidenceBadge')) {
  content = content.replace(
    "import { Plus, Briefcase, FileText, CheckCircle2, AlertCircle, Info, Calculator, Download, Calendar } from 'lucide-react';",
    "import { Plus, Briefcase, FileText, CheckCircle2, AlertCircle, Info, Calculator, Download, Calendar } from 'lucide-react';\nimport { evaluateTaxPresence, TaxAssessment } from '../../utils/taxCalculator';\nimport { DataConfidenceBadge } from '../../components/ui/DataConfidenceBadge';"
  );
}

// Replace logic
if (content.includes('// Current Country 183-day residency alert')) {
  content = content.replace(
    /\/\/ Current Country 183-day residency alert[\s\S]*?(?=\n\s*return)/m,
    `// Tax presence assessment
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
  });`
  );
}

// Replace UI
if (content.includes('{/* 183-Day Worldwide Residency Alert */}')) {
  content = content.replace(
    /\{\/\* 183-Day Worldwide Residency Alert \*\/\}[\s\S]*?(?=<\/div>\s*<\/div>\s*\{\/\* Digital Nomad)/m,
    `{/* Days-Based Tax Presence Alert */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-semibold shrink-0">
            {taxAssessment.daysSpent}d
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-stone-900">
                Tax Presence Signal: {currentCountry}
              </h4>
              <DataConfidenceBadge status="estimate" />
            </div>
            <p className="text-xs text-stone-500 mt-0.5 font-normal">
              {taxAssessment.notes}
            </p>
          </div>
        </div>
        <button className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap">
          View Jurisdiction Rules
        </button>`
  );
}

fs.writeFileSync('src/features/tax/TaxOptimizationHub.tsx', content, 'utf8');

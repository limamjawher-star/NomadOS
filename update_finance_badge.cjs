const fs = require('fs');
let content = fs.readFileSync('src/features/finance/FinanceTab.tsx', 'utf8');

content = content.replace(
  /<h4 className="text-xl font-bold text-stone-900 font-display mt-1">\s*\{currentRunwayMonths\} Mo\s*<\/h4>/g,
  `<div className="flex items-center gap-2 mt-1">\n                <h4 className="text-xl font-bold text-stone-900 font-display">\n                  {currentRunwayMonths} Mo\n                </h4>\n                <DataConfidenceBadge status="estimate" />\n              </div>`
);

content = content.replace(
  /<h3 className="text-3xl font-bold text-white font-display leading-tight">\s*\{currentRunwayMonths\} Months of Freedom\s*<\/h3>/g,
  `<div className="flex items-center gap-2">\n                  <h3 className="text-3xl font-bold text-white font-display leading-tight">\n                    {currentRunwayMonths} Months of Freedom\n                  </h3>\n                  <DataConfidenceBadge status="estimate" />\n                </div>`
);

fs.writeFileSync('src/features/finance/FinanceTab.tsx', content, 'utf8');

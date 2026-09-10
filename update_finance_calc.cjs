const fs = require('fs');
let content = fs.readFileSync('src/features/finance/FinanceTab.tsx', 'utf8');

content = content.replace(
  /const currentRunwayMonths = customBurnUSD > 0 \? \(totalSavings \/ customBurnUSD\)\.toFixed\(1\) : '0';/g,
  `const currentRunwayMonths = calculateRunway(totalSavings, customBurnUSD).toFixed(1);`
);

fs.writeFileSync('src/features/finance/FinanceTab.tsx', content, 'utf8');

const fs = require('fs');
let content = fs.readFileSync('src/features/travel/MultiStopTripView.tsx', 'utf8');

if (!content.includes('DataConfidenceBadge')) {
  content = content.replace(
    "import { CountryFlag } from '../../components/ui/CountryFlag';",
    "import { CountryFlag } from '../../components/ui/CountryFlag';\nimport { DataConfidenceBadge } from '../../components/ui/DataConfidenceBadge';"
  );
}

if (!content.includes('status="demo"')) {
  content = content.replace(
    /<span className="text-xl font-semibold text-stone-900 tabular-nums">\{trip\.daysCount\}<\/span>/g,
    `<span className="text-xl font-semibold text-stone-900 tabular-nums">{trip.daysCount}</span>\n                <div className="mt-1"><DataConfidenceBadge status="demo" lastUpdated="Demo Preview" /></div>`
  );
}

fs.writeFileSync('src/features/travel/MultiStopTripView.tsx', content, 'utf8');

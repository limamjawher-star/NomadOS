const fs = require('fs');

let content = fs.readFileSync('src/features/explore/ExploreTab.tsx', 'utf8');

// Add import
if (!content.includes('DataConfidenceBadge')) {
  content = content.replace(
    "import { EXPLORE_CITIES } from '../../data/defaultData';",
    "import { EXPLORE_CITIES } from '../../data/defaultData';\nimport { DataConfidenceBadge } from '../../components/ui/DataConfidenceBadge';"
  );
}

// Add badge to city cards
if (!content.includes('<DataConfidenceBadge status="community" />')) {
  content = content.replace(
    /<h3 className="font-bold text-stone-900 text-base sm:text-lg">\{city.name\}<\/h3>/g,
    `<h3 className="font-bold text-stone-900 text-base sm:text-lg">{city.name}</h3>\n                    <DataConfidenceBadge status="community" source="NomadOS Data" />`
  );
}

fs.writeFileSync('src/features/explore/ExploreTab.tsx', content, 'utf8');

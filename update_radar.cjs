const fs = require('fs');

let content = fs.readFileSync('src/features/community/NomadLiveRadar.tsx', 'utf8');

// Add import
if (!content.includes('DataConfidenceBadge')) {
  content = content.replace(
    "import { NomadState, NearbyNomad, WorkSpot } from '../../types';",
    "import { NomadState, NearbyNomad, WorkSpot } from '../../types';\nimport { DataConfidenceBadge } from '../../components/ui/DataConfidenceBadge';"
  );
}

// Add general disclaimer below radar header
if (!content.includes('Radar simulated for demonstration')) {
  content = content.replace(
    /<\/p>\s*<\/div>\s*<button/g,
    `</p>\n                <div className="mt-1">\n                  <DataConfidenceBadge status="demo" lastUpdated="Simulated Radar" />\n                </div>\n              </div>\n              <button`
  );
}

// Add badge to selected entity popup
if (!content.includes('<DataConfidenceBadge status="demo" />')) {
  content = content.replace(
    /<h4 className="font-semibold text-stone-900 text-sm font-display">\{selectedEntity\.title\}<\/h4>/g,
    `<h4 className="font-semibold text-stone-900 text-sm font-display">{selectedEntity.title}</h4>\n                  <DataConfidenceBadge status="demo" />`
  );
}

fs.writeFileSync('src/features/community/NomadLiveRadar.tsx', content, 'utf8');

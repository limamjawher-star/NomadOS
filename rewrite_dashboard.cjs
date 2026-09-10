const fs = require('fs');
let content = fs.readFileSync('src/features/dashboard/HomeDashboard.tsx', 'utf8');

if (!content.includes('import { DailyBrief }')) {
  content = content.replace(
    "import { CountryFlag } from '../../components/ui/CountryFlag';",
    "import { CountryFlag } from '../../components/ui/CountryFlag';\nimport { DailyBrief } from '../intelligence/components/DailyBrief';\nimport { NomadScorePanel } from '../intelligence/components/NomadScorePanel';\nimport { buildIntelligenceProfile } from '../intelligence/engine/profileBuilder';\nimport { DecisionEngine } from '../intelligence/engine/DecisionEngine';\nimport { calculateNomadScore } from '../intelligence/engine/ScoreCalculator';"
  );
}

if (!content.includes('const profile = buildIntelligenceProfile')) {
  content = content.replace(
    "const [messageSent, setMessageSent] = useState(false);",
    `const [messageSent, setMessageSent] = useState(false);\n\n  const profile = buildIntelligenceProfile(state as any);\n  const brief = DecisionEngine.generateDailyBrief(profile);\n  const score = calculateNomadScore(profile);`
  );
}

if (!content.includes('<DailyBrief')) {
  content = content.replace(
    "{/* 1. ONBOARDING WIDGET (if not completed) */}",
    `<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">\n        <div className="md:col-span-2">\n          <DailyBrief brief={brief} onActionClick={onNavigateTab as any} />\n        </div>\n        <div className="md:col-span-1">\n          <NomadScorePanel score={score} />\n        </div>\n      </div>\n\n      {/* 1. ONBOARDING WIDGET (if not completed) */}`
  );
}

fs.writeFileSync('src/features/dashboard/HomeDashboard.tsx', content, 'utf8');

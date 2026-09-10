const fs = require('fs');

function replaceInFile(path, replacements) {
  let content = fs.readFileSync(path, 'utf8');
  for (const [search, replace] of Object.entries(replacements)) {
    content = content.replace(search, replace);
  }
  fs.writeFileSync(path, content, 'utf8');
}

replaceInFile('src/app/LandingPage.tsx', {
  "from './SmartAlertsCarousel'": "from '../components/feedback/SmartAlertsCarousel'",
  "from './DayItineraryView'": "from '../features/travel/DayItineraryView'",
  "from './MultiStopTripView'": "from '../features/travel/MultiStopTripView'",
  "from './CountryFlag'": "from '../components/ui/CountryFlag'"
});

replaceInFile('src/components/feedback/OfflineIndicator.tsx', {
  "from '../hooks/useOnlineStatus'": "from '../../hooks/useOnlineStatus'"
});

replaceInFile('src/components/layout/TopHeader.tsx', {
  "from './Logo'": "from '../ui/Logo'",
  "from './TopSearchBar'": "from '../../features/explore/TopSearchBar'"
});

replaceInFile('src/components/ui/PWAInstallButton.tsx', {
  "from '../hooks/usePWAInstall'": "from '../../hooks/usePWAInstall'"
});

replaceInFile('src/features/community/SocialTab.tsx', {
  "from './GoogleNomadMap'": "from '../explore/GoogleNomadMap'"
});

replaceInFile('src/features/dashboard/HomeDashboard.tsx', {
  "from './Logo'": "from '../../components/ui/Logo'",
  "from './CountryFlag'": "from '../../components/ui/CountryFlag'"
});

replaceInFile('src/features/explore/ExploreTab.tsx', {
  "from './CountryFlag'": "from '../../components/ui/CountryFlag'",
  "from './NearbyWorkSpots'": "from '../workspots/NearbyWorkSpots'"
});

replaceInFile('src/features/finance/FinanceTab.tsx', {
  "from './CountryFlag'": "from '../../components/ui/CountryFlag'",
  "from './TaxOptimizationHub'": "from '../tax/TaxOptimizationHub'"
});

replaceInFile('src/features/profile/ProfileTab.tsx', {
  "from './CountryFlag'": "from '../../components/ui/CountryFlag'"
});

replaceInFile('src/features/tax/TaxOptimizationHub.tsx', {
  "from './CountryFlag'": "from '../../components/ui/CountryFlag'"
});

replaceInFile('src/features/travel/MultiStopTripView.tsx', {
  "from './CountryFlag'": "from '../../components/ui/CountryFlag'"
});

replaceInFile('src/features/travel/TravelTab.tsx', {
  "from './CountryFlag'": "from '../../components/ui/CountryFlag'"
});

replaceInFile('src/features/workspots/NearbyWorkSpots.tsx', {
  "from './WorkSpotDetailModal'": "from '../../components/modals/WorkSpotDetailModal'"
});

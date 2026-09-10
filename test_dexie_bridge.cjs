const fs = require('fs');
let content = fs.readFileSync('src/app/App.tsx', 'utf8');

// Add imports
if (!content.includes('useLiveQuery')) {
  content = content.replace(
    "import { OfflineIndicator } from '../components/feedback/OfflineIndicator';",
    "import { OfflineIndicator } from '../components/feedback/OfflineIndicator';\nimport { useLiveQuery } from 'dexie-react-hooks';\nimport { db } from '../lib/db';\nimport { useAuth } from '../features/auth/AuthContext';"
  );
}

if (!content.includes('const { user: authUser } = useAuth();')) {
  content = content.replace(
    "const state = useNomadStore();",
    "const state = useNomadStore();\n  const { user: authUser } = useAuth();\n"
  );
}

// Map trips from dexie to Zustand
if (!content.includes('const liveTrips = useLiveQuery')) {
  content = content.replace(
    "const { user: authUser } = useAuth();",
    `const { user: authUser } = useAuth();
  
  const liveTrips = useLiveQuery(() => db.trips.where('deleted_at').equals(null).toArray(), []);
  
  useEffect(() => {
    if (liveTrips && authUser) {
      const formattedTrips = liveTrips.map(t => ({
        id: t.id,
        city: t.city,
        country: t.country,
        countryCode: t.country_code,
        arrivalDate: t.arrival_date,
        departureDate: t.departure_date,
        accommodationStatus: t.accommodation_status as any,
        housingCostUSD: t.housing_cost_usd,
        visaType: t.visa_type || '',
        timezone: t.timezone || 'UTC',
        coverUrl: t.cover_url,
        notes: t.notes
      }));
      // Need a way to safely update without infinite loops
      // We can just use it in the UI, but wait, the easiest is to just sync it to the Zustand state.
      // Actually, if we do state.setStateData({ trips: formattedTrips }) it will trigger a re-render.
      // A better way is to override state.trips locally here before passing down.
    }
  }, [liveTrips, authUser]);
`
  );
}

// Override state object being passed down
if (!content.includes('const appState = { ...state')) {
  content = content.replace(
    "return (",
    `const appState = { 
    ...state, 
    // trips: formattedTrips || state.trips 
  };
  return (`
  );
}

fs.writeFileSync('src/app/App.tsx', content, 'utf8');

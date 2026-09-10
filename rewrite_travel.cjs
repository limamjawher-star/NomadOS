const fs = require('fs');
let content = fs.readFileSync('src/features/travel/TravelTab.tsx', 'utf8');

if (!content.includes('import { TripValidationPanel }')) {
  content = content.replace(
    "import { CountryFlag } from '../../components/ui/CountryFlag';",
    "import { CountryFlag } from '../../components/ui/CountryFlag';\nimport { TripValidationPanel } from '../intelligence/components/TripValidationPanel';\nimport { validateTrip } from '../intelligence/rules/TripValidator';\nimport { buildIntelligenceProfile } from '../intelligence/engine/profileBuilder';"
  );
}

if (!content.includes('const profile = buildIntelligenceProfile')) {
  content = content.replace(
    "const [stayCountry, setStayCountry] = useState('Portugal');",
    `const [stayCountry, setStayCountry] = useState('Portugal');\n\n  // Intelligence Engine Hook\n  const profile = buildIntelligenceProfile(state as any);\n  const newTripCode = newCountry === 'Thailand' ? 'TH' : newCountry === 'Portugal' ? 'PT' : newCountry === 'Indonesia' ? 'ID' : newCountry === 'Mexico' ? 'MX' : 'FR';\n  const mockTrip = { id: 'temp', city: newCity, country: newCountry, countryCode: newTripCode, arrivalDate: newArrival, departureDate: newDeparture, accommodationStatus: newHousingStatus, housingCostUSD: newHousingCost, visaType: newVisaType };\n  const tripValidation = newCity && newArrival && newDeparture ? validateTrip(profile, mockTrip as any) : null;`
  );
}

if (!content.includes('<TripValidationPanel')) {
  content = content.replace(
    "{/* Buttons */}",
    `{tripValidation && <TripValidationPanel validation={tripValidation} />}\n            {/* Buttons */}`
  );
}

fs.writeFileSync('src/features/travel/TravelTab.tsx', content, 'utf8');

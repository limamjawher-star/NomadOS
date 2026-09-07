export interface SchengenStay {
  id: string;
  country: string;
  countryCode: string;
  entryDate: string; // YYYY-MM-DD
  exitDate: string;  // YYYY-MM-DD
  notes?: string;
}

export interface TaxPresence {
  id: string;
  country: string;
  countryCode: string;
  daysSpent: number;
  year: number;
  maxSafeDays: number; // usually 183 or custom (e.g. 60 for Cyprus, 90, 183)
  taxResidencyRisk: 'low' | 'moderate' | 'high' | 'exceeded';
  notes?: string;
}

export interface TripDestination {
  id: string;
  city: string;
  country: string;
  countryCode: string;
  arrivalDate: string;
  departureDate: string;
  accommodationStatus: 'Booked' | 'Searching' | 'Friends/Family' | 'Co-living';
  housingCostUSD: number;
  visaType: string;
  timezone: string;
  notes?: string;
}

export interface TeamTimezone {
  id: string;
  label: string;
  location: string;
  timezone: string;
  targetWorkingStart: number; // e.g. 9 for 09:00
  targetWorkingEnd: number;   // e.g. 17 for 17:00
}

export interface NomadExpense {
  id: string;
  date: string;
  description: string;
  category: 'Accommodation' | 'Flights & Transit' | 'Food & Groceries' | 'Coworking & Cafes' | 'Health & Visas' | 'Activities';
  amount: number;
  currency: string;
  amountUSD: number;
}

export interface NomadDocCheck {
  id: string;
  title: string;
  type: 'passport' | 'insurance' | 'visa' | 'driving_permit' | 'other';
  referenceNumber: string;
  expirationDate: string;
  notes: string;
}

export interface NomadState {
  nomadName: string;
  homeCountry: string;
  currentCity: string;
  currentCountry: string;
  currentCountryCode: string;
  schengenStays: SchengenStay[];
  taxPresences: TaxPresence[];
  trips: TripDestination[];
  teamTimezones: TeamTimezone[];
  expenses: NomadExpense[];
  monthlyBudgetUSD: number;
  documents: NomadDocCheck[];
}

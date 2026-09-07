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
  maxSafeDays: number;
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
  targetWorkingStart: number;
  targetWorkingEnd: number;
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

export interface NomadUser {
  id: string;
  name: string;
  tag: string;
  avatarUrl: string;
  nationality: string;
  nationalityCode: string;
  gender: 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say';
  profession: string;
  bio: string;
  rank: string;
  countriesVisited: string[];
  followersCount: number;
  followingCount: number;
  isPro: boolean;
  subscriptionPlan: 'free' | 'monthly' | 'yearly';
  profileCompletion: number;
}

export interface NomadCity {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  region: string;
  nomadScore: number;
  costPerMonthUSD: number;
  internetSpeedMbps: number;
  weather: string;
  weatherTempC: number;
  safetyScore: number;
  funScore: number;
  coworkingSpacesCount: number;
  highlights: string[];
  bestTag?: 'budget' | 'wifi' | 'coworking' | 'community';
}

export interface NomadEvent {
  id: string;
  title: string;
  city: string;
  country: string;
  date: string;
  time: string;
  location: string;
  attendeesCount: number;
  isAttending: boolean;
  hostName: string;
  hostAvatar: string;
  category: 'Coworking' | 'Coffee' | 'Drinks' | 'Outdoor' | 'Workshop';
}

export interface NearbyNomad {
  id: string;
  name: string;
  tag: string;
  profession: string;
  currentCity: string;
  nationality: string;
  avatarUrl: string;
  isOnline: boolean;
  bio: string;
}

export interface NomadState {
  user: NomadUser;
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
  events: NomadEvent[];
  nearbyNomads: NearbyNomad[];
  hasCompletedOnboarding: boolean;
}

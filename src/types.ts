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
  maxDaysAllowed?: number;
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
  coverUrl?: string;
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
  category: 'Accommodation' | 'Flights & Transit' | 'Food & Groceries' | 'Coworking & Cafes' | 'Health & Visas' | 'Tech & Subscriptions' | 'Gear & Equipment' | 'Wellness & Leisure' | 'Activities' | 'Taxes & Legal';
  amount: number;
  currency: string;
  amountUSD: number;
  isDeductible?: boolean;
  notes?: string;
  receiptUrl?: string;
}

export interface NomadIncomeStream {
  id: string;
  source: string;
  type: 'salary' | 'retainer' | 'freelance' | 'saas' | 'passive';
  monthlyAmountUSD: number;
  currency: string;
  originalAmount: number;
  clientCountry?: string;
  taxable: boolean;
  notes?: string;
}

export interface NomadFinancialGoal {
  id: string;
  title: string;
  targetUSD: number;
  currentUSD: number;
  deadline: string;
  category: 'emergency' | 'visa' | 'gear' | 'flights' | 'tax';
  imageUrl: string;
}

export interface NomadCostEstimate {
  city: string;
  country: string;
  flag: string;
  imageUrl: string;
  monthlyBurnUSD: number;
  rentUSD: number;
  coworkingUSD: number;
  foodUSD: number;
  visasUSD: number;
  leisureUSD: number;
  runwayMonths?: number;
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
  imageUrl?: string;
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
  coverUrl?: string;
}

export interface DayItineraryActivity {
  id: string;
  dayDate: string; // e.g. "2026-05-17"
  dayLabel: string; // e.g. "Sun, 17 May"
  time: string; // e.g. "09:00"
  timeRange: string; // e.g. "08:45 – 09:45"
  title: string; // e.g. "Car rental"
  category: 'transport' | 'activity' | 'culture' | 'food' | 'coworking' | 'sightseeing' | 'free';
  icon?: string;
  hasAttachment?: boolean;
  attachmentName?: string;
  attachmentCount?: number;
  locationName?: string;
  locationAddress?: string;
  isFreeTime?: boolean;
  notes?: string;
}

export interface MultiStopTrip {
  id: string;
  title: string;
  dateRange: string;
  status: 'Planning' | 'Active' | 'Completed';
  countriesCount: number;
  daysCount: number;
  totalBudgetEUR: number;
  stopsCount: number;
  countries: { name: string; code: string; flag: string }[];
  stops: {
    id: string;
    city: string;
    country: string;
    flag: string;
    visaName: string;
    durationDays: number;
    dates: string;
    coworking: string;
    budgetEUR: number;
    spentEUR: number;
  }[];
}

export interface SmartNotificationAlert {
  id: string;
  type: 'action' | 'warning' | 'info';
  title: string;
  message: string;
  category: 'visa' | 'schengen' | 'doc' | 'trip' | 'passport';
  tag: string;
  timestamp: string;
}

export interface NearbyNomad {
  id: string;
  name: string;
  tag: string;
  profession: string;
  currentCity: string;
  location?: string;
  nationality: string;
  avatarUrl: string;
  isOnline: boolean;
  bio: string;
}

export interface WorkSpotReview {
  id: string;
  author: string;
  avatarUrl: string;
  rating: number;
  wifiRating: number;
  noiseLevel: 'Quiet Focus' | 'Silent / Focus' | 'Moderate / Cafe Ambience' | 'Lively' | 'Zoom Friendly';
  comment: string;
  date: string;
  verifiedNomad?: boolean;
}

export interface WorkSpot {
  id: string;
  name: string;
  category: 'coworking' | 'cafe' | 'restaurant' | 'bar';
  city: string;
  country: string;
  lat: number;
  lng: number;
  address: string;
  distanceKm?: number;
  wifiSpeedMbps: number;
  wifiSpeedText: string;
  wifiReliability: 'Ultra Fast (150+ Mbps)' | 'Fast & Stable (80-150 Mbps)' | 'Good (40-80 Mbps)' | 'Basic';
  hasBackupPower: boolean;
  powerOutlets: 'Plentiful (Every Seat)' | 'Good (Most Tables)' | 'Limited' | 'Upon Request';
  noiseLevel: 'Silent / Focus' | 'Moderate / Cafe Ambience' | 'Bustling' | 'Call / Zoom Friendly' | 'Quiet Focus';
  seatingErgonomics: 'Ergonomic Mesh Chairs' | 'Cushioned Cafe Seating' | 'Lounge / Sofas' | 'Standing Desks';
  airConditioning: boolean;
  foodAndCoffee: string;
  openingHours: string;
  rating: number;
  reviewCount: number;
  priceLevel: '$' | '$$' | '$$$';
  dayPassUSD?: number;
  photoUrl: string;
  photos?: string[];
  reviews: WorkSpotReview[];
  tags: string[];

  // Detailed Coffee, Bar & Dining metadata
  coffeePriceUSD?: string;
  specialtyCoffee?: string;
  barAndDrinks?: string;
  popularDishes?: string[];
  dietaryOptions?: string[];
  atmosphere?: string;
  phone?: string;
  instagram?: string;
  website?: string;
  googleMapsUrl?: string;
  features?: {
    petFriendly?: boolean;
    outdoorSeating?: boolean;
    alcoholServed?: boolean;
    veganFriendly?: boolean;
    phoneBooths?: boolean;
    parking?: boolean;
    creditCardsAccepted?: boolean;
    takeawayAvailable?: boolean;
    roasteryOnSite?: boolean;
  };
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
  incomes: NomadIncomeStream[];
  savingsTotalUSD: number;
  taxBufferPercentage: number;
  financialGoals: NomadFinancialGoal[];
  documents: NomadDocCheck[];
  events: NomadEvent[];
  nearbyNomads: NearbyNomad[];
  hasCompletedOnboarding: boolean;
  dayActivities: DayItineraryActivity[];
  multiStopTrips: MultiStopTrip[];
  smartAlerts: SmartNotificationAlert[];
}

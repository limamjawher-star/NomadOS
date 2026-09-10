import { z } from 'zod';

// Utility schemas
export const DateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD");

// Data Confidence Metadata
export const DataConfidenceSchema = z.object({
  status: z.enum(['verified', 'estimate', 'community', 'demo']),
  source: z.string().optional(),
  lastVerified: z.string().optional(),
  notes: z.string().optional()
});

export type DataConfidence = z.infer<typeof DataConfidenceSchema>;

export const SchengenStaySchema = z.object({
  id: z.string(),
  country: z.string(),
  countryCode: z.string(),
  entryDate: DateStringSchema,
  exitDate: DateStringSchema,
  notes: z.string().optional(),
  confidence: DataConfidenceSchema.optional()
});

export const TaxPresenceSchema = z.object({
  id: z.string(),
  country: z.string(),
  countryCode: z.string(),
  daysSpent: z.number(),
  year: z.number(),
  maxSafeDays: z.number(),
  maxDaysAllowed: z.number().optional(),
  taxResidencyRisk: z.enum(['low', 'moderate', 'high', 'exceeded']),
  notes: z.string().optional(),
  confidence: DataConfidenceSchema.optional()
});

export const TripDestinationSchema = z.object({
  id: z.string(),
  city: z.string(),
  country: z.string(),
  countryCode: z.string(),
  arrivalDate: DateStringSchema,
  departureDate: DateStringSchema,
  accommodationStatus: z.enum(['Booked', 'Searching', 'Friends/Family', 'Co-living']),
  housingCostUSD: z.number(),
  visaType: z.string(),
  timezone: z.string(),
  coverUrl: z.string().optional(),
  notes: z.string().optional(),
});

export const NomadExpenseSchema = z.object({
  id: z.string(),
  date: DateStringSchema,
  description: z.string(),
  category: z.enum(['Accommodation', 'Flights & Transit', 'Food & Groceries', 'Coworking & Cafes', 'Health & Visas', 'Tech & Subscriptions', 'Gear & Equipment', 'Wellness & Leisure', 'Activities', 'Taxes & Legal']),
  amount: z.number(),
  currency: z.string(),
  amountUSD: z.number(),
  isDeductible: z.boolean().optional(),
  notes: z.string().optional(),
  receiptUrl: z.string().optional(),
});

export const NomadIncomeStreamSchema = z.object({
  id: z.string(),
  source: z.string(),
  type: z.enum(['salary', 'retainer', 'freelance', 'saas', 'passive']),
  monthlyAmountUSD: z.number(),
  currency: z.string(),
  originalAmount: z.number(),
  clientCountry: z.string().optional(),
  taxable: z.boolean(),
  notes: z.string().optional(),
});

export const NomadFinancialGoalSchema = z.object({
  id: z.string(),
  title: z.string(),
  targetUSD: z.number(),
  currentUSD: z.number(),
  deadline: DateStringSchema,
  category: z.enum(['emergency', 'visa', 'gear', 'flights', 'tax']),
  imageUrl: z.string(),
});

export type AlertPriority = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface IntelligenceAlert {
  id: string;
  type: 'schengen' | 'finance' | 'document' | 'tax' | 'itinerary' | 'work';
  priority: AlertPriority;
  title: string;
  message: string;
  action?: { label: string; actionId: string };
  relatedEntityId?: string;
}

export interface Recommendation {
  id: string;
  type: 'travel' | 'finance' | 'lifestyle';
  priority: AlertPriority;
  title: string;
  explanation: string;
  actionText?: string;
  actionId?: string;
  confidence: 'Verified' | 'High confidence' | 'Estimated' | 'Needs review';
  explainability: string[];
}

export interface NomadScore {
  total: number; // 0-100
  dimensions: {
    travel: number;
    finance: number;
    documents: number;
    work: number;
  };
  factors: string[];
}

export interface DailyBrief {
  greeting: string;
  summaryText: string;
  alerts: IntelligenceAlert[];
  topRecommendation?: Recommendation;
}

export interface TripValidationResult {
  status: 'SAFE' | 'WARNING' | 'CONFLICT';
  issues: IntelligenceAlert[];
}

export interface DestinationScore {
  score: number;
  factors: {
    label: string;
    isPositive: boolean;
  }[];
}

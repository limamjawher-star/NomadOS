import { NomadState } from '../../../types';
import { buildNomadAIContext } from '../engine/contextBuilder';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface AIAction {
  label: string;
  actionId: string;
}

export interface AIResponse {
  answer: string;
  recommendations: string[];
  warnings: string[];
  actions: AIAction[];
}

export interface RouteOptimizationConstraints {
  durationDays: number;
  budgetUSD: number;
  startDate?: string;
}

export interface RouteOptimizationPreferences {
  climate?: string;
  internetRequirement?: boolean;
  preferredRegions?: string[];
}

export interface RouteDestination {
  city: string;
  country: string;
  durationDays: number;
  estimatedCostUSD: number;
  reasoning: string;
}

export interface RouteResponse {
  validRouteFound: boolean;
  explanation: string;
  score: {
    overall: number;
    budgetFit: number;
    workFit: number;
    climate: number;
  };
  destinations: RouteDestination[];
}

export class AIProvider {
  static async chat(state: NomadState, message: string, history: ChatMessage[] = []): Promise<AIResponse> {
    const context = buildNomadAIContext(state);
    
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('nomados-auth-token')}`
      },
      body: JSON.stringify({
        context,
        message,
        history
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to chat with AI');
    }

    return response.json();
  }

  static async optimizeRoute(
    state: NomadState, 
    constraints: RouteOptimizationConstraints, 
    preferences: RouteOptimizationPreferences
  ): Promise<RouteResponse> {
    const context = buildNomadAIContext(state);
    
    const response = await fetch('/api/ai/optimize-route', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('nomados-auth-token')}`
      },
      body: JSON.stringify({
        context,
        constraints,
        preferences
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to optimize route');
    }

    return response.json();
  }
}

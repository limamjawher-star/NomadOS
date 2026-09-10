export interface ExchangeRate {
  baseCurrency: string;
  quoteCurrency: string;
  rate: number;
  timestamp: string;
  provider: string;
  isVerified: boolean;
}

const mockRates: Record<string, number> = {
  'EUR_USD': 1.08,
  'GBP_USD': 1.25,
  'IDR_USD': 0.000065,
  'THB_USD': 0.028,
};

export class CurrencyService {
  static async getLatestRates(base: string, quote: string): Promise<ExchangeRate> {
    const key = `${base}_${quote}`;
    const rate = mockRates[key] || 1.0; 
    
    return {
      baseCurrency: base,
      quoteCurrency: quote,
      rate,
      timestamp: new Date().toISOString(),
      provider: 'Estimated fallback (API needed)',
      isVerified: false
    };
  }

  static convertCurrency(amount: number, rate: number): number {
    return amount * rate;
  }

  static async getHistoricalRate(base: string, quote: string, date: string): Promise<ExchangeRate> {
    // Returns estimated mock data for now
    return {
      baseCurrency: base,
      quoteCurrency: quote,
      rate: (mockRates[`${base}_${quote}`] || 1.0) * 0.98, // simulate slight difference
      timestamp: date,
      provider: 'Estimated historical fallback (API needed)',
      isVerified: false
    };
  }
}

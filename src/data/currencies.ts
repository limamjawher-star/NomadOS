export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  region: 'Major' | 'Asia & Pacific' | 'Europe' | 'Americas' | 'Middle East & Africa';
  hub?: string; // Top nomad hub hint
  ratePerUSD: number; // Units of currency per 1 USD
  rateInUSD: number;  // USD per 1 unit of currency (1 / ratePerUSD)
}

export const NOMAD_CURRENCIES: CurrencyInfo[] = [
  // Major Global Currencies
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', region: 'Major', hub: 'Global Reserve', ratePerUSD: 1.0, rateInUSD: 1.0 },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', region: 'Major', hub: 'Eurozone (Portugal, Spain, Germany)', ratePerUSD: 0.92, rateInUSD: 1.087 },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', region: 'Major', hub: 'United Kingdom', ratePerUSD: 0.78, rateInUSD: 1.282 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦', region: 'Major', hub: 'Canada', ratePerUSD: 1.36, rateInUSD: 0.735 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', region: 'Major', hub: 'Australia', ratePerUSD: 1.52, rateInUSD: 0.658 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', region: 'Major', hub: 'Japan (Tokyo, Kyoto, Fukuoka)', ratePerUSD: 152.0, rateInUSD: 0.00658 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭', region: 'Major', hub: 'Switzerland', ratePerUSD: 0.88, rateInUSD: 1.136 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', region: 'Major', hub: 'Singapore', ratePerUSD: 1.33, rateInUSD: 0.752 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿', region: 'Major', hub: 'New Zealand', ratePerUSD: 1.64, rateInUSD: 0.61 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰', region: 'Major', hub: 'Hong Kong', ratePerUSD: 7.78, rateInUSD: 0.1285 },

  // Asia & Pacific Nomad Hotspots
  { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭', region: 'Asia & Pacific', hub: 'Thailand (Chiang Mai, Bangkok, Phuket)', ratePerUSD: 35.5, rateInUSD: 0.0282 },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩', region: 'Asia & Pacific', hub: 'Indonesia (Bali, Canggu, Ubud)', ratePerUSD: 16100, rateInUSD: 0.0000621 },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳', region: 'Asia & Pacific', hub: 'Vietnam (Da Nang, Saigon, Hanoi)', ratePerUSD: 25200, rateInUSD: 0.0000397 },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾', region: 'Asia & Pacific', hub: 'Malaysia (Kuala Lumpur, Penang)', ratePerUSD: 4.45, rateInUSD: 0.225 },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭', region: 'Asia & Pacific', hub: 'Philippines (Siargao, Manila, Cebu)', ratePerUSD: 58.0, rateInUSD: 0.0172 },
  { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$', flag: '🇹🇼', region: 'Asia & Pacific', hub: 'Taiwan (Taipei, Kaohsiung)', ratePerUSD: 32.2, rateInUSD: 0.031 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷', region: 'Asia & Pacific', hub: 'South Korea (Seoul, Jeju)', ratePerUSD: 1380, rateInUSD: 0.000725 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', region: 'Asia & Pacific', hub: 'India (Goa, Bengaluru)', ratePerUSD: 85.5, rateInUSD: 0.0117 },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs', flag: '🇱🇰', region: 'Asia & Pacific', hub: 'Sri Lanka (Ahangama, Colombo)', ratePerUSD: 298, rateInUSD: 0.00335 },

  // Europe Nomad Hotspots
  { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв', flag: '🇧🇬', region: 'Europe', hub: 'Bulgaria (Bansko, Sofia)', ratePerUSD: 1.80, rateInUSD: 0.556 },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱', region: 'Europe', hub: 'Poland (Warsaw, Krakow)', ratePerUSD: 3.95, rateInUSD: 0.253 },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿', region: 'Europe', hub: 'Czech Republic (Prague, Brno)', ratePerUSD: 23.2, rateInUSD: 0.0431 },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', flag: '🇭🇺', region: 'Europe', hub: 'Hungary (Budapest)', ratePerUSD: 368, rateInUSD: 0.00272 },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei', flag: '🇷🇴', region: 'Europe', hub: 'Romania (Bucharest, Cluj)', ratePerUSD: 4.58, rateInUSD: 0.218 },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷', region: 'Europe', hub: 'Turkey (Istanbul, Antalya, Kas)', ratePerUSD: 34.5, rateInUSD: 0.029 },
  { code: 'GEL', name: 'Georgian Lari', symbol: '₾', flag: '🇬🇪', region: 'Europe', hub: 'Georgia (Tbilisi, Batumi)', ratePerUSD: 2.75, rateInUSD: 0.364 },
  { code: 'RSD', name: 'Serbian Dinar', symbol: 'din', flag: '🇷🇸', region: 'Europe', hub: 'Serbia (Belgrade, Novi Sad)', ratePerUSD: 108, rateInUSD: 0.00926 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪', region: 'Europe', hub: 'Sweden (Stockholm)', ratePerUSD: 10.4, rateInUSD: 0.096 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴', region: 'Europe', hub: 'Norway (Oslo, Bergen)', ratePerUSD: 10.7, rateInUSD: 0.093 },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰', region: 'Europe', hub: 'Denmark (Copenhagen)', ratePerUSD: 6.85, rateInUSD: 0.146 },
  { code: 'ALL', name: 'Albanian Lek', symbol: 'L', flag: '🇦🇱', region: 'Europe', hub: 'Albania (Tirana, Saranda)', ratePerUSD: 91.5, rateInUSD: 0.0109 },
  { code: 'ISK', name: 'Icelandic Króna', symbol: 'kr', flag: '🇮🇸', region: 'Europe', hub: 'Iceland (Reykjavik)', ratePerUSD: 137, rateInUSD: 0.0073 },

  // Americas Nomad Hotspots
  { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$', flag: '🇲🇽', region: 'Americas', hub: 'Mexico (CDMX, Oaxaca, Playa del Carmen)', ratePerUSD: 18.5, rateInUSD: 0.054 },
  { code: 'COP', name: 'Colombian Peso', symbol: 'COL$', flag: '🇨🇴', region: 'Americas', hub: 'Colombia (Medellín, Bogotá, Cartagena)', ratePerUSD: 4150, rateInUSD: 0.000241 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷', region: 'Americas', hub: 'Brazil (Florianópolis, Rio, São Paulo)', ratePerUSD: 5.45, rateInUSD: 0.183 },
  { code: 'ARS', name: 'Argentine Peso', symbol: 'ARS$', flag: '🇦🇷', region: 'Americas', hub: 'Argentina (Buenos Aires, Bariloche)', ratePerUSD: 980, rateInUSD: 0.00102 },
  { code: 'CLP', name: 'Chilean Peso', symbol: 'CLP$', flag: '🇨🇱', region: 'Americas', hub: 'Chile (Santiago, Valparaíso)', ratePerUSD: 940, rateInUSD: 0.00106 },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/.', flag: '🇵🇪', region: 'Americas', hub: 'Peru (Lima, Cusco, Arequipa)', ratePerUSD: 3.75, rateInUSD: 0.267 },
  { code: 'CRC', name: 'Costa Rican Colón', symbol: '₡', flag: '🇨🇷', region: 'Americas', hub: 'Costa Rica (Santa Teresa, San José)', ratePerUSD: 518, rateInUSD: 0.00193 },
  { code: 'UYU', name: 'Uruguayan Peso', symbol: '$U', flag: '🇺🇾', region: 'Americas', hub: 'Uruguay (Montevideo, Punta del Este)', ratePerUSD: 41.5, rateInUSD: 0.0241 },
  { code: 'DOP', name: 'Dominican Peso', symbol: 'RD$', flag: '🇩🇴', region: 'Americas', hub: 'Dominican Republic (Cabarete, Las Terrenas)', ratePerUSD: 59.5, rateInUSD: 0.0168 },

  // Middle East & Africa Nomad Hotspots
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪', region: 'Middle East & Africa', hub: 'United Arab Emirates (Dubai, Abu Dhabi)', ratePerUSD: 3.67, rateInUSD: 0.272 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦', region: 'Middle East & Africa', hub: 'South Africa (Cape Town, Johannesburg)', ratePerUSD: 18.2, rateInUSD: 0.0549 },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'MAD', flag: '🇲🇦', region: 'Middle East & Africa', hub: 'Morocco (Taghazout, Marrakech, Essaouira)', ratePerUSD: 9.85, rateInUSD: 0.1015 },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', flag: '🇪🇬', region: 'Middle East & Africa', hub: 'Egypt (Dahab, Cairo, Alexandria)', ratePerUSD: 48.5, rateInUSD: 0.0206 },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪', region: 'Middle East & Africa', hub: 'Kenya (Nairobi, Diani Beach)', ratePerUSD: 129, rateInUSD: 0.00775 },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', flag: '🇮🇱', region: 'Middle East & Africa', hub: 'Israel (Tel Aviv)', ratePerUSD: 3.70, rateInUSD: 0.270 }
];

export const CURRENCY_MAP: Record<string, CurrencyInfo> = NOMAD_CURRENCIES.reduce(
  (acc, c) => {
    acc[c.code] = c;
    return acc;
  },
  {} as Record<string, CurrencyInfo>
);

export const CURRENCY_REGIONS = [
  'Major',
  'Asia & Pacific',
  'Europe',
  'Americas',
  'Middle East & Africa',
] as const;

export function getCurrency(code: string): CurrencyInfo {
  return (
    CURRENCY_MAP[code.toUpperCase()] || {
      code: code.toUpperCase(),
      name: code.toUpperCase(),
      symbol: code.toUpperCase(),
      flag: '🌐',
      region: 'Major',
      ratePerUSD: 1.0,
      rateInUSD: 1.0,
    }
  );
}

export function convertCurrency(
  amount: number,
  fromCode: string,
  toCode: string
): number {
  if (!amount || isNaN(amount)) return 0;
  if (fromCode === toCode) return amount;

  const fromCurr = getCurrency(fromCode);
  const toCurr = getCurrency(toCode);

  // Convert from 'from' to USD, then from USD to 'to'
  // amount in USD = amount * fromCurr.rateInUSD
  // amount in target = (amount in USD) * toCurr.ratePerUSD
  const amountUSD = amount * fromCurr.rateInUSD;
  return amountUSD * toCurr.ratePerUSD;
}

export function formatConvertedAmount(
  amount: number,
  currencyCode: string
): string {
  const curr = getCurrency(currencyCode);
  
  // Choose decimal digits based on magnitude
  let decimals = 2;
  if (amount >= 1000) {
    decimals = 0;
  } else if (curr.ratePerUSD > 500) {
    // Large nominal currencies like IDR, VND, KRW, CLP, COP
    decimals = 0;
  } else if (amount < 1 && amount > 0) {
    decimals = 4;
  }

  const formattedNum = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  return `${curr.symbol} ${formattedNum}`;
}

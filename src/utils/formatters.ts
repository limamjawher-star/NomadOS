import { parseISO, differenceInDays } from 'date-fns';

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function getDaysUntil(dateStr: string): number {
  try {
    const target = parseISO(dateStr);
    return differenceInDays(target, new Date());
  } catch {
    return 0;
  }
}

export const COUNTRY_FLAG_MAP: Record<string, string> = {
  US: '🇺🇸',
  PT: '🇵🇹',
  ES: '🇪🇸',
  FR: '🇫🇷',
  DE: '🇩🇪',
  IT: '🇮🇹',
  BG: '🇧🇬',
  TH: '🇹🇭',
  ID: '🇮🇩',
  GB: '🇬🇧',
  GR: '🇬🇷',
  HR: '🇭🇷',
  NL: '🇳🇱',
  JP: '🇯🇵',
  VN: '🇻🇳',
  MX: '🇲🇽',
  BR: '🇧🇷',
  CA: '🇨🇦',
  AU: '🇦🇺',
  GE: '🇬🇪',
  ME: '🇲🇪',
  AL: '🇦🇱',
  CY: '🇨🇾',
};

export function getCountryFlag(code: string): string {
  return COUNTRY_FLAG_MAP[code.toUpperCase()] || '🌍';
}

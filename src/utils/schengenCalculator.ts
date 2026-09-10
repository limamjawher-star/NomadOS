import {
  parseISO,
  isWithinInterval,
  subDays,
  addDays,
  format,
  eachDayOfInterval,
  isBefore,
  isAfter,
  isValid,
  compareAsc
} from 'date-fns';

export interface SchengenStayBase {
  entryDate: string; // YYYY-MM-DD
  exitDate: string;  // YYYY-MM-DD
}

export interface SchengenCalculationResult {
  referenceDate: string;
  windowStart: string;
  daysUsedInWindow: number;
  daysRemainingInWindow: number;
  isOverstay: boolean;
  maxContinuousFutureDays: number;
  latestExitDate: string;
  dayByDayInWindow: {
    date: string;
    isSchengenDay: boolean;
    rollingCount: number;
  }[];
}

/**
 * Normalizes dates and checks for valid interval
 */
function isValidStay(stay: SchengenStayBase): boolean {
  const start = parseISO(stay.entryDate);
  const end = parseISO(stay.exitDate);
  if (!isValid(start) || !isValid(end)) return false;
  return compareAsc(start, end) <= 0;
}

/**
 * Returns true if a given date string (YYYY-MM-DD) falls within any of the stays (inclusive)
 */
export function isDateInStays(dateStr: string, stays: SchengenStayBase[]): boolean {
  const target = parseISO(dateStr);
  if (!isValid(target)) return false;
  
  return stays.filter(isValidStay).some((stay) => {
    try {
      const start = parseISO(stay.entryDate);
      const end = parseISO(stay.exitDate);
      return isWithinInterval(target, { start, end });
    } catch {
      return false;
    }
  });
}

/**
 * Calculate the Schengen 90/180 status for a given reference date
 */
export function calculateSchengen(
  stays: SchengenStayBase[],
  refDateInput?: Date | string
): SchengenCalculationResult {
  const refDate = typeof refDateInput === 'string'
    ? parseISO(refDateInput)
    : (refDateInput || new Date());
  
  const formattedRefDate = format(refDate, 'yyyy-MM-dd');
  const windowStartDate = subDays(refDate, 179); // 180 days total including refDate
  const formattedWindowStart = format(windowStartDate, 'yyyy-MM-dd');

  // Days in 180-day window
  const windowDays = eachDayOfInterval({ start: windowStartDate, end: refDate });

  let daysUsedInWindow = 0;
  const dayByDayInWindow = windowDays.map((day) => {
    const dStr = format(day, 'yyyy-MM-dd');
    const isSchengen = isDateInStays(dStr, stays);
    if (isSchengen) {
      daysUsedInWindow += 1;
    }
    return {
      date: dStr,
      isSchengenDay: isSchengen,
      rollingCount: daysUsedInWindow,
    };
  });

  const daysRemainingInWindow = Math.max(0, 90 - daysUsedInWindow);
  const isOverstay = daysUsedInWindow > 90;

  // Simulate how many continuous future days from refDate user can stay
  let futureContinuousDays = 0;
  let testDate = refDate;
  
  for (let i = 0; i < 90; i++) {
    const candidateDate = addDays(refDate, i);
    const candidateWindowStart = subDays(candidateDate, 179);
    
    // We only need to check the window ending at candidateDate
    const daysInCandidateWindow = eachDayOfInterval({
      start: candidateWindowStart,
      end: candidateDate,
    });

    let countForThisWindow = 0;
    for (const d of daysInCandidateWindow) {
      const dStr = format(d, 'yyyy-MM-dd');
      const inSimulated = isBefore(d, refDate)
        ? isDateInStays(dStr, stays)
        : !isAfter(d, candidateDate); // assume continuous stay from refDate to candidateDate
      
      if (inSimulated) countForThisWindow++;
    }

    if (countForThisWindow <= 90) {
      futureContinuousDays = i + (isDateInStays(format(refDate, 'yyyy-MM-dd'), stays) ? 0 : 1);
      testDate = candidateDate;
    } else {
      break;
    }
  }

  const latestExitDate = format(testDate, 'yyyy-MM-dd');

  return {
    referenceDate: formattedRefDate,
    windowStart: formattedWindowStart,
    daysUsedInWindow,
    daysRemainingInWindow,
    isOverstay,
    maxContinuousFutureDays: futureContinuousDays,
    latestExitDate,
    dayByDayInWindow,
  };
}

export const SCHENGEN_COUNTRIES = [
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷' },
  { code: 'CZ', name: 'Czechia', flag: '🇨🇿' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺' },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻' },
  { code: 'LI', name: 'Liechtenstein', flag: '🇱🇮' },
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴' },
  { code: 'SK', name: 'Slovakia', flag: '🇸🇰' },
  { code: 'SI', name: 'Slovenia', flag: '🇸🇮' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
];

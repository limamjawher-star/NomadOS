import { differenceInDays, parseISO, isValid, compareAsc } from 'date-fns';
import { TripDestination } from '../types';

export function calculateTripDuration(arrivalDate: string, departureDate: string): number {
  const arrival = parseISO(arrivalDate);
  const departure = parseISO(departureDate);
  
  if (!isValid(arrival) || !isValid(departure)) return 0;
  if (compareAsc(arrival, departure) > 0) return 0; // Prevent impossible dates

  return differenceInDays(departure, arrival);
}

export function calculateProjectedTripCost(trip: TripDestination, dailyLivingCostUSD: number): number {
  const duration = calculateTripDuration(trip.arrivalDate, trip.departureDate);
  if (duration <= 0) return 0;
  
  // Basic calculation: Housing + (Daily living * days)
  return trip.housingCostUSD + (dailyLivingCostUSD * duration);
}

export function validateTripDates(arrivalDate: string, departureDate: string): boolean {
  const arrival = parseISO(arrivalDate);
  const departure = parseISO(departureDate);
  if (!isValid(arrival) || !isValid(departure)) return false;
  return compareAsc(arrival, departure) <= 0;
}

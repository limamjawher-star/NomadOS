import { db, LocalTrip } from '../lib/db';
import { v4 as uuidv4 } from 'uuid';
import { TripDestination } from '../types';

export class TripsService {
  static async getTrips(userId: string): Promise<TripDestination[]> {
    const records = await db.trips
      .where('user_id')
      .equals(userId)
      .and(trip => trip.deleted_at === null)
      .toArray();

    return records.map(r => ({
      id: r.id,
      city: r.city,
      country: r.country,
      countryCode: r.country_code,
      arrivalDate: r.arrival_date,
      departureDate: r.departure_date,
      accommodationStatus: r.accommodation_status as any,
      housingCostUSD: r.housing_cost_usd,
      visaType: r.visa_type || '',
      timezone: r.timezone || 'UTC',
      coverUrl: r.cover_url,
      notes: r.notes
    }));
  }

  static async addTrip(userId: string, trip: TripDestination): Promise<void> {
    const newRecord: LocalTrip = {
      id: trip.id || uuidv4(),
      user_id: userId,
      city: trip.city,
      country: trip.country,
      country_code: trip.countryCode,
      arrival_date: trip.arrivalDate,
      departure_date: trip.departureDate,
      accommodation_status: trip.accommodationStatus,
      housing_cost_usd: trip.housingCostUSD,
      visa_type: trip.visaType,
      timezone: trip.timezone,
      cover_url: trip.coverUrl,
      notes: trip.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
      sync_status: 'pending_insert'
    };

    await db.trips.put(newRecord);
  }

  static async deleteTrip(id: string): Promise<void> {
    const record = await db.trips.get(id);
    if (record) {
      if (record.sync_status === 'pending_insert') {
        // Was never sent to server
        await db.trips.delete(id);
      } else {
        await db.trips.update(id, {
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          sync_status: 'pending_delete'
        });
      }
    }
  }
}

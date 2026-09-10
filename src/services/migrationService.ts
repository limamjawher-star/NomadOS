import { supabase } from '../lib/supabase';
import { db } from '../lib/db';
import { SyncService } from './syncService';
import { v4 as uuidv4 } from 'uuid';

export class MigrationService {
  static async checkAndMigrate(userId: string) {
    const rawLocalData = localStorage.getItem('nomados_state_v3');
    if (!rawLocalData) return;

    try {
      const parsed = JSON.parse(rawLocalData);
      const state = parsed.state;
      
      // Check if already migrated
      if (state.hasMigratedToCloud) return;

      console.log('Migrating local data to Supabase/Dexie...');

      // 1. Migrate Profile
      if (state.user) {
        await db.profiles.put({
          id: userId,
          user_id: userId,
          email: state.user.email || '',
          first_name: state.user.name || '',
          home_currency: 'USD',
          timezone: 'UTC',
          sync_status: 'pending_update',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          deleted_at: null,
        });
      }

      // 2. Migrate Trips
      if (Array.isArray(state.trips)) {
        for (const trip of state.trips) {
          await db.trips.put({
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
            sync_status: 'pending_insert',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted_at: null,
          });
        }
      }

      // 3. Migrate Expenses
      if (Array.isArray(state.expenses)) {
        for (const exp of state.expenses) {
          await db.expenses.put({
            id: exp.id || uuidv4(),
            user_id: userId,
            date: exp.date,
            description: exp.description,
            category: exp.category,
            amount: exp.amount,
            currency: exp.currency,
            amount_usd: exp.amountUSD,
            is_deductible: exp.isDeductible || false,
            notes: exp.notes,
            receipt_url: exp.receiptUrl,
            sync_status: 'pending_insert',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted_at: null,
          });
        }
      }
      
      // Do the same for others...

      // 4. Force a sync
      await SyncService.syncAll(userId);

      // 5. Mark local storage as migrated so we don't do it again
      state.hasMigratedToCloud = true;
      localStorage.setItem('nomados_state_v3', JSON.stringify({ state, version: parsed.version }));

      console.log('Migration successful!');
    } catch (err) {
      console.error('Migration failed:', err);
    }
  }
}

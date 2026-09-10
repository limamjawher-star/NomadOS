import Dexie, { Table } from 'dexie';

export interface SyncRecord {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  sync_status: 'synced' | 'pending_insert' | 'pending_update' | 'pending_delete';
}

export interface LocalProfile extends SyncRecord {
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  home_currency: string;
  timezone: string;
}

export interface LocalTrip extends SyncRecord {
  city: string;
  country: string;
  country_code: string;
  arrival_date: string;
  departure_date: string;
  accommodation_status: string;
  housing_cost_usd: number;
  visa_type?: string;
  timezone?: string;
  cover_url?: string;
  notes?: string;
}

export interface LocalSchengenStay extends SyncRecord {
  country: string;
  country_code: string;
  entry_date: string;
  exit_date: string;
  notes?: string;
}

export interface LocalExpense extends SyncRecord {
  date: string;
  description: string;
  category: string;
  amount: number;
  currency: string;
  amount_usd: number;
  is_deductible: boolean;
  notes?: string;
  receipt_url?: string;
}

export interface LocalIncome extends SyncRecord {
  source: string;
  type: string;
  monthly_amount_usd: number;
  currency: string;
  original_amount: number;
  client_country?: string;
  taxable: boolean;
  notes?: string;
}

export interface LocalGoal extends SyncRecord {
  title: string;
  target_usd: number;
  current_usd: number;
  deadline: string;
  category: string;
  image_url?: string;
}

export interface LocalTaxPresence extends SyncRecord {
  country: string;
  country_code: string;
  days_spent: number;
  year: number;
  max_safe_days: number;
  max_days_allowed?: number;
  tax_residency_risk: string;
  notes?: string;
}

export class NomadDatabase extends Dexie {
  profiles!: Table<LocalProfile, string>;
  trips!: Table<LocalTrip, string>;
  schengenStays!: Table<LocalSchengenStay, string>;
  expenses!: Table<LocalExpense, string>;
  income!: Table<LocalIncome, string>;
  goals!: Table<LocalGoal, string>;
  taxPresence!: Table<LocalTaxPresence, string>;

  constructor() {
    super('NomadOS_DB');
    this.version(1).stores({
      profiles: 'id, user_id, sync_status, updated_at',
      trips: 'id, user_id, sync_status, arrival_date, updated_at',
      schengenStays: 'id, user_id, sync_status, entry_date, updated_at',
      expenses: 'id, user_id, sync_status, date, category, updated_at',
      income: 'id, user_id, sync_status, updated_at',
      goals: 'id, user_id, sync_status, updated_at',
      taxPresence: 'id, user_id, sync_status, year, country_code, updated_at'
    });
  }
}

export const db = new NomadDatabase();

import { db } from '../lib/db';
import { v4 as uuidv4 } from 'uuid';
import { TripDestination, NomadExpense, SchengenStay, NomadIncomeStream, NomadFinancialGoal, TaxPresence } from '../types';

export class AppServices {
  // TRIPS
  static async addTrip(userId: string, trip: TripDestination) {
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
      deleted_at: null
    });
  }

  static async deleteTrip(id: string) {
    await db.trips.update(id, { deleted_at: new Date().toISOString(), sync_status: 'pending_delete' });
  }

  // EXPENSES
  static async addExpense(userId: string, exp: NomadExpense) {
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
      deleted_at: null
    });
  }

  static async deleteExpense(id: string) {
    await db.expenses.update(id, { deleted_at: new Date().toISOString(), sync_status: 'pending_delete' });
  }

  // SCHENGEN
  static async addSchengenStay(userId: string, stay: SchengenStay) {
    await db.schengenStays.put({
      id: stay.id || uuidv4(),
      user_id: userId,
      country: stay.country,
      country_code: stay.countryCode,
      entry_date: stay.entryDate,
      exit_date: stay.exitDate,
      notes: stay.notes,
      sync_status: 'pending_insert',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null
    });
  }

  static async deleteSchengenStay(id: string) {
    await db.schengenStays.update(id, { deleted_at: new Date().toISOString(), sync_status: 'pending_delete' });
  }

  // INCOMES
  static async addIncome(userId: string, inc: NomadIncomeStream) {
    await db.income.put({
      id: inc.id || uuidv4(),
      user_id: userId,
      source: inc.source,
      type: inc.type,
      monthly_amount_usd: inc.monthlyAmountUSD,
      currency: inc.currency,
      original_amount: inc.originalAmount,
      client_country: inc.clientCountry,
      taxable: inc.taxable,
      notes: inc.notes,
      sync_status: 'pending_insert',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null
    });
  }

  static async deleteIncome(id: string) {
    await db.income.update(id, { deleted_at: new Date().toISOString(), sync_status: 'pending_delete' });
  }

  // TAX PRESENCE
  static async updateTaxPresence(userId: string, tp: TaxPresence) {
     const existing = await db.taxPresence.get(tp.id);
     if (existing) {
         await db.taxPresence.update(tp.id, {
             days_spent: tp.daysSpent,
             tax_residency_risk: tp.taxResidencyRisk,
             updated_at: new Date().toISOString(),
             sync_status: 'pending_update'
         });
     } else {
         await db.taxPresence.put({
            id: tp.id || uuidv4(),
            user_id: userId,
            country: tp.country,
            country_code: tp.countryCode,
            days_spent: tp.daysSpent,
            year: tp.year,
            max_safe_days: tp.maxSafeDays,
            max_days_allowed: tp.maxDaysAllowed,
            tax_residency_risk: tp.taxResidencyRisk,
            notes: tp.notes,
            sync_status: 'pending_insert',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted_at: null
         });
     }
  }

  // GOALS
  static async addGoal(userId: string, goal: NomadFinancialGoal) {
     await db.goals.put({
        id: goal.id || uuidv4(),
        user_id: userId,
        title: goal.title,
        target_usd: goal.targetUSD,
        current_usd: goal.currentUSD,
        deadline: goal.deadline,
        category: goal.category,
        image_url: goal.imageUrl,
        sync_status: 'pending_insert',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null
     });
  }

  static async updateGoal(id: string, newAmount: number) {
     await db.goals.update(id, {
         current_usd: newAmount,
         updated_at: new Date().toISOString(),
         sync_status: 'pending_update'
     });
  }
}

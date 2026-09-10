import { db, SyncRecord } from '../lib/db';
import { supabase } from '../lib/supabase';

// Helper to push local changes to Supabase
async function pushTableChanges(tableName: string, localTable: any, userId: string) {
  // 1. Get all pending inserts
  const inserts = await localTable.where('sync_status').equals('pending_insert').toArray();
  for (const item of inserts) {
    const { sync_status, ...rest } = item;
    const { error } = await supabase.from(tableName).insert(rest);
    if (!error) {
      await localTable.update(item.id, { sync_status: 'synced' });
    }
  }

  // 2. Get all pending updates
  const updates = await localTable.where('sync_status').equals('pending_update').toArray();
  for (const item of updates) {
    const { sync_status, ...rest } = item;
    const { error } = await supabase.from(tableName).update(rest).eq('id', item.id);
    if (!error) {
      await localTable.update(item.id, { sync_status: 'synced' });
    }
  }

  // 3. Get all pending deletes
  const deletes = await localTable.where('sync_status').equals('pending_delete').toArray();
  for (const item of deletes) {
    // Soft delete in Supabase
    const { error } = await supabase.from(tableName).update({ deleted_at: new Date().toISOString() }).eq('id', item.id);
    if (!error) {
      await localTable.delete(item.id);
    }
  }
}

// Helper to pull remote changes from Supabase
async function pullTableChanges(tableName: string, localTable: any, userId: string) {
  // We should ideally track the last sync timestamp, but for now we pull all active records for the user
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('user_id', userId);

  if (error || !data) return;

  // Process incoming data
  for (const remoteItem of data) {
    const localItem = await localTable.get(remoteItem.id);
    if (!localItem) {
      // It's new from server (or we cleared local DB)
      if (!remoteItem.deleted_at) {
        await localTable.put({ ...remoteItem, sync_status: 'synced' });
      }
    } else {
      // Conflict resolution based on updated_at
      const localDate = new Date(localItem.updated_at).getTime();
      const remoteDate = new Date(remoteItem.updated_at).getTime();

      if (remoteItem.deleted_at) {
        // Deleted on server
        await localTable.delete(localItem.id);
      } else if (remoteDate > localDate && localItem.sync_status === 'synced') {
        // Server is newer and we have no pending changes
        await localTable.put({ ...remoteItem, sync_status: 'synced' });
      }
    }
  }
}

export class SyncService {
  static async syncAll(userId: string) {
    if (!navigator.onLine) return; // Only sync if online

    const tables = [
      { name: 'profiles', local: db.profiles },
      { name: 'trips', local: db.trips },
      { name: 'schengen_stays', local: db.schengenStays },
      { name: 'expenses', local: db.expenses },
      { name: 'income_streams', local: db.income },
      { name: 'financial_goals', local: db.goals },
      { name: 'tax_presence', local: db.taxPresence },
    ];

    for (const table of tables) {
      try {
        await pushTableChanges(table.name, table.local, userId);
        await pullTableChanges(table.name, table.local, userId);
      } catch (err) {
        console.error(`Error syncing table ${table.name}`, err);
      }
    }
  }
}

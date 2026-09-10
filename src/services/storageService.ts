import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export class StorageService {
  /**
   * Upload a file to the secure receipts bucket
   * @param file The File object from an input
   * @param userId The authenticated user ID
   * @returns The path of the uploaded file
   */
  static async uploadReceipt(file: File, userId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${uuidv4()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('receipts')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) {
      throw error;
    }
    
    return data.path;
  }

  /**
   * Upload a file to the secure documents bucket
   * @param file The File object from an input
   * @param userId The authenticated user ID
   * @returns The path of the uploaded file
   */
  static async uploadDocument(file: File, userId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${uuidv4()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) {
      throw error;
    }
    
    return data.path;
  }

  /**
   * Get a temporary signed URL to view a private file
   */
  static async getSignedUrl(bucket: 'receipts' | 'documents', path: string, expiresIn = 60): Promise<string> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);
      
    if (error) {
      throw error;
    }
    
    return data.signedUrl;
  }
}

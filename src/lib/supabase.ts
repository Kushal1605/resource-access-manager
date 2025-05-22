
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Replace these with your actual Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  try {
    return supabase && 
      typeof supabase.from === 'function' && 
      supabaseUrl !== 'https://your-project-url.supabase.co' && 
      supabaseAnonKey !== 'your-anon-key';
  } catch (error) {
    console.error('Error checking Supabase configuration:', error);
    return false;
  }
};

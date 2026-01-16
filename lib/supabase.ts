import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rtbyopvyxyvomqloewmd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0YnlvcHZ5eHl2b21xbG9ld21kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4OTI3ODEsImV4cCI6MjA4MzQ2ODc4MX0.ZqWc4go-4tDWyCmW8ixumIPRd5ktpxeyKZ2Int9rXLk';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

try {
  if (supabaseUrl && supabaseAnonKey && supabaseUrl.includes('supabase.co') && supabaseAnonKey.length > 10) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      db: {
        schema: 'public',
      },
    });
    
    console.log('✅ Supabase client initialized successfully');
    console.log('📡 Supabase URL:', supabaseUrl);
    console.log('🔑 API Key format: JWT (correct format)');
  } else {
    console.error('❌ Supabase credentials validation failed');
    console.error('URL valid:', supabaseUrl && supabaseUrl.includes('supabase.co'));
    console.error('Key valid:', supabaseAnonKey && supabaseAnonKey.length > 10);
  }
} catch (error: any) {
  console.error('❌ Failed to initialize Supabase client:', error);
  console.error('Error message:', error?.message);
  supabase = null;
}

export { supabase };

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
        detectSessionInUrl: false,
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'apikey': supabaseAnonKey,
        },
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

// Initialize anonymous authentication
export const initializeAuth = async () => {
  if (!supabase) {
    console.error('❌ Supabase client not initialized');
    return;
  }

  try {
    // Check if there's already a session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // Sign in anonymously - this creates an anonymous user session
      const { data, error } = await supabase.auth.signInAnonymously();
      
      if (error) {
        console.error('❌ Anonymous sign-in error:', error);
        // If anonymous sign-in fails, try to continue anyway
        // The anon key should still work for inserts
        return;
      }
      
      console.log('✅ Anonymous authentication successful');
      console.log('👤 User ID:', data.user?.id);
    } else {
      console.log('✅ Existing session found');
      console.log('👤 User ID:', session.user?.id);
    }
  } catch (error: any) {
    console.error('❌ Authentication initialization error:', error);
    // Continue anyway - anon key should still work
  }
};

export { supabase };

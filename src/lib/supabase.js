import { createClient } from '@supabase/supabase-js';

// Project details - will be populated during deployment
const SUPABASE_URL = 'https://supabase-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-supabase-anon-key';

if (SUPABASE_URL === 'https://supabase-project-id.supabase.co' || SUPABASE_ANON_KEY === 'your-supabase-anon-key') {
  console.warn('Supabase credentials not configured. Using local authentication fallback.');
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export default supabase;
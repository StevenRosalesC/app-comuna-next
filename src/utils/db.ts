import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/lib/env.config';
import { createClient } from '@supabase/supabase-js';
import { Database } from 'types/supabase';

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
});

export default supabase;

import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/lib/env.config';
import { createBrowserClient } from '@supabase/ssr';
import { Database } from 'types/supabase';

export function createClient() {
  return createBrowserClient<Database>(SUPABASE_URL!, SUPABASE_ANON_KEY!);
}

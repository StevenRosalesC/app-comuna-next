import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/lib/env.config';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from 'types/supabase';

export async function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      }
    }
  });
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://nowoveogsdqqtwjloocc.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  || process.env.SUPABASE_SERVICE_ROLE
  || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  || process.env.SUPABASE_KEY
  || '';

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  // eslint-disable-next-line no-console
  console.warn('[supabaseServer] SUPABASE_SERVICE_ROLE_KEY not set. Falling back to anon key. Some admin operations may fail due to RLS.');
}

export const supabaseServer = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

export function getSupabaseWithAuth(token: string) {
  return createClient(supabaseUrl, serviceRoleKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false },
  });
}
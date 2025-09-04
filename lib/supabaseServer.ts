import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://nowoveogsdqqtwjloocc.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseServer = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});
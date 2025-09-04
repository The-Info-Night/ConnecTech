import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://nowoveogsdqqtwjloocc.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  // In dev, this helps notice missing env var. Avoid throwing to not crash build.
  // eslint-disable-next-line no-console
  console.warn('Supabase key is not set. Define NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_KEY in your env.');
}

export const supabase = createClient(supabaseUrl, supabaseKey ?? '');



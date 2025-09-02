import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nowoveogsdqqtwjloocc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vd292ZW9nc2RxcXR3amxvb2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MjE3MTYsImV4cCI6MjA3MjI5NzcxNn0.myaAc62qmkGExIAkdZVRFXORKu89pi6WM_GcUxaEG6M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

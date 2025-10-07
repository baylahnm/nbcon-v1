import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://joloqygeooyntwxjpxwv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvbG9xeWdlb295bnR3eGpweHd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MjkyMjQsImV4cCI6MjA3MzUwNTIyNH0.0kZ-_DvpdpU2qoDoyAeyEOKPZSOrwrXKD0IIYOtXY_E";

// Centralized Supabase client - single instance for the entire app
// Import like this: import { supabase } from "@/shared/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});


import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get Supabase credentials from environment variables
// Set these in your .env file:
// VITE_SUPABASE_URL=your_supabase_url
// VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

let SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
let SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate environment variables - critical for database connection
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.warn(
    '⚠️ SUPABASE CONFIGURATION WARNING\n\n' +
    'Missing environment variables:\n' +
    (!SUPABASE_URL ? '  - VITE_SUPABASE_URL\n' : '') +
    (!SUPABASE_PUBLISHABLE_KEY ? '  - VITE_SUPABASE_ANON_KEY\n' : '') +
    '\nUsing hardcoded fallbacks from environment.ts\n' +
    'For production, create a .env file with proper credentials.'
  );
  
  // Use hardcoded fallbacks
  SUPABASE_URL = 'https://joloqygeooyntwxjpxwv.supabase.co';
  SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvbG9xeWdlb295bnR3eGpweHd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MjkyMjQsImV4cCI6MjA3MzUwNTIyNH0.0kZ-_DvpdpU2qoDoyAeyEOKPZSOrwrXKD0IIYOtXY_E';
}

// Centralized Supabase client - single instance for the entire app
// Import like this: import { supabase } from "@/shared/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});


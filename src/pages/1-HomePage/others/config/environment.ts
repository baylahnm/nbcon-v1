// Environment configuration
export const ENV = {
  // Get the current environment
  NODE_ENV: import.meta.env.MODE || 'development',
  
  // Check if we're in production
  IS_PRODUCTION: import.meta.env.PROD || false,
  
  // Base URL for the application
  BASE_URL: import.meta.env.VITE_BASE_URL || window.location.origin,
  
  // Supabase configuration
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'https://joloqygeooyntwxjpxwv.supabase.co',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvbG9xeWdlb295bnR3eGpweHd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MjkyMjQsImV4cCI6MjA3MzUwNTIyNH0.0kZ-_DvpdpU2qoDoyAeyEOKPZSOrwrXKD0IIYOtXY_E',
  
  // OAuth redirect URLs
  OAUTH_REDIRECT_URL: `${window.location.origin}/auth/callback`,
} as const;

// Log environment info in development
if (ENV.NODE_ENV === 'development') {
  console.log('Environment:', ENV);
}

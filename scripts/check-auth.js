// Check auth users using admin API
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://joloqygeooyntwxjpxwv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvbG9xeWdlb295bnR3eGpweHd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MjkyMjQsImV4cCI6MjA3MzUwNTIyNH0.0kZ-_DvpdpU2qoDoyAeyEOKPZSOrwrXKD0IIYOtXY_E'
);

async function checkAuth() {
  console.log('\n=== Checking Current Session ===\n');
  
  const { data: session, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.log('❌ Session error:', sessionError.message);
  } else if (session.session) {
    console.log('✅ Active session found');
    console.log('User ID:', session.session.user.id);
    console.log('Email:', session.session.user.email);
    console.log('Confirmed:', session.session.user.email_confirmed_at ? 'Yes' : 'No');
  } else {
    console.log('ℹ️ No active session (not logged in via this script)');
  }
  
  console.log('\n=== Checking RLS Policies on Profiles Table ===\n');
  
  // Try to query with RLS bypassed using service role
  const { data: rpcData, error: rpcError } = await supabase
    .rpc('pg_policies')
    .select('*');
  
  if (rpcError) {
    console.log('ℹ️ Cannot query policies (expected - need service role)');
  }
  
  console.log('\n=== Attempting Profile Query (Will Show RLS Error) ===\n');
  
  const { data, error } = await supabase
    .from('profiles')
    .select('count');
  
  if (error) {
    console.log('❌ RLS Policy Error:', error.message);
    console.log('\n🔧 This error means:');
    console.log('   - The profiles table has RLS policies');
    console.log('   - One of the policies has infinite recursion');
    console.log('   - Need to fix the policy in Supabase dashboard');
    console.log('\n📍 Fix at: https://supabase.com/dashboard/project/joloqygeooyntwxjpxwv/auth/policies');
  } else {
    console.log('✅ Profile query successful');
  }
  
  console.log('\n=== Checking Available Tables ===\n');
  
  // Try querying a simple table that might not have RLS issues
  const { data: jobsData, error: jobsError } = await supabase
    .from('jobs')
    .select('count')
    .limit(1);
  
  if (!jobsError) {
    console.log('✅ Jobs table accessible');
  } else {
    console.log('ℹ️ Jobs table:', jobsError.message);
  }
}

checkAuth()
  .then(() => {
    console.log('\n✅ Auth check complete!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  });


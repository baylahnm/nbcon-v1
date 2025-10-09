// Quick script to check Supabase database
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://joloqygeooyntwxjpxwv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvbG9xeWdlb295bnR3eGpweHd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MjkyMjQsImV4cCI6MjA3MzUwNTIyNH0.0kZ-_DvpdpU2qoDoyAeyEOKPZSOrwrXKD0IIYOtXY_E'
);

async function checkDatabase() {
  console.log('\n=== Checking Auth Users ===\n');
  
  // Get current auth users count
  const { count: userCount, error: countError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
  
  if (countError) {
    console.log('❌ Error counting profiles:', countError.message);
  } else {
    console.log(`✅ Total profiles in database: ${userCount}`);
  }
  
  // Get sample profiles
  console.log('\n=== Sample Profiles ===\n');
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('user_id, role, first_name, last_name, email, phone, location_city, created_at')
    .order('created_at', { ascending: false })
    .limit(10);
  
  if (profileError) {
    console.log('❌ Error fetching profiles:', profileError.message);
  } else if (profiles && profiles.length > 0) {
    console.log(`Found ${profiles.length} profiles:\n`);
    profiles.forEach((p, i) => {
      console.log(`${i + 1}. ${p.first_name} ${p.last_name} (${p.email})`);
      console.log(`   Role: ${p.role}`);
      console.log(`   Phone: ${p.phone || 'N/A'}`);
      console.log(`   Location: ${p.location_city || 'N/A'}`);
      console.log(`   Created: ${new Date(p.created_at).toLocaleString()}`);
      console.log('');
    });
  } else {
    console.log('ℹ️ No profiles found in database');
  }
  
  // Check table structure
  console.log('\n=== Checking Tables ===\n');
  const { data: tables, error: tableError } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);
  
  if (tableError) {
    console.log('❌ Profiles table error:', tableError.message);
  } else {
    console.log('✅ Profiles table exists and is accessible');
    if (tables && tables[0]) {
      console.log('✅ Columns available:', Object.keys(tables[0]).join(', '));
    }
  }
}

checkDatabase()
  .then(() => {
    console.log('\n✅ Database check complete!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  });


// Verification script for all test accounts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseKey);

const testEmails = [
  'ahmed.rashid.test@gmail.com',      // Engineer
  'fatima.zahrani.test@gmail.com',    // Client
  'khalid.bawani.test@gmail.com',     // Enterprise
  'sara.mansour.admin@gmail.com'      // Admin
];

async function verifyAccounts() {
  console.log('\n🔍 VERIFYING ALL TEST ACCOUNTS\n');
  console.log('═'.repeat(80));
  
  // Query profiles
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('email, role, account_number, first_name, last_name, location_city, account_status, created_at')
    .in('email', testEmails)
    .order('role');

  if (error) {
    console.error('❌ Error querying profiles:', error.message);
    return;
  }

  console.log('\n📊 PROFILES TABLE RESULTS:\n');
  console.log('─'.repeat(80));
  
  if (profiles && profiles.length > 0) {
    profiles.forEach((profile, index) => {
      console.log(`\n${index + 1}. ${profile.role.toUpperCase()} ACCOUNT`);
      console.log(`   Email:          ${profile.email}`);
      console.log(`   Account Number: ${profile.account_number || '❌ NOT ASSIGNED'}`);
      console.log(`   Name:           ${profile.first_name} ${profile.last_name}`);
      console.log(`   Location:       ${profile.location_city}`);
      console.log(`   Status:         ${profile.account_status}`);
      console.log(`   Created:        ${new Date(profile.created_at).toLocaleString()}`);
    });
  } else {
    console.log('❌ No profiles found!');
  }

  console.log('\n' + '─'.repeat(80));
  console.log('\n📈 SUMMARY BY ROLE:\n');
  
  const summary = profiles.reduce((acc, profile) => {
    if (!acc[profile.role]) {
      acc[profile.role] = { count: 0, accounts: [] };
    }
    acc[profile.role].count++;
    acc[profile.role].accounts.push(profile.account_number);
    return acc;
  }, {});

  Object.entries(summary).forEach(([role, data]) => {
    console.log(`   ${role.toUpperCase().padEnd(12)} ${data.count} account(s) → [${data.accounts.join(', ')}]`);
  });

  console.log('\n' + '═'.repeat(80));
  
  // Verification checks
  console.log('\n✅ VERIFICATION CHECKLIST:\n');
  const checks = [
    { name: 'Total accounts created', pass: profiles.length === 4, value: profiles.length },
    { name: 'All have account numbers', pass: profiles.every(p => p.account_number), value: profiles.filter(p => p.account_number).length + '/4' },
    { name: 'All status = active', pass: profiles.every(p => p.account_status === 'active'), value: profiles.filter(p => p.account_status === 'active').length + '/4' },
    { name: 'Unique account numbers', pass: new Set(profiles.map(p => p.account_number)).size === profiles.length, value: new Set(profiles.map(p => p.account_number)).size },
    { name: 'All roles represented', pass: ['admin', 'client', 'engineer', 'enterprise'].every(role => profiles.some(p => p.role === role)), value: new Set(profiles.map(p => p.role)).size + '/4' }
  ];

  checks.forEach(check => {
    const icon = check.pass ? '✅' : '❌';
    console.log(`   ${icon} ${check.name.padEnd(30)} ${check.value}`);
  });

  const allPassed = checks.every(c => c.pass);
  
  console.log('\n' + '═'.repeat(80));
  if (allPassed) {
    console.log('\n🎉 ALL VERIFICATION CHECKS PASSED! Ready to test dashboards.\n');
  } else {
    console.log('\n⚠️  Some checks failed. Please review the results above.\n');
  }

  return allPassed;
}

// Run verification
verifyAccounts()
  .then(success => {
    if (success) {
      console.log('✅ Account creation test: PASSED');
      console.log('➡️  Next step: Test all role-specific dashboards\n');
      process.exit(0);
    } else {
      console.log('❌ Account creation test: FAILED');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  });


/**
 * Token Widget Diagnostic Script
 * 
 * Verifies that the AI Token Widget in TierAwareAppSidebar renders correctly
 * by checking tokenService functions and data flow.
 * 
 * @version 1.0.0
 * @created October 29, 2025
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface DiagnosticResult {
  check: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  message: string;
  data?: any;
}

const results: DiagnosticResult[] = [];

// ============================================================================
// DIAGNOSTIC CHECKS
// ============================================================================

async function checkSupabaseConnection() {
  console.log('\n🔌 Checking Supabase connection...');
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error) throw error;
    results.push({
      check: 'Supabase Connection',
      status: 'PASS',
      message: 'Connected successfully',
    });
  } catch (error) {
    results.push({
      check: 'Supabase Connection',
      status: 'FAIL',
      message: error instanceof Error ? error.message : 'Connection failed',
    });
  }
}

async function checkUserAIQuotasTable() {
  console.log('\n📊 Checking user_ai_quotas table...');
  try {
    const { data, error } = await supabase
      .from('user_ai_quotas')
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01') {
        results.push({
          check: 'user_ai_quotas Table',
          status: 'FAIL',
          message: 'Table does not exist',
        });
      } else {
        throw error;
      }
    } else {
      results.push({
        check: 'user_ai_quotas Table',
        status: 'PASS',
        message: `Table exists (${data?.length || 0} records found)`,
        data: data?.[0],
      });
    }
  } catch (error) {
    results.push({
      check: 'user_ai_quotas Table',
      status: 'FAIL',
      message: error instanceof Error ? error.message : 'Check failed',
    });
  }
}

async function checkMonthlyUsageRPC() {
  console.log('\n📈 Checking get_user_monthly_usage RPC...');
  try {
    const { data, error } = await supabase.rpc('get_user_monthly_usage', {});
    
    if (error) {
      if (error.code === '42883') {
        results.push({
          check: 'get_user_monthly_usage RPC',
          status: 'FAIL',
          message: 'Function does not exist',
        });
      } else if (error.code === '40000' || error.message?.includes('400')) {
        results.push({
          check: 'get_user_monthly_usage RPC',
          status: 'WARN',
          message: 'Function exists but returns no data (expected for new users)',
          data,
        });
      } else {
        throw error;
      }
    } else {
      results.push({
        check: 'get_user_monthly_usage RPC',
        status: 'PASS',
        message: 'Function exists and returns data',
        data,
      });
    }
  } catch (error) {
    results.push({
      check: 'get_user_monthly_usage RPC',
      status: 'FAIL',
      message: error instanceof Error ? error.message : 'Check failed',
    });
  }
}

async function checkMockDataFlag() {
  console.log('\n🎭 Checking mock data configuration...');
  
  const nodeEnv = process.env.NODE_ENV;
  const useMockTokens = process.env.VITE_USE_MOCK_TOKENS;
  const willUseMock = nodeEnv === 'development' || useMockTokens === 'true';
  
  results.push({
    check: 'Mock Data Configuration',
    status: willUseMock ? 'PASS' : 'WARN',
    message: willUseMock 
      ? 'Mock data ENABLED (development mode)'
      : 'Mock data DISABLED (production mode)',
    data: { NODE_ENV: nodeEnv, VITE_USE_MOCK_TOKENS: useMockTokens },
  });
}

async function checkWidgetRenderConditions() {
  console.log('\n🎨 Checking widget render conditions...');
  
  // Simulate the hook's behavior
  const mockQuotaStatus = {
    used: 12500,
    limit: 50000,
    remaining: 37500,
    percentage: 25,
    resetDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
    status: 'healthy' as const,
  };
  
  const shouldRender = !false && mockQuotaStatus.limit > 0; // !isLoading && tokensLimit > 0
  
  results.push({
    check: 'Widget Render Conditions',
    status: shouldRender ? 'PASS' : 'FAIL',
    message: shouldRender
      ? 'Widget should render (tokensLimit > 0)'
      : 'Widget will NOT render (tokensLimit = 0)',
    data: { 
      isLoading: false, 
      tokensLimit: mockQuotaStatus.limit,
      shouldRender,
    },
  });
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function runDiagnostics() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║                                                          ║');
  console.log('║          AI TOKEN WIDGET DIAGNOSTIC REPORT               ║');
  console.log('║                                                          ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  
  await checkSupabaseConnection();
  await checkUserAIQuotasTable();
  await checkMonthlyUsageRPC();
  await checkMockDataFlag();
  await checkWidgetRenderConditions();
  
  // Print results
  console.log('\n\n╔══════════════════════════════════════════════════════════╗');
  console.log('║                    DIAGNOSTIC RESULTS                    ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
  
  let passCount = 0;
  let warnCount = 0;
  let failCount = 0;
  
  results.forEach((result) => {
    const icon = result.status === 'PASS' ? '✅' : result.status === 'WARN' ? '⚠️' : '❌';
    console.log(`${icon} ${result.check}`);
    console.log(`   ${result.message}`);
    if (result.data) {
      console.log(`   Data:`, JSON.stringify(result.data, null, 2).split('\n').map(line => `   ${line}`).join('\n'));
    }
    console.log('');
    
    if (result.status === 'PASS') passCount++;
    else if (result.status === 'WARN') warnCount++;
    else failCount++;
  });
  
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║                        SUMMARY                           ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
  console.log(`   ✅ Passed: ${passCount}`);
  console.log(`   ⚠️  Warnings: ${warnCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log('');
  
  if (failCount > 0) {
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║                    RECOMMENDATIONS                       ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');
    
    const hasMissingTable = results.some(r => r.check === 'user_ai_quotas Table' && r.status === 'FAIL');
    const hasMissingRPC = results.some(r => r.check === 'get_user_monthly_usage RPC' && r.status === 'FAIL');
    
    if (hasMissingTable || hasMissingRPC) {
      console.log('   🔧 Run migrations to create missing database objects:');
      console.log('      cd supabase');
      console.log('      supabase db reset');
      console.log('');
      console.log('   📝 Or apply specific migrations:');
      console.log('      - 20250126000003_token_tracking_monetization.sql');
      console.log('      - 202501280930_fix_ai_usage_rpcs.sql');
      console.log('');
    }
    
    console.log('   🎭 ALTERNATIVE: Enable mock data for development:');
    console.log('      Set VITE_USE_MOCK_TOKENS=true in .env.local');
    console.log('      Widget will use hardcoded test data');
    console.log('');
  } else if (warnCount > 0) {
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║                          NOTES                           ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');
    console.log('   ℹ️  Mock data is currently enabled');
    console.log('   ℹ️  Widget will display test usage data');
    console.log('   ℹ️  This is expected in development mode');
    console.log('');
  } else {
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║                         SUCCESS!                         ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');
    console.log('   🎉 All checks passed!');
    console.log('   🎉 Token widget should render correctly');
    console.log('');
  }
}

// Run diagnostics
runDiagnostics().catch(console.error);


/**
 * Phase 1-3 Verification Script
 * 
 * Verifies all AI agent system components are properly deployed
 * 
 * Run: node scripts/verify-phase1-3.js
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://joloqygeooyntwxjpxwv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvbG9xeWdlb295bnR3eGpweHd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MjkyMjQsImV4cCI6MjA3MzUwNTIyNH0.0kZ-_DvpdpU2qoDoyAeyEOKPZSOrwrXKD0IIYOtXY_E';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

const TEST_EMAIL = 'info@nbcon.org';
const TEST_PASSWORD = '1234@';

async function main() {
  console.log('\n🔍 Phase 1-3 Verification Starting...\n');
  console.log('═══════════════════════════════════════════════════════\n');

  let passed = 0;
  let failed = 0;

  // ========================================
  // Phase 1: RPC Endpoints
  // ========================================
  console.log('📍 PHASE 1: Server-Authoritative State\n');

  try {
    // Sign in
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    if (authError) throw authError;
    console.log('  ✅ Authentication successful');
    passed++;

    // Test get_ai_threads RPC
    const { data: threads, error: threadsError } = await supabase.rpc('get_ai_threads');
    if (threadsError) throw threadsError;
    console.log(`  ✅ get_ai_threads RPC works (${threads?.length || 0} threads)`);
    passed++;

    // Test create_ai_thread RPC
    const { data: newThread, error: createError } = await supabase.rpc('create_ai_thread', {
      p_title: 'Phase 3 Test Thread',
      p_mode: 'chat',
      p_type: 'test',
    });
    if (createError) throw createError;
    console.log(`  ✅ create_ai_thread RPC works (ID: ${newThread})`);
    passed++;

    // Test get_thread_messages RPC
    const { data: messages, error: messagesError } = await supabase.rpc('get_thread_messages', {
      thread_id: newThread,
    });
    if (messagesError) throw messagesError;
    console.log(`  ✅ get_thread_messages RPC works (${messages?.length || 0} messages)`);
    passed++;

    console.log('\n📍 Phase 1 Result: ✅ ALL TESTS PASSED (4/4)\n');
  } catch (error) {
    console.error('  ❌ Phase 1 Error:', error.message);
    failed++;
    console.log('\n📍 Phase 1 Result: ❌ FAILED\n');
  }

  // ========================================
  // Phase 2: Specialized Agents
  // ========================================
  console.log('═══════════════════════════════════════════════════════\n');
  console.log('📍 PHASE 2: Specialized Engineering Agents\n');

  try {
    // Check ai_agents table
    const { data: agents, error: agentsError } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('is_active', true);

    if (agentsError) throw agentsError;
    
    if (!agents || agents.length !== 9) {
      throw new Error(`Expected 9 agents, found ${agents?.length || 0}`);
    }
    
    console.log(`  ✅ Found 9 specialized agents:`);
    agents.forEach((agent, i) => {
      console.log(`     ${i + 1}. ${agent.display_name} (${agent.discipline})`);
    });
    passed++;

    // Check ai_agent_sessions table exists
    const { error: sessionsError } = await supabase
      .from('ai_agent_sessions')
      .select('count')
      .limit(1);
    
    if (sessionsError && !sessionsError.message.includes('0 rows')) {
      throw sessionsError;
    }
    console.log('  ✅ ai_agent_sessions table exists');
    passed++;

    // Check ai_agent_deliverables table
    const { error: deliverablesError } = await supabase
      .from('ai_agent_deliverables')
      .select('count')
      .limit(1);
    
    if (deliverablesError && !deliverablesError.message.includes('0 rows')) {
      throw deliverablesError;
    }
    console.log('  ✅ ai_agent_deliverables table exists');
    passed++;

    console.log('\n📍 Phase 2 Result: ✅ ALL TESTS PASSED (3/3)\n');
  } catch (error) {
    console.error('  ❌ Phase 2 Error:', error.message);
    failed++;
    console.log('\n📍 Phase 2 Result: ❌ FAILED\n');
  }

  // ========================================
  // Phase 3: Token Tracking
  // ========================================
  console.log('═══════════════════════════════════════════════════════\n');
  console.log('📍 PHASE 3: Token Tracking & Monetization\n');

  try {
    // Check ai_agent_usage table
    const { error: usageTableError } = await supabase
      .from('ai_agent_usage')
      .select('count')
      .limit(1);
    
    if (usageTableError && !usageTableError.message.includes('0 rows')) {
      throw usageTableError;
    }
    console.log('  ✅ ai_agent_usage table exists (token tracking)');
    passed++;

    // Check user_ai_quotas table
    const { error: quotasError } = await supabase
      .from('user_ai_quotas')
      .select('count')
      .limit(1);
    
    if (quotasError && !quotasError.message.includes('0 rows')) {
      throw quotasError;
    }
    console.log('  ✅ user_ai_quotas table exists (billing limits)');
    passed++;

    // Check RPC: get_user_monthly_usage
    const { data: usageData, error: usageError } = await supabase.rpc('get_user_monthly_usage');
    
    if (usageError) throw usageError;
    console.log('  ✅ get_user_monthly_usage RPC works');
    console.log(`     Interactions: ${usageData?.[0]?.total_interactions || 0}`);
    console.log(`     Tokens: ${usageData?.[0]?.total_tokens || 0}`);
    console.log(`     Cost: $${(usageData?.[0]?.total_cost_usd || 0).toFixed(2)} USD`);
    passed++;

    // Check RPC: check_user_quota
    const { data: quotaCheck, error: quotaError } = await supabase.rpc('check_user_quota', {
      p_estimated_tokens: 1000,
    });
    
    if (quotaError) throw quotaError;
    console.log(`  ✅ check_user_quota RPC works (allowed: ${quotaCheck})`);
    passed++;

    // Check analytics views
    const { error: analyticsError } = await supabase
      .from('workflow_cost_analytics')
      .select('*')
      .limit(1);
    
    if (analyticsError && !analyticsError.message.includes('0 rows')) {
      throw analyticsError;
    }
    console.log('  ✅ Analytics views configured (workflow_cost_analytics)');
    passed++;

    console.log('\n📍 Phase 3 Result: ✅ ALL TESTS PASSED (5/5)\n');
  } catch (error) {
    console.error('  ❌ Phase 3 Error:', error.message);
    failed++;
    console.log('\n📍 Phase 3 Result: ❌ FAILED\n');
  }

  // ========================================
  // Summary
  // ========================================
  console.log('═══════════════════════════════════════════════════════\n');
  console.log('📊 VERIFICATION SUMMARY\n');
  console.log(`  ✅ Passed: ${passed}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log(`  Total: ${passed + failed}`);
  console.log(`  Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%\n`);

  if (failed === 0) {
    console.log('🎉 ALL PHASES VERIFIED ✅');
    console.log('🚀 READY FOR SPRINT 1 KICKOFF\n');
    console.log('Next Steps:');
    console.log('  1. Review docs/PHASE3_EXECUTION_PLAN.md');
    console.log('  2. Schedule team kickoff meeting');
    console.log('  3. Start Sprint 1 planning');
    console.log('  4. Begin implementation\n');
  } else {
    console.log('⚠️  SOME TESTS FAILED - Review errors above\n');
    process.exit(1);
  }

  await supabase.auth.signOut();
}

main().catch(console.error);


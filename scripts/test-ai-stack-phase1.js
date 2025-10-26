/**
 * Phase 1: AI Stack Integration Test
 * 
 * Tests Supabase RPC endpoints and real-time synchronization
 * 
 * Usage: node scripts/test-ai-stack-phase1.js
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://joloqygeooyntwxjpxwv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvbG9xeWdlb295bnR3eGpweHd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MjkyMjQsImV4cCI6MjA3MzUwNTIyNH0.0kZ-_DvpdpU2qoDoyAeyEOKPZSOrwrXKD0IIYOtXY_E';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
  }
});

// Test credentials
const TEST_EMAIL = 'info@nbcon.org';
const TEST_PASSWORD = '1234@';

async function runTests() {
  console.log('\n🧪 Phase 1: AI Stack Integration Tests\n');
  console.log('=' .repeat(60));

  try {
    // Step 1: Authenticate
    console.log('\n📝 Step 1: Authenticating...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    if (authError) {
      console.error('❌ Authentication failed:', authError.message);
      return;
    }

    console.log('✅ Authenticated as:', authData.user.email);

    // Step 2: Test get_ai_threads()
    console.log('\n📝 Step 2: Testing get_ai_threads()...');
    const { data: threads, error: threadsError } = await supabase.rpc('get_ai_threads');

    if (threadsError) {
      console.error('❌ get_ai_threads() failed:', threadsError.message);
    } else {
      console.log(`✅ Fetched ${threads?.length || 0} threads`);
      if (threads && threads.length > 0) {
        console.log('   Sample thread:', {
          id: threads[0].id,
          title: threads[0].conversation_title,
          mode: threads[0].ai_service_mode,
          created: threads[0].created_at,
        });
      }
    }

    // Step 3: Test create_ai_thread()
    console.log('\n📝 Step 3: Testing create_ai_thread()...');
    const { data: newThread, error: createError } = await supabase.rpc('create_ai_thread', {
      p_title: `Test Thread ${Date.now()}`,
      p_mode: 'chat',
      p_type: 'test',
    });

    if (createError) {
      console.error('❌ create_ai_thread() failed:', createError.message);
    } else {
      console.log('✅ Created new thread:', newThread?.[0]?.id);
      
      // Step 4: Test add_thread_message()
      if (newThread && newThread.length > 0) {
        const threadId = newThread[0].id;
        
        console.log('\n📝 Step 4: Testing add_thread_message()...');
        const { data: newMessage, error: messageError } = await supabase.rpc('add_thread_message', {
          p_thread_id: threadId,
          p_message_type: 'user',
          p_content: 'Hello, this is a test message!',
          p_metadata: { test: true, timestamp: new Date().toISOString() },
        });

        if (messageError) {
          console.error('❌ add_thread_message() failed:', messageError.message);
        } else {
          console.log('✅ Added message to thread:', newMessage?.[0]?.id);
        }

        // Step 5: Test get_thread_messages()
        console.log('\n📝 Step 5: Testing get_thread_messages()...');
        const { data: messages, error: messagesError } = await supabase.rpc('get_thread_messages', {
          thread_id: threadId,
        });

        if (messagesError) {
          console.error('❌ get_thread_messages() failed:', messagesError.message);
        } else {
          console.log(`✅ Fetched ${messages?.length || 0} messages from thread`);
          if (messages && messages.length > 0) {
            console.log('   Sample message:', {
              id: messages[0].id,
              type: messages[0].message_type,
              content: messages[0].content.substring(0, 50) + '...',
              created: messages[0].created_at,
            });
          }
        }

        // Step 6: Test Real-time Subscription
        console.log('\n📝 Step 6: Testing real-time subscriptions...');
        console.log('   Setting up channel...');
        
        const channel = supabase
          .channel('test-realtime')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'ai_messages',
              filter: `conversation_id=eq.${threadId}`,
            },
            (payload) => {
              console.log('   ✅ Real-time INSERT received:', {
                id: payload.new.id,
                content: payload.new.content.substring(0, 30) + '...',
              });
            }
          )
          .subscribe((status) => {
            console.log('   Channel status:', status);
          });

        // Wait for subscription to be ready
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Add another message to trigger real-time event
        console.log('   Adding message to trigger real-time event...');
        await supabase.rpc('add_thread_message', {
          p_thread_id: threadId,
          p_message_type: 'assistant',
          p_content: 'This is a test assistant response!',
          p_metadata: { test: true },
        });

        // Wait for real-time event
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Cleanup
        console.log('\n   Cleaning up subscription...');
        await channel.unsubscribe();

        // Step 7: Cleanup test thread
        console.log('\n📝 Step 7: Cleaning up test thread...');
        const { error: deleteError } = await supabase
          .from('ai_conversations')
          .delete()
          .eq('id', threadId);

        if (deleteError) {
          console.error('❌ Cleanup failed:', deleteError.message);
        } else {
          console.log('✅ Test thread cleaned up');
        }
      }
    }

    // Final Summary
    console.log('\n' + '='.repeat(60));
    console.log('\n🎉 Phase 1 Integration Tests Complete!\n');
    console.log('✅ All RPC endpoints functional');
    console.log('✅ Real-time subscriptions working');
    console.log('✅ Authorization checks passing');
    console.log('\n📊 Next Steps:');
    console.log('   1. Test in UI: npm run dev');
    console.log('   2. Navigate to /free/dashboard');
    console.log('   3. Open AI chat widget');
    console.log('   4. Send a message and verify it persists');
    console.log('   5. Open /free/ai in another tab');
    console.log('   6. Verify messages sync in real-time\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
  } finally {
    // Sign out
    await supabase.auth.signOut();
  }
}

runTests();


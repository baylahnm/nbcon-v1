// Simple test script for the AI function
// Run this after starting the Supabase function locally

const BASE_URL = 'http://localhost:54321/functions/v1/ai';

async function testAI() {
  console.log('🧪 Testing AI Function...\n');

  // Test 1: GET request (health check)
  console.log('1️⃣ Testing GET request...');
  try {
    const getResponse = await fetch(BASE_URL);
    const getData = await getResponse.json();
    console.log('✅ GET Response:', getData);
  } catch (error) {
    console.log('❌ GET Error:', error.message);
  }

  console.log('\n2️⃣ Testing POST request...');
  
  // Test 2: POST request with site inspection
  const testPayload = {
    mode: "site-inspection",
    prompt: "I need help with a construction site inspection. What should I check for safety hazards?",
    userId: "test-user-123",
    budgetMs: 30000,
    budgetUsd: 0.05
  };

  try {
    const postResponse = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });

    const postData = await postResponse.json();
    console.log('✅ POST Response:', JSON.stringify(postData, null, 2));
  } catch (error) {
    console.log('❌ POST Error:', error.message);
  }

  console.log('\n3️⃣ Testing structural analysis...');
  
  // Test 3: POST request with structural analysis
  const structuralPayload = {
    mode: "structural-analysis",
    prompt: "I have a concrete beam with 6m span, 300mm depth, 200mm width. What's the maximum load it can carry?",
    userId: "test-user-456"
  };

  try {
    const structResponse = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(structuralPayload)
    });

    const structData = await structResponse.json();
    console.log('✅ Structural Analysis Response:', JSON.stringify(structData, null, 2));
  } catch (error) {
    console.log('❌ Structural Analysis Error:', error.message);
  }
}

// Run the test
testAI().catch(console.error);

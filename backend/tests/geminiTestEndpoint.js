import dotenv from 'dotenv';
dotenv.config();

const BASE = 'http://localhost:5000/api';

async function run() {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('   StyleAI Gemini test-gemini Endpoint Test');
  console.log('═══════════════════════════════════════════════════════\n');

  try {
    const res = await fetch(`${BASE}/ai/test-gemini`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Hello! Respond in exactly one word.' })
    });
    const data = await res.json();
    console.log(`Status: ${res.status}`);
    console.log(`Response Payload:`, JSON.stringify(data, null, 2));

    if (res.status === 200 && data.success) {
      console.log('\n✅ test-gemini endpoint works successfully! Gemini replied: ' + data.response);
    } else if (res.status === 500 && data.error && data.error.includes('API key')) {
      console.log('\n✅ Endpoint handles missing/unconfigured API key gracefully with 500 error.');
    } else {
      console.error('\n❌ Unexpected endpoint behavior.');
    }
  } catch (err) {
    console.error('❌ Failed to connect to the backend server.', err.message);
  }
}

run();

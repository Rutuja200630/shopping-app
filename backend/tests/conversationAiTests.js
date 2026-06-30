import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import {
  mergeConversationContext,
  determineMissingInformation,
  generateFollowUpQuestion,
  resolveLookReference,
  summarizeConversation,
  buildSuggestedReplies
} from '../services/conversationService.js';

dotenv.config();

const BASE = 'http://localhost:5000/api';

let PASS = 0;
let FAIL = 0;

function logTest(label, passed, detail = '') {
  const icon = passed ? '✅' : '❌';
  console.log(`${icon}  ${label}${detail ? ' — ' + detail : ''}`);
  if (passed) PASS++; else FAIL++;
}

async function req(method, path, { body, token } = {}) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  if (body) opts.body = JSON.stringify(body);

  try {
    const res = await fetch(`${BASE}${path}`, opts);
    let data;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    return { status: res.status, data };
  } catch (err) {
    return { status: 500, error: err.message };
  }
}

async function run() {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('   StyleAI Phase 5.6A – Conversational Stylist Tests');
  console.log('═══════════════════════════════════════════════════════\n');

  // 1. DB Connect
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/styleai');
    logTest('Connected to MongoDB', true);
  } catch (err) {
    logTest('Connected to MongoDB', false, err.message);
    process.exit(1);
  }

  // Seed test user and products
  const testEmail = 'convo_stylist@example.com';
  const pwd = 'password123';

  await User.deleteMany({ email: testEmail });
  await Product.deleteMany({ brand: 'ConvoBrand' });

  const regRes = await req('POST', '/auth/register', {
    body: { name: 'Convo User', email: testEmail, password: pwd }
  });
  console.log('[DEBUG REG] Register response status:', regRes.status, JSON.stringify(regRes.data));

  // Seed main, footwear, accessory products
  await Product.create({
    name: 'Casual Floral Dress',
    slug: 'casual-floral-dress',
    description: 'Beautiful floral coordinate.',
    brand: 'ConvoBrand',
    category: 'Apparel',
    subCategory: 'Dresses',
    colors: ['Red', 'Pink'],
    occasionTags: ['Party', 'Casual'],
    gender: 'Women',
    price: 4500,
    originalPrice: 6000,
    fit: 'Regular',
    material: 'Cotton',
    sizes: ['S', 'M'],
    images: ['https://example.com/dress.jpg'],
    isActive: true,
    inventory: 10
  });

  await Product.create({
    name: 'Red Casual Sandals',
    slug: 'red-casual-sandals',
    description: 'Matching red strap sandals.',
    brand: 'ConvoBrand',
    category: 'Footwear',
    subCategory: 'Sandals',
    colors: ['Red'],
    occasionTags: ['Party', 'Casual'],
    gender: 'Women',
    price: 1500,
    originalPrice: 2000,
    fit: 'Regular',
    material: 'Leather',
    sizes: ['S', 'M'],
    images: ['https://example.com/sandals.jpg'],
    isActive: true,
    inventory: 5
  });

  logTest('Test seeding completed', true);

  // Authenticate
  const loginRes = await req('POST', '/auth/login', { body: { email: testEmail, password: pwd } });
  console.log('[DEBUG LOGIN] Response:', JSON.stringify(loginRes));
  const token = loginRes.data?.token;
  logTest('Authentication token fetched', !!token);

  // --- UNIT TESTS: Conversation Context & Service Helpers ---

  // 1. mergeConversationContext
  let context = mergeConversationContext(null, { occasion: 'Wedding', gender: 'Female' });
  logTest('mergeConversationContext sets initial occasion & gender', context.occasion === 'Wedding' && context.gender === 'Female');

  context = mergeConversationContext(context, { budget: 5000, color: 'Red' });
  logTest('mergeConversationContext merges budget, keeping occasion', context.occasion === 'Wedding' && context.budget === 5000);

  // 2. determineMissingInformation
  let missing = determineMissingInformation({ occasion: 'Wedding' });
  logTest('determineMissingInformation detects budget missing', missing.includes('budget') && !missing.includes('occasion'));

  missing = determineMissingInformation({ occasion: 'Party', budget: 7000 });
  logTest('determineMissingInformation returns empty if all critical inputs satisfied', missing.length === 0);

  // 3. generateFollowUpQuestion
  let q = generateFollowUpQuestion(['occasion', 'budget']);
  logTest('generateFollowUpQuestion requests both inputs', q.includes('occasion') && q.includes('budget'));

  // 4. resolveLookReference
  const mockLooks = [
    { id: 'look_aaa', title: 'Look One Title', items: { main: { name: 'Main 1' } } },
    { id: 'look_bbb', title: 'Look Two Title', items: { main: { name: 'Main 2' } } }
  ];
  let resolved = resolveLookReference('make look 2 cheaper', mockLooks);
  logTest('resolveLookReference maps look 2 to second look index', resolved && resolved.lookId === 'look_bbb');
  logTest('resolveLookReference resolves to main slot by default', resolved && resolved.slot === 'main');

  resolved = resolveLookReference('replace shoes in look 1', mockLooks);
  logTest('resolveLookReference maps to footwear slot', resolved && resolved.slot === 'footwear' && resolved.lookId === 'look_aaa');

  // 5. summarizeConversation
  const history = [
    { sender: 'user', text: 'I need a party look' },
    { sender: 'ai', text: 'What is your budget?' },
    { sender: 'user', text: 'Around 5000' }
  ];
  const summary = summarizeConversation(history);
  logTest('summarizeConversation summaries dialog request topics', summary.includes('party look') && summary.includes('5000'));

  // 6. buildSuggestedReplies
  let replies = buildSuggestedReplies({ occasion: null });
  logTest('buildSuggestedReplies returns occasions list when missing occasion', replies.includes('Wedding Outfit'));

  // --- API INTEGRATION TESTS ---

  const sessionId = 'test_session_' + Date.now();

  // Test 1: Vague query triggers follow-up
  const chatRes1 = await req('POST', '/ai/chat', {
    body: { message: 'I need some outfit suggestions', sessionId },
    token
  });
  logTest('Vague request API response returns success 200', chatRes1.status === 200);
  logTest('Vague request API sets followUp: true', chatRes1.data?.followUp === true);
  logTest('Vague request API returns suggested replies', Array.isArray(chatRes1.data?.suggestedReplies) && chatRes1.data.suggestedReplies.length > 0);

  // Test 2: Supply occasion (still missing budget)
  const chatRes2 = await req('POST', '/ai/chat', {
    body: { message: 'It is for a casual beach party', sessionId },
    token
  });
  logTest('Second turn missing budget remains on followUp', chatRes2.data?.followUp === true);

  // Test 3: Supply budget (complete details) -> Outfit generated
  const chatRes3 = await req('POST', '/ai/chat', {
    body: { message: 'My budget is around 6000', sessionId },
    token
  });
  logTest('Context completion triggers outfit looks generation', chatRes3.status === 200 && chatRes3.data?.followUp === false, `status: ${chatRes3.status}, followUp: ${chatRes3.data?.followUp}`);
  console.log('[DEBUG CHAT] chatRes3.data:', JSON.stringify(chatRes3.data));
  logTest('Looks coordinates returned', Array.isArray(chatRes3.data?.looks));

  // Test 4: Verify look editing relative reference resolution API
  if (chatRes3.data?.looks?.length > 0) {
    const editRes = await req('POST', '/ai/modify-look', {
      body: {
        sessionId,
        lookId: 'look 1', // relative reference
        slot: 'main',
        action: 'upgrade',
        query: 'make look 1 premium'
      },
      token
    });
    logTest('Relative reference resolved successfully on modify-look endpoint', editRes.status === 200 && editRes.data?.success === true);
  } else {
    logTest('Relative reference resolved successfully on modify-look endpoint', false, 'Skipped: No looks generated to test modification');
  }

  // Cleanup & Connection Close
  await User.deleteMany({ email: testEmail });
  await Product.deleteMany({ brand: 'ConvoBrand' });
  await mongoose.connection.close();
  console.log('✅ Cleanup complete. DB connection closed.');

  console.log('\n═══════════════════════════════════════════════════════');
  console.log(`   Results: ${PASS} passed, ${FAIL} failed`);
  console.log('═══════════════════════════════════════════════════════\n');

  if (FAIL > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

run();

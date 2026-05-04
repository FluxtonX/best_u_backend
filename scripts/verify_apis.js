// API Verification Script
// Run this via: node scripts/verify_apis.js

// NOTE: Since the APIs are protected by Firebase Auth middleware, 
// this script needs a valid Firebase ID token to test successfully.
// 
// For local testing without a token, you can temporarily bypass the auth middleware
// in your routes or index.js by commenting out `app.use(verifyFirebaseToken)`.

const BASE_URL = 'http://localhost:5000/api/v1';

// Replace this with a real token from your Flutter app console log
const FIREBASE_TOKEN = 'YOUR_TEST_TOKEN_HERE'; 

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${FIREBASE_TOKEN}`
};

const endpoints = [
  // 1. User & Profile APIs
  { method: 'POST', path: '/users/onboarding', body: { name: "Test User", age: 25, height: 180, currentWeight: 80, targetWeight: 75, fitnessLevel: "Beginner", goals: ["Lose weight"] } },
  { method: 'GET', path: '/users/profile' },
  { method: 'PUT', path: '/users/profile', body: { targetWeight: 74 } },
  
  // 2. Dashboard APIs
  { method: 'GET', path: '/dashboard/summary' },
  { method: 'GET', path: '/dashboard/quotes/daily' },

  // 3. Workout Plans & Programs
  { method: 'GET', path: '/programs/active' },
  { method: 'GET', path: '/workouts/507f191e810c19729de860ea' }, // Replaced MOCK_ID with valid ObjectId
  { method: 'POST', path: '/workouts/507f191e810c19729de860ea/complete', body: { timeTakenMinutes: 45, volumeLifted: 2000 } },
  { method: 'POST', path: '/workouts/session/log-set', body: { exerciseName: "Bench Press", weight: 65, reps: 10, setNumber: 1, workoutSessionId: "507f191e810c19729de860eb" } },
  { method: 'GET', path: '/workouts/exercise/history/Bench Press' },

  // 4. Progress & Tracking
  { method: 'GET', path: '/progress/summary' },
  { method: 'POST', path: '/progress/weight', body: { weight: 79 } },
  { method: 'GET', path: '/progress/weight-history' },
  { method: 'GET', path: '/progress/strength-levels' },
  { method: 'GET', path: '/progress/personal-bests' },

  // 5. Subscriptions
  { method: 'GET', path: '/subscriptions/status' },
];

async function runTests() {
  console.log('--- Starting API Verification ---');
  console.log(`Make sure your server is running on ${BASE_URL} (npm start)`);
  console.log(`Make sure you have inserted a valid FIREBASE_TOKEN if Auth is active.\n`);

  for (const ep of endpoints) {
    try {
      const options = {
        method: ep.method,
        headers: headers
      };
      
      if (ep.body) {
        options.body = JSON.stringify(ep.body);
      }

      console.log(`[TEST] ${ep.method} ${ep.path}...`);
      
      // We catch fetch errors manually so the script doesn't completely crash if server is off
      const res = await fetch(`${BASE_URL}${ep.path}`, options);
      const data = await res.json().catch(() => ({ error: 'Failed to parse JSON' }));
      
      if (res.ok) {
        console.log(`✅ SUCCESS (${res.status})`);
      } else {
        console.log(`❌ FAILED (${res.status}) - ${data.message || 'Unknown error'}`);
        // 401 means Auth is working and blocking invalid tokens, which is technically a "success" for security!
        if (res.status === 401) {
           console.log(`   (Note: 401 Unauthorized is expected if FIREBASE_TOKEN is invalid)`);
        }
      }
    } catch (error) {
      console.log(`❌ ERROR connecting to ${ep.path} - ${error.message}`);
    }
    console.log('-----------------------------------');
  }
}

runTests();

const admin = require('firebase-admin');

// Note: Ensure FIREBASE_SERVICE_ACCOUNT is properly configured in the future.
// For now, if the app is initialized elsewhere, we just use admin.auth()
// It is recommended to initialize admin in index.js or config/firebase.js

const verifyFirebaseToken = async (req, res, next) => {
  // ==========================================
  // REAL FIREBASE AUTH (Uncomment to use!)
  // ==========================================
  /*
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // contains uid, email, etc.
    next();
  } catch (error) {
    console.error('Firebase Auth Error:', error);
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
  }
  */

  // ==========================================
  // MOCK AUTH FOR TESTING PURPOSES
  // ==========================================
  req.user = {
    uid: "test_mock_firebase_uid_123",
    email: "test@example.com",
    name: "Mock User"
  };
  
  console.log(`[Mock Auth] Request to ${req.originalUrl} bypassed Auth`);
  next();
};

module.exports = verifyFirebaseToken;

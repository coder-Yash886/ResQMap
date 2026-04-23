const admin = require("firebase-admin");

// Note: In production, use environment variables to load credentials
// const serviceAccount = require("../../serviceAccountKey.json");

const initializeFirebase = () => {
  try {
    // If you have a serviceAccountKey.json, use:
    // admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    
    // For default credentials (e.g. deployed on GCP/Firebase)
    admin.initializeApp();
    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error("Firebase Admin initialization error:", error.message);
  }
};

const db = admin.firestore();

module.exports = {
  admin,
  db,
  initializeFirebase,
};

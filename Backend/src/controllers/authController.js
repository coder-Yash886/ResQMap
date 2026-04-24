const { db } = require("../config/firebase");

// This handles login or registration mapping from Firebase Auth to our Database
const syncUser = async (req, res, next) => {
  try {
    // The user object is attached by authMiddleware.js
    const { uid, email, name, picture } = req.user;

    const userRef = db.collection("users").doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      // Create new user
      const newUser = {
        uid,
        email,
        name: name || "",
        picture: picture || "",
        role: "user", // default role
        createdAt: new Date().toISOString(),
      };
      await userRef.set(newUser);
      return res.status(201).json({ success: true, user: newUser });
    } else {
      // Update existing user (e.g. if name/picture changed)
      await userRef.update({
        name: name || doc.data().name,
        picture: picture || doc.data().picture,
        lastLoginAt: new Date().toISOString()
      });
      const updatedDoc = await userRef.get();
      return res.status(200).json({ success: true, user: updatedDoc.data() });
    }
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const doc = await db.collection("users").doc(uid).get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user: doc.data() });
  } catch (error) {
    next(error);
  }
};

module.exports = { syncUser, getProfile };

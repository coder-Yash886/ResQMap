const express = require("express");
const { syncUser, getProfile } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Route to sync Firebase user to Firestore (Call after login/register on frontend)
router.post("/sync", verifyToken, syncUser);

// Route to get current user profile
router.get("/profile", verifyToken, getProfile);

module.exports = router;

const express = require("express");
const { register, login, getProfile } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Route to get current user profile
router.get("/profile", verifyToken, getProfile);

module.exports = router;

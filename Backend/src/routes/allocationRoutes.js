const express = require("express");
const { runAllocation, getAllocations } = require("../controllers/allocationController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/run", verifyToken, runAllocation);
router.get("/", verifyToken, getAllocations);

module.exports = router;

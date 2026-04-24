const express = require("express");
const { getSummaryReport } = require("../controllers/reportController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/summary", verifyToken, getSummaryReport);

module.exports = router;

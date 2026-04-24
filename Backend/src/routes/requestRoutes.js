const express = require("express");
const {
  createRequest,
  getAllRequests,
  updateRequestStatus,
} = require("../controllers/requestController");

const router = express.Router();

// Public or protected routes depending on setup. Assuming public for hackathon initial test.
router.post("/", createRequest);
router.get("/", getAllRequests);
router.patch("/:id/status", updateRequestStatus);

module.exports = router;

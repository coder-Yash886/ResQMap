const express = require("express");
const {
  createRequest,
  getAllRequests,
  getNearbyRequests,
  updateRequestStatus,
  assignRequest,
  startRequest,
  completeRequest,
} = require("../controllers/requestController");

const router = express.Router();

// CRUD
router.post("/", createRequest);
router.get("/", getAllRequests);
router.get("/nearby", getNearbyRequests);

// Lifecycle actions
router.patch("/:id/status", updateRequestStatus);
router.patch("/:id/assign", assignRequest);
router.patch("/:id/start", startRequest);
router.patch("/:id/complete", completeRequest);

module.exports = router;

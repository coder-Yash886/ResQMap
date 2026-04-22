const express = require("express");
const {
  createResource,
  getAllResources,
  updateResourceStatus,
} = require("../controllers/resourceController");

const router = express.Router();

router.post("/", createResource);
router.get("/", getAllResources);
router.patch("/:id/status", updateResourceStatus);

module.exports = router;

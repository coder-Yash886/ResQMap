const { randomUUID } = require("crypto");
const { db } = require("../config/firebase");
const {
  validateCreatePayload,
  validateStatusUpdate,
} = require("../utils/resourceValidation");
const { runAutoMatch } = require("../services/allocationEngine");

const createResource = async (req, res) => {
  const validation = validateCreatePayload(req.body);

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid resource payload",
      errors: validation.errors,
    });
  }

  const { title, type, quantity, location, description = "" } = req.body;

  const resource = {
    id: randomUUID(),
    title: title.trim(),
    type,
    quantity,
    location: location.trim(),
    description: typeof description === "string" ? description.trim() : "",
    status: "available",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    await db.collection("resources").doc(resource.id).set(resource);

    // Trigger auto-match asynchronously
    runAutoMatch();

    return res.status(201).json({
      success: true,
      message: "Resource created successfully",
      data: resource,
    });
  } catch (error) {
    console.error("Error creating resource:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create resource",
    });
  }
};

const getAllResources = async (req, res) => {
  const { type, status } = req.query;

  try {
    let query = db.collection("resources");

    if (type) {
      query = query.where("type", "==", type);
    }
    if (status) {
      query = query.where("status", "==", status);
    }

    const snapshot = await query.get();
    const resources = [];
    snapshot.forEach((doc) => {
      resources.push(doc.data());
    });

    return res.status(200).json({
      success: true,
      count: resources.length,
      data: resources,
    });
  } catch (error) {
    console.error("Error fetching resources:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch resources",
    });
  }
};

const updateResourceStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const validation = validateStatusUpdate(status);

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid status update payload",
      errors: validation.errors,
    });
  }

  try {
    const resourceRef = db.collection("resources").doc(id);
    const doc = await resourceRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    await resourceRef.update({
      status,
      updatedAt: new Date().toISOString(),
    });

    const updatedDoc = await resourceRef.get();

    return res.status(200).json({
      success: true,
      message: "Resource status updated successfully",
      data: updatedDoc.data(),
    });
  } catch (error) {
    console.error("Error updating resource:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update resource",
    });
  }
};

module.exports = {
  createResource,
  getAllResources,
  updateResourceStatus,
};

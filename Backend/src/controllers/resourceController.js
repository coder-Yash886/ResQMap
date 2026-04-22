const { randomUUID } = require("crypto");
const { resources } = require("../data/resourceStore");
const {
  validateCreatePayload,
  validateStatusUpdate,
} = require("../utils/resourceValidation");

const createResource = (req, res) => {
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

  resources.push(resource);

  return res.status(201).json({
    success: true,
    message: "Resource created successfully",
    data: resource,
  });
};

const getAllResources = (req, res) => {
  const { type, status } = req.query;

  const filtered = resources.filter((item) => {
    if (type && item.type !== type) {
      return false;
    }
    if (status && item.status !== status) {
      return false;
    }
    return true;
  });

  return res.status(200).json({
    success: true,
    count: filtered.length,
    data: filtered,
  });
};

const updateResourceStatus = (req, res) => {
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

  const resource = resources.find((item) => item.id === id);

  if (!resource) {
    return res.status(404).json({
      success: false,
      message: "Resource not found",
    });
  }

  resource.status = status;
  resource.updatedAt = new Date().toISOString();

  return res.status(200).json({
    success: true,
    message: "Resource status updated successfully",
    data: resource,
  });
};

module.exports = {
  createResource,
  getAllResources,
  updateResourceStatus,
};

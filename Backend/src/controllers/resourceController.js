const Resource = require("../models/Resource");
const {
  validateCreatePayload,
  validateStatusUpdate,
} = require("../utils/resourceValidation");

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

  try {
    const resource = await Resource.create({
      title: title.trim(),
      type,
      quantity,
      location: location.trim(),
      description: typeof description === "string" ? description.trim() : "",
      status: "available",
    });

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
    let query = {};

    if (type) {
      query.type = type;
    }
    if (status) {
      query.status = status;
    }

    const resources = await Resource.find(query);

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
    const resource = await Resource.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resource status updated successfully",
      data: resource,
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

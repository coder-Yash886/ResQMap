const VALID_RESOURCE_TYPES = ["food", "medicine", "shelter", "volunteer", "funds"];
const VALID_RESOURCE_STATUSES = ["available", "allocated", "completed"];

const validateCreatePayload = (payload = {}) => {
  const errors = [];
  const { title, type, quantity, location } = payload;

  if (!title || typeof title !== "string" || !title.trim()) {
    errors.push("title is required");
  }

  if (!VALID_RESOURCE_TYPES.includes(type)) {
    errors.push(`type must be one of: ${VALID_RESOURCE_TYPES.join(", ")}`);
  }

  if (typeof quantity !== "number" || Number.isNaN(quantity) || quantity <= 0) {
    errors.push("quantity must be a number greater than 0");
  }

  if (!location || typeof location !== "string" || !location.trim()) {
    errors.push("location is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validateStatusUpdate = (status) => {
  if (!VALID_RESOURCE_STATUSES.includes(status)) {
    return {
      isValid: false,
      errors: [`status must be one of: ${VALID_RESOURCE_STATUSES.join(", ")}`],
    };
  }

  return {
    isValid: true,
    errors: [],
  };
};

module.exports = {
  VALID_RESOURCE_TYPES,
  VALID_RESOURCE_STATUSES,
  validateCreatePayload,
  validateStatusUpdate,
};

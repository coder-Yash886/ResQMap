const Request = require("../models/Request");

// ─── Helper ──────────────────────────────────────────────────────────────────
const urgencyScore = { low: 1, medium: 2, high: 3, critical: 4 };

// ─── CREATE REQUEST ───────────────────────────────────────────────────────────
const createRequest = async (req, res) => {
  console.log("📥 Incoming Create Request:", JSON.stringify(req.body, null, 2));
  const {
    title,
    category,
    resourceType,
    quantity,
    unit,
    urgency,
    location,
    description,
    requesterId,
    requesterName,
    requesterEmail,
  } = req.body;

  const cat = (category || resourceType || "").toLowerCase();
  const validCategories = ["food", "medicine", "shelter", "clothes", "water", "volunteer", "funds", "other"];

  if (!title || !cat || !quantity || !urgency) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields (title, category, quantity, urgency)",
    });
  }

  if (!validCategories.includes(cat)) {
    return res.status(400).json({ success: false, message: "Invalid category" });
  }

  const validUrgencies = ["low", "medium", "high", "critical"];
  if (!validUrgencies.includes(urgency.toLowerCase())) {
    return res.status(400).json({ success: false, message: "Invalid urgency level" });
  }

  // Normalize location — accept string (legacy) or object { address, lat, lng }
  let locationObj = { address: "", lat: null, lng: null };
  if (typeof location === "string") {
    locationObj.address = location.trim();
  } else if (location && typeof location === "object") {
    locationObj.address = (location.address || "").trim();
    locationObj.lat = location.lat != null ? Number(location.lat) : null;
    locationObj.lng = location.lng != null ? Number(location.lng) : null;
  }

  try {
    const requestObj = await Request.create({
      title: title.trim(),
      category: cat,
      resourceType: cat,
      quantity: Number(quantity),
      unit: unit || "units",
      urgency: urgency.toLowerCase(),
      location: locationObj,
      description: description ? description.trim() : "",
      requesterId: requesterId || "anonymous",
      requesterName: requesterName || "Anonymous",
      requesterEmail: requesterEmail || "",
      status: "pending",
    });

    // Emit socket event if io is attached to app
    const io = req.app.get("io");
    if (io) {
      io.emit("new_request", requestObj);
    }

    return res.status(201).json({
      success: true,
      message: "Request created successfully",
      data: requestObj,
    });
  } catch (error) {
    console.error("Error creating request:", error);
    return res.status(500).json({ success: false, message: "Failed to create request" });
  }
};

// ─── GET ALL REQUESTS ─────────────────────────────────────────────────────────
const getAllRequests = async (req, res) => {
  const { urgency, status, category } = req.query;

  // Status can be camelCase (e.g. inProgress) — preserve it as-is
  // Only lowercase simple statuses (pending, assigned, completed, closed)
  const normalizeStatus = (s) => {
    if (!s) return null;
    const lower = s.toLowerCase();
    if (lower === "inprogress") return "inProgress";
    return lower;
  };

  try {
    let query = {};
    if (urgency) query.urgency = urgency.toLowerCase();
    if (status)  query.status = normalizeStatus(status);
    if (category) query.category = category.toLowerCase();

    const requests = await Request.find(query).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch requests" });
  }
};

// ─── GET NEARBY REQUESTS ──────────────────────────────────────────────────────
const getNearbyRequests = async (req, res) => {
  const { lat, lng, radius = 10, status } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ success: false, message: "lat and lng are required" });
  }

  try {
    let query = {};
    if (status) query.status = status.toLowerCase();

    const all = await Request.find(query).sort({ createdAt: -1 });

    // Filter by radius using Haversine
    const { haversineDistance } = require("../utils/geoUtils");
    const nearby = all.filter((r) => {
      if (r.location.lat == null || r.location.lng == null) return true; // include if no coords
      const dist = haversineDistance(
        Number(lat), Number(lng),
        r.location.lat, r.location.lng
      );
      return dist <= Number(radius);
    });

    return res.status(200).json({ success: true, count: nearby.length, data: nearby });
  } catch (error) {
    console.error("Error fetching nearby requests:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch nearby requests" });
  }
};

// ─── UPDATE STATUS (generic — legacy) ────────────────────────────────────────
const updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["pending", "assigned", "inProgress", "completed", "closed"];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  try {
    const request = await Request.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    const io = req.app.get("io");
    if (io) io.emit("request_updated", request);

    return res.status(200).json({ success: true, data: request });
  } catch (error) {
    console.error("Error updating status:", error);
    return res.status(500).json({ success: false, message: "Failed to update status" });
  }
};

// ─── ASSIGN TO VOLUNTEER ──────────────────────────────────────────────────────
const assignRequest = async (req, res) => {
  const { id } = req.params;
  const { volunteerId, volunteerName } = req.body;

  if (!volunteerId) {
    return res.status(400).json({ success: false, message: "volunteerId is required" });
  }

  try {
    const request = await Request.findById(id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot assign a request that is already '${request.status}'`,
      });
    }

    request.status = "assigned";
    request.assignedTo = volunteerId;
    request.assignedToName = volunteerName || "Volunteer";
    request.assignedAt = new Date();
    await request.save();

    const io = req.app.get("io");
    if (io) io.emit("request_assigned", request);

    return res.status(200).json({ success: true, message: "Request assigned", data: request });
  } catch (error) {
    console.error("Error assigning request:", error);
    return res.status(500).json({ success: false, message: "Failed to assign request" });
  }
};

// ─── START DELIVERY ───────────────────────────────────────────────────────────
const startRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await Request.findById(id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    if (request.status !== "assigned") {
      return res.status(400).json({
        success: false,
        message: `Cannot start a request that is '${request.status}'`,
      });
    }

    request.status = "inProgress";
    request.startedAt = new Date();
    await request.save();

    const io = req.app.get("io");
    if (io) io.emit("request_updated", request);

    return res.status(200).json({ success: true, message: "Delivery started", data: request });
  } catch (error) {
    console.error("Error starting request:", error);
    return res.status(500).json({ success: false, message: "Failed to start request" });
  }
};

// ─── COMPLETE REQUEST ─────────────────────────────────────────────────────────
const completeRequest = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  try {
    const request = await Request.findById(id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    if (!["assigned", "inProgress"].includes(request.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot complete a request that is '${request.status}'`,
      });
    }

    request.status = "completed";
    request.completedAt = new Date();
    if (rating) request.feedback.rating = Number(rating);
    if (comment) request.feedback.comment = comment;
    await request.save();

    const io = req.app.get("io");
    if (io) io.emit("request_completed", request);

    return res.status(200).json({ success: true, message: "Request completed", data: request });
  } catch (error) {
    console.error("Error completing request:", error);
    return res.status(500).json({ success: false, message: "Failed to complete request" });
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  getNearbyRequests,
  updateRequestStatus,
  assignRequest,
  startRequest,
  completeRequest,
};

const { randomUUID } = require("crypto");
const { db } = require("../config/firebase");

const createRequest = async (req, res) => {
  const { title, resourceType, quantity, urgency, location, description, requesterId } = req.body;

  if (!title || !resourceType || !quantity || !urgency || !location) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields (title, resourceType, quantity, urgency, location)",
    });
  }

  // urgency can be "low", "medium", "high", "critical"
  const validUrgencies = ["low", "medium", "high", "critical"];
  if (!validUrgencies.includes(urgency.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: "Invalid urgency level",
    });
  }

  const requestObj = {
    id: randomUUID(),
    title: title.trim(),
    resourceType,
    quantity,
    urgency: urgency.toLowerCase(),
    location: location.trim(),
    description: description ? description.trim() : "",
    requesterId: requesterId || "anonymous",
    status: "pending", // pending, fulfilled, closed
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    await db.collection("requests").doc(requestObj.id).set(requestObj);

    return res.status(201).json({
      success: true,
      message: "Request created successfully",
      data: requestObj,
    });
  } catch (error) {
    console.error("Error creating request:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create request",
    });
  }
};

const getAllRequests = async (req, res) => {
  const { urgency, status } = req.query;

  try {
    let query = db.collection("requests");

    if (urgency) {
      query = query.where("urgency", "==", urgency.toLowerCase());
    }
    if (status) {
      query = query.where("status", "==", status.toLowerCase());
    }

    const snapshot = await query.get();
    const requests = [];
    snapshot.forEach((doc) => {
      requests.push(doc.data());
    });

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch requests",
    });
  }
};

const updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["pending", "fulfilled", "closed"];
  if (!status || !validStatuses.includes(status.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: "Invalid status update payload",
    });
  }

  try {
    const requestRef = db.collection("requests").doc(id);
    const doc = await requestRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    await requestRef.update({
      status: status.toLowerCase(),
      updatedAt: new Date().toISOString(),
    });

    const updatedDoc = await requestRef.get();

    return res.status(200).json({
      success: true,
      message: "Request status updated successfully",
      data: updatedDoc.data(),
    });
  } catch (error) {
    console.error("Error updating request:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update request",
    });
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  updateRequestStatus,
};

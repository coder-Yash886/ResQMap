const { db } = require("../config/firebase");

// Priority score formula:
// Urgency: Critical (4), High (3), Medium (2), Low (1)
// The higher the score, the higher the priority.
const getUrgencyScore = (urgency) => {
  switch (urgency) {
    case "critical": return 4;
    case "high": return 3;
    case "medium": return 2;
    case "low": return 1;
    default: return 0;
  }
};

const runAllocation = async (req, res, next) => {
  console.log("Running Auto-Match Allocation Engine...");

  try {
    // Get all pending requests
    const requestsSnapshot = await db.collection("requests").where("status", "==", "pending").get();
    let requests = [];
    requestsSnapshot.forEach((doc) => requests.push({ id: doc.id, ...doc.data() }));

    if (requests.length === 0) {
      return res.status(200).json({ success: true, message: "No pending requests to match.", matchCount: 0 });
    }

    // Sort requests by priority (urgency score) descending
    requests.sort((a, b) => getUrgencyScore(b.urgency) - getUrgencyScore(a.urgency));

    // Get all available resources
    const resourcesSnapshot = await db.collection("resources").where("status", "==", "available").get();
    let resources = [];
    resourcesSnapshot.forEach((doc) => resources.push({ id: doc.id, ...doc.data() }));

    const batch = db.batch();
    let matchCount = 0;
    const matches = [];

    for (let reqData of requests) {
      // Find matching resource by type and sufficient quantity
      const matchIndex = resources.findIndex(resItem => 
        resItem.type === reqData.resourceType && 
        resItem.quantity >= reqData.quantity &&
        resItem.status === "available"
      );

      if (matchIndex !== -1) {
        const matchedResource = resources[matchIndex];
        
        // Update Request
        const requestRef = db.collection("requests").doc(reqData.id);
        batch.update(requestRef, { 
          status: "fulfilled", 
          matchedResourceId: matchedResource.id,
          updatedAt: new Date().toISOString()
        });

        // Update Resource
        const resourceRef = db.collection("resources").doc(matchedResource.id);
        batch.update(resourceRef, {
          status: "allocated",
          matchedRequestId: reqData.id,
          updatedAt: new Date().toISOString()
        });

        matches.push({ requestId: reqData.id, resourceId: matchedResource.id });

        // Remove the resource from our local available pool
        resources.splice(matchIndex, 1);
        matchCount++;
      }
    }

    if (matchCount > 0) {
      await batch.commit();
      return res.status(200).json({ 
        success: true, 
        message: `Successfully auto-matched ${matchCount} requests.`, 
        matchCount,
        matches
      });
    } else {
      return res.status(200).json({ success: true, message: "No matches found in this run.", matchCount: 0 });
    }

  } catch (error) {
    next(error);
  }
};

const getAllocations = async (req, res, next) => {
  try {
    const requestsSnapshot = await db.collection("requests").where("status", "==", "fulfilled").get();
    let allocations = [];
    requestsSnapshot.forEach((doc) => allocations.push({ id: doc.id, ...doc.data() }));

    res.status(200).json({ success: true, count: allocations.length, data: allocations });
  } catch (error) {
    next(error);
  }
};

module.exports = { runAllocation, getAllocations };

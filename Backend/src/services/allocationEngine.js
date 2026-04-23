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

const runAutoMatch = async () => {
  console.log("Running Auto-Match Allocation Engine...");

  try {
    // Get all pending requests
    const requestsSnapshot = await db.collection("requests").where("status", "==", "pending").get();
    let requests = [];
    requestsSnapshot.forEach((doc) => requests.push({ id: doc.id, ...doc.data() }));

    if (requests.length === 0) {
      console.log("No pending requests to match.");
      return;
    }

    // Sort requests by priority (urgency score) descending
    requests.sort((a, b) => getUrgencyScore(b.urgency) - getUrgencyScore(a.urgency));

    // Get all available resources
    const resourcesSnapshot = await db.collection("resources").where("status", "==", "available").get();
    let resources = [];
    resourcesSnapshot.forEach((doc) => resources.push({ id: doc.id, ...doc.data() }));

    const batch = db.batch();
    let matchCount = 0;

    for (let req of requests) {
      // Find matching resource by type and sufficient quantity
      const matchIndex = resources.findIndex(res => 
        res.type === req.resourceType && 
        res.quantity >= req.quantity &&
        res.status === "available"
      );

      if (matchIndex !== -1) {
        const matchedResource = resources[matchIndex];
        
        console.log(`Matched Request [${req.id}] with Resource [${matchedResource.id}]`);

        // Update Request
        const requestRef = db.collection("requests").doc(req.id);
        batch.update(requestRef, { 
          status: "fulfilled", 
          matchedResourceId: matchedResource.id,
          updatedAt: new Date().toISOString()
        });

        // Update Resource
        // For simplicity, we just mark the resource as allocated. In a real scenario, we might deduct quantity.
        const resourceRef = db.collection("resources").doc(matchedResource.id);
        batch.update(resourceRef, {
          status: "allocated",
          matchedRequestId: req.id,
          updatedAt: new Date().toISOString()
        });

        // Remove the resource from our local available pool
        resources.splice(matchIndex, 1);
        matchCount++;
      }
    }

    if (matchCount > 0) {
      await batch.commit();
      console.log(`Successfully auto-matched ${matchCount} requests.`);
    } else {
      console.log("No matches found in this run.");
    }

  } catch (error) {
    console.error("Error in Allocation Engine:", error);
  }
};

module.exports = {
  runAutoMatch,
};

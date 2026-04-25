const Request = require("../models/Request");
const Resource = require("../models/Resource");

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
    const requests = await Request.find({ status: "pending" });

    if (requests.length === 0) {
      return res.status(200).json({ success: true, message: "No pending requests to match.", matchCount: 0 });
    }

    // Sort requests by priority (urgency score) descending
    requests.sort((a, b) => getUrgencyScore(b.urgency) - getUrgencyScore(a.urgency));

    // Get all available resources
    const resources = await Resource.find({ status: "available" });

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
        reqData.status = "fulfilled";
        reqData.matchedResourceId = matchedResource._id;
        await reqData.save();

        // Update Resource
        matchedResource.status = "allocated";
        matchedResource.matchedRequestId = reqData._id;
        await matchedResource.save();

        matches.push({ requestId: reqData._id, resourceId: matchedResource._id });

        // Remove the resource from our local available pool
        resources.splice(matchIndex, 1);
        matchCount++;
      }
    }

    if (matchCount > 0) {
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
    const allocations = await Request.find({ status: "fulfilled" }).populate("matchedResourceId");

    res.status(200).json({ success: true, count: allocations.length, data: allocations });
  } catch (error) {
    next(error);
  }
};

module.exports = { runAllocation, getAllocations };

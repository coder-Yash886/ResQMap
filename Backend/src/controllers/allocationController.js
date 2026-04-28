const Request = require("../models/Request");
const Resource = require("../models/Resource");
const { haversineDistance } = require("../utils/geoUtils");

const MATCH_RADIUS_KM = 50; // match within 50km for hackathon demo

// Priority score formula:
// Critical (4), High (3), Medium (2), Low (1)
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
  console.log("Running Geo-Aware Auto-Match Allocation Engine...");

  try {
    const requests = await Request.find({ status: "pending" });

    if (requests.length === 0) {
      return res.status(200).json({ success: true, message: "No pending requests to match.", matchCount: 0 });
    }

    // Sort by urgency descending
    requests.sort((a, b) => getUrgencyScore(b.urgency) - getUrgencyScore(a.urgency));

    const resources = await Resource.find({ status: "available" });

    let matchCount = 0;
    const matches = [];

    for (let reqData of requests) {
      // Find matching resource: type match + sufficient quantity + geo proximity
      const reqLat = reqData.location?.lat;
      const reqLng = reqData.location?.lng;

      const matchIndex = resources.findIndex((resItem) => {
        // Category / type match
        const typeMatch =
          resItem.type === reqData.category || resItem.type === reqData.resourceType;
        if (!typeMatch) return false;

        // Quantity check
        if (resItem.quantity < reqData.quantity) return false;

        // Geo check — if either side has no coords, skip distance filter
        if (reqLat != null && reqLng != null && resItem.lat != null && resItem.lng != null) {
          const dist = haversineDistance(reqLat, reqLng, resItem.lat, resItem.lng);
          if (dist > MATCH_RADIUS_KM) return false;
        }

        return resItem.status === "available";
      });

      if (matchIndex !== -1) {
        const matchedResource = resources[matchIndex];

        // Update Request → fulfilled
        reqData.status = "assigned";
        reqData.matchedResourceId = matchedResource._id;
        await reqData.save();

        // Update Resource → allocated
        matchedResource.status = "allocated";
        matchedResource.matchedRequestId = reqData._id;
        await matchedResource.save();

        matches.push({ requestId: reqData._id, resourceId: matchedResource._id });
        resources.splice(matchIndex, 1);
        matchCount++;
      }
    }

    // Emit socket event
    const io = req.app.get("io");
    if (io && matchCount > 0) {
      io.emit("allocation_run", { matchCount, matches });
    }

    if (matchCount > 0) {
      return res.status(200).json({
        success: true,
        message: `Successfully auto-matched ${matchCount} requests.`,
        matchCount,
        matches,
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
    const allocations = await Request.find({
      status: { $in: ["assigned", "inProgress", "completed"] },
    }).populate("matchedResourceId");

    res.status(200).json({ success: true, count: allocations.length, data: allocations });
  } catch (error) {
    next(error);
  }
};

module.exports = { runAllocation, getAllocations };

const { db } = require("../config/firebase");

const getSummaryReport = async (req, res, next) => {
  try {
    const resourcesSnapshot = await db.collection("resources").get();
    const requestsSnapshot = await db.collection("requests").get();

    let totalResources = 0;
    let availableResources = 0;
    let allocatedResources = 0;

    resourcesSnapshot.forEach((doc) => {
      totalResources++;
      const data = doc.data();
      if (data.status === "available") availableResources++;
      if (data.status === "allocated") allocatedResources++;
    });

    let totalRequests = 0;
    let pendingRequests = 0;
    let fulfilledRequests = 0;

    requestsSnapshot.forEach((doc) => {
      totalRequests++;
      const data = doc.data();
      if (data.status === "pending") pendingRequests++;
      if (data.status === "fulfilled") fulfilledRequests++;
    });

    return res.status(200).json({
      success: true,
      data: {
        resources: {
          total: totalResources,
          available: availableResources,
          allocated: allocatedResources,
        },
        requests: {
          total: totalRequests,
          pending: pendingRequests,
          fulfilled: fulfilledRequests,
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { getSummaryReport };

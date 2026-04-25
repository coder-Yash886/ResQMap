const Resource = require("../models/Resource");
const Request = require("../models/Request");

const getSummaryReport = async (req, res, next) => {
  try {
    const totalResources = await Resource.countDocuments();
    const availableResources = await Resource.countDocuments({ status: "available" });
    const allocatedResources = await Resource.countDocuments({ status: "allocated" });

    const totalRequests = await Request.countDocuments();
    const pendingRequests = await Request.countDocuments({ status: "pending" });
    const fulfilledRequests = await Request.countDocuments({ status: "fulfilled" });

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

const getHealthStatus = (req, res) => {
  res.status(200).json({
    success: true,
    service: "AidSync Backend API",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  getHealthStatus,
};

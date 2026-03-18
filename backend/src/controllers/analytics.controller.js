const analyticsService = require('../services/analytics.service');

async function getAnalytics(req, res) {
  const userId = req.user.id;
  const websiteId = req.params.websiteId;

  const analytics = await analyticsService.getAnalyticsByMonitor(userId, websiteId);

  if (!analytics) {
    return res.status(404).json({
      error: { message: 'Website not found' }
    });
  }

  res.json(analytics);
}

module.exports = {
  getAnalytics
};

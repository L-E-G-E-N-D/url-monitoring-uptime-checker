const analyticsService = require('../services/analytics.service');

async function getAnalytics(req, res) {
  try {
    const userId = req.user.id;
    const websiteId = req.params.websiteId;

    console.log(`Fetching analytics for monitor ${websiteId} and user ${userId}`);

    const analytics = await analyticsService.getAnalyticsByMonitor(userId, websiteId);

    if (!analytics) {
      return res.status(404).json({
        error: { message: 'Website not found or access denied' }
      });
    }

    res.json(analytics);
  } catch (err) {
    console.error('Analytics Fetch Error:', err);
    res.status(500).json({
      error: { message: 'Internal server error while fetching analytics' }
    });
  }
}

module.exports = {
  getAnalytics
};

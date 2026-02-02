const monitorService = require('../services/monitor.service');

async function createMonitor(req, res) {
  const { url, checkIntervalMinutes } = req.body;
  const userId = req.user.id;

  if (!url || !checkIntervalMinutes) {
    return res.status(400).json({
      error: { message: 'url and checkIntervalMinutes are required' },
    });
  }

  try {
    const parsedUrl = new URL(url);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Only HTTP/HTTPS protocols are supported');
    }
  } catch (err) {
    return res.status(400).json({ error: { message: 'Invalid URL format' } });
  }

  if (isNaN(checkIntervalMinutes) || checkIntervalMinutes < 1) {
    return res.status(400).json({ error: { message: 'Interval must be at least 1 minute' } });
  }

  const monitor = await monitorService.createMonitor(
    userId,
    url,
    checkIntervalMinutes
  );

  res.status(201).json(monitor);
}

async function getMonitors(req, res) {
  const userId = req.user.id;
  const monitors = await monitorService.getMonitorsByUser(userId);
  res.json(monitors);
}

async function updateMonitor(req, res) {
  const userId = req.user.id;
  const monitorId = req.params.id;
  const { checkIntervalMinutes, isActive } = req.body;

  const updated = await monitorService.updateMonitor(
    userId,
    monitorId,
    { checkIntervalMinutes, isActive }
  );

  if (!updated) {
    return res.status(404).json({
      error: { message: 'Monitor not found' },
    });
  }

  res.json({ message: 'Monitor updated' });
}

async function deleteMonitor(req, res) {
  const userId = req.user.id;
  const monitorId = req.params.id;

  const deleted = await monitorService.deleteMonitor(userId, monitorId);

  if (!deleted) {
    return res.status(404).json({
      error: { message: 'Monitor not found' },
    });
  }

  res.json({ message: 'Monitor deleted' });
}

module.exports = {
  createMonitor,
  getMonitors,
  updateMonitor,
  deleteMonitor,
};

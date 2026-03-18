const express = require('express');
const controller = require('../controllers/analytics.controller');
const authenticateToken = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticateToken);
router.get('/:websiteId', controller.getAnalytics);

module.exports = router;

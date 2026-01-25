const express = require('express');
const controller = require('../controllers/monitor.controller');
const authenticateToken = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticateToken);

router.post('/', controller.createMonitor);
router.get('/', controller.getMonitors);
router.put('/:id', controller.updateMonitor);
router.delete('/:id', controller.deleteMonitor);

module.exports = router;

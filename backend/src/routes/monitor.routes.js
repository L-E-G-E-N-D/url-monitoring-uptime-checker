const express = require('express');
const controller = require('../controllers/monitor.controller');

const router = express.Router();

router.use((req, res, next) => {
  req.user = { id: '44bec830-8701-4b6a-bd5c-61b6bb1eae15' };
  next();
});

router.post('/', controller.createMonitor);
router.get('/', controller.getMonitors);
router.put('/:id', controller.updateMonitor);
router.delete('/:id', controller.deleteMonitor);

module.exports = router;

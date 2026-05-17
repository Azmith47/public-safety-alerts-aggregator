const express = require('express');
const router = express.Router();
const { getAlerts, getTrafficAlerts } = require('../controllers/alertsController');

router.get('/', getAlerts);
router.get('/traffic', getTrafficAlerts);

module.exports = router;
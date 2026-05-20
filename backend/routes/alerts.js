const express = require('express');
const router = express.Router();
const { getAlerts, getTrafficAlerts } = require('../controllers/alertsController');
const { getAlertsFromDb, getAlertById } = require('../controllers/alertsController');

router.get('/', getAlerts);
router.get('/traffic', getTrafficAlerts);
router.get('/db', getAlertsFromDb);
router.get('/db/:id', getAlertById);

module.exports = router;
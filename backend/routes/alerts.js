const express = require('express');
const router = express.Router();
const { getAlerts, getTrafficAlerts } = require('../controllers/alertsController');
const { getAlertsFromDb, getAlertById, unsubscribe } = require('../controllers/alertsController');

router.get('/', getAlerts);
router.get('/traffic', getTrafficAlerts);
router.get('/db', getAlertsFromDb);
router.get('/db/:id', getAlertById);
router.get('/unsubscribe/:token', unsubscribe);

module.exports = router;
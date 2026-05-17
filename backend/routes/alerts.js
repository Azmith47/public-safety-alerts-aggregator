const express = require('express');
const router = express.Router();
const { getAlerts, getTrafficAlerts, getFireAlerts } = require('../controllers/alertsController');

//set all alert routes
    //get routes
router.get('/', getAlerts);
router.get('/traffic', getTrafficAlerts);
router.get('/fire', getFireAlerts);

module.exports = router;
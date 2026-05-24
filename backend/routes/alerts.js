const express = require('express');
const router = express.Router();
const { getAlert ,getAlerts, getTrafficAlerts, getFireAlerts } = require('../controllers/alertsController');

//set all alert routes
    //get routes
router.get('/', getAlerts);
router.get('/traffic', getTrafficAlerts);
router.get('/fire', getFireAlerts);

//filtered get routes
    //get alert by id
router.get('/:id', getAlert);

module.exports = router;
import express from 'express'

const router = express.Router()

import {
    getAlert,
    getAlerts,
    getTrafficAlerts,
    getFireAlerts
} from '../controllers/alertsController.js'

//set all alert routes
    //get routes
router.get('/', getAlerts);
router.get('/traffic', getTrafficAlerts);
router.get('/fire', getFireAlerts);

//filtered get routes
    //get alert by id
router.get('/:id', getAlert);

export default router;
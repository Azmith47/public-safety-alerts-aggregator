import express from 'express';
import { getAlerts, getTrafficAlerts } from '../controllers/alertsController.js';
import { getAlertsFromDb, getAlertById, unsubscribe } from '../controllers/alertsController.js';

const router = express.Router();

router.get('/', getAlerts);
router.get('/traffic', getTrafficAlerts);
router.get('/db', getAlertsFromDb);
router.get('/db/:id', getAlertById);
router.get('/unsubscribe/:token', unsubscribe);

export default router;
import express from "express";
import {
	getAlertsFromDb,
	getAlertById,
	unsubscribe,
} from "../controllers/alertsController.js";

const router = express.Router();

router.get("/db", getAlertsFromDb);
router.get("/db/:id", getAlertById);
router.get("/unsubscribe/:token", unsubscribe);

export default router;

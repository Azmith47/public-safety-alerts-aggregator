import express from "express";
import {
	getAlertsFromDb,
	getAlertById,
} from "../controllers/alertsController.js";

const router = express.Router();

router.get("/", getAlertsFromDb);
router.get("/:id", getAlertById);

export default router;

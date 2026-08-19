import express from "express";

import geoController from "../controllers/geoController.js";

const router = express.Router();

router.get("/alerts/in-box", geoController.getAlertsInBoundingBox);
router.get("/alerts/nearby", geoController.getAlertsNearby);
router.get("/alerts/:alertId/geometry", geoController.getAlertGeometry);

export default router;

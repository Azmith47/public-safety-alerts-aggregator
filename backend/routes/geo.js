const express = require("express");
const router = express.Router();
const geoController = require("../controllers/geoController");

router.get("/alerts/in-box", geoController.getAlertsInBoundingBox);
router.get("/alerts/nearby", geoController.getAlertsNearby);
router.get("/alerts/:alertId/geometry", geoController.getAlertGeometry);

module.exports = router;

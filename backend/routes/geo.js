<<<<<<< Updated upstream
const express = require("express");
const router = express.Router();
const geoController = require("../controllers/geoController");
=======
import express from "express";

import geoController from "../controllers/geoController.js";

const router = express.Router();
>>>>>>> Stashed changes

router.get("/alerts/in-box", geoController.getAlertsInBoundingBox);
router.get("/alerts/nearby", geoController.getAlertsNearby);
router.get("/alerts/:alertId/geometry", geoController.getAlertGeometry);

<<<<<<< Updated upstream
module.exports = router;
=======
export default router;
>>>>>>> Stashed changes

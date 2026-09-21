import express from "express";

import geoController from "../controllers/geoController.js";

const router = express.Router();

router.get("/loadgeometry", geoController.getMapGeometry);

export default router;
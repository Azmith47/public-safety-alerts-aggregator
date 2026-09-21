import express from "express";

import {
	getAllSourceHealth,
	getSourceHealth,
} from "../controllers/sourceHealthController.js";

const router = express.Router();

router.get("/health", getAllSourceHealth);
router.get("/health/:sourceId", getSourceHealth);

export default router;

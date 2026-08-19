<<<<<<< Updated upstream
const express = require('express');
const router = express.Router();
const { getAllSourceHealth, getSourceHealth } = require('../controllers/sourceHealthController');

router.get('/health', getAllSourceHealth);
router.get('/health/:sourceId', getSourceHealth);

module.exports = router;
=======
import express from "express";

import {
	getAllSourceHealth,
	getSourceHealth,
} from "../controllers/sourceHealthController.js";

const router = express.Router();

router.get("/health", getAllSourceHealth);
router.get("/health/:sourceId", getSourceHealth);

export default router;
>>>>>>> Stashed changes

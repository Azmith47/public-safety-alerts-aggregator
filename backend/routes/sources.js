const express = require('express');
const router = express.Router();
const { getAllSourceHealth, getSourceHealth } = require('../controllers/sourceHealthController');

router.get('/health', getAllSourceHealth);
router.get('/health/:sourceId', getSourceHealth);

module.exports = router;

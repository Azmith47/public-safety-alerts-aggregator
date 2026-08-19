<<<<<<< Updated upstream
const SourceHealthService = require('../services/SourceHealthService');

const getAllSourceHealth = async (req, res) => {
    try {
        const health = await SourceHealthService.getAllHealth();
        res.json({ data: health });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to load source health data' });
    }
};

const getSourceHealth = async (req, res) => {
    try {
        const sourceId = parseInt(req.params.sourceId, 10);
        if (Number.isNaN(sourceId)) {
            return res.status(400).json({ error: 'Invalid source ID' });
        }

        const health = await SourceHealthService.getHealthForSource(sourceId);
        if (!health) {
            return res.status(404).json({ error: 'Source health record not found' });
        }

        res.json({ data: health });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to load source health data' });
    }
};

module.exports = { getAllSourceHealth, getSourceHealth };
=======
import SourceHealthService from "../services/SourceHealthService.js";

export const getAllSourceHealth = async (req, res) => {
	try {
		const health = await SourceHealthService.getAllHealth();
		res.json({ data: health });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to load source health data" });
	}
};

export const getSourceHealth = async (req, res) => {
	try {
		const sourceId = parseInt(req.params.sourceId, 10);
		if (Number.isNaN(sourceId)) {
			return res.status(400).json({ error: "Invalid source ID" });
		}

		const health = await SourceHealthService.getHealthForSource(sourceId);
		if (!health) {
			return res
				.status(404)
				.json({ error: "Source health record not found" });
		}

		res.json({ data: health });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to load source health data" });
	}
};

export default getAllSourceHealth;
>>>>>>> Stashed changes

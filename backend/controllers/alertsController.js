import AlertQueryService from "../services/AlertQueryService.js";

export const getAlertsFromDb = async (req, res) => {
	try {
		const filters = {};
		if (req.query.active !== undefined)
			filters.active = req.query.active === "true";
		if (req.query.category_id)
			filters.category_id = parseInt(req.query.category_id);
		if (req.query.source_id)
			filters.source_id = parseInt(req.query.source_id);
		if (req.query.severity_level_id)
			filters.severity_level_id = parseInt(req.query.severity_level_id);
		if (req.query.status_type_id)
			filters.status_type_id = parseInt(req.query.status_type_id);
		if (req.query.region_id)
			filters.region_id = parseInt(req.query.region_id);
		if (req.query.council_area_id)
			filters.council_area_id = parseInt(req.query.council_area_id);
		if (req.query.location_id)
			filters.location_id = parseInt(req.query.location_id);
		if (req.query.q) filters.q = req.query.q;
		if (req.query.startDate) filters.startDate = req.query.startDate;
		if (req.query.endDate) filters.endDate = req.query.endDate;

		const options = {
			limit: req.query.limit ? parseInt(req.query.limit) : undefined,
			offset: req.query.offset ? parseInt(req.query.offset) : undefined,
			sortBy: req.query.sortBy,
			sortDir: req.query.sortDir,
		};

		const result = await AlertQueryService.queryAlerts(filters, options);
		res.json(result);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to query alerts" });
	}
};

export const getAlertById = async (req, res) => {
	try {
		const id = req.params.id;
		const result = await AlertQueryService.getAlertDetails(id);
		if (!result) return res.status(404).json({ error: "Alert not found" });
		res.json(result);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to fetch alert details" });
	}
};
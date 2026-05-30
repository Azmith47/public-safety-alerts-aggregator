import geoSpatialService from "../services/GeoSpatialService.js";

class GeoController {
	parseNumber(value, fallback = null) {
		const result = Number(value);
		return Number.isFinite(result) ? result : fallback;
	}

	buildQueryOptions(req) {
		return {
			limit: this.parseNumber(req.query.limit, 50),
			offset: this.parseNumber(req.query.offset, 0),
			sortBy: req.query.sortBy,
			sortDir: req.query.sortDir,
		};
	}

	buildFilters(req) {
		return {
			active:
				req.query.active === "true"
					? true
					: req.query.active === "false"
						? false
						: undefined,
			category_id: this.parseNumber(req.query.category_id),
			source_id: this.parseNumber(req.query.source_id),
			severity_level_id: this.parseNumber(req.query.severity_level_id),
			status_type_id: this.parseNumber(req.query.status_type_id),
			q: req.query.q,
			startDate: req.query.startDate,
			endDate: req.query.endDate,
		};
	}

	getAlertsInBoundingBox = async (req, res, next) => {
		try {
			const minLat = this.parseNumber(req.query.minLat);
			const maxLat = this.parseNumber(req.query.maxLat);
			const minLng = this.parseNumber(req.query.minLng);
			const maxLng = this.parseNumber(req.query.maxLng);

			if (
				[minLat, maxLat, minLng, maxLng].some((value) => value === null)
			) {
				return res
					.status(400)
					.json({
						error: "Missing or invalid bounding box parameters: minLat, maxLat, minLng, maxLng.",
					});
			}

			const filters = this.buildFilters(req);
			const options = this.buildQueryOptions(req);
			const result = await geoSpatialService.findAlertsInBoundingBox(
				{ minLat, maxLat, minLng, maxLng },
				filters,
				options,
			);

			res.json(result);
		} catch (error) {
			next(error);
		}
	};

	getAlertsNearby = async (req, res, next) => {
		try {
			const latitude = this.parseNumber(req.query.latitude);
			const longitude = this.parseNumber(req.query.longitude);
			const radiusKm = this.parseNumber(req.query.radiusKm);

			if (
				[latitude, longitude, radiusKm].some((value) => value === null)
			) {
				return res
					.status(400)
					.json({
						error: "Missing or invalid nearby search parameters: latitude, longitude, radiusKm.",
					});
			}

			const filters = this.buildFilters(req);
			const options = this.buildQueryOptions(req);
			const result = await geoSpatialService.findAlertsNearby(
				latitude,
				longitude,
				radiusKm,
				filters,
				options,
			);

			res.json(result);
		} catch (error) {
			next(error);
		}
	};

	getAlertGeometry = async (req, res, next) => {
		try {
			const alertId = this.parseNumber(req.params.alertId);
			if (alertId === null) {
				return res
					.status(400)
					.json({ error: "Alert id must be a number." });
			}

			const result = await geoSpatialService.getAlertGeometry(alertId);
			if (!result) {
				return res.status(404).json({ error: "Alert not found." });
			}

			res.json(result);
		} catch (error) {
			next(error);
		}
	};
}

export default new GeoController();

<<<<<<< Updated upstream
const geoSpatialService = require("../services/GeoSpatialService");

function parseNumber(value, fallback = null) {
    const result = Number(value);
    return Number.isFinite(result) ? result : fallback;
}

function buildQueryOptions(req) {
    return {
        limit: parseNumber(req.query.limit, 50),
        offset: parseNumber(req.query.offset, 0),
        sortBy: req.query.sortBy,
        sortDir: req.query.sortDir
    };
}

function buildFilters(req) {
    return {
        active: req.query.active === 'true' ? true : req.query.active === 'false' ? false : undefined,
        category_id: parseNumber(req.query.category_id),
        source_id: parseNumber(req.query.source_id),
        severity_level_id: parseNumber(req.query.severity_level_id),
        status_type_id: parseNumber(req.query.status_type_id),
        q: req.query.q,
        startDate: req.query.startDate,
        endDate: req.query.endDate
    };
}

exports.getAlertsInBoundingBox = async (req, res, next) => {
    try {
        const minLat = parseNumber(req.query.minLat);
        const maxLat = parseNumber(req.query.maxLat);
        const minLng = parseNumber(req.query.minLng);
        const maxLng = parseNumber(req.query.maxLng);

        if ([minLat, maxLat, minLng, maxLng].some(value => value === null)) {
            return res.status(400).json({ error: "Missing or invalid bounding box parameters: minLat, maxLat, minLng, maxLng." });
        }

        const filters = buildFilters(req);
        const options = buildQueryOptions(req);
        const result = await geoSpatialService.findAlertsInBoundingBox({ minLat, maxLat, minLng, maxLng }, filters, options);

        res.json(result);
    } catch (error) {
        next(error);
    }
};

exports.getAlertsNearby = async (req, res, next) => {
    try {
        const latitude = parseNumber(req.query.latitude);
        const longitude = parseNumber(req.query.longitude);
        const radiusKm = parseNumber(req.query.radiusKm);

        if ([latitude, longitude, radiusKm].some(value => value === null)) {
            return res.status(400).json({ error: "Missing or invalid nearby search parameters: latitude, longitude, radiusKm." });
        }

        const filters = buildFilters(req);
        const options = buildQueryOptions(req);
        const result = await geoSpatialService.findAlertsNearby(latitude, longitude, radiusKm, filters, options);

        res.json(result);
    } catch (error) {
        next(error);
    }
};

exports.getAlertGeometry = async (req, res, next) => {
    try {
        const alertId = parseNumber(req.params.alertId);
        if (alertId === null) {
            return res.status(400).json({ error: "Alert id must be a number." });
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
=======
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

	getMapGeometry = async (req, res, next) => {
		try {
			const minLat = this.parseNumber(req.query.minLat);
			const maxLat = this.parseNumber(req.query.maxLat);
			const minLng = this.parseNumber(req.query.minLng);
			const maxLng = this.parseNumber(req.query.maxLng);

			if (
				[minLat, maxLat, minLng, maxLng].some((value) => value === null)
			) {
				return res.status(400).json({
					error:
						"Missing or invalid bounding box parameters: minLat, maxLat, minLng, maxLng.",
				});
			}

			const filters = this.buildFilters(req);
			const options = {
				...this.buildQueryOptions(req),
				limit: 10000,
			};

			const alertResult = await geoSpatialService.findAlertsInBoundingBox(
				{ minLat, maxLat, minLng, maxLng },
				filters,
				options,
			);

			const alerts = alertResult?.rows ?? [];
			const geometryArray = [];

			for (const alert of alerts) {

				const alertGeometry = await geoSpatialService.getAlertGeometry(alert.id);

				if (alertGeometry) {
					geometryArray.push({
						alertId: alert.id,
						alertType: alert.category_id,
						marker: alertGeometry.geometry.markers,
						polygon: alertGeometry.geometry.polygons,
						polyline: alertGeometry.geometry.polylines,
					});
				}
			}

			return res.json(geometryArray);
		} catch (error) {
			console.error("MAP GEOMETRY: error:", error);
			return next(error);
		}
	}
}

export default new GeoController();
>>>>>>> Stashed changes

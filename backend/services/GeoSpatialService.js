import AlertDAO from "../database/dao/AlertDAO.js";
import AlertMarkerDAO from "../database/dao/AlertMarkersDAO.js";
import AlertPolygonDAO from "../database/dao/AlertPolygonDAO.js";

class GeoSpatialService {
	_haversineDistanceKm(lat1, lng1, lat2, lng2) {
		const toRad = (degrees) => (degrees * Math.PI) / 180;
		const R = 6371; // Earth radius in km
		const dLat = toRad(lat2 - lat1);
		const dLng = toRad(lng2 - lng1);
		const a =
			Math.sin(dLat / 2) ** 2 +
			Math.cos(toRad(lat1)) *
				Math.cos(toRad(lat2)) *
				Math.sin(dLng / 2) ** 2;
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c;
	}

	_buildSqlFilters(filters, params) {
		const where = [];

		if (filters.active === true) {
			where.push("(end_date IS NULL OR end_date > datetime('now'))");
		} else if (filters.active === false) {
			where.push(
				"(end_date IS NOT NULL AND end_date <= datetime('now'))",
			);
		}

		if (filters.category_id) {
			where.push("category_id = ?");
			params.push(filters.category_id);
		}

		if (filters.source_id) {
			where.push("source_id = ?");
			params.push(filters.source_id);
		}

		if (filters.severity_level_id) {
			where.push("severity_level_id = ?");
			params.push(filters.severity_level_id);
		}

		if (filters.status_type_id) {
			where.push("status_type_id = ?");
			params.push(filters.status_type_id);
		}

		if (filters.q) {
			where.push("(LOWER(title) LIKE ? OR LOWER(description) LIKE ?)");
			const term = `%${String(filters.q).toLowerCase()}%`;
			params.push(term, term);
		}

		if (filters.startDate) {
			where.push("issued_at >= ?");
			params.push(filters.startDate);
		}

		if (filters.endDate) {
			where.push("issued_at <= ?");
			params.push(filters.endDate);
		}

		return where.length ? ` AND ${where.join(" AND ")}` : "";
	}

	async _queryAlertsByIds(alertIds, filters = {}, options = {}) {
		if (!alertIds.length) {
			return { total: 0, rows: [] };
		}

		const params = [...alertIds];
		const filterClause = this._buildSqlFilters(filters, params);

		const whereClause = `WHERE id IN (${alertIds.map(() => "?").join(",")})${filterClause}`;
		const allowedSort = new Set([
			"issued_at",
			"updated_at",
			"id",
			"start_date",
			"end_date",
		]);
		const sortBy = allowedSort.has(options.sortBy)
			? options.sortBy
			: "issued_at";
		const sortDir =
			options.sortDir && options.sortDir.toUpperCase() === "ASC"
				? "ASC"
				: "DESC";
		const orderClause = `ORDER BY ${sortBy} ${sortDir}`;
		const limit = Math.min(options.limit || 50, 200);
		const offset = options.offset || 0;

		const countRow = await AlertDAO.get(
			`SELECT COUNT(*) as count FROM alerts ${whereClause}`,
			params,
		);
		const total = countRow ? countRow.count : 0;

		const rows = await AlertDAO.all(
			`SELECT * FROM alerts ${whereClause} ${orderClause} LIMIT ? OFFSET ?`,
			params.concat([limit, offset]),
		);
		return { total, rows };
	}

	async _collectMatchIdsFromMarkerBox(box) {
		return AlertMarkerDAO.all(
			`SELECT DISTINCT alert_id FROM ${AlertMarkerDAO.tableName} WHERE latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?`,
			[box.minLat, box.maxLat, box.minLng, box.maxLng],
		).then((rows) => rows.map((row) => row.alert_id));
	}

	async _collectMatchIdsFromPolygonBox(box) {
		return AlertPolygonDAO.all(
			`SELECT DISTINCT alert_id FROM ${AlertPolygonDAO.tableName} WHERE latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?`,
			[box.minLat, box.maxLat, box.minLng, box.maxLng],
		).then((rows) => rows.map((row) => row.alert_id));
	}

	async findAlertsInBoundingBox(box, filters = {}, options = {}) {
		const markerIds = await this._collectMatchIdsFromMarkerBox(box);
		const polygonIds = await this._collectMatchIdsFromPolygonBox(box);
		const alertIds = Array.from(new Set([...markerIds, ...polygonIds]));
		return this._queryAlertsByIds(alertIds, filters, options);
	}

	async findAlertsNearby(lat, lng, radiusKm, filters = {}, options = {}) {
		const latRadians = (lat * Math.PI) / 180;
		const kmPerDegreeLat = 111.32;
		const kmPerDegreeLng =
			Math.abs(111.32 * Math.cos(latRadians)) || 111.32;
		const deltaLat = radiusKm / kmPerDegreeLat;
		const deltaLng = radiusKm / kmPerDegreeLng;
		const box = {
			minLat: lat - deltaLat,
			maxLat: lat + deltaLat,
			minLng: lng - deltaLng,
			maxLng: lng + deltaLng,
		};

		const markerRows = await AlertMarkerDAO.all(
			`SELECT DISTINCT alert_id, latitude, longitude FROM ${AlertMarkerDAO.tableName} WHERE latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?`,
			[box.minLat, box.maxLat, box.minLng, box.maxLng],
		);

		const markerIds = markerRows
			.filter(
				(row) =>
					this._haversineDistanceKm(
						lat,
						lng,
						row.latitude,
						row.longitude,
					) <= radiusKm,
			)
			.map((row) => row.alert_id);

		const polygonRows = await AlertPolygonDAO.all(
			`SELECT DISTINCT alert_id, latitude, longitude FROM ${AlertPolygonDAO.tableName} WHERE latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?`,
			[box.minLat, box.maxLat, box.minLng, box.maxLng],
		);

		const polygonIds = polygonRows
			.filter(
				(row) =>
					this._haversineDistanceKm(
						lat,
						lng,
						row.latitude,
						row.longitude,
					) <= radiusKm,
			)
			.map((row) => row.alert_id);

		const alertIds = Array.from(new Set([...markerIds, ...polygonIds]));
		return this._queryAlertsByIds(alertIds, filters, options);
	}

	async getAlertGeometry(alertId) {
		const alert = await AlertDAO.getById(alertId);
		if (!alert) return null;

		const markers = await AlertMarkerDAO.findAll(
			AlertMarkerDAO.tableName,
			"alert_id = ?",
			[alertId],
		);
		const polygons = await AlertPolygonDAO.findAll(
			AlertPolygonDAO.tableName,
			"alert_id = ?",
			[alertId],
		);

		return {
			alert,
			geometry: {
				markers,
				polygons,
			},
		};
	}
}

export default new GeoSpatialService();

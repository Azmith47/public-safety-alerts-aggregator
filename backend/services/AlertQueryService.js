const AlertDAO = require("../database/dao/AlertDAO");
const AlertMarkerDAO = require("../database/dao/AlertMarkersDAO");
const AlertPolygonDAO = require("../database/dao/AlertPolygonDAO");
const AlertRoadDAO = require("../database/dao/AlertRoadDAO");
const AlertAdviceDAO = require("../database/dao/AlertAdviceDAO");
const AlertLinkDAO = require("../database/dao/AlertLinkDAO");

class AlertQueryService {
    /**
     * Query alerts with filters and pagination.
     * filters: { active, category_id, source_id, severity_level_id, status_type_id, region_id, council_area_id, location_id, q, startDate, endDate }
     * options: { limit, offset, sortBy, sortDir }
     */
    async queryAlerts(filters = {}, options = {}) {
        const where = [];
        const params = [];

        if (filters.active === true) {
            where.push("(end_date IS NULL OR end_date > datetime('now'))");
        } else if (filters.active === false) {
            where.push("(end_date IS NOT NULL AND end_date <= datetime('now'))");
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

        if (filters.location_id) {
            where.push("location_id = ?");
            params.push(filters.location_id);
        }

        // region filter via locations -> council_areas
        if (filters.region_id) {
            where.push("location_id IN (SELECT id FROM locations WHERE council_area_id IN (SELECT id FROM council_areas WHERE region_id = ?))");
            params.push(filters.region_id);
        }

        if (filters.council_area_id) {
            where.push("location_id IN (SELECT id FROM locations WHERE council_area_id = ?)");
            params.push(filters.council_area_id);
        }

        if (filters.q) {
            where.push("(LOWER(title) LIKE ? OR LOWER(description) LIKE ?)");
            const t = `%${String(filters.q).toLowerCase()}%`;
            params.push(t, t);
        }

        if (filters.startDate) {
            where.push("issued_at >= ?");
            params.push(filters.startDate);
        }

        if (filters.endDate) {
            where.push("issued_at <= ?");
            params.push(filters.endDate);
        }

        const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

        // Sorting
        const allowedSort = new Set(['issued_at', 'updated_at', 'id', 'start_date', 'end_date']);
        const sortBy = allowedSort.has(options.sortBy) ? options.sortBy : 'issued_at';
        const sortDir = (options.sortDir && options.sortDir.toUpperCase() === 'ASC') ? 'ASC' : 'DESC';
        const orderClause = `ORDER BY ${sortBy} ${sortDir}`;

        const limit = Math.min(options.limit || 50, 200);
        const offset = options.offset || 0;

        const countRow = await AlertDAO.get(`SELECT COUNT(*) as count FROM alerts ${whereClause}`, params);
        const total = countRow ? countRow.count : 0;

        const rows = await AlertDAO.all(
            `SELECT * FROM alerts ${whereClause} ${orderClause} LIMIT ? OFFSET ?`,
            params.concat([limit, offset])
        );

        return { total, rows };
    }

    async getAlertDetails(id) {
        const alert = await AlertDAO.getById(id);
        if (!alert) return null;

        const markers = await AlertMarkerDAO.findAll(AlertMarkerDAO.tableName, 'alert_id = ?', [id]);
        const polygons = await AlertPolygonDAO.findAll(AlertPolygonDAO.tableName, 'alert_id = ?', [id]);
        const roads = await AlertRoadDAO.findAll(AlertRoadDAO.tableName, 'alert_id = ?', [id]);
        const advice = await AlertAdviceDAO.findAll(AlertAdviceDAO.tableName, 'alert_id = ?', [id]);
        const links = await AlertLinkDAO.findAll(AlertLinkDAO.tableName, 'alert_id = ?', [id]);

        return {
            alert,
            markers,
            polygons,
            roads,
            advice,
            links
        };
    }
}

module.exports = new AlertQueryService();

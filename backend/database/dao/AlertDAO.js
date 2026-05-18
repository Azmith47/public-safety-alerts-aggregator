const BaseDAO = require("./BaseDAO");

class AlertDAO extends BaseDAO {

    async create(alert) {

        const sql = `
            INSERT INTO alerts (
                external_id,
                title,
                description,
                category_id,
                source_id,
                location_id,
                status_type_id,
                severity_level_id,
                issued_at,
                updated_at,
                source_url,
                planned,
                is_major,
                impacting_network,
                delay,
                start_date,
                end_date,
                raw_payload
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        return this.run(sql, [
            alert.external_id,
            alert.title,
            alert.description,
            alert.category_id,
            alert.source_id,
            alert.location_id,
            alert.status_type_id,
            alert.severity_level_id,
            alert.issued_at,
            alert.updated_at,
            alert.source_url,
            alert.planned,
            alert.is_major,
            alert.impacting_network,
            alert.delay,
            alert.start_date,
            alert.end_date,
            alert.raw_payload
        ]);
    }

    async update(id, alert) {

        const sql = `
            UPDATE alerts
            SET
                title = ?,
                description = ?,
                category_id = ?,
                source_id = ?,
                location_id = ?,
                status_type_id = ?,
                severity_level_id = ?,
                issued_at = ?,
                updated_at = ?,
                source_url = ?,
                planned = ?,
                is_major = ?,
                impacting_network = ?,
                delay = ?,
                start_date = ?,
                end_date = ?,
                raw_payload = ?
            WHERE id = ?
        `;

        return this.run(sql, [
            alert.title,
            alert.description,
            alert.category_id,
            alert.source_id,
            alert.location_id,
            alert.status_type_id,
            alert.severity_level_id,
            alert.issued_at,
            alert.updated_at,
            alert.source_url,
            alert.planned,
            alert.is_major,
            alert.impacting_network,
            alert.delay,
            alert.start_date,
            alert.end_date,
            alert.raw_payload,
            id
        ]);
    }

    async exists(externalId) {
        return this.get(
            `SELECT * FROM alerts WHERE external_id = ?`,
            [externalId]
        );
    }

    async getById(id) {
        return this.get(
            `SELECT * FROM alerts WHERE id = ?`,
            [id]
        );
    }

    async getAllActiveAlerts() {
        return this.all(`
            SELECT * FROM alerts
            WHERE end_date IS NULL OR end_date > datetime('now')`
        );
    }

    async getAll() {
        return this.all(`
            SELECT * FROM alerts
            ORDER BY issued_at DESC
        `);
    }

    async delete(id) {
        return this.run(
            `DELETE FROM alerts WHERE id = ?`,
            [id]
        );
    }
}

module.exports = new AlertDAO();
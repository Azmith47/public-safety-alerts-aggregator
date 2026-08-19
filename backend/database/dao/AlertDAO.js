<<<<<<< Updated upstream
const BaseDAO = require("./BaseDAO");

class AlertDAO extends BaseDAO {

    constructor() {
        super("alerts");
    }

    async create(alert) {
        return super.insert(this.tableName, {
            external_id: alert.external_id,
            title: alert.title,
            description: alert.description,
            category_id: alert.category_id,
            source_id: alert.source_id,
            location_id: alert.location_id,
            status_type_id: alert.status_type_id,
            severity_level_id: alert.severity_level_id,
            issued_at: alert.issued_at,
            updated_at: alert.updated_at,
            source_url: alert.source_url,
            planned: alert.planned,
            is_major: alert.is_major,
            impacting_network: alert.impacting_network,
            delay: alert.delay,
            start_date: alert.start_date,
            end_date: alert.end_date,
            raw_payload: alert.raw_payload
        });
    }

    async update(id, alert) {
        return super.update(
            this.tableName,
            {
                title: alert.title,
                description: alert.description,
                category_id: alert.category_id,
                source_id: alert.source_id,
                location_id: alert.location_id,
                status_type_id: alert.status_type_id,
                severity_level_id: alert.severity_level_id,
                issued_at: alert.issued_at,
                updated_at: alert.updated_at,
                source_url: alert.source_url,
                planned: alert.planned,
                is_major: alert.is_major,
                impacting_network: alert.impacting_network,
                delay: alert.delay,
                start_date: alert.start_date,
                end_date: alert.end_date,
                raw_payload: alert.raw_payload
            },
            "id = ?",
            [id]
        );
    }

    async exists(externalId) {
        return this.findOne(
            this.tableName,
            "external_id = ?",
            [externalId]
        );
    }

    async getById(id) {
        return this.findOne(
            this.tableName,
            "id = ?",
            [id]
        );
    }

    async getAllActiveAlerts() {
        return this.findAll(
            this.tableName,
            "end_date IS NULL OR end_date > datetime('now')"
        );
    }

    async getAll() {
        return this.findAll(this.tableName, "1=1", [], "issued_at DESC");
    }

    async delete(id) {
        return super.delete(this.tableName, "id = ?", [id]);
    }
}

module.exports = new AlertDAO();
=======
import BaseDAO from "./BaseDAO.js";

class AlertDAO extends BaseDAO {
	constructor() {
		super("alerts");
	}

	async create(alert) {
		return super.insert(this.tableName, {
			external_id: alert.external_id,
			title: alert.title,
			description: alert.description,
			category_id: alert.category_id,
			source_id: alert.source_id,
			location_id: alert.location_id,
			status_type_id: alert.status_type_id,
			severity_level_id: alert.severity_level_id,
			issued_at: alert.issued_at,
			updated_at: alert.updated_at,
			source_url: alert.source_url,
			planned: alert.planned,
			is_major: alert.is_major,
			impacting_network: alert.impacting_network,
			delay: alert.delay,
			start_date: alert.start_date,
			end_date: alert.end_date,
			is_active: alert.is_active,
			raw_payload: alert.raw_payload,
		});
	}

	async update(id, alert) {
		return super.update(
			this.tableName,
			{
				title: alert.title,
				description: alert.description,
				category_id: alert.category_id,
				source_id: alert.source_id,
				location_id: alert.location_id,
				status_type_id: alert.status_type_id,
				severity_level_id: alert.severity_level_id,
				issued_at: alert.issued_at,
				updated_at: alert.updated_at,
				source_url: alert.source_url,
				planned: alert.planned,
				is_major: alert.is_major,
				impacting_network: alert.impacting_network,
				delay: alert.delay,
				start_date: alert.start_date,
				end_date: alert.end_date,
				is_active: alert.is_active,
				raw_payload: alert.raw_payload,
			},
			"id = ?",
			[id],
		);
	}

	async exists(externalId, sourceId = null) {
		if (sourceId) {
			return this.findOne(
				this.tableName,
				"external_id = ? AND source_id = ?",
				[externalId, sourceId],
			);
		}

		return this.findOne(this.tableName, "external_id = ?", [externalId]);
	}

	async getById(id) {
		return this.findOne(this.tableName, "id = ?", [id]);
	}

	async getAllActiveAlerts() {
		return this.findAll(
			this.tableName,
			"end_date IS NULL OR end_date > datetime('now')",
		);
	}

	async getAll() {
		return this.findAll(this.tableName, "1=1", [], "issued_at DESC");
	}

	async delete(idOrTable, whereClause = null, params = []) {
		if (whereClause) {
			return super.delete(idOrTable, whereClause, params);
		}

		return super.delete(this.tableName, "id = ?", [idOrTable]);
	}
}

export default new AlertDAO();
>>>>>>> Stashed changes

<<<<<<< Updated upstream
const BaseDAO = require("./BaseDAO");

class SourceHealthDAO extends BaseDAO {
    constructor() {
        super("source_health");
    }

    async getBySourceId(sourceId) {
        return this.findOne(this.tableName, "source_id = ?", [sourceId]);
    }

    async getAll() {
        return this.findAll(this.tableName, "1=1", [], "last_run_at DESC");
    }

    async create(entry) {
        return super.insert(this.tableName, {
            source_id: entry.source_id,
            last_run_at: entry.last_run_at,
            last_success_at: entry.last_success_at,
            last_failure_at: entry.last_failure_at,
            last_status: entry.last_status,
            last_message: entry.last_message,
            run_count: entry.run_count,
            success_count: entry.success_count,
            failure_count: entry.failure_count,
            processed_count: entry.processed_count,
            created_count: entry.created_count,
            updated_count: entry.updated_count,
            failed_count: entry.failed_count,
            created_at: entry.created_at,
            updated_at: entry.updated_at
        });
    }

    async updateBySourceId(sourceId, data) {
        return super.update(this.tableName, data, "source_id = ?", [sourceId]);
    }
}

module.exports = new SourceHealthDAO();
=======
import BaseDAO from "./BaseDAO.js";

class SourceHealthDAO extends BaseDAO {
	constructor() {
		super("source_health");
	}

	async getBySourceId(sourceId) {
		return this.findOne(this.tableName, "source_id = ?", [sourceId]);
	}

	async getAll() {
		return this.findAll(this.tableName, "1=1", [], "last_run_at DESC");
	}

	async create(entry) {
		return super.insert(this.tableName, {
			source_id: entry.source_id,
			last_run_at: entry.last_run_at,
			last_success_at: entry.last_success_at,
			last_failure_at: entry.last_failure_at,
			last_status: entry.last_status,
			last_message: entry.last_message,
			run_count: entry.run_count,
			success_count: entry.success_count,
			failure_count: entry.failure_count,
			processed_count: entry.processed_count,
			created_count: entry.created_count,
			updated_count: entry.updated_count,
			failed_count: entry.failed_count,
			created_at: entry.created_at,
			updated_at: entry.updated_at,
		});
	}

	async updateBySourceId(sourceId, data) {
		return super.update(this.tableName, data, "source_id = ?", [sourceId]);
	}
}

export default new SourceHealthDAO();
>>>>>>> Stashed changes

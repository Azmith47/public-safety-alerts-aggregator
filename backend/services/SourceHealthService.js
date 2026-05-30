import LookupService from "./LookupService.js";
import SourceHealthDAO from "../database/dao/SourceHealthDAO.js";

class SourceHealthService {
	constructor() {
		this.maxMessageLength = 1000;
	}

	_now() {
		return new Date().toISOString();
	}

	_normalizeMessage(message) {
		if (message === null || message === undefined) return null;
		const text =
			typeof message === "string" ? message : JSON.stringify(message);
		return text.length > this.maxMessageLength
			? text.slice(0, this.maxMessageLength)
			: text;
	}

	async getHealthForSource(sourceId) {
		return SourceHealthDAO.getBySourceId(sourceId);
	}

	async getHealthForSourceName(sourceName, sourceWebsite = null) {
		const sourceId = await LookupService.getOrCreateSource(
			sourceName,
			sourceWebsite,
		);
		return this.getHealthForSource(sourceId);
	}

	async getAllHealth() {
		return SourceHealthDAO.getAll();
	}

	async recordRun(sourceName, sourceWebsite, result = {}) {
		const sourceId = await LookupService.getOrCreateSource(
			sourceName,
			sourceWebsite,
		);
		const now = this._now();
		const existing = await SourceHealthDAO.getBySourceId(sourceId);

		const success = result.success !== false;
		const failure = !success;
		const message = this._normalizeMessage(
			result.error || result.message || null,
		);

		const updateData = {
			last_run_at: now,
			last_status: success ? "success" : "failure",
			last_message: message,
			run_count: (existing?.run_count || 0) + 1,
			success_count: (existing?.success_count || 0) + (success ? 1 : 0),
			failure_count: (existing?.failure_count || 0) + (failure ? 1 : 0),
			processed_count:
				(existing?.processed_count || 0) + (result.processed || 0),
			created_count:
				(existing?.created_count || 0) + (result.created || 0),
			updated_count:
				(existing?.updated_count || 0) + (result.updated || 0),
			failed_count: (existing?.failed_count || 0) + (result.failed || 0),
			updated_at: now,
		};

		if (success) {
			updateData.last_success_at = now;
			updateData.last_failure_at = existing?.last_failure_at || null;
		} else {
			updateData.last_failure_at = now;
			updateData.last_success_at = existing?.last_success_at || null;
		}

		if (existing) {
			await SourceHealthDAO.updateBySourceId(sourceId, updateData);
			return { sourceId, updated: true, success };
		}

		await SourceHealthDAO.create({
			source_id: sourceId,
			...updateData,
			created_at: now,
		});

		return { sourceId, created: true, success };
	}
}

export default new SourceHealthService();

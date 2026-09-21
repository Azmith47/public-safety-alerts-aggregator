import CategoryDAO from "../database/dao/CategoryDAO.js";
import SourceDAO from "../database/dao/SourceDAO.js";
import StatusTypeDAO from "../database/dao/StatusTypeDAO.js";
import SeverityLevelDAO from "../database/dao/SeverityLevelDAO.js";
import RegionDAO from "../database/dao/RegionDAO.js";
import CouncilAreaDAO from "../database/dao/CouncilAreaDAO.js";
import LocationDAO from "../database/dao/LocationDAO.js";

class LookupService {
	constructor(options = {}) {
		this.ttl = options.ttl || 10 * 60 * 1000; // default 10 minutes

		this.caches = {
			categories: new Map(),
			sources: new Map(),
			statusTypes: new Map(),
			severityLevels: new Map(),
			regions: new Map(),
			councilAreas: new Map(),
			locations: new Map(),
		};
	}

	normalizeKey(value) {
		if (value === null || value === undefined) return "";
		return String(value).trim().toLowerCase();
	}

	_getCache(map, key) {
		const entry = map.get(key);
		if (!entry) return null;
		if (entry.expiresAt && Date.now() > entry.expiresAt) {
			map.delete(key);
			return null;
		}
		return entry.id;
	}

	_setCache(map, key, id) {
		map.set(key, { id, expiresAt: Date.now() + this.ttl });
	}

	clearCache() {
		Object.values(this.caches).forEach((m) => m.clear());
	}

	// -----------------------
	// Categories
	// -----------------------
	async getOrCreateCategory(name) {
		const key = this.normalizeKey(name);
		const cached = this._getCache(this.caches.categories, key);
		if (cached) return cached;

		const res = await CategoryDAO.getOrCreate(name);
		const id = res && res.id ? res.id : res;
		this._setCache(this.caches.categories, key, id);
		return id;
	}

	// -----------------------
	// Sources
	// -----------------------
	async getOrCreateSource(name, websiteUrl = null) {
		const key = this.normalizeKey(name || websiteUrl || "");
		const cached = this._getCache(this.caches.sources, key);
		if (cached) return cached;

		const res = await SourceDAO.getOrCreate(name, websiteUrl);
		const id = res && res.id ? res.id : res;
		this._setCache(this.caches.sources, key, id);
		return id;
	}

	// -----------------------
	// Status types
	// -----------------------
	async getOrCreateStatusType(name) {
		const key = this.normalizeKey(name);
		const cached = this._getCache(this.caches.statusTypes, key);
		if (cached) return cached;

		const res = await StatusTypeDAO.getOrCreate(name);
		const id = res && res.id ? res.id : res;
		this._setCache(this.caches.statusTypes, key, id);
		return id;
	}

	// -----------------------
	// Severity levels
	// -----------------------
	async getOrCreateSeverityLevel(name, description = null) {
		const key = this.normalizeKey(name);
		const cached = this._getCache(this.caches.severityLevels, key);
		if (cached) return cached;

		const res = await SeverityLevelDAO.getOrCreate(name, description);
		const id = res && res.id ? res.id : res;
		this._setCache(this.caches.severityLevels, key, id);
		return id;
	}

	// -----------------------
	// Regions, council areas, locations
	// -----------------------
	async getOrCreateRegion(name) {
		const key = this.normalizeKey(name);
		const cached = this._getCache(this.caches.regions, key);
		if (cached) return cached;

		const res = await RegionDAO.getOrCreate(name);
		const id = res && res.id ? res.id : res;
		this._setCache(this.caches.regions, key, id);
		return id;
	}

	async getOrCreateCouncilArea(name, regionId = null) {
		const key = `${this.normalizeKey(name)}:${regionId || ""}`;
		const cached = this._getCache(this.caches.councilAreas, key);
		if (cached) return cached;

		const res = await CouncilAreaDAO.getOrCreate(name, regionId);
		const id = res && res.id ? res.id : res;
		this._setCache(this.caches.councilAreas, key, id);
		return id;
	}

	async getOrCreateLocation(name, postcode = null, councilAreaId = null) {
		const key = `${this.normalizeKey(name)}:${postcode || ""}:${councilAreaId || ""}`;
		const cached = this._getCache(this.caches.locations, key);
		if (cached) return cached;

		const res = await LocationDAO.getOrCreate(
			name,
			postcode,
			councilAreaId,
		);
		const id = res && res.id ? res.id : res;
		this._setCache(this.caches.locations, key, id);
		return id;
	}
}

export default new LookupService();

import BaseDAO from "./BaseDAO.js";

class LocationDAO extends BaseDAO {
	constructor() {
		super("locations");
	}

	extractCandidateNames(name) {
		const rawName = String(name || "").trim();
		if (!rawName) {
			return [];
		}

		const normalizedName = rawName.replace(/\s+/g, " ").trim();
		const candidates = [normalizedName];

		const routeMatch = normalizedName.match(
			/^(.*?)\s+(?:to|from|via)\s+(.*)$/i,
		);
		if (routeMatch) {
			candidates.push(routeMatch[1].trim(), routeMatch[2].trim());
		}

		const dashMatch = normalizedName.match(/^(.*?)(?:\s*[–—-]\s*)(.*)$/);
		if (dashMatch) {
			candidates.push(dashMatch[1].trim(), dashMatch[2].trim());
		}

		const slashMatch = normalizedName.match(/^(.*?)(?:\s*\/\s*)(.*)$/);
		if (slashMatch) {
			candidates.push(slashMatch[1].trim(), slashMatch[2].trim());
		}

		return [...new Set(candidates.filter(Boolean))];
	}

	async getOrCreate(name, postcode = null, councilAreaId = null) {
		const trimmedName = String(name || "").trim();
		if (!trimmedName) {
			return { id: null, created: false };
		}

		const normalizedPostcode =
			postcode === null || postcode === undefined || postcode === ""
				? null
				: String(postcode).trim();

		const candidateNames = this.extractCandidateNames(trimmedName);
		for (const candidateName of candidateNames) {
			const exactMatch = normalizedPostcode
				? await this.findOne(
						this.tableName,
						"LOWER(name) = LOWER(?) AND postcode = ?",
						[candidateName, normalizedPostcode],
					)
				: null;

			if (exactMatch) {
				return { id: exactMatch.id, created: false };
			}

			const councilMatch =
				councilAreaId !== null && councilAreaId !== undefined
					? await this.findOne(
							this.tableName,
							"LOWER(name) = LOWER(?) AND council_area_id = ?",
							[candidateName, councilAreaId],
						)
					: null;

			if (councilMatch) {
				return { id: councilMatch.id, created: false };
			}

			const existingRow = await this.findOne(
				this.tableName,
				"LOWER(name) = LOWER(?)",
				[candidateName],
			);

			if (existingRow) {
				if (normalizedPostcode && !existingRow.postcode) {
					await this.update(
						this.tableName,
						{ postcode: normalizedPostcode },
						"id = ?",
						[existingRow.id],
					);
				}
				return { id: existingRow.id, created: false };
			}
		}

		const result = await super.insert(this.tableName, {
			name: trimmedName,
			postcode: normalizedPostcode,
			council_area_id: councilAreaId,
		});

		return { id: result.id, created: true };
	}

	async getAll() {
		return this.findAll(this.tableName, "1=1", [], "name");
	}
}

export default new LocationDAO();

import BaseDAO from "./BaseDAO.js";

class LocationDAO extends BaseDAO {
	constructor() {
		super("locations");
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

		const exactMatch = normalizedPostcode
			? await this.findOne(
					this.tableName,
					"LOWER(name) = LOWER(?) AND postcode = ?",
					[trimmedName, normalizedPostcode],
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
						[trimmedName, councilAreaId],
					)
				: null;

		if (councilMatch) {
			return { id: councilMatch.id, created: false };
		}

		const existingRow = await this.findOne(
			this.tableName,
			"LOWER(name) = LOWER(?)",
			[trimmedName],
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

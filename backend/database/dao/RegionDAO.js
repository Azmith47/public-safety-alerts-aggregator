import BaseDAO from "./BaseDAO.js";
import { Regions } from "../../models/globalEnums.js";
import { normalizeRegion } from "../../normalization/transformers/locationTransformer.js";

class RegionDAO extends BaseDAO {
	constructor() {
		super("regions");
	}

	canonicalizeName(name) {
		if (name === null || name === undefined) {
			return null;
		}

		const trimmedName = String(name).trim();
		if (!trimmedName) {
			return null;
		}

		const normalizedKey = normalizeRegion(trimmedName);
		if (!normalizedKey) {
			return trimmedName;
		}

		const canonicalMatch = Object.values(Regions).find(
			(regionName) => normalizeRegion(regionName) === normalizedKey,
		);

		return canonicalMatch ?? trimmedName;
	}

	async getOrCreate(name) {
		const canonicalName = this.canonicalizeName(name);
		const normalizedKey = canonicalName
			? normalizeRegion(canonicalName)
			: null;

		const rows = await this.findAll(this.tableName, "1=1");
		const existingRow = rows.find((row) => {
			const existingName = String(row.name || "").trim();
			if (!existingName) {
				return false;
			}

			return (
				existingName.toLowerCase() === canonicalName?.toLowerCase() ||
				normalizeRegion(existingName) === normalizedKey
			);
		});

		if (existingRow) {
			if (existingRow.name !== canonicalName) {
				await this.update(
					this.tableName,
					{ name: canonicalName },
					"id = ?",
					[existingRow.id],
				);
			}
			return { id: existingRow.id, created: false };
		}

		const result = await super.insert(this.tableName, {
			name: canonicalName,
		});
		return { id: result.id, created: true };
	}

	async getAll() {
		return this.findAll(this.tableName, "1=1", [], "name");
	}
}

export default new RegionDAO();

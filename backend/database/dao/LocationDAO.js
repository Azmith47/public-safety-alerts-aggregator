import BaseDAO from "./BaseDAO.js";

class LocationDAO extends BaseDAO {
	constructor() {
		super("locations");
	}

	async getOrCreate(name, postcode = null, councilAreaId = null) {
		const row = await this.findOne(this.tableName, "name = ?", [name]);

		if (row) {
			return { id: row.id, created: false };
		}

		const result = await super.insert(this.tableName, {
			name,
			postcode,
			council_area_id: councilAreaId,
		});

		return { id: result.id, created: true };
	}

	async getAll() {
		return this.findAll(this.tableName, "1=1", [], "name");
	}
}

export default new LocationDAO();

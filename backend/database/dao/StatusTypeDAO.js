import BaseDAO from "./BaseDAO.js";

class StatusTypeDAO extends BaseDAO {
	constructor() {
		super("status_types");
	}

	async getOrCreate(name) {
		const row = await this.findOne(this.tableName, "name = ?", [name]);

		if (row) {
			return { id: row.id, created: false };
		}

		const result = await super.insert(this.tableName, { name });
		return { id: result.id, created: true };
	}
}

export default new StatusTypeDAO();

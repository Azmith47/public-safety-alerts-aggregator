<<<<<<< Updated upstream
const BaseDAO = require("./BaseDAO");

class RegionDAO extends BaseDAO {

    constructor() {
        super("regions");
    }

    async getOrCreate(name) {
        const row = await this.findOne(
            this.tableName,
            "name = ?",
            [name]
        );

        if (row) {
            return { id: row.id, created: false };
        }

        const result = await super.insert(this.tableName, { name });
        return { id: result.id, created: true };
    }

    async getAll() {
        return this.findAll(this.tableName, "1=1", [], "name");
    }
}

module.exports = new RegionDAO();
=======
import BaseDAO from "./BaseDAO.js";

class RegionDAO extends BaseDAO {
	constructor() {
		super("regions");
	}

	async getOrCreate(name) {
		const row = await this.findOne(this.tableName, "name = ?", [name]);

		if (row) {
			return { id: row.id, created: false };
		}

		const result = await super.insert(this.tableName, { name });
		return { id: result.id, created: true };
	}

	async getAll() {
		return this.findAll(this.tableName, "1=1", [], "name");
	}
}

export default new RegionDAO();
>>>>>>> Stashed changes

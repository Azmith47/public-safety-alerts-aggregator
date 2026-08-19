<<<<<<< Updated upstream
const BaseDAO = require("./BaseDAO");

class SeverityLevelDAO extends BaseDAO {

    constructor() {
        super("severity_levels");
    }

    async getOrCreate(name, description = null) {
        const row = await this.findOne(
            this.tableName,
            "name = ?",
            [name]
        );

        if (row) {
            return { id: row.id, created: false };
        }

        const result = await super.insert(this.tableName, {
            name,
            description
        });

        return { id: result.id, created: true };
    }
}

module.exports = new SeverityLevelDAO();
=======
import BaseDAO from "./BaseDAO.js";

class SeverityLevelDAO extends BaseDAO {
	constructor() {
		super("severity_levels");
	}

	async getOrCreate(name, description = null) {
		const row = await this.findOne(this.tableName, "name = ?", [name]);

		if (row) {
			return { id: row.id, created: false };
		}

		const result = await super.insert(this.tableName, {
			name,
			description,
		});

		return { id: result.id, created: true };
	}
}

export default new SeverityLevelDAO();
>>>>>>> Stashed changes

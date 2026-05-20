const BaseDAO = require("./BaseDAO");

class CouncilAreaDAO extends BaseDAO {

    constructor() {
        super("council_areas");
    }
    
    async getOrCreate(name, regionId = null) {
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
            region_id: regionId
        });

        return { id: result.id, created: true };
    }

    async getAll() {
        return this.findAll(this.tableName, "1=1", [], "name");
    }
}

module.exports = new CouncilAreaDAO();
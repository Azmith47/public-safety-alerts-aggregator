const BaseDAO = require("./BaseDAO");

class SourceDAO extends BaseDAO {

    constructor() {
        super("sources");
    }

    async getOrCreate(name, websiteUrl = null) {
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
            website_url: websiteUrl
        });

        return { id: result.id, created: true };
    }
}

module.exports = new SourceDAO();
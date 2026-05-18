const BaseDAO = require("./BaseDAO");

class SourceDAO extends BaseDAO {

    async getOrCreate(name, websiteUrl = null) {

        let row = await this.get(
            `SELECT * FROM sources WHERE name = ?`,
            [name]
        );

        if (row) {
            return row.id;
        }

        const result = await this.run(
            `INSERT INTO sources (name, website_url)
             VALUES (?, ?)`,
            [name, websiteUrl]
        );

        return result.id;
    }
}

module.exports = new SourceDAO();
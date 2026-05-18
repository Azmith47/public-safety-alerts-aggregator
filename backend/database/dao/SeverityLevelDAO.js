const BaseDAO = require("./BaseDAO");

class SeverityLevelDAO extends BaseDAO {

    async getOrCreate(name, description = null) {

        let row = await this.get(
            `SELECT * FROM severity_levels WHERE name = ?`,
            [name]
        );

        if (row) {
            return row.id;
        }

        const result = await this.run(
            `INSERT INTO severity_levels (name, description)
             VALUES (?, ?)`,
            [name, description]
        );

        return result.id;
    }
}

module.exports = new SeverityLevelDAO();
const BaseDAO = require("./BaseDAO");

class StatusTypeDAO extends BaseDAO {

    async getOrCreate(name) {

        let row = await this.get(
            `SELECT * FROM status_types WHERE name = ?`,
            [name]
        );

        if (row) {
            return row.id;
        }

        const result = await this.run(
            `INSERT INTO status_types (name)
             VALUES (?)`,
            [name]
        );

        return result.id;
    }
}

module.exports = new StatusTypeDAO();
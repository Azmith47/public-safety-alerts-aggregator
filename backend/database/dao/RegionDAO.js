const BaseDAO = require("./BaseDAO");

class RegionDAO extends BaseDAO {

    async getOrCreate(name) {

        let row = await this.get(
            `SELECT * FROM regions WHERE name = ?`,
            [name]
        );

        if (row) {
            return row.id;
        }

        const result = await this.run(
            `INSERT INTO regions (name)
             VALUES (?)`,
            [name]
        );

        return result.id;
    }
}

module.exports = new RegionDAO();
const BaseDAO = require("./BaseDAO");

class CouncilAreaDAO extends BaseDAO {

    async getOrCreate(name, regionId = null) {

        let row = await this.get(
            `SELECT * FROM council_areas
             WHERE name = ?`,
            [name]
        );

        if (row) {
            return row.id;
        }

        const result = await this.run(
            `INSERT INTO council_areas (name, region_id)
             VALUES (?, ?)`,
            [name, regionId]
        );

        return result.id;
    }
}

module.exports = new CouncilAreaDAO();
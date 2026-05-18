const BaseDAO = require("./BaseDAO");

class LocationDAO extends BaseDAO {

    async getOrCreate(name, postcode = null, councilAreaId = null) {

        let row = await this.get(
            `SELECT * FROM locations WHERE name = ?`,
            [name]
        );

        if (row) {
            return row.id;
        }

        const result = await this.run(
            `INSERT INTO locations (
                name,
                postcode,
                council_area_id
            )
            VALUES (?, ?, ?)`,
            [name, postcode, councilAreaId]
        );

        return result.id;
    }
}

module.exports = new LocationDAO();
const BaseDAO = require("./BaseDAO");

class CategoryDAO extends BaseDAO {

    async getOrCreate(name) {

        let row = await this.get(
            `SELECT * FROM categories WHERE name = ?`,
            [name]
        );

        if (row) {
            return row.id;
        }

        const result = await this.run(
            `INSERT INTO categories (name) VALUES (?)`,
            [name]
        );

        return result.id;
    }

    async getAll() {
        return this.all(
            `SELECT * FROM categories ORDER BY name`
        );
    }
}

module.exports = new CategoryDAO();
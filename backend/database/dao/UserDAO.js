const BaseDAO = require("./BaseDAO");

class UserDAO extends BaseDAO {

    async create(email) {

        return this.run(
            `INSERT INTO users (email)
             VALUES (?)`,
            [email]
        );
    }

    async getByEmail(email) {

        return this.get(
            `SELECT * FROM users
             WHERE email = ?`,
            [email]
        );
    }
}

module.exports = new UserDAO();
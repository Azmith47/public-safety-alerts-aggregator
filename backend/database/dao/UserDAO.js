const BaseDAO = require("./BaseDAO");

class UserDAO extends BaseDAO {

    constructor() {
        super("users");
    }

    async create(email) {
        if (await this.exists(email)) {
            throw new Error(`User with email ${email} already exists`);
        }

        return super.insert(this.tableName, { email });
    }

    async exists(email) {
        return this.findOne(
            this.tableName,
            "email = ?",
            [email]
        );
    }

    async getByEmail(email) {
        return this.findOne(
            this.tableName,
            "email = ?",
            [email]
        );
    }
}

module.exports = new UserDAO();
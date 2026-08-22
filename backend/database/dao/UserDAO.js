import BaseDAO from "./BaseDAO.js";

class UserDAO extends BaseDAO {
	constructor() {
		super("users");
	}

	async create(email, unsubscribe_token) {
		if (await this.exists(email)) {
			throw new Error(`User with email ${email} already exists`);
		}

		return super.insert(this.tableName, {
			email: email,
			verified: false,
			verification_token: null,
			verification_sent_at: null,
			unsubscribe_token: unsubscribe_token,
			created_at: new Date(),
		});
	}

	async exists(email) {
		return this.findOne(this.tableName, "email = ?", [email]);
	}

	async getByEmail(email) {
		return this.findOne(this.tableName, "email = ?", [email]);
	}

	async getById(id) {
		return this.findOne(this.tableName, "id = ?", [id]);
	}

	async verifyByEmail(email) {
		return this.update(this.tableName, { verified: true }, "email = ?", [
			email,
		]);
	}
}

export default new UserDAO();

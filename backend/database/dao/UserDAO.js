import BaseDAO from "./BaseDAO.js";

class UserDAO extends BaseDAO {
	constructor() {
		super("users");
	}

	async create(email, verification_token, unsubscribe_token = null) {
		if (await this.exists(email)) {
			throw new Error(`User with email ${email} already exists`);
		}

		return super.insert(this.tableName, {
			email: email,
			verified: false,
			verification_token: verification_token,
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
		return this.update(
			this.tableName,
			{ verified: true, verification_token: null },
			"email = ?",
			[email],
		);
	}

	async setVerificationToken(email, token) {
		return this.update(
			this.tableName,
			{ verification_token: token, verification_sent_at: new Date() },
			"email = ?",
			[email],
		);
	}

	async verifyByToken(token) {
		const user = this.findOne(this.tableName, "verification_token = ?", [
			token,
		]);
		if (!user) return null;
		await this.verifyByEmail(user.email);
		return user;
	}
}

export default new UserDAO();

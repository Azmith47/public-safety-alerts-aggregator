import BaseDAO from "./BaseDAO.js";

class SubscriptionDAO extends BaseDAO {
	constructor() {
		super("subscriptions");
	}

	async create(subscription) {
		return super.insert(this.tableName, {
			user_id: subscription.user_id,
			category_id: subscription.category_id,
			region_id: subscription.region_id,
			council_area_id: subscription.council_area_id,
			severity_level_id: subscription.severity_level_id,
			is_enabled: subscription.is_enabled,
			created_at: subscription.created_at || new Date(),
		});
	}

	async getByUser(userId) {
		return this.findAll(this.tableName, "user_id = ?", [userId]);
	}

	async getForUser(userId) {
		return this.getByUser(userId);
	}

	async getById(id) {
		return this.findOne(this.tableName, "id = ?", [id]);
	}

	async deleteById(id) {
		return super.delete(this.tableName, "id = ?", [id]);
	}
}

export default new SubscriptionDAO();

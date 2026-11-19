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

	async getMatchingForAlert(alertId) {
		return this.all(
			`SELECT DISTINCT s.user_id
			 FROM subscriptions s
			 JOIN users u ON u.id = s.user_id
			 JOIN alerts a ON a.id = ?
			 LEFT JOIN locations l ON l.id = a.location_id
			 LEFT JOIN council_areas ca ON ca.id = l.council_area_id
			 WHERE u.verified = 1 AND s.is_enabled = 1
			 AND (s.category_id IS NULL OR s.category_id = a.category_id)
			 AND (s.severity_level_id IS NULL OR s.severity_level_id = a.severity_level_id)
			 AND (s.council_area_id IS NULL OR s.council_area_id = ca.id)
			 AND (s.region_id IS NULL OR s.region_id = ca.region_id OR EXISTS (
				SELECT 1 FROM alerts_to_regions atr
				WHERE atr.alert_id = a.id AND atr.region_id = s.region_id
			 ))`,
			[alertId],
		);
	}

	async enableForUser(userId) {
		return this.update(
			this.tableName,
			{ is_enabled: true },
			"user_id = ?",
			[userId],
		);
	}

	async getById(id) {
		return this.findOne(this.tableName, "id = ?", [id]);
	}

	async deleteById(id) {
		return super.delete(this.tableName, "id = ?", [id]);
	}
}

export default new SubscriptionDAO();

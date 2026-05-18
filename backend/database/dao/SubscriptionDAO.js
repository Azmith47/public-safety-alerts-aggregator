const BaseDAO = require("./BaseDAO");

class SubscriptionDAO extends BaseDAO {

    async create(subscription) {

        return this.run(
            `INSERT INTO subscriptions (
                user_id,
                category_id,
                region_id,
                council_area_id,
                severity_level_id
            )
            VALUES (?, ?, ?, ?, ?)`,
            [
                subscription.user_id,
                subscription.category_id,
                subscription.region_id,
                subscription.council_area_id,
                subscription.severity_level_id
            ]
        );
    }

    async getByUser(userId) {

        return this.all(
            `SELECT * FROM subscriptions
             WHERE user_id = ?`,
            [userId]
        );
    }
}

module.exports = new SubscriptionDAO();
const BaseDAO = require("./BaseDAO");

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
            severity_level_id: subscription.severity_level_id
        });
    }

    async getByUser(userId) {
        return this.findAll(
            this.tableName,
            "user_id = ?",
            [userId]
        );
    }
}

module.exports = new SubscriptionDAO();
<<<<<<< Updated upstream
const SubscriptionDAO = require("../database/dao/SubscriptionDAO");
const UserDAO = require("../database/dao/UserDAO");

class SubscriptionService {
    // subscription: { email, category_id, region_id, council_area_id, severity_level_id }
    async createSubscription(subscription) {
        if (!subscription || !subscription.email) {
            throw new Error("Subscription must include an email");
        }

        let user = await UserDAO.getByEmail(subscription.email);
        let userId;

        if (!user) {
            const res = await UserDAO.create(subscription.email);
            userId = res.id;
        } else {
            userId = user.id;
        }

        return SubscriptionDAO.create({
            user_id: userId,
            category_id: subscription.category_id || null,
            region_id: subscription.region_id || null,
            council_area_id: subscription.council_area_id || null,
            severity_level_id: subscription.severity_level_id || null,
            is_enabled: subscription.is_enabled || false, // default to disabled if not set
            created_at: new Date(),
        });
    }

    async getSubscriptionsByUserEmail(email) {
        const user = await UserDAO.getByEmail(email);
        if (!user) return [];
        return SubscriptionDAO.getByUser(user.id);
    }

    async deleteSubscription(id) {
        return SubscriptionDAO.deleteById(id);
    }
}

module.exports = new SubscriptionService();
=======
import SubscriptionDAO from "../database/dao/SubscriptionDAO.js";
import UserDAO from "../database/dao/UserDAO.js";

class SubscriptionService {
	// subscription: { email, category_id, region_id, council_area_id, severity_level_id }
	async createSubscription(subscription) {
		if (!subscription || !subscription.email) {
			throw new Error("Subscription must include an email");
		}

		let user = await UserDAO.getByEmail(subscription.email);
		let userId;

		if (!user) {
			const res = await UserDAO.create(subscription.email);
			userId = res.id;
		} else {
			userId = user.id;
		}

		return SubscriptionDAO.create({
			user_id: userId,
			category_id: subscription.category_id || null,
			region_id: subscription.region_id || null,
			council_area_id: subscription.council_area_id || null,
			severity_level_id: subscription.severity_level_id || null,
			is_enabled: subscription.is_enabled || false, // default to disabled if not set
			created_at: new Date(),
		});
	}

	async getSubscriptionsByUserEmail(email) {
		const user = await UserDAO.getByEmail(email);
		if (!user) return [];
		return SubscriptionDAO.getByUser(user.id);
	}

	async deleteSubscription(id) {
		return SubscriptionDAO.deleteById(id);
	}
}

export default new SubscriptionService();
>>>>>>> Stashed changes

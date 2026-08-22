import SubscriptionDAO from "../database/dao/SubscriptionDAO.js";
import UserDAO from "../database/dao/UserDAO.js";
import EmailService from "./EmailService.js";
import crypto from "crypto";

class SubscriptionService {
	// subscription: { email, category_id, region_id, council_area_id, severity_level_id }
	async createSubscription(subscription) {
		if (!subscription || !subscription.email) {
			throw new Error("Subscription must include an email");
		}

		const email = subscription.email.trim().toLowerCase();
		const verificationToken = crypto.randomBytes(32).toString("hex");

		let user = await UserDAO.getByEmail(email);
		let userId;

		if (!user) {
			const res = await UserDAO.create(email, verificationToken);
			userId = res.id;
		} else {
			userId = user.id;
			await UserDAO.setVerificationToken(email, verificationToken);
		}

		const savedSubscription = {
			user_id: userId,
			category_id: subscription.category_id || null,
			region_id: subscription.region_id || null,
			council_area_id: subscription.council_area_id || null,
			severity_level_id: subscription.severity_level_id || null,
			is_enabled: false,
			created_at: new Date(),
		};

		const result = await SubscriptionDAO.create(savedSubscription);
		await EmailService.sendConfirmationEmail(email, verificationToken);
		return result;
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

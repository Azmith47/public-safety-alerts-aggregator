import SubscriptionService from "../services/SubscriptionService.js";
import UserDAO from "../database/dao/UserDAO.js";
import SubscriptionDAO from "../database/dao/SubscriptionDAO.js";

export const createSubscription = async (req, res, next) => {
	try {
		const subscription = await SubscriptionService.createSubscription(
			req.body,
		);
		res.status(202).json({
			message: "Check your email to confirm the subscription.",
			subscription,
		});
	} catch (error) {
		next(error);
	}
};

export const handleMailchimpWebhook = async (req, res, next) => {
	try {
		if (req.body.type === "subscribe" && req.body.data?.email) {
			const email = req.body.data.email.trim().toLowerCase();
			const user = await UserDAO.getByEmail(email);
			if (user) {
				await UserDAO.verifyByEmail(email);
				await SubscriptionDAO.enableForUser(user.id);
			}
		}
		res.sendStatus(204);
	} catch (error) {
		next(error);
	}
};

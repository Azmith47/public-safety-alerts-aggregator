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

export const confirmSubscription = async (req, res, next) => {
	try {
		const user = await UserDAO.verifyByToken(req.params.token);
		if (!user) return res.status(404).send("Invalid confirmation link.");
		await SubscriptionDAO.enableForUser(user.id);
		res.send(
			"Subscription confirmed. You will now receive relevant alerts.",
		);
	} catch (error) {
		next(error);
	}
};

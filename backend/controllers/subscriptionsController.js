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

export const getSubscriptionsByEmail = async (req, res) => {
	try {
		const email = req.query.email;
		if (!email) return res.status(400).json({ error: "Email is required" });

		const subscriptions =
			await SubscriptionService.getSubscriptionsByUserEmail(email);
		res.json(subscriptions);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to fetch subscriptions" });
	}
};

export const deleteSubscription = async (req, res) => {
	try {
		const { id } = req.params;
		await SubscriptionService.deleteSubscription(id);
		res.status(204).send();
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to delete subscription" });
	}
};
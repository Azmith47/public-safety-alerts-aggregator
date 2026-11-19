import NotificationDAO from "../database/dao/NotificationDAO.js";
import UserDAO from "../database/dao/UserDAO.js";
import SubscriptionDAO from "../database/dao/SubscriptionDAO.js";
import AlertDAO from "../database/dao/AlertDAO.js";
import EmailService from "./EmailService.js";

class NotificationService {
	constructor(options = {}) {
		this.pollInterval = options.pollInterval || 5000; // 5s
		this.emailService = options.emailService || EmailService;
		this.running = false;
	}

	async enqueue(userId, alertId) {
		return NotificationDAO.create({
			user_id: userId,
			alert_id: alertId,
			sent_status: "pending",
		});
	}

	async processPending(limit = 50) {
		const pending = await NotificationDAO.getPending(limit);
		const notificationsByUser = new Map();
		for (const notification of pending) {
			const userNotifications =
				notificationsByUser.get(notification.user_id) || [];
			userNotifications.push(notification);
			notificationsByUser.set(notification.user_id, userNotifications);
		}

		for (const userNotifications of notificationsByUser.values()) {
			const notificationIds = userNotifications.map(
				(notification) => notification.id,
			);
			try {
				const userId = userNotifications[0].user_id;
				const user = await UserDAO.getById(userId);
				if (!user || !user.email) {
					await this.markNotificationsFailed(notificationIds);
					continue;
				}
				const subscription = await SubscriptionDAO.getForUser(userId);

				if (!Array.isArray(subscription) || subscription.length === 0) {
					console.warn(
						`No subscription for user ${userId}, marking notifications failed`,
					);
					await this.markNotificationsFailed(notificationIds);
					continue;
				}

				const hasEnabledSubscription = Array.isArray(subscription)
					? subscription.some((item) => item.is_enabled)
					: subscription.is_enabled;
				if (!user.verified || !hasEnabledSubscription) {
					console.warn(
						`Subscription disabled for user ${userId}, marking notifications failed`,
					);
					await this.markNotificationsFailed(notificationIds);
					continue;
				}

				const alerts = [];
				for (const notification of userNotifications) {
					alerts.push(await AlertDAO.getById(notification.alert_id));
				}
				await this.emailService.sendAlertDigest(user.email, alerts);
				for (const notificationId of notificationIds) {
					await NotificationDAO.markSent(notificationId);
				}
			} catch (err) {
				console.error("Notification send failed", err);
				await this.markNotificationsFailed(notificationIds);
			}
		}
		return pending.length;
	}

	async markNotificationsFailed(notificationIds) {
		for (const notificationId of notificationIds) {
			await NotificationDAO.markFailed(notificationId);
		}
	}

	startProcessing() {
		if (this.running) return;
		this.running = true;
		this._timer = setInterval(
			() => this.processPending().catch((err) => console.error(err)),
			this.pollInterval,
		);
	}

	stopProcessing() {
		if (!this.running) return;
		clearInterval(this._timer);
		this.running = false;
	}
}

export default new NotificationService();

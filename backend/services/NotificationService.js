const NotificationDAO = require("../database/dao/NotificationDAO");
const UserDAO = require("../database/dao/UserDAO");
const SubscriptionDAO = require("../database/dao/SubscriptionDAO");

class NotificationService {
    constructor(options = {}) {
        this.pollInterval = options.pollInterval || 5000; // 5s
        this.running = false;
    }

    async enqueue(userId, alertId) {
        return NotificationDAO.create({ user_id: userId, alert_id: alertId, sent_status: 'pending' });
    }

    async processPending(limit = 50) {
        const pending = await NotificationDAO.getPending(limit);
        for (const n of pending) {
            try {
                const user = await UserDAO.getById(n.user_id);
                const subscription = await SubscriptionDAO.getForUser(n.user_id);

                if (!subscription) {
                    console.warn(`No subscription for user ${n.user_id}, marking notification ${n.id} failed`);
                    await NotificationDAO.markFailed(n.id);
                    continue;
                }

                if (!subscription.is_enabled && !user.verified) {
                    console.warn(`Subscription disabled for user ${n.user_id}, marking notification ${n.id} failed`);
                    await NotificationDAO.markFailed(n.id);
                    continue;
                }

                if (!user || !user.email) {
                    console.warn(`No email for user ${n.user_id}, marking notification ${n.id} failed`);
                    await NotificationDAO.markFailed(n.id);
                    continue;
                }

                // Mock send: in production replace with real email sender
                console.log(`Sending notification for alert ${n.alert_id} to ${user.email}`);
                await NotificationDAO.markSent(n.id);
            } catch (err) {
                console.error("Notification send failed", err);
                await NotificationDAO.markFailed(n.id);
            }
        }
        return pending.length;
    }

    startProcessing() {
        if (this.running) return;
        this.running = true;
        this._timer = setInterval(() => this.processPending().catch(err => console.error(err)), this.pollInterval);
    }

    stopProcessing() {
        if (!this.running) return;
        clearInterval(this._timer);
        this.running = false;
    }
}

module.exports = new NotificationService();

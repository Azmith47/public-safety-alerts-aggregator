const BaseDAO = require("./BaseDAO");

class NotificationDAO extends BaseDAO {

    constructor() {
        super("notifications");
    }

    async create(notification) {
        return super.insert(this.tableName, {
            user_id: notification.user_id,
            alert_id: notification.alert_id,
            sent_status: notification.sent_status
        });
    }

    async getPending(limit = 50) {
        return this.findAll(this.tableName, "sent_status IS NULL OR sent_status = 'pending'", [], "created_at ASC LIMIT " + (limit || 50));
    }

    async markSent(id) {
        return this.update(this.tableName, { sent_status: 'sent' }, "id = ?", [id]);
    }

    async markFailed(id) {
        return this.update(this.tableName, { sent_status: 'failed' }, "id = ?", [id]);
    }

    async getByUser(userId) {
        return this.findAll(this.tableName, "user_id = ?", [userId], "created_at DESC");
    }
}

module.exports = new NotificationDAO();
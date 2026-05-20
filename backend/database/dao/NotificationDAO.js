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
}

module.exports = new NotificationDAO();
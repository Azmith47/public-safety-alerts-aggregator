const BaseDAO = require("./BaseDAO");

class NotificationDAO extends BaseDAO {

    async create(notification) {

        return this.run(
            `INSERT INTO notifications (
                user_id,
                alert_id,
                sent_status
            )
            VALUES (?, ?, ?)`,
            [
                notification.user_id,
                notification.alert_id,
                notification.sent_status
            ]
        );
    }
}

module.exports = new NotificationDAO();
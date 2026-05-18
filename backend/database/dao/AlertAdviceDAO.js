const BaseDAO = require("./BaseDAO");

class AlertAdviceDAO extends BaseDAO {

    async create(alertId, message) {

        return this.run(
            `INSERT INTO alert_advice (
                alert_id,
                message
            )
            VALUES (?, ?)`,
            [alertId, message]
        );
    }
}

module.exports = new AlertAdviceDAO();
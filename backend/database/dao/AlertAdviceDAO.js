const BaseDAO = require("./BaseDAO");

class AlertAdviceDAO extends BaseDAO {
    constructor() {
        super("alert_advice");
    }

    async create(alertId, message) {
        return super.insert(this.tableName, {
            alert_id: alertId,
            message
        });
    }

    async deleteByAlert(alertId) {
        return super.delete(this.tableName, "alert_id = ?", [alertId]);
    }
}

module.exports = new AlertAdviceDAO();
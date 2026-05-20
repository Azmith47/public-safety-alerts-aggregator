const BaseDAO = require("./BaseDAO");

class AlertLinkDAO extends BaseDAO {

    constructor() {
        super("alert_links");
    }

    async create(alertId, linkText, linkUrl) {
        return super.insert(this.tableName, {
            alert_id: alertId,
            link_text: linkText,
            link_url: linkUrl
        });
    }

    async deleteByAlert(alertId) {
        return super.delete(this.tableName, "alert_id = ?", [alertId]);
    }
}

module.exports = new AlertLinkDAO();
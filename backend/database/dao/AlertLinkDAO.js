const BaseDAO = require("./BaseDAO");

class AlertLinkDAO extends BaseDAO {

    async create(alertId, linkText, linkUrl) {

        return this.run(
            `INSERT INTO alert_links (
                alert_id,
                link_text,
                link_url
            )
            VALUES (?, ?, ?)`,
            [alertId, linkText, linkUrl]
        );
    }
}

module.exports = new AlertLinkDAO();
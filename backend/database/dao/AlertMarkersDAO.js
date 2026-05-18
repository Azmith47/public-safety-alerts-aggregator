const BaseDAO = require("./BaseDAO");

class AlertMarkerDAO extends BaseDAO {

    async create(alertId, latitude, longitude) {

        return this.run(
            `INSERT INTO alert_markers (
                alert_id,
                latitude,
                longitude
            )
            VALUES (?, ?, ?)`,
            [alertId, latitude, longitude]
        );
    }

    async deleteByAlert(alertId) {

    return this.run(
        `DELETE FROM alert_markers
         WHERE alert_id = ?`,
        [alertId]
    );
}
}

module.exports = new AlertMarkerDAO();
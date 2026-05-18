const BaseDAO = require("./BaseDAO");

class AlertPolygonDAO extends BaseDAO {

    async create(alertId, pointOrder, latitude, longitude) {

        return this.run(
            `INSERT INTO alert_polygons (
                alert_id,
                point_order,
                latitude,
                longitude
            )
            VALUES (?, ?, ?, ?)`,
            [alertId, pointOrder, latitude, longitude]
        );
    }

    async deleteByAlert(alertId) {

    return this.run(
        `DELETE FROM alert_polygons
         WHERE alert_id = ?`,
        [alertId]
    );
}
}

module.exports = new AlertPolygonDAO();
const BaseDAO = require("./BaseDAO");

class AlertPolygonDAO extends BaseDAO {

    constructor() {
        super("alert_polygons");
    }

    async create(alertId, pointOrder, latitude, longitude) {
        return super.insert(this.tableName, {
            alert_id: alertId,
            point_order: pointOrder,
            latitude,
            longitude
        });
    }

    async deleteByAlert(alertId) {
        return super.delete(this.tableName, "alert_id = ?", [alertId]);
    }
}

module.exports = new AlertPolygonDAO();
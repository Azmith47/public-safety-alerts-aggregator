import BaseDAO from "./BaseDAO.js";

class AlertPolygonDAO extends BaseDAO {
	constructor() {
		super("alert_polygons");
	}

	async create(
		alertId,
		pointOrder,
		latitude,
		longitude,
		polygonIndex = 0,
		ringIndex = 0,
	) {
		return super.insert(this.tableName, {
			alert_id: alertId,
			polygon_index: polygonIndex,
			ring_index: ringIndex,
			point_order: pointOrder,
			latitude,
			longitude,
		});
	}

	async deleteByAlert(alertId) {
		return super.delete(this.tableName, "alert_id = ?", [alertId]);
	}
}

export default new AlertPolygonDAO();

import BaseDAO from "./BaseDAO.js";

class AlertPolylineDAO extends BaseDAO {
	constructor() {
		super("alert_polylines");
	}

	async create(alertId, lineIndex, pointOrder, latitude, longitude) {
		return super.insert(this.tableName, {
			alert_id: alertId,
			line_index: lineIndex,
			point_order: pointOrder,
			latitude,
			longitude,
		});
	}

	async deleteByAlert(alertId) {
		return super.delete(this.tableName, "alert_id = ?", [alertId]);
	}
}

export default new AlertPolylineDAO();

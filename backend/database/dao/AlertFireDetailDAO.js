import BaseDAO from "./BaseDAO.js";

class AlertFireDetailDAO extends BaseDAO {
	constructor() {
		super("alert_fire_details");
	}

	async create(details) {
		return super.insert(this.tableName, {
			alert_id: details.alert_id,
			fire_type: details.fire_type,
			fire_size: details.fire_size,
			containment_status: details.containment_status,
			responsible_agency: details.responsible_agency,
		});
	}

	async deleteByAlert(alertId) {
		return super.delete(this.tableName, "alert_id = ?", [alertId]);
	}
}

export default new AlertFireDetailDAO();

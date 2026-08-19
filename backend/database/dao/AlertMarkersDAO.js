<<<<<<< Updated upstream
const BaseDAO = require("./BaseDAO");

class AlertMarkerDAO extends BaseDAO {

    constructor() {
        super("alert_markers");
    }

    async create(alertId, latitude, longitude) {
        return super.insert(this.tableName, {
            alert_id: alertId,
            latitude,
            longitude
        });
    }

    async deleteByAlert(alertId) {
        return super.delete(this.tableName, "alert_id = ?", [alertId]);
    }
}

module.exports = new AlertMarkerDAO();
=======
import BaseDAO from "./BaseDAO.js";

class AlertMarkerDAO extends BaseDAO {
	constructor() {
		super("alert_markers");
	}

	async create(alertId, latitude, longitude) {
		return super.insert(this.tableName, {
			alert_id: alertId,
			latitude,
			longitude,
		});
	}

	async deleteByAlert(alertId) {
		return super.delete(this.tableName, "alert_id = ?", [alertId]);
	}
}

export default new AlertMarkerDAO();
>>>>>>> Stashed changes

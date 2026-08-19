<<<<<<< Updated upstream
const BaseDAO = require("./BaseDAO");

class AlertRegionDAO extends BaseDAO {
    constructor() {
        super("alerts_to_regions");
    }

    async create(alertId, regionId) {
        return super.insert(this.tableName, {
            alert_id: alertId,
            region_id: regionId
        });
    }

    async deleteByAlert(alertId) {
        return super.delete(this.tableName, "alert_id = ?", [alertId]);
    }
}

module.exports = new AlertRegionDAO();
=======
import BaseDAO from "./BaseDAO.js";

class AlertRegionDAO extends BaseDAO {
	constructor() {
		super("alerts_to_regions");
	}

	async create(alertId, regionId) {
		return super.insert(this.tableName, {
			alert_id: alertId,
			region_id: regionId,
		});
	}

	async deleteByAlert(alertId) {
		return super.delete(this.tableName, "alert_id = ?", [alertId]);
	}
}

export default new AlertRegionDAO();
>>>>>>> Stashed changes

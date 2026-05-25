import BaseDAO from "./BaseDAO.js";

class AlertRoadDAO extends BaseDAO {

    constructor() {
        super("alert_roads");
    }

    async create(road) {
        return super.insert(this.tableName, {
            alert_id: road.alert_id,
            main_street: road.main_street,
            cross_street: road.cross_street,
            second_location: road.second_location,
            suburb: road.suburb,
            region: road.region
        });
    }

    async deleteByAlert(alertId) {
        return super.delete(this.tableName, "alert_id = ?", [alertId]);
    }
}

export default new AlertRoadDAO();
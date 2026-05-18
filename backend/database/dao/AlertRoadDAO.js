const BaseDAO = require("./BaseDAO");

class AlertRoadDAO extends BaseDAO {

    async create(road) {

        return this.run(
            `INSERT INTO alert_roads (
                alert_id,
                main_street,
                cross_street,
                second_location,
                suburb,
                region
            )
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                road.alert_id,
                road.main_street,
                road.cross_street,
                road.second_location,
                road.suburb,
                road.region
            ]
        );
    }
}

module.exports = new AlertRoadDAO();
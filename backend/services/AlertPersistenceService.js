const AlertDAO = require("../database/dao/AlertDAO");

const CategoryDAO = require("../database/dao/CategoryDAO");
const SourceDAO = require("../database/dao/SourceDAO");
const StatusTypeDAO = require("../database/dao/StatusTypeDAO");
const SeverityLevelDAO = require("../database/dao/SeverityLevelDAO");

const RegionDAO = require("../database/dao/RegionDAO");
const CouncilAreaDAO = require("../database/dao/CouncilAreaDAO");
const LocationDAO = require("../database/dao/LocationDAO");

const AlertMarkerDAO = require("../database/dao/AlertMarkerDAO");
const AlertPolygonDAO = require("../database/dao/AlertPolygonDAO");
const AlertRoadDAO = require("../database/dao/AlertRoadDAO");
const AlertAdviceDAO = require("../database/dao/AlertAdviceDAO");
const AlertLinkDAO = require("../database/dao/AlertLinkDAO");

class AlertPersistenceService {

    async save(alert, sourceName, sourceWebsite = null) {

        // -----------------------------------------
        // Resolve lookup IDs
        // -----------------------------------------

        const categoryId =
            await CategoryDAO.getOrCreate(alert.category);

        const sourceId =
            await SourceDAO.getOrCreate(
                sourceName,
                sourceWebsite
            );

        const statusTypeId =
            await StatusTypeDAO.getOrCreate(
                alert.status || "Unknown"
            );

        const severityLevelId =
            await SeverityLevelDAO.getOrCreate(
                alert.alertLevel || "Unknown"
            );

        // -----------------------------------------
        // Geographic resolution
        // -----------------------------------------

        let regionId = null;
        let councilAreaId = null;
        let locationId = null;

        if (alert.region) {

            regionId =
                await RegionDAO.getOrCreate(
                    alert.region
                );
        }

        if (alert.councilArea) {

            councilAreaId =
                await CouncilAreaDAO.getOrCreate(
                    alert.councilArea,
                    regionId
                );
        }

        if (alert.location) {

            locationId =
                await LocationDAO.getOrCreate(
                    alert.location,
                    null,
                    councilAreaId
                );
        }

        // -----------------------------------------
        // Check for existing alert
        // -----------------------------------------

        const existingAlert =
            await AlertDAO.exists(alert.id);

        // -----------------------------------------
        // UPDATE EXISTING ALERT
        // -----------------------------------------

        if (existingAlert) {

            await AlertDAO.update(existingAlert.id, {

                title: alert.title,
                description:
                    alert.headline ||
                    alert.description ||
                    alert.title,

                category_id: categoryId,
                source_id: sourceId,
                location_id: locationId,
                status_type_id: statusTypeId,
                severity_level_id: severityLevelId,

                issued_at: alert.pubDate,
                updated_at: alert.lastUpdated,

                source_url: alert.link,

                planned: alert.planned || false,
                is_major: alert.isMajor || false,
                impacting_network:
                    alert.impactingNetwork || false,

                delay: alert.delay || 0,

                start_date: alert.startDate || null,
                end_date: alert.endDate || null,

                raw_payload: alert
            });

            // -----------------------------------------
            // Replace related child records
            // -----------------------------------------

            await this.replaceSpatialData(
                existingAlert.id,
                alert
            );

            await this.replaceRoadData(
                existingAlert.id,
                alert
            );

            await this.replaceAdviceData(
                existingAlert.id,
                alert
            );

            await this.replaceLinkData(
                existingAlert.id,
                alert
            );

            return {
                action: "updated",
                alertId: existingAlert.id
            };
        }

        // -----------------------------------------
        // CREATE NEW ALERT
        // -----------------------------------------

        const result = await AlertDAO.create({

            external_id: alert.id,

            title: alert.title,

            description:
                alert.headline ||
                alert.description ||
                alert.title,

            category_id: categoryId,
            source_id: sourceId,
            location_id: locationId,
            status_type_id: statusTypeId,
            severity_level_id: severityLevelId,

            issued_at: alert.pubDate,
            updated_at: alert.lastUpdated,

            source_url: alert.link,

            planned: alert.planned || false,
            is_major: alert.isMajor || false,
            impacting_network:
                alert.impactingNetwork || false,

            delay: alert.delay || 0,

            start_date: alert.startDate || null,
            end_date: alert.endDate || null,

            raw_payload: alert
        });

        const alertId = result.id;

        await this.insertSpatialData(alertId, alert);

        await this.insertRoadData(alertId, alert);

        await this.insertAdviceData(alertId, alert);

        await this.insertLinkData(alertId, alert);

        return {
            action: "created",
            alertId
        };
    }

    // ==================================================
    // SPATIAL
    // ==================================================

    async insertSpatialData(alertId, alert) {

        if (alert.markerPoint) {

            await AlertMarkerDAO.create(
                alertId,
                alert.markerPoint.lat,
                alert.markerPoint.lng
            );
        }

        if (alert.polygon) {

            for (let i = 0; i < alert.polygon.length; i++) {

                const point = alert.polygon[i];

                await AlertPolygonDAO.create(
                    alertId,
                    i,
                    point.lat,
                    point.lng
                );
            }
        }
    }

    async replaceSpatialData(alertId, alert) {

        await AlertMarkerDAO.deleteByAlert(alertId);

        await AlertPolygonDAO.deleteByAlert(alertId);

        await this.insertSpatialData(alertId, alert);
    }

    // ==================================================
    // ROADS
    // ==================================================

    async insertRoadData(alertId, alert) {

        if (!alert.roads) {
            return;
        }

        for (const road of alert.roads) {

            await AlertRoadDAO.create({

                alert_id: alertId,

                main_street:
                    road.mainStreet || null,

                cross_street:
                    road.crossStreet || null,

                second_location:
                    road.secondLocation || null,

                suburb:
                    road.suburb || null,

                region:
                    road.region || null
            });
        }
    }

    async replaceRoadData(alertId, alert) {

        await AlertRoadDAO.deleteByAlert(alertId);

        await this.insertRoadData(alertId, alert);
    }

    // ==================================================
    // ADVICE
    // ==================================================

    async insertAdviceData(alertId, alert) {

        if (!alert.advice) {
            return;
        }

        for (const message of alert.advice) {

            if (!message) {
                continue;
            }

            await AlertAdviceDAO.create(
                alertId,
                message
            );
        }
    }

    async replaceAdviceData(alertId, alert) {

        await AlertAdviceDAO.deleteByAlert(alertId);

        await this.insertAdviceData(alertId, alert);
    }

    // ==================================================
    // LINKS
    // ==================================================

    async insertLinkData(alertId, alert) {

        if (!alert.otherLinks) {
            return;
        }

        for (const link of alert.otherLinks) {

            await AlertLinkDAO.create(
                alertId,
                link.text || "Link",
                link.url || null
            );
        }
    }

    async replaceLinkData(alertId, alert) {

        await AlertLinkDAO.deleteByAlert(alertId);

        await this.insertLinkData(alertId, alert);
    }
}

module.exports = new AlertPersistenceService();
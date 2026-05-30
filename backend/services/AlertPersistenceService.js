import AlertDAO from "../database/dao/AlertDAO.js";
import LookupService from "./LookupService.js";

import AlertMarkerDAO from "../database/dao/AlertMarkersDAO.js";
import AlertPolygonDAO from "../database/dao/AlertPolygonDAO.js";
import AlertPolylineDAO from "../database/dao/AlertPolylineDAO.js";
import AlertRoadDAO from "../database/dao/AlertRoadDAO.js";
import AlertAdviceDAO from "../database/dao/AlertAdviceDAO.js";
import AlertLinkDAO from "../database/dao/AlertLinkDAO.js";
import AlertRegionDAO from "../database/dao/AlertRegionDAO.js";
import AlertFireDetailDAO from "../database/dao/AlertFireDetailDAO.js";

class AlertPersistenceService {
	async save(alert, sourceName, sourceWebsite = null) {
		return AlertDAO.transaction(async () => {
			const categoryId = await LookupService.getOrCreateCategory(
				alert.category,
			);
			const sourceId = await LookupService.getOrCreateSource(
				sourceName,
				sourceWebsite,
			);
			const statusTypeId = await LookupService.getOrCreateStatusType(
				alert.status || "Unknown",
			);
			const severityLevelId =
				await LookupService.getOrCreateSeverityLevel(
					alert.severity || "Unknown",
				);

			let regionId = null;
			let councilAreaId = null;
			let locationId = null;

			if (alert.region) {
				regionId = await LookupService.getOrCreateRegion(alert.region);
			}

			if (alert.councilArea) {
				councilAreaId = await LookupService.getOrCreateCouncilArea(
					alert.councilArea,
					regionId,
				);
			}

			if (alert.location) {
				locationId = await LookupService.getOrCreateLocation(
					alert.location,
					null,
					councilAreaId,
				);
			}

			const externalId = alert.externalId || alert.id;

			if (!externalId) {
				throw new Error("Cannot persist alert without an externalId");
			}

			const existingAlert = await AlertDAO.exists(externalId, sourceId);

			const alertData = this.buildAlertData(
				alert,
				categoryId,
				sourceId,
				locationId,
				statusTypeId,
				severityLevelId,
			);

			if (existingAlert) {
				await AlertDAO.update(existingAlert.id, alertData);
				await this.replaceSpatialData(existingAlert.id, alert);
				await this.replaceRegionData(existingAlert.id, regionId);
				await this.replaceRoadData(existingAlert.id, alert);
				await this.replaceFireDetailData(existingAlert.id, alert);
				await this.replaceAdviceData(existingAlert.id, alert);
				await this.replaceLinkData(existingAlert.id, alert);

				return { action: "updated", alertId: existingAlert.id };
			}

			const result = await AlertDAO.create({
				external_id: externalId,
				...alertData,
			});
			const alertId = result.id;

			await this.insertSpatialData(alertId, alert);
			await this.insertRegionData(alertId, regionId);
			await this.insertRoadData(alertId, alert);
			await this.insertFireDetailData(alertId, alert);
			await this.insertAdviceData(alertId, alert);
			await this.insertLinkData(alertId, alert);

			return { action: "created", alertId };
		});
	}

	buildAlertData(
		alert,
		categoryId,
		sourceId,
		locationId,
		statusTypeId,
		severityLevelId,
	) {
		const primaryLink = Array.isArray(alert.links) ? alert.links[0] : null;

		return {
			title: alert.title,
			description: alert.description || alert.title,
			category_id: categoryId,
			source_id: sourceId,
			location_id: locationId,
			status_type_id: statusTypeId,
			severity_level_id: severityLevelId,
			issued_at: this.serializeDate(alert.publishedAt || alert.createdAt),
			updated_at: this.serializeDate(alert.updatedAt),
			source_url: primaryLink?.url || null,
			planned: alert.planned ? 1 : 0,
			is_major: alert.isMajor ? 1 : 0,
			impacting_network: alert.impactingNetwork ? 1 : 0,
			delay: alert.delayMinutes || alert.delay || 0,
			start_date: this.serializeDate(alert.startDate),
			end_date: this.serializeDate(alert.endDate || alert.expiresAt),
			is_active: alert.isActive === false ? 0 : 1,
			raw_payload: JSON.stringify(alert.rawPayload || alert),
		};
	}

	serializeDate(value) {
		if (!value) {
			return null;
		}

		if (value instanceof Date) {
			return Number.isNaN(value.getTime()) ? null : value.toISOString();
		}

		return value;
	}

	// ==================================================
	// SPATIAL
	// ==================================================

	async insertSpatialData(alertId, alert) {
		if (alert.marker) {
			await AlertMarkerDAO.create(
				alertId,
				alert.marker.latitude,
				alert.marker.longitude,
			);
		}

		if (Array.isArray(alert.polygons)) {
			for (let polygonIndex = 0; polygonIndex < alert.polygons.length; polygonIndex++) {
				const polygon = alert.polygons[polygonIndex];

				for (let pointOrder = 0; pointOrder < polygon.length; pointOrder++) {
					const [longitude, latitude] = polygon[pointOrder];
					await AlertPolygonDAO.create(
						alertId,
						pointOrder,
						latitude,
						longitude,
						polygonIndex,
						0,
					);
				}
			}
		}

		if (Array.isArray(alert.polylines)) {
			for (let lineIndex = 0; lineIndex < alert.polylines.length; lineIndex++) {
				const line = alert.polylines[lineIndex];

				for (let pointOrder = 0; pointOrder < line.length; pointOrder++) {
					const [longitude, latitude] = line[pointOrder];
					await AlertPolylineDAO.create(
						alertId,
						lineIndex,
						pointOrder,
						latitude,
						longitude,
					);
				}
			}
		}
	}

	async replaceSpatialData(alertId, alert) {
		await AlertMarkerDAO.deleteByAlert(alertId);
		await AlertPolygonDAO.deleteByAlert(alertId);
		await AlertPolylineDAO.deleteByAlert(alertId);
		await this.insertSpatialData(alertId, alert);
	}

	// ==================================================
	// REGIONS
	// ==================================================

	async insertRegionData(alertId, regionId) {
		if (!regionId) return;
		await AlertRegionDAO.create(alertId, regionId);
	}

	async replaceRegionData(alertId, regionId) {
		await AlertRegionDAO.deleteByAlert(alertId);
		await this.insertRegionData(alertId, regionId);
	}

	// ==================================================
	// ROADS
	// ==================================================

	async insertRoadData(alertId, alert) {
		if (!alert.roads) return;
		for (const road of alert.roads) {
			await AlertRoadDAO.create({
				alert_id: alertId,
				main_street: road.mainStreet || road.roadName || null,
				cross_street: road.crossStreet || null,
				second_location: road.secondLocation || null,
				suburb: road.suburb || null,
				region: road.region || null,
				location_qualifier: road.locationQualifier || null,
				condition_tendency: road.conditionTendency || null,
				delay: road.delay || null,
				queue_length: road.queueLength ?? null,
				traffic_volume: road.trafficVolume || null,
				impacted_lanes: JSON.stringify(road.impactedLanes || []),
			});
		}
	}

	async replaceRoadData(alertId, alert) {
		await AlertRoadDAO.deleteByAlert(alertId);
		await this.insertRoadData(alertId, alert);
	}

	// ==================================================
	// FIRE DETAILS
	// ==================================================

	async insertFireDetailData(alertId, alert) {
		if (
			!alert.fireType &&
			alert.fireSize == null &&
			!alert.containmentStatus &&
			!alert.responsibleAgency
		) {
			return;
		}

		await AlertFireDetailDAO.create({
			alert_id: alertId,
			fire_type: alert.fireType || null,
			fire_size: alert.fireSize ?? null,
			containment_status: alert.containmentStatus || null,
			responsible_agency: alert.responsibleAgency || null,
		});
	}

	async replaceFireDetailData(alertId, alert) {
		await AlertFireDetailDAO.deleteByAlert(alertId);
		await this.insertFireDetailData(alertId, alert);
	}

	// ==================================================
	// ADVICE
	// ==================================================

	async insertAdviceData(alertId, alert) {
		if (!alert.advice) return;
		for (const message of alert.advice) {
			if (!message) continue;
			await AlertAdviceDAO.create(alertId, message);
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
		if (!alert.links) return;
		for (const link of alert.links) {
			await AlertLinkDAO.create(
				alertId,
				link.title || link.text || "Link",
				link.url || null,
			);
		}
	}

	async replaceLinkData(alertId, alert) {
		await AlertLinkDAO.deleteByAlert(alertId);
		await this.insertLinkData(alertId, alert);
	}
}

export default new AlertPersistenceService();

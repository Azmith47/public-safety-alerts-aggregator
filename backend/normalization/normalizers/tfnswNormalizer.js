/**
 * tfnswNormalizer.js
 *
 * Responsibility:
 * Convert raw Transport for NSW incident payloads
 * into canonical internal traffic alert objects.
 *
 * IMPORTANT:
 * This layer:
 * - understands TFNSW-specific payloads
 * - transforms raw API data into canonical alerts
 *
 * This layer should NEVER:
 * - access the database
 * - perform persistence
 * - resolve DB IDs
 */

import crypto from "crypto";

import CanonicalTrafficAlert from "../canonical/CanonicalTrafficAlert.js";

import {
	Categories,
	Sources,
	SourceTypes,
	Statuses,
} from "../../models/globalEnums.js";

import { transformCategory } from "../transformers/categoryTransformer.js";

import { transformSeverity } from "../transformers/severityTransformer.js";

import { transformStatus } from "../transformers/statusTransformer.js";

import { transformDate } from "../transformers/dateTransformer.js";

import {
	normalizeLocationName,
	normalizeMarker,
	normalizePolylineCoordinates,
	resolveCanonicalLGA,
	resolveRegionFromLGA,
} from "../transformers/locationTransformer.js";

/**
 * extractMarkersFromGeometry
 *
 * Recursively extracts Point geometries
 * from GeoJSON structures.
 *
 * Supports:
 * - Point
 * - MultiPoint
 * - GeometryCollection
 *
 * @param {Object|null|undefined} geometry
 * @returns {Array}
 */
function extractMarkersFromGeometry(geometry) {
	if (!geometry || typeof geometry !== "object") {
		return [];
	}

	const markers = [];

	/**
	 * Point geometry.
	 */
	if (
		geometry.type === "Point" &&
		Array.isArray(geometry.coordinates) &&
		geometry.coordinates.length >= 2
	) {
		const marker = normalizeMarker({
			longitude: geometry.coordinates[0],
			latitude: geometry.coordinates[1],
		});

		if (marker) {
			markers.push(marker);
		}
	}

	/**
	 * MultiPoint geometry.
	 */
	if (geometry.type === "MultiPoint" && Array.isArray(geometry.coordinates)) {
		for (const coordinatePair of geometry.coordinates) {
			if (Array.isArray(coordinatePair) && coordinatePair.length >= 2) {
				const marker = normalizeMarker({
					longitude: coordinatePair[0],
					latitude: coordinatePair[1],
				});

				if (marker) {
					markers.push(marker);
				}
			}
		}
	}

	/**
	 * Recursive GeometryCollection support.
	 */
	if (
		geometry.type === "GeometryCollection" &&
		Array.isArray(geometry.geometries)
	) {
		for (const childGeometry of geometry.geometries) {
			markers.push(...extractMarkersFromGeometry(childGeometry));
		}
	}

	return markers;
}

/**
 * extractPolylinesFromGeometry
 *
 * Recursively extracts LineString geometries
 * from GeoJSON structures.
 *
 * Supports:
 * - LineString
 * - MultiLineString
 * - GeometryCollection
 *
 * @param {Object|null|undefined} geometry
 * @returns {Array}
 */
function extractPolylinesFromGeometry(geometry) {
	if (!geometry || typeof geometry !== "object") {
		return [];
	}

	const polylines = [];

	/**
	 * LineString geometry.
	 */
	if (geometry.type === "LineString" && Array.isArray(geometry.coordinates)) {
		const normalizedCoordinates = normalizePolylineCoordinates(
			geometry.coordinates,
		);

		if (normalizedCoordinates.length > 0) {
			polylines.push(normalizedCoordinates);
		}
	}

	/**
	 * MultiLineString geometry.
	 */
	if (
		geometry.type === "MultiLineString" &&
		Array.isArray(geometry.coordinates)
	) {
		for (const line of geometry.coordinates) {
			const normalizedCoordinates = normalizePolylineCoordinates(line);

			if (normalizedCoordinates.length > 0) {
				polylines.push(normalizedCoordinates);
			}
		}
	}

	/**
	 * Recursive GeometryCollection support.
	 */
	if (
		geometry.type === "GeometryCollection" &&
		Array.isArray(geometry.geometries)
	) {
		for (const childGeometry of geometry.geometries) {
			polylines.push(...extractPolylinesFromGeometry(childGeometry));
		}
	}

	return polylines;
}

/**
 * normalizeTfnswIncident
 *
 * Converts a single raw TFNSW incident
 * into a CanonicalTrafficAlert.
 *
 * @param {Object} incident
 * @returns {CanonicalTrafficAlert|null}
 */
export function normalizeTfnswIncident(incident) {
	try {
		if (!incident || typeof incident !== "object") {
			return null;
		}

		/**
		 * -------------------------------------------------
		 * Geometry Extraction
		 * -------------------------------------------------
		 */

		const geometry =
			incident.geometry || incident.GeoJson || incident.geojson || null;

		const markers = extractMarkersFromGeometry(geometry);

		const primaryMarker = markers[0] || null;

		const polylines = extractPolylinesFromGeometry(geometry);

		/**
		 * -------------------------------------------------
		 * Administrative Geography
		 * -------------------------------------------------
		 */

		const rawCouncilArea =
			incident.councilArea ||
			incident.lga ||
			incident.localGovernmentArea ||
			null;

		const canonicalLGA = resolveCanonicalLGA(rawCouncilArea);

		const region = resolveRegionFromLGA(canonicalLGA);

		/**
		 * -------------------------------------------------
		 * Location
		 * -------------------------------------------------
		 */

		const locationName = normalizeLocationName(
			incident.suburb ||
				incident.location ||
				incident.area ||
				incident.region ||
				null,
		);

		/**
		 * -------------------------------------------------
		 * Alert Metadata
		 * -------------------------------------------------
		 */

		const category = transformCategory(
			incident.category ||
				incident.incidentKind ||
				incident.eventType ||
				"Traffic Incident",
		);

		const severity = transformSeverity(
			incident.severity ||
				incident.impact ||
				incident.trafficImpact ||
				incident.adviceLevel,
		);

		const status = transformStatus(
			incident.status || incident.incidentStatus || incident.roadStatus,
		);

		/**
		 * -------------------------------------------------
		 * Dates
		 * -------------------------------------------------
		 */

		const createdAt = transformDate(
			incident.created || incident.createdAt || incident.publishDate,
		);

		const updatedAt = transformDate(
			incident.updated || incident.updatedAt || incident.lastUpdated,
		);

		const publishedAt = transformDate(
			incident.publishDate || incident.created || incident.createdAt,
		);

		/**
		 * -------------------------------------------------
		 * Advice / Messaging
		 * -------------------------------------------------
		 */

		const advice = [];

		if (incident.advice) {
			advice.push(incident.advice);
		}

		if (incident.publicAdvice) {
			advice.push(incident.publicAdvice);
		}

		if (incident.diversions) {
			advice.push(incident.diversions);
		}

		/**
		 * -------------------------------------------------
		 * Links
		 * -------------------------------------------------
		 */

		const links = [];

		if (incident.url) {
			links.push({
				title: "TFNSW Incident",
				url: incident.url,
			});
		}

		/**
		 * -------------------------------------------------
		 * Traffic-specific metadata
		 * -------------------------------------------------
		 */

		const affectedRoads = [];

		if (incident.roadName) {
			affectedRoads.push(incident.roadName);
		}

		if (incident.alternateName) {
			affectedRoads.push(incident.alternateName);
		}

		const lanesAffected = Number(incident.lanesAffected) || null;

		const trafficImpact = incident.trafficImpact || incident.impact || null;

		/**
		 * -------------------------------------------------
		 * Create Canonical Alert
		 * -------------------------------------------------
		 */

		const data = {
			source: Sources.TFNSW,
			sourceType: SourceTypes.TRAFFIC,
			/**
			 * Core identifiers
			 */
			externalId: String(
				incident.id || incident.guid || crypto.randomUUID(),
			),

			/**
			 * Core alert info
			 */
			title: properties.title || properties.headline || "RFS Incident",

			description: properties.description || properties.caption || null,

			category: category,

			subCategory: null, // Optional - Not implemented yet

			severity: severity,

			status: status,

			/**
			 * Dates
			 */
			createdAt: createdAt,
			updatedAt: updatedAt,
			publishedAt: publishedAt,

			/**
			 * Geography
			 */
			location: locationName,
			councilArea: canonicalLGA,
			region: region,

			marker: primaryMarker,
			polygons: polygons,

			/**
			 * Links
			 */
			links: links,

			/**
			 * Advice
			 */
			advice: advice,

			isMajor: isMajor,

			isActive: isActive,

			/**
			 * Fire-specific fields
			 */
			fireType: fireType,
			fireSize: size,
			containmentStatus: containment,

			responsibleAgency: responsibleAgency,

			/**
			 * Store raw payload for debugging/auditing
			 */
			rawPayload: feature,
		};

		return new CanonicalTrafficAlert({
			/**
			 * Core identifiers
			 */
			externalId: String(
				incident.id || incident.guid || crypto.randomUUID(),
			),

			source: Sources.TFNSW,

			/**
			 * Core alert info
			 */
			title:
				incident.title ||
				incident.headline ||
				incident.displayName ||
				"Traffic Incident",

			description: incident.description || incident.details || null,

			category,
			severity,
			status,

			/**
			 * Geography
			 */
			locationName,
			councilArea: canonicalLGA,
			region,

			marker: primaryMarker,
			polylines,

			/**
			 * Dates
			 */
			createdAt,
			updatedAt,
			publishedAt,

			/**
			 * Advice
			 */
			advice,

			/**
			 * Links
			 */
			links,

			/**
			 * Traffic-specific fields
			 */
			affectedRoads,
			lanesAffected,
			trafficImpact,

			/**
			 * Store raw payload
			 */
			rawPayload: incident,
		});
	} catch (error) {
		console.error("Failed to normalize TFNSW incident:", error);

		return null;
	}
}

/**
 * normalizeTfnswFeed
 *
 * Converts an array of raw TFNSW incidents
 * into canonical alerts.
 *
 * Invalid alerts are automatically filtered.
 *
 * @param {Array} incidents
 * @returns {CanonicalTrafficAlert[]}
 */
export function normalizeTfnswFeed(incidents = []) {
	if (!Array.isArray(incidents)) {
		return [];
	}

	return incidents.map(normalizeTfnswIncident).filter(Boolean);
}

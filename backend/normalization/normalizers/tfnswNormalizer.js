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
	SeverityLevels,
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
	decodeEncodedPolyline,
	resolveCanonicalLGA,
	resolveRegionFromLGA,
} from "../transformers/locationTransformer.js";

function getProperties(feature) {
	return feature?.properties && typeof feature.properties === "object"
		? feature.properties
		: {};
}

function firstNonEmpty(...values) {
	return values.find((value) => {
		if (typeof value === "string") {
			return value.trim() !== "";
		}

		return value !== null && value !== undefined;
	});
}

function normalizePositiveNumber(value) {
	const parsedValue = Number(value);

	return Number.isFinite(parsedValue) && parsedValue >= 0
		? parsedValue
		: null;
}

function normalizeRoads(roads) {
	if (!Array.isArray(roads)) {
		return [];
	}

	return roads.map((road) => ({
		roadName: road.mainStreet || null,
		crossStreet: road.crossStreet || null,
		suburb: road.suburb || null,
		region: road.region || null,
		locationQualifier: road.locationQualifier || null,
		secondLocation: road.secondLocation || null,
		conditionTendency: road.conditionTendency || null,
		delay: road.delay || null,
		impactedLanes: Array.isArray(road.impactedLanes)
			? road.impactedLanes
			: [],
		queueLength: normalizePositiveNumber(road.queueLength),
		trafficVolume: road.trafficVolume || null,
	}));
}

function normalizeLinks(properties) {
	const links = [];

	if (Array.isArray(properties.webLinks)) {
		for (const link of properties.webLinks) {
			if (link?.linkURL) {
				links.push({
					title: link.linkText || "TFNSW Link",
					url: link.linkURL,
				});
			}
		}
	}

	if (properties.weblinkUrl) {
		links.push({
			title: properties.weblinkName || "TFNSW Incident",
			url: properties.weblinkUrl,
		});
	}

	return links;
}

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

	if (Array.isArray(geometry.collections)) {
		for (const childGeometry of geometry.collections) {
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

	if (Array.isArray(geometry.collections)) {
		for (const childGeometry of geometry.collections) {
			polylines.push(...extractPolylinesFromGeometry(childGeometry));
		}
	}

	return polylines;
}

function extractEncodedPolylines(encodedPolylines) {
	if (!Array.isArray(encodedPolylines)) {
		return [];
	}

	return encodedPolylines
		.map((encodedPolyline) =>
			decodeEncodedPolyline(encodedPolyline?.coords),
		)
		.filter((polyline) => polyline.length > 0);
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

		const properties = getProperties(incident);

		/**
		 * -------------------------------------------------
		 * Geometry Extraction
		 * -------------------------------------------------
		 */

		const geometry =
			incident.geometry || incident.GeoJson || incident.geojson || null;

		const markers = extractMarkersFromGeometry(geometry);

		const primaryMarker = markers[0] || null;

		const polylines = [
			...extractPolylinesFromGeometry(geometry),
			...extractEncodedPolylines(properties.encodedPolylines),
		];

		/**
		 * -------------------------------------------------
		 * Administrative Geography
		 * -------------------------------------------------
		 */

		const roads = normalizeRoads(properties.roads);
		const primaryRoad = roads[0] || null;

		const rawCouncilArea = firstNonEmpty(
			properties.councilArea,
			properties.lga,
			properties.localGovernmentArea,
			incident.councilArea,
			incident.lga,
			incident.localGovernmentArea,
		);

		const canonicalLGA = resolveCanonicalLGA(rawCouncilArea);

		const region = resolveRegionFromLGA(canonicalLGA);

		/**
		 * -------------------------------------------------
		 * Location
		 * -------------------------------------------------
		 */

		const locationName = normalizeLocationName(
			firstNonEmpty(
				primaryRoad?.suburb,
				properties.suburb,
				properties.location,
				properties.area,
				properties.region,
				incident.suburb,
				incident.location,
				incident.area,
				incident.region,
			),
		);

		/**
		 * -------------------------------------------------
		 * Alert Metadata
		 * -------------------------------------------------
		 */

		const category = transformCategory(
			firstNonEmpty(
				properties.mainCategory,
				properties.CategoryIcon,
				properties.incidentKind,
				properties.eventType,
				incident.category,
				incident.incidentKind,
				incident.eventType,
				"Traffic Incident",
			),
		);

		const severity = properties.isMajor
			? SeverityLevels.MAJOR
			: transformSeverity(
					firstNonEmpty(
						properties.severity,
						properties.impact,
						properties.trafficImpact,
						properties.adviceLevel,
						incident.severity,
						incident.impact,
						incident.trafficImpact,
						incident.adviceLevel,
					),
				);

		const status = properties.ended
			? Statuses.CLOSED
			: transformStatus(
					firstNonEmpty(
						properties.status,
						properties.incidentStatus,
						properties.roadStatus,
						properties.incidentKind,
						incident.status,
						incident.incidentStatus,
						incident.roadStatus,
					),
				);

		/**
		 * -------------------------------------------------
		 * Dates
		 * -------------------------------------------------
		 */

		const createdAt = transformDate(
			firstNonEmpty(
				properties.created,
				incident.created,
				incident.createdAt,
				incident.publishDate,
			),
		);

		const updatedAt = transformDate(
			firstNonEmpty(
				properties.lastUpdated,
				properties.updated,
				incident.updated,
				incident.updatedAt,
				incident.lastUpdated,
			),
		);

		const publishedAt = transformDate(
			firstNonEmpty(
				properties.publishDate,
				properties.created,
				incident.publishDate,
				incident.created,
				incident.createdAt,
			),
		);

		const startDate = transformDate(properties.start);
		const endDate = transformDate(properties.end);

		/**
		 * -------------------------------------------------
		 * Advice / Messaging
		 * -------------------------------------------------
		 */

		const advice = [];

		for (const value of [
			properties.adviceA,
			properties.adviceB,
			properties.adviceC,
			incident.advice,
			incident.publicAdvice,
			properties.diversions,
		]) {
			if (typeof value === "string" && value.trim()) {
				advice.push(value.trim());
			}
		}

		/**
		 * -------------------------------------------------
		 * Links
		 * -------------------------------------------------
		 */

		const links = normalizeLinks(properties);

		/**
		 * -------------------------------------------------
		 * Traffic-specific metadata
		 * -------------------------------------------------
		 */

		const delayMinutes = normalizePositiveNumber(properties.expectedDelay);
		const queueLength = normalizePositiveNumber(primaryRoad?.queueLength);
		const speedLimit = normalizePositiveNumber(properties.speedLimit);
		const planned = properties.incidentKind === "Planned";
		const impactingNetwork = Boolean(properties.impactingNetwork);
		const isMajor = Boolean(properties.isMajor);
		const isActive = !properties.ended;

		/**
		 * -------------------------------------------------
		 * Create Canonical Alert
		 * -------------------------------------------------
		 */

		return new CanonicalTrafficAlert({
			/**
			 * Core identifiers
			 */
			externalId: String(
				incident.id ||
					properties.guid ||
					properties.id ||
					crypto.randomUUID(),
			),

			source: Sources.TFNSW,
			sourceType: SourceTypes.TRAFFIC,

			/**
			 * Core alert info
			 */
			title:
				properties.displayName ||
				properties.headline ||
				properties.name ||
				incident.title ||
				"Traffic Incident",

			description:
				properties.otherAdvice ||
				properties.publicTransport ||
				incident.description ||
				incident.details ||
				null,

			category: category,
			subCategory:
				properties.subCategoryA || properties.subCategoryB || null,
			severity: severity,
			status: status,

			/**
			 * Geography
			 */
			location: locationName,
			councilArea: canonicalLGA,
			region: region,

			marker: primaryMarker,
			polylines: polylines,

			/**
			 * Dates
			 */
			createdAt: createdAt,
			updatedAt: updatedAt,
			publishedAt: publishedAt,

			/**
			 * Advice
			 */
			advice: advice,

			/**
			 * Links
			 */
			links: links,

			isMajor: isMajor,
			isActive: isActive,

			/**
			 * Traffic-specific fields
			 */
			planned: planned,
			startDate: startDate,
			endDate: endDate,
			delayMinutes: delayMinutes,
			queueLength: queueLength,
			speedLimit: speedLimit,
			impactingNetwork: impactingNetwork,
			roads: roads,
			diversions: properties.diversions || null,
			attendingGroups: Array.isArray(properties.attendingGroups)
				? properties.attendingGroups
				: [],
			publicTransport: properties.publicTransport || null,

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

/**
 * rfsNormalizer.js
 *
 * Responsibility:
 * Convert raw NSW RFS feed features into
 * canonical internal fire alert objects.
 *
 * IMPORTANT:
 * This layer:
 * - understands RFS-specific payloads
 * - transforms raw data into canonical alerts
 *
 * This layer should NEVER:
 * - access the database
 * - perform persistence
 * - resolve DB IDs
 */

import CanonicalFireAlert from "../canonical/CanonicalFireAlert.js";

import { transformCategory } from "../transformers/categoryTransformer.js";

import { transformSeverity } from "../transformers/severityTransformer.js";

import { transformStatus } from "../transformers/statusTransformer.js";

import { transformDate } from "../transformers/dateTransformer.js";

import {
	normalizeLocationName,
	normalizeMarker,
	normalizePolygonCoordinates,
	resolveCanonicalLGA,
	resolveRegionFromLGA,
} from "../transformers/locationTransformer.js";

/** * extractMarkersFromGeometry
 *
 * Recursively extracts Point geometries
 * from GeoJSON structures.
 *
 * Supports:
 * - Point
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
	 * Standard Point geometry.
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
 * extractPolygonsFromGeometry
 *
 * Recursively extracts Polygon geometries
 * from GeoJSON structures.
 * Supports:
 * - Polygon
 * - MultiPolygon
 * - GeometryCollection
 * @param {Object|null|undefined} geometry
 * @returns {Array}
 */
function extractPolygonsFromGeometry(geometry) {
	if (!geometry || typeof geometry !== "object") {
		return [];
	}
	const polygons = [];
	/**
	 * Polygon geometry.
	 */
	if (geometry.type === "Polygon" && Array.isArray(geometry.coordinates)) {
		for (const ring of geometry.coordinates) {
			const normalizedRing = normalizePolygonCoordinates(ring);
			if (normalizedRing.length > 0) {
				polygons.push(normalizedRing);
			}
		}
	}
	/**
	 * MultiPolygon geometry.
	 */
	if (
		geometry.type === "MultiPolygon" &&
		Array.isArray(geometry.coordinates)
	) {
		for (const polygon of geometry.coordinates) {
			for (const ring of polygon) {
				const normalizedRing = normalizePolygonCoordinates(ring);
				if (normalizedRing.length > 0) {
					polygons.push(normalizedRing);
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
			polygons.push(...extractPolygonsFromGeometry(childGeometry));
		}
	}
	return polygons;
}
/**
 * normalizeRfsFeature
 *
 * Converts a single raw RFS feature into
 * a CanonicalFireAlert.
 *
 * @param {Object} feature
 * @returns {CanonicalFireAlert|null}
 */
export function normalizeRfsFeature(feature) {
	try {
		if (!feature || typeof feature !== "object") {
			return null;
		}

		const properties = feature.properties || {};

		/**
		 * -------------------------------------------------
		 * Geometry Extraction
		 * -------------------------------------------------
		 */

		const geometry = feature.geometry || {};

		/**
		 * Extract all markers from geometry.
		 */
		const markers = extractMarkersFromGeometry(geometry);

		/**
		 * First marker becomes primary marker.
		 */
		const primaryMarker = markers[0] || null;

		/**
		 * Extract polygon geometries.
		 */
		const polygons = extractPolygonsFromGeometry(geometry);

		/**
		 * -------------------------------------------------
		 * Administrative Geography
		 * -------------------------------------------------
		 */

		const rawCouncilArea =
			properties.councilArea ||
			properties.lga ||
			properties.localGovernmentArea ||
			null;

		const canonicalLGA = resolveCanonicalLGA(rawCouncilArea);

		const region = resolveRegionFromLGA(canonicalLGA);

		/**
		 * -------------------------------------------------
		 * Location Name
		 * -------------------------------------------------
		 */

		const locationName = normalizeLocationName(
			properties.location || properties.suburb || properties.area || null,
		);

		/**
		 * -------------------------------------------------
		 * Alert Metadata
		 * -------------------------------------------------
		 */

		const category = transformCategory(
			properties.category || properties.incidentType || "Bush Fire",
		);

		const severity = transformSeverity(
			properties.alertLevel ||
				properties.severity ||
				properties.warningLevel,
		);

		const status = transformStatus(
			properties.status ||
				properties.fireStatus ||
				properties.incidentStatus,
		);

		/**
		 * -------------------------------------------------
		 * Dates
		 * -------------------------------------------------
		 */

		const createdAt = transformDate(
			properties.created || properties.pubDate,
		);

		const updatedAt = transformDate(
			properties.updated || properties.lastUpdated,
		);

		/**
		 * -------------------------------------------------
		 * Advice / Messaging
		 * -------------------------------------------------
		 */

		const advice = [];

		if (properties.advice) {
			advice.push(properties.advice);
		}

		if (properties.publicAdvice) {
			advice.push(properties.publicAdvice);
		}

		if (properties.evacuateMessage) {
			advice.push(properties.evacuateMessage);
		}

		/**
		 * -------------------------------------------------
		 * Fire-Specific Metadata
		 * -------------------------------------------------
		 */

		const fireType = properties.fireType || properties.incidentType || null;

		const size = Number(properties.size) || null;

		const containment =
			properties.percentageContained || properties.contained || null;

		/**
		 * -------------------------------------------------
		 * External Links
		 * -------------------------------------------------
		 */

		const links = [];

		if (properties.link) {
			links.push({
				title: "RFS Incident",
				url: properties.link,
			});
		}

		if (properties.uri) {
			links.push({
				title: "RFS URI",
				url: properties.uri,
			});
		}

		/**
		 * -------------------------------------------------
		 * Create Canonical Alert
		 * -------------------------------------------------
		 */

		return new CanonicalFireAlert({
			/**
			 * Core identifiers
			 */
			externalId: String(
				feature.id ||
					properties.guid ||
					properties.id ||
					crypto.randomUUID(),
			),

			source: Sources.RFS,

			/**
			 * Core alert info
			 */
			title: properties.title || properties.headline || "RFS Incident",

			description: properties.description || properties.caption || null,

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
			polygons,

			/**
			 * Dates
			 */
			createdAt,
			updatedAt,

			/**
			 * Advice
			 */
			advice,

			/**
			 * Links
			 */
			links,

			/**
			 * Fire-specific fields
			 */
			fireType,
			size,
			containment,

			/**
			 * Store raw payload for debugging/auditing
			 */
			rawPayload: feature,
		});
	} catch (error) {
		console.error("Failed to normalize RFS feature:", error);

		return null;
	}
}

/**
 * normalizeRfsFeed
 *
 * Converts an array of raw RFS features
 * into canonical alerts.
 *
 * Invalid alerts are automatically filtered.
 *
 * @param {Array} features
 * @returns {CanonicalFireAlert[]}
 */
export function normalizeRfsFeed(features = []) {
	if (!Array.isArray(features)) {
		return [];
	}

	return features.map(normalizeRfsFeature).filter(Boolean);
}

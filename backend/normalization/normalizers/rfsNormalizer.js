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

import {
	transformCategory,
	normalizeString,
} from "../transformers/categoryTransformer.js";

import {
	transformSeverity,
	isHighSeverity,
} from "../transformers/severityTransformer.js";

import { transformStatus } from "../transformers/statusTransformer.js";

import { transformDate } from "../transformers/dateTransformer.js";

import {
	normalizeLocationName,
	normalizeMarker,
	normalizePolygonCoordinates,
	resolveCanonicalLGA,
	resolveRegionFromLGA,
} from "../transformers/locationTransformer.js";

import {
	Categories,
	Sources,
	SourceTypes,
	Statuses,
} from "../../models/globalEnums.js";

import {
	RFSDescriptionFields,
	FireTypes,
	ContainmentStatuses,
} from "../../models/rfsEnums.js";

import { stripHtml } from "../../utils/alertUtilities.js";

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

function extractDescriptionFields(description) {
	const cleanedDescription = stripHtml(description);

	const result = {};

	const lines = cleanedDescription
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean);

	for (const line of lines) {
		const separatorIndex = line.indexOf(":");

		if (separatorIndex === -1) {
			continue;
		}

		const key = normalizeString(line.slice(0, separatorIndex).trim());

		const value = line.slice(separatorIndex + 1).trim();

		result[key] = value;
	}

	return result;
}

function extractNumericValue(value) {
	if (!value) {
		return null;
	}

	const match = String(value).match(/[\d.]+/);

	return match ? Number(match[0]) : null;
}

function extractCategoryFromRFS(category, descriptionFields) {
	const res = transformCategory(category);

	if (res !== Categories.OTHER) {
		return res;
	}

	return (
		transformCategory(descriptionFields[RFSDescriptionFields.TYPE]) || res
	);
}

function extractStatusFromRFS(status, descriptionFields) {
	const res = transformStatus(status);

	if (res !== Statuses.UNKNOWN) {
		return res;
	}

	return (
		transformStatus(descriptionFields[RFSDescriptionFields.STATUS]) || res
	);
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

		const descriptionFields = extractDescriptionFields(
			properties.description,
		);

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
			descriptionFields[RFSDescriptionFields.COUNCIL_AREA] ||
			null;

		const canonicalLGA = resolveCanonicalLGA(rawCouncilArea);

		const region = resolveRegionFromLGA(canonicalLGA);

		/**
		 * -------------------------------------------------
		 * Location Name
		 * -------------------------------------------------
		 */

		const locationName = normalizeLocationName(
			properties.location ||
				properties.suburb ||
				properties.area ||
				descriptionFields[RFSDescriptionFields.LOCATION] ||
				null,
		);

		/**
		 * -------------------------------------------------
		 * Alert Metadata
		 * -------------------------------------------------
		 */

		const category = extractCategoryFromRFS(
			properties.category ||
				properties.incidentType ||
				descriptionFields[RFSDescriptionFields.TYPE] ||
				Categories.FIRE,
			descriptionFields,
		);

		const severity = transformSeverity(
			properties.alertLevel ||
				properties.severity ||
				properties.warningLevel ||
				descriptionFields[RFSDescriptionFields.ALERT_LEVEL] ||
				null,
		);

		const status = extractStatusFromRFS(
			properties.status ||
				properties.fireStatus ||
				properties.incidentStatus ||
				descriptionFields[RFSDescriptionFields.STATUS] ||
				null,
			descriptionFields,
		);

		/**
		 * -------------------------------------------------
		 * Dates
		 * -------------------------------------------------
		 */

		const createdAt = transformDate(
			properties.created || properties.pubDate || Date.now(),
		);

		const updatedAt = transformDate(
			properties.updated ||
				properties.lastUpdated ||
				descriptionFields[RFSDescriptionFields.UPDATED] ||
				Date.now(),
		);

		const publishedAt = transformDate(
			properties.pubDate || properties.created,
		);

		/**
		 * -------------------------------------------------
		 * Advice / Messaging - These don't exist in RFS Feeds just here for future placeholders
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
		 * Active / Closed
		 * -------------------------------------------------
		 */

		const isMajor = isHighSeverity(severity);

		const isActive = true;

		/**
		 * -------------------------------------------------
		 * Fire-Specific Metadata
		 * -------------------------------------------------
		 */

		const fireType =
			FireTypes[
				normalizeString(
					properties.fireType ||
						properties.incidentType ||
						descriptionFields[RFSDescriptionFields.TYPE] ||
						null,
				)
			] || null;

		const size = extractNumericValue(
			properties.size ||
				descriptionFields[RFSDescriptionFields.SIZE] ||
				null,
		);

		const containment =
			ContainmentStatuses[
				normalizeString(
					properties.contained ||
						descriptionFields[RFSDescriptionFields.STATUS] ||
						null,
				)
			] || null;

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
		 * Agency Responsible
		 * -------------------------------------------------
		 */

		const responsibleAgency =
			descriptionFields[RFSDescriptionFields.RESPONSIBLE_AGENCY] ||
			Sources.RFS;

		/**
		 * -------------------------------------------------
		 * Create Canonical Alert
		 * -------------------------------------------------
		 */

		const data = {
			source: Sources.RFS,
			sourceType: SourceTypes.FIRE,
			/**
			 * Core identifiers
			 */
			externalId: String(
				feature.id ||
					properties.guid ||
					properties.id ||
					crypto.randomUUID(),
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

		return new CanonicalFireAlert(data);
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

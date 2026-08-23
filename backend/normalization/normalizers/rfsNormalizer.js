import crypto from "crypto";

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

import {
	Categories,
	Sources,
	SourceTypes,
	Statuses,
} from "../../models/globalEnums.js";
import {
	ContainmentStatuses,
	FireTypes,
	RFSDescriptionFields,
} from "../../models/rfsEnums.js";
import { stripHtml } from "../../utils/alertUtilities.js";
import CanonicalFireAlert from "../canonical/CanonicalFireAlert.js";
import {
	normalizeString,
	transformCategory,
} from "../transformers/categoryTransformer.js";
import { transformDate } from "../transformers/dateTransformer.js";
import {
	normalizeLocationName,
	normalizeMarker,
	normalizePolygonCoordinates,
	resolveCanonicalLGA,
	resolveRegionFromLGA,
} from "../transformers/locationTransformer.js";
import {
	isHighSeverity,
	transformSeverity,
} from "../transformers/severityTransformer.js";
import { transformStatus } from "../transformers/statusTransformer.js";

function firstNonEmpty(...values) {
	return values.find((value) => {
		if (typeof value === "string") {
			return value.trim() !== "";
		}

		return value !== null && value !== undefined;
	});
}

function pushPresent(target, ...values) {
	for (const value of values) {
		if (typeof value === "string" && value.trim()) {
			target.push(value.trim());
		}
	}
}

/**
 * extractMarkersFromGeometry
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
	const transformedCategory = transformCategory(category);

	if (transformedCategory !== Categories.OTHER) {
		return transformedCategory;
	}

	return (
		transformCategory(descriptionFields[RFSDescriptionFields.TYPE]) ||
		transformedCategory
	);
}

function extractStatusFromRFS(status, descriptionFields) {
	const transformedStatus = transformStatus(status);

	if (transformedStatus !== Statuses.UNKNOWN) {
		return transformedStatus;
	}

	return (
		transformStatus(descriptionFields[RFSDescriptionFields.STATUS]) ||
		transformedStatus
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

		const rawCouncilArea = firstNonEmpty(
			properties.councilArea,
			properties.lga,
			properties.localGovernmentArea,
			descriptionFields[RFSDescriptionFields.COUNCIL_AREA],
		);

		const canonicalLGA = resolveCanonicalLGA(rawCouncilArea);

		const region = resolveRegionFromLGA(canonicalLGA);

		/**
		 * -------------------------------------------------
		 * Location Name
		 * -------------------------------------------------
		 */

		const locationName = normalizeLocationName(
			firstNonEmpty(
				properties.location,
				properties.suburb,
				properties.area,
				descriptionFields[RFSDescriptionFields.LOCATION],
			),
		);

		/**
		 * -------------------------------------------------
		 * Alert Metadata
		 * -------------------------------------------------
		 */

		const category = extractCategoryFromRFS(
			firstNonEmpty(
				properties.category,
				properties.incidentType,
				descriptionFields[RFSDescriptionFields.TYPE],
				Categories.FIRE,
			),
			descriptionFields,
		);

		const severity = transformSeverity(
			firstNonEmpty(
				properties.alertLevel,
				properties.severity,
				properties.warningLevel,
				descriptionFields[RFSDescriptionFields.ALERT_LEVEL],
			),
		);

		const status = extractStatusFromRFS(
			firstNonEmpty(
				properties.status,
				properties.fireStatus,
				properties.incidentStatus,
				descriptionFields[RFSDescriptionFields.STATUS],
			),
			descriptionFields,
		);

		/**
		 * -------------------------------------------------
		 * Dates
		 * -------------------------------------------------
		 */

		const createdAt = transformDate(
			firstNonEmpty(properties.created, properties.pubDate),
		);

		const updatedAt = transformDate(
			firstNonEmpty(
				properties.updated,
				properties.lastUpdated,
				descriptionFields[RFSDescriptionFields.UPDATED],
			),
		);

		const publishedAt = transformDate(
			firstNonEmpty(properties.pubDate, properties.created),
		);

		/**
		 * -------------------------------------------------
		 * Advice / Messaging
		 * -------------------------------------------------
		 */

		const advice = [];
		pushPresent(
			advice,
			properties.advice,
			properties.publicAdvice,
			properties.evacuateMessage,
		);

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
					firstNonEmpty(
						properties.fireType,
						properties.incidentType,
						descriptionFields[RFSDescriptionFields.TYPE],
					),
				)
			] || null;

		const size = extractNumericValue(
			firstNonEmpty(
				properties.size,
				descriptionFields[RFSDescriptionFields.SIZE],
			),
		);

		const containment =
			ContainmentStatuses[
				normalizeString(
					firstNonEmpty(
						properties.contained,
						descriptionFields[RFSDescriptionFields.STATUS],
					),
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

			category,

			subCategory: null, // Optional - Not implemented yet

			severity,

			status,

			/**
			 * Dates
			 */
			createdAt,
			updatedAt,
			publishedAt,

			/**
			 * Geography
			 */
			location: locationName,
			councilArea: canonicalLGA,
			region,

			marker: primaryMarker,
			polygons,

			/**
			 * Links
			 */
			links,

			/**
			 * Advice
			 */
			advice,

			isMajor,

			isActive,

			/**
			 * Fire-specific fields
			 */
			fireType,
			fireSize: size,
			containmentStatus: containment,

			responsibleAgency,

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

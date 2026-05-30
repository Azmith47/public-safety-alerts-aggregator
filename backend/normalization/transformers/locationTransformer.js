/**
 * locationTransformer.js
 *
 * Responsibility:
 * Normalize geographic and administrative location data
 * into stable internal canonical formats.
 *
 * IMPORTANT:
 * This transformer should ONLY:
 * - normalize values
 * - validate coordinates
 * - standardize formatting
 * - resolve canonical LGAs
 * - resolve regions from LGAs
 *
 * This transformer should NEVER:
 * - call external APIs
 * - perform geocoding
 * - access the database
 */

import { LGA_REGION_MAP } from "../../mappings/lgaRegionMappings.js";

/**
 * normalizeString
 *
 * Converts inconsistent external values into
 * normalized lookup keys.
 *
 * Example:
 * "Bega Valley"
 * → "BEGA_VALLEY"
 *
 * @param {string|null|undefined} value
 * @returns {string|null}
 */
export function normalizeString(value) {
	if (!value || typeof value !== "string") {
		return null;
	}

	return value
		.trim()
		.toUpperCase()
		.replace(/[^\w\s]/g, "")
		.replace(/\s+/g, "_");
}

/**
 * normalizeLocationName
 *
 * Converts inconsistent human-readable location names
 * into stable title-cased values.
 *
 * Example:
 * " blue mountains "
 * → "Blue Mountains"
 *
 * @param {string|null|undefined} value
 * @returns {string|null}
 */
export function normalizeLocationName(value) {
	if (!value || typeof value !== "string") {
		return null;
	}

	const trimmedValue = value.trim();

	/**
	 * Empty string protection after trimming.
	 */
	if (!trimmedValue) {
		return null;
	}

	return trimmedValue
		.trim()
		.toLowerCase()
		.split(" ")
		.filter(Boolean)
		.map((word) => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(" ");
}

/**
 * normalizeRegion
 *
 * Converts region names into stable internal enum-like values.
 *
 * Example:
 * "South East Tablelands"
 * → "SOUTH_EAST_TABLELANDS"
 *
 * @param {string|null|undefined} value
 * @returns {string|null}
 */
export function normalizeRegion(value) {
	if (!value || typeof value !== "string") {
		return null;
	}

	return value
		.trim()
		.toUpperCase()
		.replace(/[^\w\s]/g, "")
		.replace(/\s+/g, "_");
}

/**
 * normalizeLGAName
 *
 * Removes inconsistent administrative formatting
 * from council/LGA names.
 *
 * Example:
 * "Blue Mountains City Council"
 * → "Blue Mountains"
 *
 * @param {string|null|undefined} value
 * @returns {string|null}
 */
export function normalizeLGAName(value) {
	if (!value || typeof value !== "string") {
		return null;
	}

	let normalizedValue = value.trim();

	/**
	 * Ignore unincorporated areas.
	 */
	if (/^unincorporated/i.test(normalizedValue)) {
		return null;
	}

	/**
	 * Remove verbose prefixes.
	 */
	normalizedValue = normalizedValue.replace(
		/^the\s+council\s+of\s+the\s+/i,
		"",
	);

	normalizedValue = normalizedValue.replace(/^the\s+council\s+of\s+/i, "");

	normalizedValue = normalizedValue.replace(/^council\s+of\s+the\s+/i, "");

	normalizedValue = normalizedValue.replace(/^council\s+of\s+/i, "");

	/**
	 * Remove administrative suffixes.
	 */
	normalizedValue = normalizedValue.replace(
		/\s+(city|shire|municipality|municipal|council)\b/gi,
		"",
	);

	/**
	 * Remove stray "of" fragments.
	 */
	normalizedValue = normalizedValue.replace(/\s+of\s+/gi, " ");

	/**
	 * Replace hyphens with spaces.
	 */
	normalizedValue = normalizedValue.replace(/-/g, " ");

	/**
	 * Remove punctuation.
	 */
	normalizedValue = normalizedValue.replace(/[,'"`:.]/g, "");

	/**
	 * Collapse repeated whitespace.
	 */
	normalizedValue = normalizedValue.replace(/\s+/g, " ").trim();

	return normalizeLocationName(normalizedValue);
}

export function normalizePostcode(value) {
	if (value === null || value === undefined) {
		return null;
	}

	const normalizedValue = String(value).trim();

	return normalizedValue || null;
}

/**
 * normalizeLGAKey
 *
 * Converts LGA names into stable matching keys.
 *
 * Example:
 * "Blue Mountains City Council"
 * → "BLUE_MOUNTAINS"
 *
 * @param {string|null|undefined} value
 * @returns {string|null}
 */
export function normalizeLGAKey(value) {
	const normalizedName = normalizeLGAName(value);

	if (!normalizedName) {
		return null;
	}

	return normalizedName
		.toUpperCase()
		.replace(/[^\w\s]/g, "")
		.replace(/[&]/g, "_")
		.replace(/\s+/g, "_");
}

/**
 * Build normalized LGA lookup map.
 *
 * Maps:
 * normalized key → canonical seed LGA name
 */
const normalizedLgaMap = (() => {
	const map = new Map();

	for (const lga of Object.keys(LGA_REGION_MAP)) {
		const normalizedKey = normalizeLGAKey(lga);

		if (normalizedKey) {
			/**
			 * Store canonical enum-style LGA values.
			 */
			map.set(normalizedKey, normalizeLGAKey(lga));
		}
	}

	return map;
})();

/**
 * resolveCanonicalLGA
 *
 * Attempts to resolve inconsistent external
 * LGA/council names into canonical internal LGAs.
 *
 * Supports:
 * - exact matches
 * - fuzzy substring matching
 * - partial matching
 *
 * @param {string|null|undefined} value
 * @returns {string|null}
 */
export function resolveCanonicalLGA(value) {
	const normalizedKey = normalizeLGAKey(value);

	if (!normalizedKey) {
		return null;
	}

	/**
	 * Exact match.
	 */
	if (normalizedLgaMap.has(normalizedKey)) {
		return normalizedLgaMap.get(normalizedKey);
	}

	/**
	 * Fuzzy substring matching.
	 */
	for (const [candidateKey, canonicalLGA] of normalizedLgaMap.entries()) {
		if (
			candidateKey.includes(normalizedKey) ||
			normalizedKey.includes(candidateKey)
		) {
			return canonicalLGA;
		}
	}

	/**
	 * Additional relaxed matching.
	 */
	const strippedKey = normalizedKey
		.replace(/_(REGIONAL|REGION|DISTRICT|CITY|SHIRE|COUNCIL)$/g, "")
		.replace(/_{2,}/g, "_")
		.replace(/^_+|_+$/g, "");

	if (normalizedLgaMap.has(strippedKey)) {
		return normalizedLgaMap.get(strippedKey);
	}

	for (const [candidateKey, canonicalLGA] of normalizedLgaMap.entries()) {
		if (
			candidateKey.includes(strippedKey) ||
			strippedKey.includes(candidateKey)
		) {
			return canonicalLGA;
		}
	}

	return null;
}

/**
 * resolveRegionFromLGA
 *
 * Maps canonical LGAs into internal NSW regions.
 *
 * @param {string|null|undefined} lga
 * @returns {string|null}
 */
export function resolveRegionFromLGA(lga) {
	if (!lga) {
		return null;
	}

	for (const [candidateLGA, region] of Object.entries(LGA_REGION_MAP)) {
		if (normalizeLGAKey(candidateLGA) === lga) {
			return normalizeRegion(region);
		}
	}

	return null;
}

/**
 * isValidLatitude
 *
 * @param {number|null|undefined} value
 * @returns {boolean}
 */
export function isValidLatitude(value) {
	return typeof value === "number" && value >= -90 && value <= 90;
}

/**
 * isValidLongitude
 *
 * @param {number|null|undefined} value
 * @returns {boolean}
 */
export function isValidLongitude(value) {
	return typeof value === "number" && value >= -180 && value <= 180;
}

/**
 * normalizeCoordinate
 *
 * Safely converts coordinate values into numbers.
 *
 * @param {string|number|null|undefined} value
 * @returns {number|null}
 */
export function normalizeCoordinate(value) {
	if (value === null || value === undefined) {
		return null;
	}

	const parsedValue = Number(value);

	return Number.isFinite(parsedValue) ? parsedValue : null;
}

/**
 * normalizeMarker
 *
 * Converts coordinate inputs into a standardized marker object.
 *
 * Supports:
 * - latitude/longitude
 * - lat/lng
 * - lat/lon
 *
 * @param {Object|null|undefined} marker
 * @returns {Object|null}
 */
export function normalizeMarker(marker) {
	if (!marker || typeof marker !== "object") {
		return null;
	}

	const latitude = normalizeCoordinate(marker.latitude ?? marker.lat);

	const longitude = normalizeCoordinate(
		marker.longitude ?? marker.lng ?? marker.lon,
	);

	if (!isValidLatitude(latitude) || !isValidLongitude(longitude)) {
		return null;
	}

	return {
		latitude,
		longitude,
	};
}

/**
 * normalizePolygonCoordinates
 *
 * Validates polygon/polyline coordinate arrays.
 *
 * Expected format:
 * [
 *   [longitude, latitude]
 * ]
 *
 * Invalid coordinate pairs are removed.
 *
 * @param {Array|null|undefined} coordinates
 * @returns {Array}
 */
export function normalizePolygonCoordinates(coordinates) {
	if (!Array.isArray(coordinates)) {
		return [];
	}

	return coordinates.filter((coordinatePair) => {
		if (!Array.isArray(coordinatePair) || coordinatePair.length < 2) {
			return false;
		}

		const longitude = normalizeCoordinate(coordinatePair[0]);
		const latitude = normalizeCoordinate(coordinatePair[1]);

		return isValidLatitude(latitude) && isValidLongitude(longitude);
	});
}

/**
 * normalizePolylineCoordinates
 *
 * Alias/helper for line geometry normalization.
 *
 * @param {Array|null|undefined} coordinates
 * @returns {Array}
 */
export function normalizePolylineCoordinates(coordinates) {
	return normalizePolygonCoordinates(coordinates);
}

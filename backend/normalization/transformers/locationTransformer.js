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
			if (word === "of") {
				return "of";
			}
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
	 * Preserve "of" in canonical LGA names like "City of Parramatta".
	 * We only strip it for comparison lookups, not for display/storage.
	 */

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
function stripComparisonWord(value) {
	if (!value) {
		return value;
	}

	return value
		.replace(/_OF_/g, "_")
		.replace(/^OF_/, "")
		.replace(/_OF$/, "")
		.replace(/\bOF\b/gi, "")
		.replace(/_+/g, "_")
		.replace(/^_+|_+$/g, "");
}

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
		const canonicalKey = normalizeLGAKey(lga);

		if (!canonicalKey) {
			continue;
		}

		const comparisonKey = stripComparisonWord(canonicalKey);

		map.set(canonicalKey, canonicalKey);
		if (comparisonKey && comparisonKey !== canonicalKey) {
			map.set(comparisonKey, canonicalKey);
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

	const comparisonKey = stripComparisonWord(normalizedKey);
	const candidateKeys = [
		normalizedKey,
		comparisonKey,
		normalizedKey
			.replace(/_(REGIONAL|REGION|DISTRICT|CITY|SHIRE|COUNCIL)$/g, "")
			.replace(/_{2,}/g, "_")
			.replace(/^_+|_+$/g, ""),
		stripComparisonWord(
			normalizedKey
				.replace(/_(REGIONAL|REGION|DISTRICT|CITY|SHIRE|COUNCIL)$/g, "")
				.replace(/_{2,}/g, "_")
				.replace(/^_+|_+$/g, ""),
		),
	];

	for (const candidate of candidateKeys) {
		if (!candidate) continue;
		if (normalizedLgaMap.has(candidate)) {
			return normalizedLgaMap.get(candidate);
		}
	}

	for (const [candidateKey, canonicalLGA] of normalizedLgaMap.entries()) {
		if (
			candidateKey.includes(normalizedKey) ||
			normalizedKey.includes(candidateKey) ||
			(candidateKey.includes(comparisonKey) && comparisonKey) ||
			(comparisonKey && comparisonKey.includes(candidateKey))
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

/**
 * Decodes a Google encoded polyline into [longitude, latitude] pairs.
 *
 * @param {string|null|undefined} encodedPolyline
 * @returns {Array}
 */
export function decodeEncodedPolyline(encodedPolyline) {
	if (typeof encodedPolyline !== "string" || encodedPolyline.length === 0) {
		return [];
	}

	const coordinates = [];
	let index = 0;
	let latitude = 0;
	let longitude = 0;

	try {
		while (index < encodedPolyline.length) {
			let result = 0;
			let shift = 0;
			let byte;

			do {
				byte = encodedPolyline.charCodeAt(index++) - 63;
				if (byte < 0) return [];
				result |= (byte & 0x1f) << shift;
				shift += 5;
			} while (byte >= 0x20 && index <= encodedPolyline.length);

			const latitudeDelta = result & 1 ? ~(result >> 1) : result >> 1;
			latitude += latitudeDelta;

			result = 0;
			shift = 0;

			do {
				byte = encodedPolyline.charCodeAt(index++) - 63;
				if (byte < 0) return [];
				result |= (byte & 0x1f) << shift;
				shift += 5;
			} while (byte >= 0x20 && index <= encodedPolyline.length);

			const longitudeDelta = result & 1 ? ~(result >> 1) : result >> 1;
			longitude += longitudeDelta;

			const normalizedCoordinate = normalizePolylineCoordinates([
				[longitude / 1e5, latitude / 1e5],
			]);

			if (normalizedCoordinate.length === 0) {
				return [];
			}

			coordinates.push(normalizedCoordinate[0]);
		}
	} catch {
		return [];
	}

	return coordinates;
}

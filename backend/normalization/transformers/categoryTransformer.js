import { Categories } from "../../models/enums.js";
import CATEGORY_MAPPINGS from "../../mappings/categoryMappings.js";
/**
 * categoryTransformer.js
 *
 * Responsibility:
 * Transform inconsistent external source category values
 * into stable internal canonical category enums.
 *
 * IMPORTANT:
 * - Output values should NEVER be source-specific
 * - Output values should NEVER contain display formatting
 * - Output values should remain stable across all sources
 */

/**
 * normalizeString
 *
 * Converts messy external source values into
 * normalized lookup keys.
 *
 * Example:
 * "Bush Fire"
 * → "BUSH_FIRE"
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
		.replace(/[^\w\s-]/g, " ")
		.trim()
		.replace(/[-\s]+/g, "_");
}

/**
 * transformCategory
 *
 * Converts source-specific category values
 * into canonical internal category enums.
 *
 * @param {string|null|undefined} value
 * @returns {string}
 */
export function transformCategory(value) {
	const normalizedValue = normalizeString(value);

	if (!normalizedValue) {
		return Categories.OTHER;
	}

	return CATEGORY_MAPPINGS[normalizedValue] || Categories.OTHER;
}

import { SeverityLevels } from "../../models/enums.js";
import { SEVERITY_MAPPINGS } from "../../mappings/severityLevelsMappings.js";
/**
 * severityTransformer.js
 *
 * Responsibility:
 * Convert inconsistent external severity values
 * into stable internal canonical severity enums.
 *
 * IMPORTANT:
 * - Output values must remain source-agnostic
 * - Output values should NEVER contain display formatting
 * - Output values should be stable across all alert providers
 */

/**
 * normalizeString
 *
 * Converts inconsistent external values into
 * normalized lookup keys.
 *
 * Example:
 * "Emergency Warning"
 * → "EMERGENCY_WARNING"
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
 * transformSeverity
 *
 * Converts external severity values into
 * canonical internal severity enums.
 *
 * @param {string|null|undefined} value
 * @returns {string}
 */
export function transformSeverity(value) {
	const normalizedValue = normalizeString(value);

	if (!normalizedValue) {
		return SeverityLevels.UNKNOWN;
	}

	return SEVERITY_MAPPINGS[normalizedValue] || SeverityLevels.UNKNOWN;
}

/**
 * isHighSeverity
 *
 * Utility helper used for:
 * - notification prioritization
 * - frontend alert highlighting
 * - escalation logic
 *
 * @param {string|null|undefined} severity
 * @returns {boolean}
 */
export function isHighSeverity(severity) {
	const normalizedSeverity = transformSeverity(severity);

	return [
		SeverityLevels.EMERGENCY_WARNING,
		SeverityLevels.WATCH_AND_ACT,
		SeverityLevels.MAJOR,
	].includes(normalizedSeverity);
}

/**
 * getSeverityPriority
 *
 * Converts severity into a sortable numeric priority.
 *
 * Higher number = higher severity.
 *
 * Useful for:
 * - sorting alerts
 * - prioritizing notifications
 * - frontend display ordering
 *
 * @param {string|null|undefined} severity
 * @returns {number}
 */
export function getSeverityPriority(severity) {
	const normalizedSeverity = transformSeverity(severity);

	const priorities = {
		[SeverityLevels.EMERGENCY_WARNING]: 100,
		[SeverityLevels.WATCH_AND_ACT]: 80,
		[SeverityLevels.MAJOR]: 70,
		[SeverityLevels.ADVICE]: 60,
		[SeverityLevels.MODERATE]: 50,
		[SeverityLevels.MINOR]: 40,
		[SeverityLevels.INFORMATION]: 20,
		[SeverityLevels.UNKNOWN]: 0,
	};

	return priorities[normalizedSeverity] || 0;
}

import { Statuses } from "../../models/globalEnums.js";
import { STATUS_MAPPINGS } from "../../mappings/statusesMappings.js";
/**
 * statusTransformer.js
 *
 * Responsibility:
 * Convert inconsistent external operational status values
 * into stable internal canonical lifecycle statuses.
 *
 * IMPORTANT:
 * - Statuses represent operational lifecycle state
 * - Statuses are NOT severity levels
 * - Output values must remain source-agnostic
 */

/**
 * normalizeString
 *
 * Converts inconsistent external values into
 * normalized lookup keys.
 *
 * Example:
 * "Under Control"
 * → "UNDER_CONTROL"
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
 * transformStatus
 *
 * Converts external operational status values
 * into canonical internal lifecycle statuses.
 *
 * @param {string|null|undefined} value
 * @returns {string}
 */
export function transformStatus(value) {
	const normalizedValue = normalizeString(value);

	if (!normalizedValue) {
		return Statuses.UNKNOWN;
	}

	return STATUS_MAPPINGS[normalizedValue] || Statuses.UNKNOWN;
}

/**
 * isActiveStatus
 *
 * Determines whether an alert should still be
 * considered operationally active.
 *
 * Useful for:
 * - frontend visibility
 * - notification logic
 * - cleanup services
 * - alert lifecycle management
 *
 * @param {string|null|undefined} status
 * @returns {boolean}
 */
export function isActiveStatus(status) {
	const normalizedStatus = transformStatus(status);

	return [
		Statuses.ACTIVE,
		Statuses.MONITORING,
		Statuses.UNDER_CONTROL,
		Statuses.CONTAINED,
		Statuses.CONTROLLED,
		Statuses.PLANNED,
	].includes(normalizedStatus);
}

/**
 * isClosedStatus
 *
 * Determines whether an alert lifecycle
 * has effectively ended.
 *
 * @param {string|null|undefined} status
 * @returns {boolean}
 */
export function isClosedStatus(status) {
	const normalizedStatus = transformStatus(status);

	return [
		Statuses.COMPLETED,
		Statuses.RESOLVED,
		Statuses.CLOSED,
		Statuses.CANCELLED,
	].includes(normalizedStatus);
}

/**
 * getStatusPriority
 *
 * Converts lifecycle statuses into sortable priorities.
 *
 * Higher number = operationally more active.
 *
 * Useful for:
 * - sorting active incidents
 * - prioritizing current alerts
 * - frontend ordering
 *
 * @param {string|null|undefined} status
 * @returns {number}
 */
export function getStatusPriority(status) {
	const normalizedStatus = transformStatus(status);

	const priorities = {
		[Statuses.ACTIVE]: 100,
		[Statuses.MONITORING]: 90,
		[Statuses.UNDER_CONTROL]: 80,
		[Statuses.CONTAINED]: 70,
		[Statuses.CONTROLLED]: 60,
		[Statuses.PLANNED]: 50,
		[Statuses.COMPLETED]: 20,
		[Statuses.RESOLVED]: 10,
		[Statuses.CLOSED]: 0,
		[Statuses.CANCELLED]: 0,
		[Statuses.UNKNOWN]: 0,
	};

	return priorities[normalizedStatus] || 0;
}

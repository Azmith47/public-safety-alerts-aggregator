/**
 * dateTransformer.js
 *
 * Responsibility:
 * Normalize inconsistent external date/time formats
 * into stable JavaScript Date objects.
 *
 * IMPORTANT:
 * - Transformers should NEVER throw errors for bad input
 * - Invalid dates should safely return null
 * - Internal system standard = JavaScript Date objects
 */

/**
 * transformDate
 *
 * Converts external date formats into a valid Date object.
 *
 * Supported inputs:
 * - JavaScript Date
 * - Unix epoch milliseconds
 * - ISO date strings
 * - RFC-style date strings
 *
 * Examples:
 * 1748839200000
 * "2026-05-01T10:00:00Z"
 * "Tue, 01 May 2026 10:00:00 GMT"
 *
 * @param {Date|string|number|null|undefined} value
 * @returns {Date|null}
 */
export function transformDate(value) {
	/**
	 * Null/undefined protection.
	 */
	if (value === null || value === undefined) {
		return null;
	}

	/**
	 * Already a valid Date instance.
	 */
	if (value instanceof Date) {
		return isNaN(value.getTime()) ? null : value;
	}

	/**
	 * Unix epoch milliseconds.
	 */
	if (typeof value === "number") {
		const parsedDate = new Date(value);

		return isNaN(parsedDate.getTime()) ? null : parsedDate;
	}

	/**
	 * String parsing.
	 */
	if (typeof value === "string") {
		const trimmedValue = value.trim();

		/**
		 * Empty string protection.
		 */
		if (!trimmedValue) {
			return null;
		}

		const parsedDate = new Date(trimmedValue);

		return isNaN(parsedDate.getTime()) ? null : parsedDate;
	}

	/**
	 * Unsupported input type.
	 */
	return null;
}

/**
 * transformDateToISOString
 *
 * Converts external date values into standardized ISO strings.
 *
 * Example:
 * "2026-05-01T10:00:00.000Z"
 *
 * Useful for:
 * - API responses
 * - logging
 * - serialization
 *
 * @param {Date|string|number|null|undefined} value
 * @returns {string|null}
 */
export function transformDateToISOString(value) {
	const parsedDate = transformDate(value);

	if (!parsedDate) {
		return null;
	}

	return parsedDate.toISOString();
}

/**
 * isExpired
 *
 * Determines whether a datetime has already passed.
 *
 * Useful for:
 * - alert expiration
 * - cleanup services
 * - lifecycle management
 *
 * @param {Date|string|number|null|undefined} value
 * @returns {boolean}
 */
export function isExpired(value) {
	const parsedDate = transformDate(value);

	if (!parsedDate) {
		return false;
	}

	return parsedDate.getTime() < Date.now();
}

/**
 * isFutureDate
 *
 * Determines whether a datetime occurs in the future.
 *
 * Useful for:
 * - planned incidents
 * - scheduling
 * - event activation
 *
 * @param {Date|string|number|null|undefined} value
 * @returns {boolean}
 */
export function isFutureDate(value) {
	const parsedDate = transformDate(value);

	if (!parsedDate) {
		return false;
	}

	return parsedDate.getTime() > Date.now();
}

/**
 * getUnixTimestamp
 *
 * Converts supported date values into Unix epoch milliseconds.
 *
 * Useful for:
 * - sorting
 * - database storage
 * - comparisons
 *
 * @param {Date|string|number|null|undefined} value
 * @returns {number|null}
 */
export function getUnixTimestamp(value) {
	const parsedDate = transformDate(value);

	if (!parsedDate) {
		return null;
	}

	return parsedDate.getTime();
}

/**
 * calculateAgeInMinutes
 *
 * Calculates how old a timestamp is in minutes.
 *
 * Useful for:
 * - stale alert detection
 * - ingestion monitoring
 * - source health analysis
 *
 * @param {Date|string|number|null|undefined} value
 * @returns {number|null}
 */
export function calculateAgeInMinutes(value) {
	const parsedDate = transformDate(value);

	if (!parsedDate) {
		return null;
	}

	const ageMilliseconds = Date.now() - parsedDate.getTime();

	return Math.floor(ageMilliseconds / (1000 * 60));
}

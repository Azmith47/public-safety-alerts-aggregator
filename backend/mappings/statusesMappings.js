import { Statuses } from "../models/globalEnums.js";
/**
 * Internal canonical status mappings.
 *
 * Key:
 * - normalized external status value
 *
 * Value:
 * - canonical internal status enum
 */
export const STATUS_MAPPINGS = {
	/**
	 * Generic active statuses
	 */
	ACTIVE: Statuses.ACTIVE,

	OPEN: Statuses.ACTIVE,

	ON_GOING: Statuses.ACTIVE,

	GOING: Statuses.ACTIVE,

	IN_PROGRESS: Statuses.ACTIVE,

	/**
	 * Monitoring states
	 */
	MONITORING: Statuses.MONITORING,

	WATCHING: Statuses.MONITORING,

	OBSERVING: Statuses.MONITORING,

	/**
	 * Fire containment/control states
	 */
	UNDER_CONTROL: Statuses.UNDER_CONTROL,

	BEING_CONTROLLED: Statuses.UNDER_CONTROL,

	CONTAINED: Statuses.CONTAINED,

	CONTROLLED: Statuses.CONTROLLED,

	/**
	 * Planned incidents/events
	 */
	PLANNED: Statuses.PLANNED,

	SCHEDULED: Statuses.PLANNED,

	UPCOMING: Statuses.PLANNED,

	/**
	 * Completed/resolved states
	 */
	COMPLETED: Statuses.COMPLETED,

	FINISHED: Statuses.COMPLETED,

	RESOLVED: Statuses.RESOLVED,

	CLOSED: Statuses.CLOSED,

	ENDED: Statuses.CLOSED,

	/**
	 * Cancellation states
	 */
	CANCELLED: Statuses.CANCELLED,

	CANCELED: Statuses.CANCELLED,
};

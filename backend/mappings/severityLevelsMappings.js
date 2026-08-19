import { SeverityLevels } from "../models/globalEnums.js";
/**
 * Internal canonical severity mappings.
 *
 * Key:
 * - normalized external severity value
 *
 * Value:
 * - canonical internal severity enum
 */
export const SEVERITY_MAPPINGS = {
	/**
	 * NSW RFS warning levels
	 */
	EMERGENCY_WARNING: SeverityLevels.EMERGENCY_WARNING,

	WATCH_AND_ACT: SeverityLevels.WATCH_AND_ACT,

	ADVICE: SeverityLevels.ADVICE,

	NOT_APPLICABLE: SeverityLevels.UNKNOWN,

	/**
	 * Generic operational severities
	 */
	MAJOR: SeverityLevels.MAJOR,

	MODERATE: SeverityLevels.MODERATE,

	MINOR: SeverityLevels.MINOR,

	INFORMATION: SeverityLevels.INFORMATION,

	INFO: SeverityLevels.INFORMATION,

	/**
	 * TFNSW / generic transport wording
	 */
	HIGH: SeverityLevels.MAJOR,

	MEDIUM: SeverityLevels.MODERATE,

	LOW: SeverityLevels.MINOR,

	/**
	 * Common aliases
	 */
	CRITICAL: SeverityLevels.EMERGENCY_WARNING,

	SEVERE: SeverityLevels.MAJOR,

	WARNING: SeverityLevels.WATCH_AND_ACT,
};

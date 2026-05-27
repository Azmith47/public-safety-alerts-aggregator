import { SEVERITY } from "../models/enums.js";
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
    EMERGENCY_WARNING: SEVERITY.EMERGENCY_WARNING,

    WATCH_AND_ACT: SEVERITY.WATCH_AND_ACT,

    ADVICE: SEVERITY.ADVICE,

    /**
     * Generic operational severities
     */
    MAJOR: SEVERITY.MAJOR,

    MODERATE: SEVERITY.MODERATE,

    MINOR: SEVERITY.MINOR,

    INFORMATION: SEVERITY.INFORMATION,

    INFO: SEVERITY.INFORMATION,

    /**
     * TFNSW / generic transport wording
     */
    HIGH: SEVERITY.MAJOR,

    MEDIUM: SEVERITY.MODERATE,

    LOW: SEVERITY.MINOR,

    /**
     * Common aliases
     */
    CRITICAL: SEVERITY.EMERGENCY_WARNING,

    SEVERE: SEVERITY.MAJOR,

    WARNING: SEVERITY.WATCH_AND_ACT
};
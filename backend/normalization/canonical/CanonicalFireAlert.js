import CanonicalAlert from "./CanonicalAlert.js";

/**
 * CanonicalFireAlert
 *
 * Specialized canonical alert model for fire-related incidents.
 *
 * Extends:
 * - CanonicalAlert
 *
 * Used primarily for:
 * - NSW RFS
 * - Future SES/Fire integrations
 */

export default class CanonicalFireAlert extends CanonicalAlert {

    /**
     * @param {Object} data
     */
    constructor(data = {}) {

        /**
         * Initialize shared/base alert properties.
         */
        super(data);

        /**
         * Fire classification.
         * Example:
         * "BUSH_FIRE"
         * "GRASS_FIRE"
         * "STRUCTURE_FIRE"
         */
        this.fireType = data.fireType || null;

        /**
         * Public-facing fire warning level.
         * Example:
         * "EMERGENCY_WARNING"
         * "WATCH_AND_ACT"
         * "ADVICE"
         */
        this.alertLevel = data.alertLevel || null;

        /**
         * Approximate fire size in hectares.
         */
        this.fireSize = data.fireSize || null;

        /**
         * Containment/control status.
         * Example:
         * "OUT_OF_CONTROL"
         * "BEING_CONTROLLED"
         * "UNDER_CONTROL"
         */
        this.containmentStatus = data.containmentStatus || null;

        /**
         * Evacuation instructions or warnings.
         */
        this.evacuationAdvice = Array.isArray(data.evacuationAdvice)
            ? data.evacuationAdvice
            : [];

        /**
         * Primary responding agency.
         */
        this.agency = data.agency || "NSW_RFS";
    }
}

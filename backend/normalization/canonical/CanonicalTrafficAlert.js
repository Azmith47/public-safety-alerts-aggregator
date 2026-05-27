import CanonicalAlert from "./CanonicalAlert.js";

/**
 * CanonicalTrafficAlert
 *
 * Specialized canonical alert model for transport and road hazards.
 *
 * Extends:
 * - CanonicalAlert
 *
 * Used primarily for:
 * - Transport for NSW
 */

export default class CanonicalTrafficAlert extends CanonicalAlert {

    /**
     * @param {Object} data
     */
    constructor(data = {}) {

        /**
         * Initialize shared/base alert properties.
         */
        super(data);

        /**
         * Indicates whether incident is planned.
         * Example:
         * roadworks, scheduled closures, events
         */
        this.planned = Boolean(data.planned);

        /**
         * Planned start datetime.
         */
        this.startDate = data.startDate || null;

        /**
         * Planned end datetime.
         */
        this.endDate = data.endDate || null;

        /**
         * Estimated traffic delay in minutes.
         */
        this.delayMinutes = data.delayMinutes || null;

        /**
         * Estimated queue length in kilometres.
         */
        this.queueLength = data.queueLength || null;

        /**
         * Temporary restricted speed limit.
         */
        this.speedLimit = data.speedLimit || null;

        /**
         * Indicates impact to road network operations.
         */
        this.impactingNetwork = Boolean(data.impactingNetwork);

        /**
         * Roads affected by incident.
         *
         * Example:
         * [
         *   {
         *     roadName: "M1 Pacific Motorway",
         *     direction: "Northbound"
         *   }
         * ]
         */
        this.roads = Array.isArray(data.roads)
            ? data.roads
            : [];

        /**
         * Traffic diversion information.
         */
        this.diversions = data.diversions || null;

        /**
         * Agencies/groups attending the incident.
         */
        this.attendingGroups = Array.isArray(data.attendingGroups)
            ? data.attendingGroups
            : [];

        /**
         * Public transport impact information.
         */
        this.publicTransport = data.publicTransport || null;
    }
}

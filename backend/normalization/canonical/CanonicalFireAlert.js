import CanonicalAlert from "./CanonicalAlert.js";
import { Sources } from "../../models/globalEnums.js";
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
		 * Primary responding agency.
		 */
		this.responsibleAgency = data.responsibleAgency || Sources.RFS;
	}
}

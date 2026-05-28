/**
 * CanonicalAlert
 *
 * Base standardized alert model used internally throughout the system.
 *
 * IMPORTANT:
 * This class represents a NORMALIZED alert structure.
 * It should NEVER contain:
 * - source-specific field names
 * - database IDs
 * - raw API formatting assumptions
 *
 * All source-specific logic belongs in:
 * - collectors
 * - normalizers
 * - transformers
 *
 * The persistence layer should ONLY receive canonical alerts.
 */

export default class CanonicalAlert {
	/**
	 * @param {Object} data
	 * @param {string} data.source
	 * Name of the originating source.
	 * Example:
	 * "NSW_RFS"
	 * "TFNSW"
	 *
	 * @param {string} data.sourceType
	 * High-level alert source category.
	 * Example:
	 * "FIRE"
	 * "TRAFFIC"
	 * "WEATHER"
	 *
	 * @param {string} data.externalId
	 * Unique identifier from external source.
	 *
	 * @param {string} data.title
	 * Human-readable alert title.
	 *
	 * @param {string|null} data.description
	 * Optional detailed description.
	 *
	 * @param {string} data.category
	 * Internal normalized category value.
	 * Example:
	 * "FIRE"
	 * "ROAD_HAZARD"
	 *
	 * @param {string|null} data.subCategory
	 * Optional normalized sub-category.
	 *
	 * @param {string|null} data.severity
	 * Normalized severity level.
	 *
	 * @param {string|null} data.status
	 * Normalized operational status.
	 *
	 * @param {Date|string|null} data.createdAt
	 * Original creation time from source.
	 *
	 * @param {Date|string|null} data.updatedAt
	 * Last updated time from source.
	 *
	 * @param {Date|string|null} data.publishedAt
	 * Public publication time.
	 *
	 * @param {Date|string|null} data.expiresAt
	 * Optional expiration time.
	 *
	 * @param {string|null} data.location
	 * Human-readable suburb/location.
	 *
	 * @param {string|null} data.region
	 * NSW region name.
	 *
	 * @param {string|null} data.councilArea
	 * Local council area.
	 *
	 * @param {Object|null} data.marker
	 * Primary map marker.
	 * Example:
	 * {
	 *   latitude: -33.86,
	 *   longitude: 151.20
	 * }
	 *
	 * @param {Array} data.polygons
	 * Polygon geometry collection.
	 *
	 * @param {Array} data.polylines
	 * Polyline geometry collection.
	 *
	 * @param {Array<string>} data.links
	 * External related links.
	 *
	 * @param {Array<string>} data.advice
	 * Public safety advice messages.
	 *
	 * @param {boolean} data.isMajor
	 * Indicates significant/high-impact event.
	 *
	 * @param {boolean} data.isActive
	 * Indicates whether alert is currently active.
	 *
	 * @param {Object|null} data.rawPayload
	 * Original unmodified source payload.
	 * Stored for debugging/auditing.
	 */
	constructor(data = {}) {
		/**
		 * Source metadata
		 */
		this.source = data.source || null;
		this.sourceType = data.sourceType || null;

		/**
		 * External source identifier
		 */
		this.externalId = data.externalId || null;

		/**
		 * Public-facing content
		 */
		this.title = data.title || null;
		this.description = data.description || null;

		/**
		 * Internal normalized classifications
		 */
		this.category = data.category || null;
		this.subCategory = data.subCategory || null;

		this.severity = data.severity || null;
		this.status = data.status || null;

		/**
		 * Temporal metadata
		 */
		this.createdAt = data.createdAt || null;
		this.updatedAt = data.updatedAt || null;
		this.publishedAt = data.publishedAt || null;
		this.expiresAt = data.expiresAt || null;

		/**
		 * Geographic metadata
		 */
		this.location = data.location || null;
		this.region = data.region || null;
		this.councilArea = data.councilArea || null;

		/**
		 * Spatial geometry
		 */
		this.marker = data.marker || null;

		this.polygons = Array.isArray(data.polygons) ? data.polygons : [];

		this.polylines = Array.isArray(data.polylines) ? data.polylines : [];

		/**
		 * Supporting metadata
		 */
		this.links = Array.isArray(data.links) ? data.links : [];

		this.advice = Array.isArray(data.advice) ? data.advice : [];

		/**
		 * Operational flags
		 */
		this.isMajor = Boolean(data.isMajor);
		this.isActive = data.isActive ?? true;

		/**
		 * Original source payload
		 *
		 * IMPORTANT:
		 * This should NEVER be modified after assignment.
		 */
		this.rawPayload = data.rawPayload || null;
	}
}

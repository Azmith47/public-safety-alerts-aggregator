import { describe, it, expect } from "@jest/globals";

import rfsFixture from "../data/rfs_test_json_data.json" with { type: "json" };
import {
	normalizeRfsFeature,
	normalizeRfsFeed,
} from "../../normalization/normalizers/rfsNormalizer.js";

import CanonicalFireAlert from "../../normalization/canonical/CanonicalFireAlert.js";

import {
	Categories,
	SeverityLevels,
	Statuses,
	Sources,
	SourceTypes,
} from "../../models/globalEnums.js";

describe("rfsNormalizer", () => {
	describe("normalizeRfsFeature", () => {
		it("should return null for invalid inputs", () => {
			expect(normalizeRfsFeature(null)).toBeNull();
			expect(normalizeRfsFeature(undefined)).toBeNull();
			expect(normalizeRfsFeature("invalid")).toBeNull();
		});

		it("should normalize a complete RFS feature", () => {
			const feature = {
				properties: {
					title: "CASTLEREAGH HWY, APPLE TREE FLAT",
					link: "https://www.rfs.nsw.gov.au",
					category: "Advice",
					guid: "https://incidents.rfs.nsw.gov.au/api/v1/incidents/660262",
					pubDate: "26/05/2026 7:26:00 AM",
					description:
						"ALERT LEVEL: Advice <br />LOCATION: CASTLEREAGH HWY, APPLE TREE FLAT 2850 <br />COUNCIL AREA: Mid-Western <br />STATUS: Under control <br />TYPE: Grass Fire <br />FIRE: Yes <br />SIZE: 10 ha <br />RESPONSIBLE AGENCY: Rural Fire Service <br />UPDATED: 26 May 2026 17:26",
				},

				geometry: {
					type: "Point",
					coordinates: [151.2093, -33.8688],
				},
			};

			const result = normalizeRfsFeature(feature);

			expect(result).toBeInstanceOf(CanonicalFireAlert);

			/**
			 * Core identifiers
			 */
			expect(result.externalId).toBe(feature.properties.guid);
			expect(result.source).toBe(Sources.RFS);
			expect(result.sourceType).toBe(SourceTypes.FIRE);

			expect(result.description).toBe(feature.properties.description);

			/**
			 * Core alert data
			 */
			expect(result.title).toBe(feature.properties.title);

			expect(result.category).toBe(Categories.FIRE);
			expect(result.severity).toBe(SeverityLevels.ADVICE);
			expect(result.status).toBe(Statuses.UNDER_CONTROL);

			/**
			 * Geography
			 */
			expect(result.location).toBe(
				"Castlereagh Hwy, Apple Tree Flat 2850",
			);
			expect(result.councilArea).toBe("MID_WESTERN_REGIONAL");
			expect(result.region).toBe("CENTRAL_WEST_ORANA");

			expect(result.marker).toEqual({
				longitude: 151.2093,
				latitude: -33.8688,
			});

			/**
			 * Dates
			 */
			expect(result.createdAt).toBeInstanceOf(Date);
			expect(result.updatedAt).toBeInstanceOf(Date);
			expect(result.publishedAt).toBeInstanceOf(Date);

			/**
			 * Advice
			 */
			expect(result.advice).toHaveLength(0);

			/**
			 * Links
			 */
			expect(result.links).toHaveLength(1);

			/**
			 * Fire-specific fields
			 */
			expect(result.fireType).toBe("GRASS_FIRE");
			expect(result.fireSize).toBe(10);
			expect(result.containmentStatus).toBe("UNDER_CONTROL");
			expect(result.responsibleAgency).toBe("Rural Fire Service");

			/**
			 * Raw payload
			 */
			expect(result.rawPayload).toEqual(feature);
		});

		it("should safely handle missing optional fields", () => {
			const feature = {
				id: "minimal-rfs",

				properties: {},

				geometry: null,
			};

			const result = normalizeRfsFeature(feature);

			expect(result).toBeInstanceOf(CanonicalFireAlert);

			expect(result.externalId).toBe("minimal-rfs");

			expect(result.title).toBe("RFS Incident");

			/**
			 * Default category fallback
			 */
			expect(result.category).toBe(Categories.FIRE);

			/**
			 * Optional values
			 */
			expect(result.description).toBeNull();

			expect(result.marker).toBeNull();

			expect(result.polygons).toEqual([]);

			expect(result.advice).toEqual([]);

			expect(result.links).toEqual([]);
		});

		it("should extract markers from GeometryCollection", () => {
			const feature = {
				id: "geometry-collection",

				properties: {},

				geometry: {
					type: "GeometryCollection",

					geometries: [
						{
							type: "Point",
							coordinates: [150.1, -33.1],
						},
						{
							type: "Point",
							coordinates: [151.1, -34.1],
						},
					],
				},
			};

			const result = normalizeRfsFeature(feature);

			expect(result.marker).toEqual({
				longitude: 150.1,
				latitude: -33.1,
			});
		});

		it("should extract polygon geometries", () => {
			const feature = {
				id: "polygon-test",

				properties: {},

				geometry: {
					type: "Polygon",

					coordinates: [
						[
							[151.0, -33.0],
							[152.0, -33.0],
							[152.0, -34.0],
							[151.0, -34.0],
							[151.0, -33.0],
						],
					],
				},
			};

			const result = normalizeRfsFeature(feature);

			expect(result.polygons.length).toBeGreaterThan(0);
		});

		it("should extract multipolygon geometries", () => {
			const feature = {
				id: "multipolygon-test",

				properties: {},

				geometry: {
					type: "MultiPolygon",

					coordinates: [
						[
							[
								[151.0, -33.0],
								[152.0, -33.0],
								[152.0, -34.0],
								[151.0, -34.0],
								[151.0, -33.0],
							],
						],
					],
				},
			};

			const result = normalizeRfsFeature(feature);

			expect(result.polygons.length).toBeGreaterThan(0);
		});

		it("should collect all advice fields", () => {
			const feature = {
				id: "advice-test",

				properties: {
					advice: "Advice 1",
					publicAdvice: "Advice 2",
					evacuateMessage: "Evacuate now",
				},

				geometry: null,
			};

			const result = normalizeRfsFeature(feature);

			expect(result.advice).toEqual([
				"Advice 1",
				"Advice 2",
				"Evacuate now",
			]);
		});

		it("should safely handle malformed geometry", () => {
			const feature = {
				id: "bad-geometry",

				properties: {},

				geometry: {
					type: "Point",
					coordinates: null,
				},
			};

			const result = normalizeRfsFeature(feature);

			expect(result).toBeInstanceOf(CanonicalFireAlert);

			expect(result.marker).toBeNull();
		});

		it("should generate a fallback externalId if IDs are missing", () => {
			const feature = {
				properties: {},

				geometry: null,
			};

			const result = normalizeRfsFeature(feature);

			expect(result.externalId).toBeTruthy();
			expect(typeof result.externalId).toBe("string");
		});

		it("should normalize a real RFS feed feature", () => {
			const feature = rfsFixture.features[0];
			const result = normalizeRfsFeature(feature);

			expect(result).toBeInstanceOf(CanonicalFireAlert);
			expect(result.externalId).toBe(feature.properties.guid);
			expect(result.title).toBe(feature.properties.title);
			expect(result.source).toBe(Sources.RFS);
			expect(result.sourceType).toBe(SourceTypes.FIRE);
			expect(result.severity).toBe(SeverityLevels.ADVICE);
			expect(result.status).toBe(Statuses.UNDER_CONTROL);
			expect(result.marker).toEqual({
				longitude: feature.geometry.coordinates[0],
				latitude: feature.geometry.coordinates[1],
			});
			expect(result.location).toBe("Castlereagh Hwy, Apple Tree Flat 2850");
			expect(result.councilArea).toBe("MID_WESTERN_REGIONAL");
			expect(result.region).toBe("CENTRAL_WEST_ORANA");
			expect(result.rawPayload).toBe(feature);
		});
	});

	describe("normalizeRfsFeed", () => {
		it("should return empty array for invalid input", () => {
			expect(normalizeRfsFeed(null)).toEqual([]);
			expect(normalizeRfsFeed(undefined)).toEqual([]);
			expect(normalizeRfsFeed({})).toEqual([]);
		});

		it("should normalize multiple features", () => {
			const features = [
				{
					id: "1",
					properties: {
						title: "Fire 1",
					},
					geometry: null,
				},
				{
					id: "2",
					properties: {
						title: "Fire 2",
					},
					geometry: null,
				},
			];

			const result = normalizeRfsFeed(features);

			expect(result).toHaveLength(2);

			expect(result[0]).toBeInstanceOf(CanonicalFireAlert);

			expect(result[1]).toBeInstanceOf(CanonicalFireAlert);
		});

		it("should filter invalid normalized alerts", () => {
			const features = [
				null,
				{
					id: "valid-feature",
					properties: {},
					geometry: null,
				},
			];

			const result = normalizeRfsFeed(features);

			expect(result).toHaveLength(1);
		});
	});
});

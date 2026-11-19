import { describe, expect, test } from "@jest/globals";

import tfnswFixture from "../data/tfnsw_test_json_data.json" with { type: "json" };
import {
	normalizeTfnswFeed,
	normalizeTfnswIncident,
} from "../../normalization/normalizers/tfnswNormalizer.js";
import CanonicalTrafficAlert from "../../normalization/canonical/CanonicalTrafficAlert.js";
import {
	Categories,
	SeverityLevels,
	Sources,
	SourceTypes,
	Statuses,
} from "../../models/globalEnums.js";

describe("tfnswNormalizer", () => {
	describe("normalizeTfnswIncident", () => {
		test("returns null for invalid inputs", () => {
			expect(normalizeTfnswIncident(null)).toBeNull();
			expect(normalizeTfnswIncident(undefined)).toBeNull();
			expect(normalizeTfnswIncident("invalid")).toBeNull();
		});

		test("normalizes a documented TFNSW GeoJSON feature", () => {
			const feature = tfnswFixture.features[1];
			const result = normalizeTfnswIncident(feature);

			expect(result).toBeInstanceOf(CanonicalTrafficAlert);
			expect(result.externalId).toBe(String(feature.id));
			expect(result.source).toBe(Sources.TFNSW);
			expect(result.sourceType).toBe(SourceTypes.TRAFFIC);
			expect(result.title).toBe(feature.properties.displayName);
			expect(result.description).toBe(feature.properties.otherAdvice);
			expect(result.category).toBe(Categories.PUBLIC_EVENT);
			expect(result.severity).toBe(SeverityLevels.UNKNOWN);
			expect(result.status).toBe(Statuses.PLANNED);
			expect(result.location).toBe("Sydney Olympic Park");
			expect(result.marker).toEqual({
				longitude: 151.0678188,
				latitude: -33.8492544,
			});
			expect(result.createdAt).toEqual(
				new Date(feature.properties.created),
			);
			expect(result.updatedAt).toEqual(
				new Date(feature.properties.lastUpdated),
			);
			expect(result.publishedAt).toEqual(
				new Date(feature.properties.created),
			);
			expect(result.planned).toBe(true);
			expect(result.startDate).toEqual(
				new Date(feature.properties.start),
			);
			expect(result.endDate).toEqual(new Date(feature.properties.end));
			expect(result.impactingNetwork).toBe(true);
			expect(result.isMajor).toBe(false);
			expect(result.isActive).toBe(true);
			expect(result.roads).toEqual([
				expect.objectContaining({
					roadName:
						"M4 Motorway, Homebush Bay Drive, Parramatta Road, Centenary Drive",
					crossStreet: "Accor Stadium",
					suburb: "Sydney Olympic Park",
					region: "Sydney",
					locationQualifier: "approaching",
				}),
			]);
			expect(result.advice).toEqual([
				"Use public transport",
				"Allow extra travel time",
			]);
			expect(result.publicTransport).toBe(
				feature.properties.publicTransport,
			);
			expect(result.rawPayload).toBe(feature);
		});

		test("decodes TfNSW encoded polylines from feature properties", () => {
			const feature = tfnswFixture.features[0];
			const result = normalizeTfnswIncident(feature);

			expect(result.polylines).toHaveLength(2);
			expect(result.polylines[0].length).toBeGreaterThan(2);
			expect(result.polylines[0][0]).toEqual([
				expect.any(Number),
				expect.any(Number),
			]);
		});

		test("normalizes web links, ended state, major severity, and numeric traffic fields", () => {
			const feature = {
				type: "Feature",
				id: "traffic-1",
				geometry: {
					type: "LineString",
					coordinates: [
						[151, -33],
						[151.1, -33.1],
					],
				},
				properties: {
					displayName: "Crash on Example Road",
					mainCategory: "ACCIDENT",
					incidentKind: "Unplanned",
					ended: true,
					isMajor: true,
					created: 1778129774000,
					lastUpdated: 1778129775167,
					expectedDelay: 12,
					speedLimit: 40,
					diversions: "Use Sample Street",
					webLinks: [
						{
							linkText: "Live Traffic",
							linkURL: "https://www.livetraffic.com/incident",
						},
					],
					roads: [
						{
							mainStreet: "Example Road",
							suburb: "Sydney",
							queueLength: 3,
							impactedLanes: ["Lane 1"],
						},
					],
				},
			};

			const result = normalizeTfnswIncident(feature);

			expect(result.category).toBe(Categories.TRAFFIC_INCIDENT);
			expect(result.severity).toBe(SeverityLevels.MAJOR);
			expect(result.status).toBe(Statuses.CLOSED);
			expect(result.isActive).toBe(false);
			expect(result.delayMinutes).toBe(12);
			expect(result.speedLimit).toBe(40);
			expect(result.queueLength).toBe(3);
			expect(result.diversions).toBe("Use Sample Street");
			expect(result.links).toEqual([
				{
					title: "Live Traffic",
					url: "https://www.livetraffic.com/incident",
				},
			]);
			expect(result.polylines).toEqual([
				[
					[151, -33],
					[151.1, -33.1],
				],
			]);
		});

		test("extracts additional markers from TFNSW geometry collections", () => {
			const feature = {
				type: "Feature",
				id: "collections-test",
				geometry: {
					type: "Point",
					coordinates: [151, -33],
					collections: [
						{
							type: "Point",
							coordinates: [152, -34],
						},
					],
				},
				properties: {},
			};

			const result = normalizeTfnswIncident(feature);

			expect(result.marker).toEqual({
				longitude: 151,
				latitude: -33,
			});
		});

		test("safely handles missing optional fields", () => {
			const result = normalizeTfnswIncident({
				type: "Feature",
				id: "minimal",
				geometry: null,
				properties: {},
			});

			expect(result).toBeInstanceOf(CanonicalTrafficAlert);
			expect(result.externalId).toBe("minimal");
			expect(result.title).toBe("Traffic Incident");
			expect(result.marker).toBeNull();
			expect(result.roads).toEqual([]);
			expect(result.advice).toEqual([]);
			expect(result.links).toEqual([]);
		});
	});

	describe("normalizeTfnswFeed", () => {
		test("returns empty array for invalid input", () => {
			expect(normalizeTfnswFeed(null)).toEqual([]);
			expect(normalizeTfnswFeed(undefined)).toEqual([]);
			expect(normalizeTfnswFeed({})).toEqual([]);
		});

		test("normalizes arrays of TFNSW features", () => {
			const result = normalizeTfnswFeed(
				tfnswFixture.features.slice(0, 3),
			);

			expect(result).toHaveLength(3);
			expect(result[0]).toBeInstanceOf(CanonicalTrafficAlert);
		});

		test("filters invalid normalized alerts", () => {
			const result = normalizeTfnswFeed([
				null,
				{
					type: "Feature",
					id: "valid",
					geometry: null,
					properties: {},
				},
			]);

			expect(result).toHaveLength(1);
			expect(result[0].externalId).toBe("valid");
		});
	});
});

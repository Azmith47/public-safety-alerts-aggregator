import { describe, expect, test } from "@jest/globals";
import {
	geoJsonToPaths,
	geoJsonToMarker,
	splitDescription,
	parsePubDate,
} from "../utils/alertUtilities.js";

describe("alertUtilities", () => {
	test("geoJsonToPaths should convert polygon coordinates to path points", () => {
		const geoJson = {
			coordinates: [
				[
					[150.0, -33.0],
					[151.0, -34.0],
				],
			],
		};
		expect(geoJsonToPaths(geoJson)).toEqual([
			{ lat: -33.0, lng: 150.0 },
			{ lat: -34.0, lng: 151.0 },
		]);
	});

	test("geoJsonToMarker should convert a point geometry to a marker", () => {
		const geoJson = { coordinates: [150.0, -33.0] };
		expect(geoJsonToMarker(geoJson)).toEqual({ lat: -33.0, lng: 150.0 });
	});

	test("splitDescription should parse description fields correctly", () => {
		const description = [
			"Location: Richmond",
			"Council area: Hawkesbury",
			"Size: 10",
			"Fire: Yes",
			"Responsible agency: RFS",
			"Updated: 12:30:00",
			"Status: Active",
			"Category: Bushfire",
		].join("<br />");

		expect(splitDescription(description)).toEqual({
			location: "Richmond",
			councilArea: "Hawkesbury",
			size: 10,
			fire: true,
			agency: "RFS",
			lastUpdated: "12:30",
			status: "Active",
			category: "Bushfire",
		});
	});

	test("parsePubDate should parse DD/MM/YYYY HH:MM:SS AM/PM strings", () => {
		const actual = parsePubDate("21/05/2026 03:15:45 PM");
		expect(actual.getFullYear()).toBe(2026);
		expect(actual.getMonth()).toBe(4);
		expect(actual.getDate()).toBe(21);
		expect(actual.getHours()).toBe(15);
		expect(actual.getMinutes()).toBe(15);
		expect(actual.getSeconds()).toBe(45);
	});
});

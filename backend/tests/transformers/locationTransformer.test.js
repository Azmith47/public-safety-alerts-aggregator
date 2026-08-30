/**
 * locationTransformer.test.js
 *
 * Unit tests for geographic normalization utilities.
 */

import {
	normalizeLocationName,
	normalizeRegion,
	normalizeLGAName,
	normalizeLGAKey,
	resolveCanonicalLGA,
	resolveRegionFromLGA,
	isValidLatitude,
	isValidLongitude,
	normalizeCoordinate,
	normalizeMarker,
	normalizePolygonCoordinates,
	normalizePolylineCoordinates,
} from "../../normalization/transformers/locationTransformer.js";

describe("normalizeLocationName", () => {
	test("should normalize location names to title case", () => {
		expect(normalizeLocationName(" blue mountains ")).toBe(
			"Blue Mountains",
		);
	});

	test("should return null for invalid input", () => {
		expect(normalizeLocationName(null)).toBeNull();
		expect(normalizeLocationName(undefined)).toBeNull();
		expect(normalizeLocationName(123)).toBeNull();
	});
});

describe("normalizeRegion", () => {
	test("should normalize region names", () => {
		expect(normalizeRegion("South East Tablelands")).toBe(
			"SOUTH_EAST_TABLELANDS",
		);
	});

	test("should remove punctuation", () => {
		expect(normalizeRegion("Central Coast!")).toBe("CENTRAL_COAST");
	});

	test("should return null for invalid input", () => {
		expect(normalizeRegion(null)).toBeNull();
	});
});

describe("normalizeLGAName", () => {
	test("should remove council suffixes", () => {
		expect(normalizeLGAName("Blue Mountains City Council")).toBe(
			"Blue Mountains",
		);
	});

	test("should remove verbose prefixes", () => {
		expect(normalizeLGAName("The Council of Mid-Western Regional")).toBe(
			"Mid Western Regional",
		);
	});

	test("should return null for unincorporated areas", () => {
		expect(normalizeLGAName("Unincorporated NSW")).toBeNull();
	});

	test("should remove punctuation", () => {
		expect(normalizeLGAName("Cessnock, Council")).toBe("Cessnock");
	});

	test("should preserve 'of' in canonical LGA names", () => {
		expect(normalizeLGAName("City of Parramatta Council")).toBe(
			"City of Parramatta",
		);
		expect(normalizeLGAKey("City of Parramatta Council")).toBe(
			"CITY_OF_PARRAMATTA",
		);
	});
});

describe("normalizeLGAKey", () => {
	test("should normalize LGA keys", () => {
		expect(normalizeLGAKey("Blue Mountains City Council")).toBe(
			"BLUE_MOUNTAINS",
		);
	});

	test("should return null for invalid input", () => {
		expect(normalizeLGAKey(null)).toBeNull();
	});
});

describe("resolveCanonicalLGA", () => {
	test("should resolve exact canonical LGA", () => {
		expect(resolveCanonicalLGA("Blue Mountains")).toBe("BLUE_MOUNTAINS");
	});

	test("should resolve fuzzy council names", () => {
		expect(resolveCanonicalLGA("Mid-Western Regional Council")).toBe(
			"MID_WESTERN_REGIONAL",
		);
	});

	test("should resolve partial names", () => {
		expect(resolveCanonicalLGA("Mid-Western")).toBe("MID_WESTERN_REGIONAL");
	});

	test("should preserve 'of' in canonical resolved LGAs", () => {
		expect(resolveCanonicalLGA("City of Parramatta Council")).toBe(
			"CITY_OF_PARRAMATTA",
		);
	});

	test("should return null for unknown LGAs", () => {
		expect(resolveCanonicalLGA("Unknown Council")).toBeNull();
	});
});

describe("resolveRegionFromLGA", () => {
	test("should resolve regions from LGAs", () => {
		expect(resolveRegionFromLGA("MID_WESTERN_REGIONAL")).toBe(
			"CENTRAL_WEST_ORANA",
		);
	});

	test("should return null for invalid LGAs", () => {
		expect(resolveRegionFromLGA("UNKNOWN")).toBeNull();
	});
});

describe("isValidLatitude", () => {
	test("should validate latitude range", () => {
		expect(isValidLatitude(-33.86)).toBe(true);
		expect(isValidLatitude(91)).toBe(false);
		expect(isValidLatitude(-91)).toBe(false);
	});
});

describe("isValidLongitude", () => {
	test("should validate longitude range", () => {
		expect(isValidLongitude(151.2)).toBe(true);
		expect(isValidLongitude(181)).toBe(false);
		expect(isValidLongitude(-181)).toBe(false);
	});
});

describe("normalizeCoordinate", () => {
	test("should normalize numeric strings", () => {
		expect(normalizeCoordinate("151.2093")).toBe(151.2093);
	});

	test("should normalize numbers", () => {
		expect(normalizeCoordinate(-33.8688)).toBe(-33.8688);
	});

	test("should return null for invalid values", () => {
		expect(normalizeCoordinate("abc")).toBeNull();

		expect(normalizeCoordinate(undefined)).toBeNull();
	});
});

describe("normalizeMarker", () => {
	test("should normalize latitude/longitude markers", () => {
		expect(
			normalizeMarker({
				latitude: -33.86,
				longitude: 151.2,
			}),
		).toEqual({
			latitude: -33.86,
			longitude: 151.2,
		});
	});

	test("should support lat/lng aliases", () => {
		expect(
			normalizeMarker({
				lat: -33.86,
				lng: 151.2,
			}),
		).toEqual({
			latitude: -33.86,
			longitude: 151.2,
		});
	});

	test("should reject invalid coordinates", () => {
		expect(
			normalizeMarker({
				latitude: 999,
				longitude: 151,
			}),
		).toBeNull();
	});

	test("should return null for invalid marker objects", () => {
		expect(normalizeMarker(null)).toBeNull();
	});
});

describe("normalizePolygonCoordinates", () => {
	test("should keep valid coordinate pairs", () => {
		const coordinates = [
			[151.2, -33.86],
			[150.0, -32.0],
		];

		expect(normalizePolygonCoordinates(coordinates)).toEqual(coordinates);
	});

	test("should remove invalid coordinate pairs", () => {
		const coordinates = [
			[151.2, -33.86],
			[999, -999],
		];

		expect(normalizePolygonCoordinates(coordinates)).toEqual([
			[151.2, -33.86],
		]);
	});

	test("should return empty array for invalid input", () => {
		expect(normalizePolygonCoordinates(null)).toEqual([]);
	});
});

describe("normalizePolylineCoordinates", () => {
	test("should normalize polyline coordinates", () => {
		const coordinates = [
			[151.2, -33.86],
			[150.5, -32.9],
		];

		expect(normalizePolylineCoordinates(coordinates)).toEqual(coordinates);
	});
});

describe("normalizeLocationName", () => {
	it("should normalize simple location names", () => {
		const result = normalizeLocationName("Sydney");

		expect(result).toBe("Sydney");
	});

	it("should trim whitespace", () => {
		const result = normalizeLocationName("  Sydney  ");

		expect(result).toBe("Sydney");
	});

	it("should return null for invalid values", () => {
		expect(normalizeLocationName(null)).toBeNull();
		expect(normalizeLocationName(undefined)).toBeNull();
		expect(normalizeLocationName("")).toBeNull();
		expect(normalizeLocationName("   ")).toBeNull();
	});
});

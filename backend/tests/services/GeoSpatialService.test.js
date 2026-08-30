import { describe, expect, jest, test } from "@jest/globals";

const AlertDAO = { get: jest.fn(), all: jest.fn(), getById: jest.fn() };
const AlertMarkersDAO = {
	all: jest.fn(),
	findAll: jest.fn(),
	tableName: "alert_markers",
};
const AlertPolygonDAO = {
	all: jest.fn(),
	findAll: jest.fn(),
	tableName: "alert_polygons",
};
jest.unstable_mockModule("../../database/dao/AlertDAO.js", () => ({
	default: AlertDAO,
}));
jest.unstable_mockModule("../../database/dao/AlertMarkersDAO.js", () => ({
	default: AlertMarkersDAO,
}));
jest.unstable_mockModule("../../database/dao/AlertPolygonDAO.js", () => ({
	default: AlertPolygonDAO,
}));

const { default: GeoSpatialService } =
	await import("../../services/GeoSpatialService.js");

describe("GeoSpatialService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("_haversineDistanceKm computes approximate distance correctly", () => {
		const distance = GeoSpatialService._haversineDistanceKm(
			-33.86,
			151.21,
			-33.87,
			151.22,
		);
		expect(distance).toBeGreaterThan(1);
		expect(distance).toBeLessThan(2);
	});

	test("findAlertsInBoundingBox returns rows for marker and polygon ids", async () => {
		AlertMarkersDAO.all.mockResolvedValue([{ alert_id: 1 }]);
		AlertPolygonDAO.all.mockResolvedValue([
			{ alert_id: 1 },
			{ alert_id: 2 },
		]);
		AlertDAO.get.mockResolvedValue({ count: 2 });
		AlertDAO.all.mockResolvedValue([{ id: 1 }, { id: 2 }]);

		const result = await GeoSpatialService.findAlertsInBoundingBox(
			{ minLat: -34, maxLat: -33, minLng: 151, maxLng: 152 },
			{},
			{ limit: 10, offset: 0 },
		);

		expect(result).toEqual({ total: 2, rows: [{ id: 1 }, { id: 2 }] });
	});

	test("findAlertsNearby filters rows by radius using distance calculation", async () => {
		AlertMarkersDAO.all.mockResolvedValue([
			{ alert_id: 1, latitude: -33.86, longitude: 151.21 },
			{ alert_id: 2, latitude: -33.0, longitude: 151.0 },
		]);
		AlertPolygonDAO.all.mockResolvedValue([]);
		AlertDAO.get.mockResolvedValue({ count: 1 });
		AlertDAO.all.mockResolvedValue([{ id: 1 }]);

		const result = await GeoSpatialService.findAlertsNearby(
			-33.86,
			151.21,
			2,
			{},
			{ limit: 10, offset: 0 },
		);

		expect(result).toEqual({ total: 1, rows: [{ id: 1 }] });
	});

	test("getAlertGeometry returns null when alert is missing", async () => {
		AlertDAO.getById.mockResolvedValue(null);
		const result = await GeoSpatialService.getAlertGeometry(555);
		expect(result).toBeNull();
	});

	test("getAlertGeometry returns alert and geometry rows", async () => {
		AlertDAO.getById.mockResolvedValue({ id: 10 });
		AlertMarkersDAO.findAll.mockResolvedValue([{ id: 1 }]);
		AlertPolygonDAO.findAll.mockResolvedValue([{ id: 2 }]);

		const result = await GeoSpatialService.getAlertGeometry(10);

		expect(result).toEqual({
			alert: { id: 10 },
			geometry: {
				markers: [{ id: 1 }],
				polygons: [{ id: 2 }],
				polylines: [],
			},
		});
	});
});

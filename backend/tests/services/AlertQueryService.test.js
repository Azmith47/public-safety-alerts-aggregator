import { describe, expect, jest, test } from "@jest/globals";

const AlertDAO = { get: jest.fn(), all: jest.fn(), getById: jest.fn() };
const AlertMarkersDAO = { findAll: jest.fn(), tableName: "alert_markers" };
const AlertPolygonDAO = { findAll: jest.fn(), tableName: "alert_polygons" };
const AlertPolylineDAO = { findAll: jest.fn(), tableName: "alert_polylines" };
const AlertRoadDAO = { findAll: jest.fn(), tableName: "alert_roads" };
const AlertAdviceDAO = { findAll: jest.fn(), tableName: "alert_advice" };
const AlertLinkDAO = { findAll: jest.fn(), tableName: "alert_links" };
const AlertFireDetailDAO = { findOne: jest.fn(), getByAlertId: jest.fn() };
jest.unstable_mockModule("../../database/dao/AlertDAO.js", () => ({
	default: AlertDAO,
}));
jest.unstable_mockModule("../../database/dao/AlertMarkersDAO.js", () => ({
	default: AlertMarkersDAO,
}));
jest.unstable_mockModule("../../database/dao/AlertPolygonDAO.js", () => ({
	default: AlertPolygonDAO,
}));
jest.unstable_mockModule("../../database/dao/AlertPolylineDAO.js", () => ({
	default: AlertPolylineDAO,
}));
jest.unstable_mockModule("../../database/dao/AlertRoadDAO.js", () => ({
	default: AlertRoadDAO,
}));
jest.unstable_mockModule("../../database/dao/AlertAdviceDAO.js", () => ({
	default: AlertAdviceDAO,
}));
jest.unstable_mockModule("../../database/dao/AlertLinkDAO.js", () => ({
	default: AlertLinkDAO,
}));
jest.unstable_mockModule("../../database/dao/AlertFireDetailDAO.js", () => ({
	default: AlertFireDetailDAO,
}));

const { default: AlertQueryService } =
	await import("../../services/AlertQueryService.js");

describe("AlertQueryService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("queryAlerts builds SQL with filters and returns paged results", async () => {
		AlertDAO.get.mockResolvedValue({ count: 1 });
		AlertDAO.all.mockResolvedValue([{ id: 8, title: "Test" }]);

		const result = await AlertQueryService.queryAlerts(
			{ active: true, q: "fire" },
			{ limit: 10, offset: 0, sortBy: "issued_at", sortDir: "ASC" },
		);

		expect(AlertDAO.get).toHaveBeenCalledWith(
			expect.stringContaining(
				"WHERE (end_date IS NULL OR end_date > datetime('now')) AND (LOWER(title) LIKE ? OR LOWER(description) LIKE ?)",
			),
			expect.arrayContaining(["%fire%", "%fire%"]),
		);
		expect(result).toEqual({ total: 1, rows: [{ id: 8, title: "Test" }] });
	});

	test("getAlertDetails returns alert details and related geometry/business rows", async () => {
		AlertDAO.getById.mockResolvedValue({ id: 9, title: "Event" });
		AlertMarkersDAO.findAll.mockResolvedValue([{ id: 1, alert_id: 9 }]);
		AlertPolygonDAO.findAll.mockResolvedValue([{ id: 2, alert_id: 9 }]);
		AlertPolylineDAO.findAll.mockResolvedValue([]);
		AlertRoadDAO.findAll.mockResolvedValue([{ id: 3, alert_id: 9 }]);
		AlertAdviceDAO.findAll.mockResolvedValue([{ id: 4, alert_id: 9 }]);
		AlertLinkDAO.findAll.mockResolvedValue([{ id: 5, alert_id: 9 }]);
		AlertFireDetailDAO.findOne.mockResolvedValue(null);
		AlertFireDetailDAO.getByAlertId.mockResolvedValue(null);

		const details = await AlertQueryService.getAlertDetails(9);

		expect(details).toEqual({
			alert: { id: 9, title: "Event" },
			markers: [{ id: 1, alert_id: 9 }],
			polygons: [{ id: 2, alert_id: 9 }],
			polylines: [],
			roads: [{ id: 3, alert_id: 9 }],
			advice: [{ id: 4, alert_id: 9 }],
			links: [{ id: 5, alert_id: 9 }],
			fireDetails: null,
		});
	});
});

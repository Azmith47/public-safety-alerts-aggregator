jest.mock("../../database/dao/AlertDAO", () => ({ get: jest.fn(), all: jest.fn(), getById: jest.fn() }));
jest.mock("../../database/dao/AlertMarkersDAO", () => ({ findAll: jest.fn(), tableName: "alert_markers" }));
jest.mock("../../database/dao/AlertPolygonDAO", () => ({ findAll: jest.fn(), tableName: "alert_polygons" }));
jest.mock("../../database/dao/AlertRoadDAO", () => ({ findAll: jest.fn(), tableName: "alert_roads" }));
jest.mock("../../database/dao/AlertAdviceDAO", () => ({ findAll: jest.fn(), tableName: "alert_advice" }));
jest.mock("../../database/dao/AlertLinkDAO", () => ({ findAll: jest.fn(), tableName: "alert_links" }));

const AlertDAO = require("../../database/dao/AlertDAO");
const AlertMarkersDAO = require("../../database/dao/AlertMarkersDAO");
const AlertPolygonDAO = require("../../database/dao/AlertPolygonDAO");
const AlertRoadDAO = require("../../database/dao/AlertRoadDAO");
const AlertAdviceDAO = require("../../database/dao/AlertAdviceDAO");
const AlertLinkDAO = require("../../database/dao/AlertLinkDAO");
const AlertQueryService = require("../../services/AlertQueryService");

describe("AlertQueryService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("queryAlerts builds SQL with filters and returns paged results", async () => {
        AlertDAO.get.mockResolvedValue({ count: 1 });
        AlertDAO.all.mockResolvedValue([{ id: 8, title: "Test" }]);

        const result = await AlertQueryService.queryAlerts({ active: true, q: "fire" }, { limit: 10, offset: 0, sortBy: "issued_at", sortDir: "ASC" });

        expect(AlertDAO.get).toHaveBeenCalledWith(
            expect.stringContaining("WHERE (end_date IS NULL OR end_date > datetime('now')) AND (LOWER(title) LIKE ? OR LOWER(description) LIKE ?)") ,
            expect.arrayContaining(["%fire%", "%fire%"])
        );
        expect(result).toEqual({ total: 1, rows: [{ id: 8, title: "Test" }] });
    });

    test("getAlertDetails returns alert details and related geometry/business rows", async () => {
        AlertDAO.getById.mockResolvedValue({ id: 9, title: "Event" });
        AlertMarkersDAO.findAll.mockResolvedValue([{ id: 1, alert_id: 9 }]);
        AlertPolygonDAO.findAll.mockResolvedValue([{ id: 2, alert_id: 9 }]);
        AlertRoadDAO.findAll.mockResolvedValue([{ id: 3, alert_id: 9 }]);
        AlertAdviceDAO.findAll.mockResolvedValue([{ id: 4, alert_id: 9 }]);
        AlertLinkDAO.findAll.mockResolvedValue([{ id: 5, alert_id: 9 }]);

        const details = await AlertQueryService.getAlertDetails(9);

        expect(details).toEqual({
            alert: { id: 9, title: "Event" },
            markers: [{ id: 1, alert_id: 9 }],
            polygons: [{ id: 2, alert_id: 9 }],
            roads: [{ id: 3, alert_id: 9 }],
            advice: [{ id: 4, alert_id: 9 }],
            links: [{ id: 5, alert_id: 9 }]
        });
    });
});

jest.mock("../../database/dao/AlertDAO", () => ({ all: jest.fn(), transaction: jest.fn(), delete: jest.fn(), tableName: "alerts" }));
jest.mock("../../database/dao/AlertMarkersDAO", () => ({ delete: jest.fn(), tableName: "alert_markers" }));
jest.mock("../../database/dao/AlertPolygonDAO", () => ({ delete: jest.fn(), tableName: "alert_polygons" }));
jest.mock("../../database/dao/AlertRoadDAO", () => ({ delete: jest.fn(), tableName: "alert_roads" }));
jest.mock("../../database/dao/AlertAdviceDAO", () => ({ delete: jest.fn(), tableName: "alert_advice" }));
jest.mock("../../database/dao/AlertLinkDAO", () => ({ delete: jest.fn(), tableName: "alert_links" }));
jest.mock("../../database/dao/AlertRegionDAO", () => ({ delete: jest.fn(), tableName: "alert_region" }));
jest.mock("../../database/dao/NotificationDAO", () => ({ delete: jest.fn(), tableName: "notifications" }));

const AlertDAO = require("../../database/dao/AlertDAO");
const AlertMarkersDAO = require("../../database/dao/AlertMarkersDAO");
const AlertPolygonDAO = require("../../database/dao/AlertPolygonDAO");
const AlertRoadDAO = require("../../database/dao/AlertRoadDAO");
const AlertAdviceDAO = require("../../database/dao/AlertAdviceDAO");
const AlertLinkDAO = require("../../database/dao/AlertLinkDAO");
const AlertRegionDAO = require("../../database/dao/AlertRegionDAO");
const NotificationDAO = require("../../database/dao/NotificationDAO");
const MaintenanceService = require("../../services/MaintenanceService");

describe("MaintenanceService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("getExpiredAlertIds returns ids from expired rows", async () => {
        AlertDAO.all.mockResolvedValue([{ id: 1 }, { id: 2 }]);

        const ids = await MaintenanceService.getExpiredAlertIds(30);

        expect(AlertDAO.all).toHaveBeenCalledWith(
            expect.stringContaining("SELECT id FROM alerts")
        );
        expect(ids).toEqual([1, 2]);
    });

    test("cleanupExpiredAlerts deletes expired alerts in a transaction", async () => {
        AlertDAO.all.mockResolvedValue([{ id: 10 }, { id: 11 }]);
        AlertDAO.transaction.mockImplementation(async (cb) => cb());
        AlertMarkersDAO.delete.mockResolvedValue({ changes: 2 });
        AlertPolygonDAO.delete.mockResolvedValue({ changes: 2 });
        AlertRoadDAO.delete.mockResolvedValue({ changes: 2 });
        AlertAdviceDAO.delete.mockResolvedValue({ changes: 2 });
        AlertLinkDAO.delete.mockResolvedValue({ changes: 2 });
        AlertRegionDAO.delete.mockResolvedValue({ changes: 2 });
        NotificationDAO.delete.mockResolvedValue({ changes: 2 });
        AlertDAO.delete.mockResolvedValue({ changes: 2 });

        const result = await MaintenanceService.cleanupExpiredAlerts(30);

        expect(result).toEqual({ expiredAlerts: 2, thresholdDays: 30 });
        expect(AlertDAO.transaction).toHaveBeenCalled();
        expect(AlertMarkersDAO.delete).toHaveBeenCalled();
    });

    test("cleanupOldNotifications deletes old rows and reports change count", async () => {
        NotificationDAO.delete.mockResolvedValue({ changes: 7 });

        const result = await MaintenanceService.cleanupOldNotifications(15);

        expect(NotificationDAO.delete).toHaveBeenCalledWith(
            "notifications",
            expect.stringContaining("created_at <")
        );
        expect(result).toEqual({ cleanedNotifications: 7, thresholdDays: 15 });
    });
});

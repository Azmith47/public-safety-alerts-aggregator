jest.mock("../../database/dao/AlertDAO.js", () => ({ all: jest.fn(), transaction: jest.fn(), delete: jest.fn(), tableName: "alerts" }));
jest.mock("../../database/dao/AlertMarkersDAO.js", () => ({ delete: jest.fn(), tableName: "alert_markers" }));
jest.mock("../../database/dao/AlertPolygonDAO.js", () => ({ delete: jest.fn(), tableName: "alert_polygons" }));
jest.mock("../../database/dao/AlertRoadDAO.js", () => ({ delete: jest.fn(), tableName: "alert_roads" }));
jest.mock("../../database/dao/AlertAdviceDAO.js", () => ({ delete: jest.fn(), tableName: "alert_advice" }));
jest.mock("../../database/dao/AlertLinkDAO.js", () => ({ delete: jest.fn(), tableName: "alert_links" }));
jest.mock("../../database/dao/AlertRegionDAO.js", () => ({ delete: jest.fn(), tableName: "alert_region" }));
jest.mock("../../database/dao/NotificationDAO.js", () => ({ delete: jest.fn(), tableName: "notifications" }));

import AlertDAO from "../../database/dao/AlertDAO.js";
import AlertMarkersDAO from "../../database/dao/AlertMarkersDAO.js";
import AlertPolygonDAO from "../../database/dao/AlertPolygonDAO.js";
import AlertRoadDAO from "../../database/dao/AlertRoadDAO.js";
import AlertAdviceDAO from "../../database/dao/AlertAdviceDAO.js";
import AlertLinkDAO from "../../database/dao/AlertLinkDAO.js";
import AlertRegionDAO from "../../database/dao/AlertRegionDAO.js";
import NotificationDAO from "../../database/dao/NotificationDAO.js";
import MaintenanceService from "../../services/MaintenanceService.js";

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

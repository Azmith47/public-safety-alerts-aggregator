import { describe, expect, jest, test } from "@jest/globals";

const AlertDAO = {
	all: jest.fn(),
	transaction: jest.fn(),
	delete: jest.fn(),
	tableName: "alerts",
};
const AlertMarkersDAO = { delete: jest.fn(), tableName: "alert_markers" };
const AlertPolygonDAO = { delete: jest.fn(), tableName: "alert_polygons" };
const AlertRoadDAO = { delete: jest.fn(), tableName: "alert_roads" };
const AlertAdviceDAO = { delete: jest.fn(), tableName: "alert_advice" };
const AlertLinkDAO = { delete: jest.fn(), tableName: "alert_links" };
const AlertRegionDAO = { delete: jest.fn(), tableName: "alert_region" };
const NotificationDAO = { delete: jest.fn(), tableName: "notifications" };

jest.unstable_mockModule("../../database/dao/AlertDAO.js", () => ({
	default: AlertDAO,
}));
jest.unstable_mockModule("../../database/dao/AlertMarkersDAO.js", () => ({
	default: AlertMarkersDAO,
}));
jest.unstable_mockModule("../../database/dao/AlertPolygonDAO.js", () => ({
	default: AlertPolygonDAO,
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
jest.unstable_mockModule("../../database/dao/AlertRegionDAO.js", () => ({
	default: AlertRegionDAO,
}));
jest.unstable_mockModule("../../database/dao/NotificationDAO.js", () => ({
	default: NotificationDAO,
}));

const { default: MaintenanceService } =
	await import("../../services/MaintenanceService.js");

describe("MaintenanceService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("getExpiredAlertIds returns ids from expired rows", async () => {
		AlertDAO.all.mockResolvedValue([{ id: 1 }, { id: 2 }]);

		const ids = await MaintenanceService.getExpiredAlertIds(30);

		expect(AlertDAO.all).toHaveBeenCalledWith(
			expect.stringContaining("SELECT id FROM alerts"),
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
			expect.stringContaining("created_at <"),
		);
		expect(result).toEqual({ cleanedNotifications: 7, thresholdDays: 15 });
	});
});

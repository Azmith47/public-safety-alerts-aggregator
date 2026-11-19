import { describe, expect, jest, test } from "@jest/globals";

const notificationDAO = {
	create: jest.fn(),
	getPending: jest.fn(),
	markSent: jest.fn(),
	markFailed: jest.fn(),
};
const userDAO = { getById: jest.fn() };
const subscriptionDAO = { getForUser: jest.fn() };
const alertDAO = { getById: jest.fn() };
const emailService = { sendAlertDigest: jest.fn() };

jest.unstable_mockModule("../../database/dao/NotificationDAO.js", () => ({
	default: notificationDAO,
}));
jest.unstable_mockModule("../../database/dao/UserDAO.js", () => ({
	default: userDAO,
}));
jest.unstable_mockModule("../../database/dao/SubscriptionDAO.js", () => ({
	default: subscriptionDAO,
}));
jest.unstable_mockModule("../../database/dao/AlertDAO.js", () => ({
	default: alertDAO,
}));
jest.unstable_mockModule("../../services/EmailService.js", () => ({
	default: emailService,
}));

const { default: NotificationService } =
	await import("../../services/NotificationService.js");

describe("NotificationService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		NotificationService.stopProcessing();
		notificationDAO.markSent.mockResolvedValue({ changes: 1 });
		notificationDAO.markFailed.mockResolvedValue({ changes: 1 });
		emailService.sendAlertDigest.mockResolvedValue({ ok: true });
		jest.useRealTimers();
	});

	test("enqueue forwards notification payload to DAO", async () => {
		notificationDAO.create.mockResolvedValue({ id: 1 });

		const result = await NotificationService.enqueue(5, 10);

		expect(notificationDAO.create).toHaveBeenCalledWith({
			user_id: 5,
			alert_id: 10,
			sent_status: "pending",
		});
		expect(result).toEqual({ id: 1 });
	});

	test("sends one digest for all pending alerts belonging to a user", async () => {
		notificationDAO.getPending.mockResolvedValue([
			{ id: 1, user_id: 2, alert_id: 3 },
			{ id: 2, user_id: 2, alert_id: 4 },
		]);
		userDAO.getById.mockResolvedValue({
			id: 2,
			email: "test@example.com",
			verified: true,
		});
		subscriptionDAO.getForUser.mockResolvedValue([{ is_enabled: true }]);
		alertDAO.getById
			.mockResolvedValueOnce({ title: "Flood" })
			.mockResolvedValueOnce({ title: "Fire" });

		const processed = await NotificationService.processPending(10);

		expect(processed).toBe(2);
		expect(emailService.sendAlertDigest).toHaveBeenCalledTimes(1);
		expect(emailService.sendAlertDigest).toHaveBeenCalledWith(
			"test@example.com",
			[{ title: "Flood" }, { title: "Fire" }],
		);
		expect(notificationDAO.markSent).toHaveBeenCalledTimes(2);
		expect(notificationDAO.markSent).toHaveBeenNthCalledWith(1, 1);
		expect(notificationDAO.markSent).toHaveBeenNthCalledWith(2, 2);
	});

	test("marks every notification in a failed digest as failed", async () => {
		notificationDAO.getPending.mockResolvedValue([
			{ id: 1, user_id: 2, alert_id: 3 },
			{ id: 2, user_id: 2, alert_id: 4 },
		]);
		userDAO.getById.mockResolvedValue({
			id: 2,
			email: "test@example.com",
			verified: true,
		});
		subscriptionDAO.getForUser.mockResolvedValue([{ is_enabled: true }]);
		alertDAO.getById.mockResolvedValue({ title: "Alert" });
		emailService.sendAlertDigest.mockRejectedValue(
			new Error("delivery failed"),
		);

		await NotificationService.processPending(10);

		expect(notificationDAO.markSent).not.toHaveBeenCalled();
		expect(notificationDAO.markFailed).toHaveBeenCalledTimes(2);
		expect(notificationDAO.markFailed).toHaveBeenNthCalledWith(1, 1);
		expect(notificationDAO.markFailed).toHaveBeenNthCalledWith(2, 2);
	});

	test("startProcessing and stopProcessing manage the timer state", () => {
		jest.useFakeTimers();

		NotificationService.startProcessing();
		expect(NotificationService.running).toBe(true);

		NotificationService.stopProcessing();
		expect(NotificationService.running).toBe(false);
	});
});

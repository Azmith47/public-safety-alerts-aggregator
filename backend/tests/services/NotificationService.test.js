jest.mock("../../database/dao/NotificationDAO", () => ({ create: jest.fn(), getPending: jest.fn(), markSent: jest.fn(), markFailed: jest.fn() }));
jest.mock("../../database/dao/UserDAO", () => ({ getById: jest.fn() }));
jest.mock("../../database/dao/SubscriptionDAO", () => ({ getForUser: jest.fn() }));

const NotificationService = require("../../services/NotificationService");
const NotificationDAO = require("../../database/dao/NotificationDAO");
const UserDAO = require("../../database/dao/UserDAO");
const SubscriptionDAO = require("../../database/dao/SubscriptionDAO");

describe("NotificationService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        NotificationService.stopProcessing();
        jest.useRealTimers();
    });

    test("enqueue forwards notification payload to DAO", async () => {
        NotificationDAO.create.mockResolvedValue({ id: 1 });
        const result = await NotificationService.enqueue(5, 10);

        expect(NotificationDAO.create).toHaveBeenCalledWith({ user_id: 5, alert_id: 10, sent_status: 'pending' });
        expect(result).toEqual({ id: 1 });
    });

    test("processPending marks a valid pending notification as sent", async () => {
        NotificationDAO.getPending.mockResolvedValue([{ id: 1, user_id: 2, alert_id: 3 }]);
        UserDAO.getById.mockResolvedValue({ id: 2, email: "test@example.com", verified: true });
        SubscriptionDAO.getForUser.mockResolvedValue({ is_enabled: true });
        NotificationDAO.markSent.mockResolvedValue({ changes: 1 });

        const processed = await NotificationService.processPending(10);

        expect(processed).toBe(1);
        expect(NotificationDAO.markSent).toHaveBeenCalledWith(1);
    });

    test("startProcessing and stopProcessing manage the timer state", () => {
        jest.useFakeTimers();

        NotificationService.startProcessing();
        expect(NotificationService.running).toBe(true);

        NotificationService.stopProcessing();
        expect(NotificationService.running).toBe(false);
    });
});

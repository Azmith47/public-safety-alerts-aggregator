jest.mock("../../services/LookupService", () => ({ getOrCreateSource: jest.fn() }));
jest.mock("../../database/dao/SourceHealthDAO", () => ({ getBySourceId: jest.fn(), create: jest.fn(), updateBySourceId: jest.fn(), getAll: jest.fn() }));

const LookupService = require("../../services/LookupService");
const SourceHealthDAO = require("../../database/dao/SourceHealthDAO");
const SourceHealthService = require("../../services/SourceHealthService");

describe("SourceHealthService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("_normalizeMessage converts objects to JSON strings and truncates long texts", () => {
        const longText = "a".repeat(1200);
        const normalized = SourceHealthService._normalizeMessage({ message: "hello" });
        expect(normalized).toContain("hello");
        expect(SourceHealthService._normalizeMessage(longText).length).toBe(1000);
    });

    test("recordRun creates a new health record when none exists", async () => {
        LookupService.getOrCreateSource.mockResolvedValue(7);
        SourceHealthDAO.getBySourceId.mockResolvedValue(null);
        SourceHealthDAO.create.mockResolvedValue({});

        const result = await SourceHealthService.recordRun("RFS", "https://example.com", { success: true, processed: 2, created: 1 });

        expect(result).toEqual({ sourceId: 7, created: true, success: true });
        expect(SourceHealthDAO.create).toHaveBeenCalledWith(
            expect.objectContaining({
                source_id: 7,
                last_status: "success",
                run_count: 1,
                success_count: 1,
                failure_count: 0,
                processed_count: 2,
                created_count: 1,
                updated_count: 0,
                failed_count: 0
            })
        );
    });

    test("recordRun updates an existing health record on failure", async () => {
        LookupService.getOrCreateSource.mockResolvedValue(8);
        SourceHealthDAO.getBySourceId.mockResolvedValue({ run_count: 1, success_count: 1, failure_count: 0, processed_count: 2, created_count: 1, updated_count: 0, failed_count: 0, last_failure_at: null, last_success_at: "2026-05-20T00:00:00.000Z" });
        SourceHealthDAO.updateBySourceId.mockResolvedValue({});

        const result = await SourceHealthService.recordRun("TFNSW", null, { success: false, processed: 3, failed: 1 });

        expect(result).toEqual({ sourceId: 8, updated: true, success: false });
        expect(SourceHealthDAO.updateBySourceId).toHaveBeenCalledWith(8, expect.objectContaining({
            last_status: "failure",
            run_count: 2,
            success_count: 1,
            failure_count: 1,
            processed_count: 5,
            failed_count: 1
        }));
    });
});

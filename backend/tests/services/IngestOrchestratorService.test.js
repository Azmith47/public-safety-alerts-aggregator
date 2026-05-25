jest.mock("../../services/AlertPersistenceService.js", () => ({ save: jest.fn() }));
jest.mock("../../services/SourceHealthService.js", () => ({ recordRun: jest.fn() }));

import IngestOrchestratorService from "../../services/IngestOrchestratorService.js";
import AlertPersistenceService from "../../services/AlertPersistenceService.js";
import SourceHealthService from "../../services/SourceHealthService.js";

describe("IngestOrchestratorService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        IngestOrchestratorService.collectors.clear();
    });

    test("registerCollector throws when collectorFn is not a function", () => {
        expect(() => IngestOrchestratorService.registerCollector("bad", null)).toThrow("collectorFn must be a function");
    });

    test("runCollector persists alerts and reports metrics", async () => {
        const collector = jest.fn().mockResolvedValue([{ id: "one" }, { id: "two" }]);
        AlertPersistenceService.save.mockResolvedValue({ action: "created" });
        SourceHealthService.recordRun.mockResolvedValue({});

        IngestOrchestratorService.registerCollector("test", collector, { sourceName: "Test Source", sourceWebsite: "https://test" });

        const result = await IngestOrchestratorService.runCollector("test");

        expect(result).toEqual({ source: "Test Source", processed: 2, created: 2, updated: 0, failed: 0, success: true });
        expect(AlertPersistenceService.save).toHaveBeenCalledTimes(2);
        expect(SourceHealthService.recordRun).toHaveBeenCalledWith("Test Source", "https://test", expect.objectContaining({ processed: 2 }));
    });

    test("runCollector handles collector failure and records an error", async () => {
        const collector = jest.fn().mockRejectedValue(new Error("boom"));
        SourceHealthService.recordRun.mockResolvedValue({});

        IngestOrchestratorService.registerCollector("failing", collector, { sourceName: "FailSource" });

        const result = await IngestOrchestratorService.runCollector("failing");

        expect(result.success).toBe(false);
        expect(result.processed).toBe(0);
        expect(result.error).toContain("boom");
        expect(SourceHealthService.recordRun).toHaveBeenCalledWith("FailSource", null, expect.objectContaining({ success: false }));
    });

    test("runAll executes all registered collectors sequentially", async () => {
        const first = jest.fn().mockResolvedValue([]);
        const second = jest.fn().mockResolvedValue([]);
        SourceHealthService.recordRun.mockResolvedValue({});

        IngestOrchestratorService.registerCollector("first", first, { sourceName: "First" });
        IngestOrchestratorService.registerCollector("second", second, { sourceName: "Second" });

        const summary = await IngestOrchestratorService.runAll();

        expect(summary).toEqual([
            expect.objectContaining({ name: "first", source: "First" }),
            expect.objectContaining({ name: "second", source: "Second" })
        ]);
    });
});

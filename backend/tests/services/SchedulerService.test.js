import { describe, expect, jest, test } from "@jest/globals";

const cron = {
	schedule: jest.fn((cronExpression, fn) => ({
		start: jest.fn(),
		stop: jest.fn(),
		destroy: jest.fn(),
		cronExpression,
		fn,
	})),
};

jest.unstable_mockModule("node-cron", () => ({ default: cron }));
jest.unstable_mockModule("../../services/IngestOrchestratorService.js", () => ({
	default: {},
}));
jest.unstable_mockModule("../../services/MaintenanceService.js", () => ({
	default: {},
}));

const {
	default: SchedulerService,
	initializeIngestScheduler,
	initializeMaintenanceScheduler,
} = await import("../../services/SchedulerService.js");

describe("SchedulerService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("schedule registers a task and does not duplicate names", () => {
		const scheduler = new SchedulerService();

		scheduler.schedule("task1", "* * * * *", async () => {});
		scheduler.schedule("task1", "* * * * *", async () => {});

		expect(scheduler.getTasks()).toEqual(["task1"]);
		expect(cron.schedule).toHaveBeenCalledTimes(1);
	});

	test("start begins all scheduled tasks", () => {
		const scheduler = new SchedulerService();
		scheduler.schedule("task2", "* * * * *", async () => {});

		scheduler.start();
		expect(scheduler.isRunning).toBe(true);
	});

	test("stop halts all scheduled tasks and resets running state", () => {
		const scheduler = new SchedulerService();
		scheduler.schedule("task3", "* * * * *", async () => {});

		scheduler.start();
		scheduler.stop();

		expect(scheduler.isRunning).toBe(false);
	});

	test("remove deletes a task and destroys it", () => {
		const scheduler = new SchedulerService();
		scheduler.schedule("task4", "* * * * *", async () => {});

		scheduler.remove("task4");
		expect(scheduler.getTasks()).toEqual([]);
	});

	test("initializeIngestScheduler adds ingest task", () => {
		const scheduler = initializeIngestScheduler("*/5 * * * *");
		expect(scheduler.getTasks()).toContain("ingest");
	});

	test("initializeMaintenanceScheduler adds maintenance task", () => {
		const scheduler = initializeMaintenanceScheduler("0 4 * * *");
		expect(scheduler.getTasks()).toContain("maintenance");
	});
});

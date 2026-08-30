import { describe, expect, jest, test } from "@jest/globals";
const CategoryDAO = { getOrCreate: jest.fn() };
const SourceDAO = { getOrCreate: jest.fn() };
const StatusTypeDAO = { getOrCreate: jest.fn() };
const SeverityLevelDAO = { getOrCreate: jest.fn() };
const RegionDAO = { getOrCreate: jest.fn() };
const CouncilAreaDAO = { getOrCreate: jest.fn() };
const LocationDAO = { getOrCreate: jest.fn() };

jest.unstable_mockModule("../../database/dao/CategoryDAO.js", () => ({
	default: CategoryDAO,
}));
jest.unstable_mockModule("../../database/dao/SourceDAO.js", () => ({
	default: SourceDAO,
}));
jest.unstable_mockModule("../../database/dao/StatusTypeDAO.js", () => ({
	default: StatusTypeDAO,
}));
jest.unstable_mockModule("../../database/dao/SeverityLevelDAO.js", () => ({
	default: SeverityLevelDAO,
}));
jest.unstable_mockModule("../../database/dao/RegionDAO.js", () => ({
	default: RegionDAO,
}));
jest.unstable_mockModule("../../database/dao/CouncilAreaDAO.js", () => ({
	default: CouncilAreaDAO,
}));
jest.unstable_mockModule("../../database/dao/LocationDAO.js", () => ({
	default: LocationDAO,
}));

const { default: LookupService } =
	await import("../../services/LookupService.js");

describe("LookupService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		LookupService.clearCache();
	});

	test("getOrCreateCategory caches lookups", async () => {
		CategoryDAO.getOrCreate.mockResolvedValue({ id: 1, created: true });

		const first = await LookupService.getOrCreateCategory("Fire");
		const second = await LookupService.getOrCreateCategory("Fire");

		expect(CategoryDAO.getOrCreate).toHaveBeenCalledTimes(1);
		expect(first).toBe(1);
		expect(second).toBe(1);
	});

	test("getOrCreateSource uses normalized cache key and returns id", async () => {
		SourceDAO.getOrCreate.mockResolvedValue({ id: 5, created: true });

		const id = await LookupService.getOrCreateSource(
			"RFS",
			"https://rfs.example.com",
		);
		const id2 = await LookupService.getOrCreateSource(
			"RFS",
			"https://rfs.example.com",
		);

		expect(SourceDAO.getOrCreate).toHaveBeenCalledTimes(1);
		expect(id).toBe(5);
		expect(id2).toBe(5);
	});

	test("clearCache removes cached values", async () => {
		CategoryDAO.getOrCreate.mockResolvedValue({ id: 99, created: true });
		await LookupService.getOrCreateCategory("Test");

		LookupService.clearCache();

		await LookupService.getOrCreateCategory("Test");
		expect(CategoryDAO.getOrCreate).toHaveBeenCalledTimes(2);
	});

	test("getOrCreateLocation caches by full composite key", async () => {
		LocationDAO.getOrCreate.mockResolvedValue({ id: 12, created: true });

		const first = await LookupService.getOrCreateLocation(
			"Sydney",
			"2000",
			3,
		);
		const second = await LookupService.getOrCreateLocation(
			"Sydney",
			"2000",
			3,
		);

		expect(LocationDAO.getOrCreate).toHaveBeenCalledTimes(1);
		expect(first).toBe(12);
		expect(second).toBe(12);
	});
});

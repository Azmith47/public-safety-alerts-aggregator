import { describe, expect, jest, test, beforeEach } from "@jest/globals";

const database = {
	run: jest.fn(),
	get: jest.fn(),
	all: jest.fn(),
	beginTransaction: jest.fn(),
	commitTransaction: jest.fn(),
	rollbackTransaction: jest.fn(),
};

jest.unstable_mockModule("../../database/db.js", () => database);

const { default: RegionDAO } = await import("../../database/dao/RegionDAO.js");

describe("RegionDAO", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("getOrCreate normalizes mismatched region names to the canonical uppercase form", async () => {
		database.all.mockResolvedValue([
			{ id: 1, name: "Greater Sydney" },
			{ id: 2, name: "Central West & Orana" },
		]);
		database.run.mockReturnValue({ lastInsertRowid: 99, changes: 1 });

		const result = await RegionDAO.getOrCreate("CENTRAL_WEST_ORANA");

		expect(result).toEqual({ id: 2, created: false });
		expect(database.run).toHaveBeenCalledWith(
			"UPDATE regions SET name = ? WHERE id = ?",
			["CENTRAL_WEST_ORANA", 2],
		);
	});

	test("getOrCreate stores the canonical uppercase region name", async () => {
		database.all.mockResolvedValue([]);
		database.run.mockReturnValue({ lastInsertRowid: 99, changes: 1 });

		const result = await RegionDAO.getOrCreate("SOUTH_EAST_TABLELANDS");

		expect(result).toEqual({ id: 99, created: true });
		expect(database.run).toHaveBeenCalledWith(
			"INSERT INTO regions (name) VALUES (?)",
			["SOUTH_EAST_TABLELANDS"],
		);
	});
});

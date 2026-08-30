import { describe, expect, jest, test } from "@jest/globals";

const database = {
	run: jest.fn(),
	get: jest.fn(),
	all: jest.fn(),
	beginTransaction: jest.fn(),
	commitTransaction: jest.fn(),
	rollbackTransaction: jest.fn(),
};
jest.unstable_mockModule("../../database/db.js", () => database);

const { default: LocationDAO } =
	await import("../../database/dao/LocationDAO.js");
const { get, run, all } = database;

describe("LocationDAO", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("getOrCreate returns existing record when found", async () => {
		get.mockResolvedValue({ id: 17, name: "Test", postcode: "2000" });

		const result = await LocationDAO.getOrCreate("Test", "2000", 3);

		expect(get).toHaveBeenCalledWith(
			"SELECT * FROM locations WHERE LOWER(name) = LOWER(?) AND postcode = ?",
			["Test", "2000"],
		);
		expect(result).toEqual({ id: 17, created: false });
	});

	test("getOrCreate inserts new location when missing", async () => {
		get.mockResolvedValue(null);
		run.mockReturnValue({ lastInsertRowid: 22, changes: 1 });

		const result = await LocationDAO.getOrCreate("Newtown", "2042", 5);

		expect(run).toHaveBeenCalledWith(
			"INSERT INTO locations (name, postcode, council_area_id) VALUES (?, ?, ?)",
			["Newtown", "2042", 5],
		);
		expect(result).toEqual({ id: 22, created: true });
	});

	test("getOrCreate reuses seeded location when postcode is missing from the alert", async () => {
		get.mockResolvedValue({ id: 41, name: "Newtown", postcode: "2042" });

		const result = await LocationDAO.getOrCreate("newtown", null, 5);

		expect(result).toEqual({ id: 41, created: false });
		expect(get).toHaveBeenCalledWith(
			"SELECT * FROM locations WHERE LOWER(name) = LOWER(?) AND council_area_id = ?",
			["newtown", 5],
		);
		expect(run).not.toHaveBeenCalled();
	});

	test("getAll returns location rows ordered by name", async () => {
		all.mockResolvedValue([
			{ id: 1, name: "A" },
			{ id: 2, name: "B" },
		]);

		const rows = await LocationDAO.getAll();

		expect(all).toHaveBeenCalledWith(
			"SELECT * FROM locations WHERE 1=1 ORDER BY name",
			[],
		);
		expect(rows).toEqual([
			{ id: 1, name: "A" },
			{ id: 2, name: "B" },
		]);
	});
});

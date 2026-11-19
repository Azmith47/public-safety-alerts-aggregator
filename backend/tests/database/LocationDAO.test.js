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
		LocationDAO.setDatabaseInitializationComplete(true);
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

	test("getOrCreate reuses an existing endpoint when the alert contains a road route", async () => {
		get.mockImplementation((sql, params) => {
			if (
				sql ===
					"SELECT * FROM locations WHERE LOWER(name) = LOWER(?) AND council_area_id = ?" &&
				params[0] === "Broken Hill To Packsaddle"
			) {
				return Promise.resolve(null);
			}
			if (
				sql ===
					"SELECT * FROM locations WHERE LOWER(name) = LOWER(?) AND council_area_id = ?" &&
				params[0] === "Broken Hill"
			) {
				return Promise.resolve({
					id: 12,
					name: "Broken Hill",
					postcode: "2880",
				});
			}
			return Promise.resolve(null);
		});

		const result = await LocationDAO.getOrCreate(
			"Broken Hill To Packsaddle",
			null,
			5,
		);

		expect(result).toEqual({ id: 12, created: false });
		expect(get).toHaveBeenCalledWith(
			"SELECT * FROM locations WHERE LOWER(name) = LOWER(?) AND council_area_id = ?",
			["Broken Hill To Packsaddle", 5],
		);
		expect(get).toHaveBeenCalledWith(
			"SELECT * FROM locations WHERE LOWER(name) = LOWER(?) AND council_area_id = ?",
			["Broken Hill", 5],
		);
		expect(run).not.toHaveBeenCalled();
	});

	test("getOrCreate falls back to postcode only when the postcode resolves to a single seeded location", async () => {
		get.mockImplementation((sql, params) => {
			if (
				sql ===
					"SELECT * FROM locations WHERE LOWER(name) = LOWER(?) AND postcode = ?" &&
				params[0] === "Kirawee"
			) {
				return Promise.resolve(null);
			}
			if (
				sql ===
					"SELECT * FROM locations WHERE LOWER(name) = LOWER(?)" &&
				params[0] === "Kirawee"
			) {
				return Promise.resolve(null);
			}
			return Promise.resolve(null);
		});
		all.mockImplementation((sql, params) => {
			if (
				sql ===
					"SELECT * FROM locations WHERE postcode = ? AND council_area_id = ?" &&
				params[0] === "2232" &&
				params[1] === 9
			) {
				return Promise.resolve([
					{
						id: 27,
						name: "Kirrawee",
						postcode: "2232",
						council_area_id: 9,
					},
				]);
			}
			return Promise.resolve([]);
		});

		const result = await LocationDAO.getOrCreate("Kirawee", "2232", 9);

		expect(result).toEqual({ id: 27, created: false });
		expect(all).toHaveBeenCalledWith(
			"SELECT * FROM locations WHERE postcode = ? AND council_area_id = ?",
			["2232", 9],
		);
		expect(run).not.toHaveBeenCalled();
	});

	test("getOrCreate skips postcode-only fallback while the database is still initializing", async () => {
		LocationDAO.setDatabaseInitializationComplete(false);
		get.mockResolvedValue(null);
		run.mockReturnValue({ lastInsertRowid: 44, changes: 1 });

		const result = await LocationDAO.getOrCreate("Kirawee", "2232", 9);

		expect(result).toEqual({ id: 44, created: true });
		expect(run).toHaveBeenCalledWith(
			"INSERT INTO locations (name, postcode, council_area_id) VALUES (?, ?, ?)",
			["Kirawee", "2232", 9],
		);
		LocationDAO.setDatabaseInitializationComplete(true);
	});

	test("getOrCreate does not reuse a postcode match when multiple suburbs share the same postcode", async () => {
		LocationDAO.setDatabaseInitializationComplete(true);
		get.mockResolvedValue(null);
		all.mockResolvedValue([
			{ id: 11, name: "Kirrawee", postcode: "2232", council_area_id: 9 },
			{
				id: 12,
				name: "Kurraba Point",
				postcode: "2232",
				council_area_id: 9,
			},
		]);
		run.mockReturnValue({ lastInsertRowid: 22, changes: 1 });

		const result = await LocationDAO.getOrCreate("Kirawee", "2232", 9);

		expect(result).toEqual({ id: 22, created: true });
		expect(run).toHaveBeenCalledWith(
			"INSERT INTO locations (name, postcode, council_area_id) VALUES (?, ?, ?)",
			["Kirawee", "2232", 9],
		);
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

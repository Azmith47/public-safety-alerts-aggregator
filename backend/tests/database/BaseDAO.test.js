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

const { default: BaseDAO } = await import("../../database/dao/BaseDAO.js");
const {
	run,
	get,
	all,
	beginTransaction,
	commitTransaction,
	rollbackTransaction,
} = database;

describe("BaseDAO", () => {
	let dao;

	beforeEach(() => {
		jest.clearAllMocks();
		dao = new BaseDAO("example_table");
	});

	test("insert constructs valid SQL and parameters", async () => {
		run.mockReturnValue({ lastInsertRowid: 42, changes: 1 });

		const result = await dao.insert("example_table", {
			foo: "bar",
			count: 7,
		});

		expect(run).toHaveBeenCalledWith(
			"INSERT INTO example_table (foo, count) VALUES (?, ?)",
			["bar", 7],
		);
		expect(result).toEqual({ id: 42, changes: 1 });
	});

	test("serializes Date values before binding them", async () => {
		run.mockReturnValue({ lastInsertRowid: 42, changes: 1 });
		const createdAt = new Date("2026-08-24T10:00:00.000Z");

		await dao.insert("example_table", { created_at: createdAt });

		expect(run).toHaveBeenCalledWith(
			"INSERT INTO example_table (created_at) VALUES (?)",
			["2026-08-24T10:00:00.000Z"],
		);
	});

	test("serializes boolean values before binding them", async () => {
		run.mockReturnValue({ lastInsertRowid: 42, changes: 1 });

		await dao.insert("example_table", { enabled: false, verified: true });

		expect(run).toHaveBeenCalledWith(
			"INSERT INTO example_table (enabled, verified) VALUES (?, ?)",
			[0, 1],
		);
	});

	test("update constructs valid SQL and parameters", async () => {
		run.mockReturnValue({ lastInsertRowid: 0, changes: 1 });

		const result = await dao.update(
			"example_table",
			{ foo: "baz", count: 9 },
			"id = ?",
			[3],
		);

		expect(run).toHaveBeenCalledWith(
			"UPDATE example_table SET foo = ?, count = ? WHERE id = ?",
			["baz", 9, 3],
		);
		expect(result).toEqual({ id: 0, changes: 1 });
	});

	test("delete constructs valid SQL and parameters", async () => {
		run.mockReturnValue({ lastInsertRowid: 0, changes: 2 });

		const result = await dao.delete("example_table", "id = ?", [5]);

		expect(run).toHaveBeenCalledWith(
			"DELETE FROM example_table WHERE id = ?",
			[5],
		);
		expect(result).toEqual({ id: 0, changes: 2 });
	});

	test("findOne delegates to get", async () => {
		get.mockResolvedValue({ id: 1, name: "test" });

		const row = await dao.findOne("example_table", "name = ?", ["test"]);

		expect(get).toHaveBeenCalledWith(
			"SELECT * FROM example_table WHERE name = ?",
			["test"],
		);
		expect(row).toEqual({ id: 1, name: "test" });
	});

	test("findAll delegates to all and applies ordering", async () => {
		all.mockResolvedValue([{ id: 1 }, { id: 2 }]);

		const rows = await dao.findAll(
			"example_table",
			"active = 1",
			[],
			"id DESC",
		);

		expect(all).toHaveBeenCalledWith(
			"SELECT * FROM example_table WHERE active = 1 ORDER BY id DESC",
			[],
		);
		expect(rows).toEqual([{ id: 1 }, { id: 2 }]);
	});

	test("transaction commits on success", async () => {
		beginTransaction.mockResolvedValue();
		commitTransaction.mockResolvedValue();

		const callback = jest.fn().mockResolvedValue("done");
		const result = await dao.transaction(callback);

		expect(beginTransaction).toHaveBeenCalled();
		expect(commitTransaction).toHaveBeenCalled();
		expect(rollbackTransaction).not.toHaveBeenCalled();
		expect(result).toBe("done");
	});

	test("transaction rolls back on failure", async () => {
		beginTransaction.mockResolvedValue();
		rollbackTransaction.mockResolvedValue();

		const callback = jest.fn().mockRejectedValue(new Error("fail"));

		await expect(dao.transaction(callback)).rejects.toThrow("fail");
		expect(beginTransaction).toHaveBeenCalled();
		expect(rollbackTransaction).toHaveBeenCalled();
		expect(commitTransaction).not.toHaveBeenCalled();
	});
});

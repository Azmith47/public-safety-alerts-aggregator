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

const { default: AlertMarkersDAO } =
	await import("../../database/dao/AlertMarkersDAO.js");
const { run } = database;

describe("AlertMarkersDAO", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("create inserts an alert marker row", async () => {
		run.mockReturnValue({ lastInsertRowid: 13, changes: 1 });

		const result = await AlertMarkersDAO.create(5, -33.8, 151.2);

		expect(run).toHaveBeenCalledWith(
			"INSERT INTO alert_markers (alert_id, latitude, longitude) VALUES (?, ?, ?)",
			[5, -33.8, 151.2],
		);
		expect(result).toEqual({ id: 13, changes: 1 });
	});

	test("deleteByAlert deletes all marker rows for an alert", async () => {
		run.mockReturnValue({ lastInsertRowid: 0, changes: 4 });

		const result = await AlertMarkersDAO.deleteByAlert(5);

		expect(run).toHaveBeenCalledWith(
			"DELETE FROM alert_markers WHERE alert_id = ?",
			[5],
		);
		expect(result).toEqual({ id: 0, changes: 4 });
	});
});

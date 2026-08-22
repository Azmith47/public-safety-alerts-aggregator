import { describe, expect, test } from "@jest/globals";
import * as db from "../database/db.js";

describe("database/db exports", () => {
	test("should export db helpers and transaction functions", () => {
		expect(db).toBeDefined();
		expect(typeof db.run).toBe("function");
		expect(typeof db.get).toBe("function");
		expect(typeof db.all).toBe("function");
		expect(typeof db.exec).toBe("function");
		expect(typeof db.beginTransaction).toBe("function");
		expect(typeof db.commitTransaction).toBe("function");
		expect(typeof db.rollbackTransaction).toBe("function");
	});
});

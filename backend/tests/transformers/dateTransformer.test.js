import {
	describe,
	it,
	expect,
	beforeEach,
	afterEach,
	jest,
} from "@jest/globals";

import {
	transformDate,
	transformDateToISOString,
	isExpired,
	isFutureDate,
	getUnixTimestamp,
	calculateAgeInMinutes,
} from "../../normalization/transformers/dateTransformer.js";

describe("dateTransformer", () => {
	/**
	 * Fixed timestamp:
	 * 2026-05-01T12:00:00.000Z
	 */
	const MOCK_NOW = new Date("2026-05-01T12:00:00.000Z").getTime();

	beforeEach(() => {
		jest.spyOn(Date, "now").mockReturnValue(MOCK_NOW);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe("transformDate", () => {
		it("should return null for null/undefined", () => {
			expect(transformDate(null)).toBeNull();
			expect(transformDate(undefined)).toBeNull();
		});

		it("should return null for unsupported types", () => {
			expect(transformDate({})).toBeNull();
			expect(transformDate([])).toBeNull();
			expect(transformDate(true)).toBeNull();
		});

		it("should return valid Date instances unchanged", () => {
			const date = new Date("2026-05-01T10:00:00Z");

			expect(transformDate(date)).toBe(date);
		});

		it("should return null for invalid Date instances", () => {
			const invalidDate = new Date("invalid");

			expect(transformDate(invalidDate)).toBeNull();
		});

		it("should parse unix epoch milliseconds", () => {
			const timestamp = 1777639200000;

			const result = transformDate(timestamp);

			expect(result).toBeInstanceOf(Date);
			expect(result.getTime()).toBe(timestamp);
		});

		it("should parse ISO date strings", () => {
			const result = transformDate("2026-05-01T10:00:00Z");

			expect(result).toBeInstanceOf(Date);
			expect(result.toISOString()).toBe("2026-05-01T10:00:00.000Z");
		});

		it("should parse RFC-style date strings", () => {
			const result = transformDate("Fri, 01 May 2026 10:00:00 GMT");

			expect(result).toBeInstanceOf(Date);
			expect(result.toISOString()).toBe("2026-05-01T10:00:00.000Z");
		});

		it("should trim whitespace from strings", () => {
			const result = transformDate("   2026-05-01T10:00:00Z   ");

			expect(result).toBeInstanceOf(Date);
			expect(result.toISOString()).toBe("2026-05-01T10:00:00.000Z");
		});

		it("should return null for empty strings", () => {
			expect(transformDate("")).toBeNull();
			expect(transformDate("   ")).toBeNull();
		});

		it("should return null for invalid date strings", () => {
			expect(transformDate("not-a-date")).toBeNull();
		});

		it("should return null for invalid numeric dates", () => {
			expect(transformDate(NaN)).toBeNull();
		});
	});

	describe("transformDateToISOString", () => {
		it("should convert valid dates to ISO strings", () => {
			expect(transformDateToISOString("2026-05-01T10:00:00Z")).toBe(
				"2026-05-01T10:00:00.000Z",
			);
		});

		it("should return null for invalid values", () => {
			expect(transformDateToISOString(null)).toBeNull();
			expect(transformDateToISOString("invalid")).toBeNull();
		});
	});

	describe("isExpired", () => {
		it("should return true for past dates", () => {
			expect(isExpired("2026-05-01T11:00:00Z")).toBe(true);
		});

		it("should return false for future dates", () => {
			expect(isExpired("2026-05-01T13:00:00Z")).toBe(false);
		});

		it("should return false for invalid values", () => {
			expect(isExpired(null)).toBe(false);
			expect(isExpired("invalid")).toBe(false);
		});
	});

	describe("isFutureDate", () => {
		it("should return true for future dates", () => {
			expect(isFutureDate("2026-05-01T13:00:00Z")).toBe(true);
		});

		it("should return false for past dates", () => {
			expect(isFutureDate("2026-05-01T11:00:00Z")).toBe(false);
		});

		it("should return false for invalid values", () => {
			expect(isFutureDate(null)).toBe(false);
			expect(isFutureDate("invalid")).toBe(false);
		});
	});

	describe("getUnixTimestamp", () => {
		it("should return unix timestamp for valid dates", () => {
			expect(getUnixTimestamp("2026-05-01T10:00:00Z")).toBe(
				new Date("2026-05-01T10:00:00Z").getTime(),
			);
		});

		it("should return null for invalid values", () => {
			expect(getUnixTimestamp(null)).toBeNull();
			expect(getUnixTimestamp("invalid")).toBeNull();
		});
	});

	describe("calculateAgeInMinutes", () => {
		it("should calculate age in minutes correctly", () => {
			/**
			 * 30 minutes before MOCK_NOW
			 */
			const result = calculateAgeInMinutes("2026-05-01T11:30:00Z");

			expect(result).toBe(30);
		});

		it("should return 0 for current timestamps", () => {
			const result = calculateAgeInMinutes("2026-05-01T12:00:00Z");

			expect(result).toBe(0);
		});

		it("should return negative values for future dates", () => {
			const result = calculateAgeInMinutes("2026-05-01T12:30:00Z");

			expect(result).toBe(-30);
		});

		it("should return null for invalid values", () => {
			expect(calculateAgeInMinutes(null)).toBeNull();
			expect(calculateAgeInMinutes("invalid")).toBeNull();
		});
	});
});

import { afterEach, describe, expect, jest, test } from "@jest/globals";

import rfsFixture from "../data/rfs_test_json_data.json" with { type: "json" };
import {
	run,
	sourceName,
	sourceWebsite,
} from "../../data-collection/api_collectors/rfsCollector.js";

describe("rfsCollector", () => {
	afterEach(() => {
		jest.restoreAllMocks();
		delete global.fetch;
	});

	test("exports source metadata", () => {
		expect(sourceName).toBe("NSW RFS");
		expect(sourceWebsite).toBe("https://www.rfs.nsw.gov.au");
	});

	test("fetches the RFS feed and returns individual features", async () => {
		global.fetch = jest.fn().mockResolvedValue({
			ok: true,
			json: jest.fn().mockResolvedValue(rfsFixture),
		});

		const result = await run();

		expect(global.fetch).toHaveBeenCalledWith(
			"https://www.rfs.nsw.gov.au/feeds/majorIncidents.json",
		);
		expect(result).toEqual(rfsFixture.features);
		expect(result).toHaveLength(rfsFixture.features.length);
	});

	test("returns an empty array when the feed has no features array", async () => {
		global.fetch = jest.fn().mockResolvedValue({
			ok: true,
			json: jest.fn().mockResolvedValue({ type: "FeatureCollection" }),
		});

		await expect(run()).resolves.toEqual([]);
	});

	test("returns an empty array when the request fails", async () => {
		jest.spyOn(console, "error").mockImplementation(() => {});
		global.fetch = jest.fn().mockRejectedValue(new Error("network down"));

		await expect(run()).resolves.toEqual([]);
		expect(console.error).toHaveBeenCalledWith(
			"RFS Collector error:",
			"network down",
		);
	});

	test("returns an empty array when the response is not successful", async () => {
		jest.spyOn(console, "error").mockImplementation(() => {});
		global.fetch = jest.fn().mockResolvedValue({
			ok: false,
			status: 503,
			json: jest.fn(),
		});

		await expect(run()).resolves.toEqual([]);
		expect(console.error).toHaveBeenCalledWith(
			"RFS Collector error:",
			"RFS request failed with status 503",
		);
	});
});

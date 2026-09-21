import { afterEach, describe, expect, jest, test } from "@jest/globals";

import tfnswFixture from "../data/tfnsw_test_json_data.json" with { type: "json" };
import {
	apiURLs,
	run,
	sourceName,
	sourceWebsite,
} from "../../data-collection/api_collectors/tfnswCollector.js";

const originalApiKey = process.env.TFNSW_API_KEY;

describe("tfnswCollector", () => {
	afterEach(() => {
		jest.restoreAllMocks();
		delete global.fetch;

		if (originalApiKey === undefined) {
			delete process.env.TFNSW_API_KEY;
		} else {
			process.env.TFNSW_API_KEY = originalApiKey;
		}
	});

	test("exports source metadata", () => {
		expect(sourceName).toBe("Transport NSW");
		expect(sourceWebsite).toBe("https://www.livetraffic.com");
		expect(apiURLs).toHaveLength(6);
	});

	test("skips collection when TFNSW_API_KEY is missing", async () => {
		delete process.env.TFNSW_API_KEY;
		jest.spyOn(console, "warn").mockImplementation(() => {});
		global.fetch = jest.fn();

		await expect(run()).resolves.toEqual([]);
		expect(global.fetch).not.toHaveBeenCalled();
		expect(console.warn).toHaveBeenCalledWith(
			"TFNSW_API_KEY not set; skipping collector",
		);
	});

	test("fetches all TFNSW endpoints with the API key and combines features", async () => {
		process.env.TFNSW_API_KEY = "test-api-key";
		global.fetch = jest.fn().mockResolvedValue({
			ok: true,
			json: jest.fn().mockResolvedValue(tfnswFixture),
		});

		const result = await run();

		expect(global.fetch).toHaveBeenCalledTimes(apiURLs.length);
		expect(global.fetch).toHaveBeenNthCalledWith(1, apiURLs[0], {
			headers: {
				Authorization: "apikey test-api-key",
				Accept: "application/json",
			},
		});
		expect(result).toHaveLength(tfnswFixture.features.length * apiURLs.length);
		expect(result.slice(0, tfnswFixture.features.length)).toEqual(
			tfnswFixture.features,
		);
	});

	test("treats endpoints without features as empty feeds", async () => {
		process.env.TFNSW_API_KEY = "test-api-key";
		global.fetch = jest.fn().mockResolvedValue({
			ok: true,
			json: jest.fn().mockResolvedValue({ type: "FeatureCollection" }),
		});

		await expect(run()).resolves.toEqual([]);
	});

	test("returns an empty array when any endpoint request fails", async () => {
		process.env.TFNSW_API_KEY = "test-api-key";
		jest.spyOn(console, "error").mockImplementation(() => {});
		global.fetch = jest.fn().mockRejectedValue(new Error("network down"));

		await expect(run()).resolves.toEqual([]);
		expect(console.error).toHaveBeenCalledWith(
			"TFNSW Collector error:",
			"network down",
		);
	});

	test("returns an empty array when any endpoint response is not successful", async () => {
		process.env.TFNSW_API_KEY = "test-api-key";
		jest.spyOn(console, "error").mockImplementation(() => {});
		global.fetch = jest.fn().mockResolvedValue({
			ok: false,
			status: 401,
			json: jest.fn(),
		});

		await expect(run()).resolves.toEqual([]);
		expect(console.error).toHaveBeenCalledWith(
			"TFNSW Collector error:",
			"TFNSW request failed with status 401",
		);
	});
});

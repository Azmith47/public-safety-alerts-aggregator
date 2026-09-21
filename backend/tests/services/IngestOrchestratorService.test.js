import { describe, expect, test } from "@jest/globals";

import { IngestOrchestratorService } from "../../services/IngestOrchestratorService.js";

describe("IngestOrchestratorService", () => {
	test("normalizes collected alerts before persistence", async () => {
		const service = new IngestOrchestratorService();

		service.registerCollector(
			"testCollector",
			async () => [{ id: "raw-alert" }],
			{
				sourceName: "Test Source",
				normalize: (alerts) =>
					alerts.map((alert) => ({
						externalId: alert.id,
						category: "TRAFFIC_INCIDENT",
					})),
			},
		);

		const entry = service.collectors.get("testCollector");
		const collectedAlerts = await entry.run();
		const normalizedAlerts = entry.normalize(collectedAlerts);

		expect(normalizedAlerts).toEqual([
			{
				externalId: "raw-alert",
				category: "TRAFFIC_INCIDENT",
			},
		]);
	});
});

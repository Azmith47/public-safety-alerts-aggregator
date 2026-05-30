import { describe, expect, test } from "@jest/globals";

import AlertPersistenceService from "../../services/AlertPersistenceService.js";

describe("AlertPersistenceService", () => {
	describe("buildAlertData", () => {
		test("maps canonical alert fields into alert table columns", () => {
			const alert = {
				title: "State of Origin Game I",
				description: "Traffic delays expected.",
				publishedAt: new Date("2026-05-27T08:00:00.000Z"),
				updatedAt: new Date("2026-05-27T09:00:00.000Z"),
				startDate: new Date("2026-05-27T07:00:00.000Z"),
				endDate: new Date("2026-05-27T12:00:00.000Z"),
				planned: true,
				isMajor: true,
				impactingNetwork: true,
				delayMinutes: 15,
				isActive: false,
				links: [
					{
						title: "Live Traffic",
						url: "https://www.livetraffic.com",
					},
				],
				rawPayload: {
					id: 123,
				},
			};

			const result = AlertPersistenceService.buildAlertData(
				alert,
				1,
				2,
				3,
				4,
				5,
			);

			expect(result).toEqual({
				title: "State of Origin Game I",
				description: "Traffic delays expected.",
				category_id: 1,
				source_id: 2,
				location_id: 3,
				status_type_id: 4,
				severity_level_id: 5,
				issued_at: "2026-05-27T08:00:00.000Z",
				updated_at: "2026-05-27T09:00:00.000Z",
				source_url: "https://www.livetraffic.com",
				planned: 1,
				is_major: 1,
				impacting_network: 1,
				delay: 15,
				start_date: "2026-05-27T07:00:00.000Z",
				end_date: "2026-05-27T12:00:00.000Z",
				is_active: 0,
				raw_payload: JSON.stringify({ id: 123 }),
			});
		});

		test("defaults canonical active state to true when omitted", () => {
			const result = AlertPersistenceService.buildAlertData(
				{
					title: "Minimal alert",
					rawPayload: {},
				},
				null,
				null,
				null,
				null,
				null,
			);

			expect(result.is_active).toBe(1);
		});
	});
});

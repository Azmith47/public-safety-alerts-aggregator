import { describe, expect, jest, test } from "@jest/globals";
import { EmailService } from "../../services/EmailService.js";

function response(body = {}) {
	return {
		ok: true,
		status: 200,
		json: jest.fn().mockResolvedValue(body),
		text: jest.fn().mockResolvedValue(""),
	};
}

describe("EmailService", () => {
	test("adds a normalized email with Mailchimp double opt-in pending status", async () => {
		const fetch = jest.fn().mockResolvedValue(response({ id: "member" }));
		const service = new EmailService({
			apiKey: "marketing-key",
			serverPrefix: "us1",
			audienceId: "audience-id",
			fetch,
		});

		await service.createPendingSubscription(" User@Example.COM ");

		expect(fetch).toHaveBeenCalledWith(
			expect.stringContaining(
				"https://us1.api.mailchimp.com/3.0/lists/audience-id/members/",
			),
			expect.objectContaining({
				method: "PUT",
				headers: expect.objectContaining({
					Authorization: "apikey marketing-key",
				}),
			}),
		);
		const request = JSON.parse(fetch.mock.calls[0][1].body);
		expect(request).toMatchObject({
			email_address: "user@example.com",
			status_if_new: "pending",
		});
	});

	test("sends one transactional digest containing every alert", async () => {
		const fetch = jest.fn().mockResolvedValue(response([]));
		const service = new EmailService({
			transactionalApiKey: "transactional-key",
			fetch,
		});

		await service.sendAlertDigest("user@example.com", [
			{ title: "Flooding", description: "Road closed" },
			{ title: "Fire", description: "Evacuate" },
		]);

		expect(fetch).toHaveBeenCalledTimes(1);
		const request = JSON.parse(fetch.mock.calls[0][1].body);
		expect(request.message.to).toEqual([
			{ email: "user@example.com", type: "to" },
		]);
		expect(request.message.subject).toBe("2 new public safety alerts");
		expect(request.message.html).toContain("Flooding");
		expect(request.message.html).toContain("Fire");
	});

	test("rejects subscription requests when Marketing API configuration is missing", async () => {
		const service = new EmailService({ fetch: jest.fn() });

		await expect(
			service.createPendingSubscription("user@example.com"),
		).rejects.toThrow("MAILCHIMP_API_KEY");
	});

	test("propagates Mailchimp API errors", async () => {
		const fetch = jest.fn().mockResolvedValue({
			ok: false,
			status: 400,
			text: jest.fn().mockResolvedValue("invalid audience"),
		});
		const service = new EmailService({ transactionalApiKey: "key", fetch });

		await expect(
			service.sendAlertDigest("user@example.com", [{ title: "Alert" }]),
		).rejects.toThrow("Mailchimp request failed (400): invalid audience");
	});
});

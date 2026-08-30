import { describe, expect, jest, test } from "@jest/globals";
import { EmailService } from "../../services/EmailService.js";

describe("EmailService", () => {
	function createService() {
		const sendMail = jest
			.fn()
			.mockResolvedValue({ messageId: "test-message" });
		return {
			service: new EmailService({
				transporter: { sendMail },
				fromEmail: "alerts@example.com",
				appUrl: "https://alerts.example.com",
			}),
			sendMail,
		};
	}

	test("sends a confirmation email with the double-opt-in link", async () => {
		const { service, sendMail } = createService();

		await service.sendConfirmationEmail("user@example.com", "token-123");

		expect(sendMail).toHaveBeenCalledWith(
			expect.objectContaining({
				to: "user@example.com",
				subject: "Confirm your public safety alert subscription",
				text: "Confirm your subscription by visiting: https://alerts.example.com/subscriptions/confirm/token-123",
			}),
		);
		expect(sendMail.mock.calls[0][0].html).toContain(
			"Confirm subscription",
		);
	});

	test("sends one digest containing every alert", async () => {
		const { service, sendMail } = createService();

		await service.sendAlertDigest("user@example.com", [
			{ title: "Flooding", description: "Road closed" },
			{ title: "Fire", description: "Evacuate" },
		]);

		expect(sendMail).toHaveBeenCalledTimes(1);
		expect(sendMail.mock.calls[0][0]).toMatchObject({
			to: "user@example.com",
			subject: "2 new public safety alerts",
		});
		expect(sendMail.mock.calls[0][0].html).toContain("Flooding");
		expect(sendMail.mock.calls[0][0].html).toContain("Fire");
	});

	test("rejects when SMTP configuration is missing", async () => {
		const service = new EmailService({});

		await expect(
			service.sendAlertDigest("user@example.com", [{ title: "Alert" }]),
		).rejects.toThrow("SMTP_HOST");
	});
});

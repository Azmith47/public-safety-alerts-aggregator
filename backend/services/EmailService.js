import crypto from "crypto";

class EmailService {
	constructor(options = {}) {
		this.fetch = options.fetch || globalThis.fetch;
		this.apiKey = options.apiKey || process.env.MAILCHIMP_API_KEY;
		this.serverPrefix =
			options.serverPrefix || process.env.MAILCHIMP_SERVER_PREFIX;
		this.audienceId =
			options.audienceId || process.env.MAILCHIMP_AUDIENCE_ID;
		this.transactionalApiKey =
			options.transactionalApiKey ||
			process.env.MAILCHIMP_TRANSACTIONAL_API_KEY;
	}

	get marketingBaseUrl() {
		return `https://${this.serverPrefix}.api.mailchimp.com/3.0`;
	}

	assertMarketingConfigured() {
		if (
			!this.fetch ||
			!this.apiKey ||
			!this.serverPrefix ||
			!this.audienceId
		) {
			throw new Error(
				"Mailchimp Marketing API is not configured: MAILCHIMP_API_KEY, MAILCHIMP_SERVER_PREFIX and MAILCHIMP_AUDIENCE_ID are required",
			);
		}
	}

	assertTransactionalConfigured() {
		if (!this.fetch || !this.transactionalApiKey) {
			throw new Error(
				"Mailchimp Transactional API is not configured: MAILCHIMP_TRANSACTIONAL_API_KEY is required",
			);
		}
	}

	async request(url, options) {
		const response = await this.fetch(url, options);
		if (!response.ok) {
			throw new Error(
				`Mailchimp request failed (${response.status}): ${await response.text()}`,
			);
		}
		return response.status === 204 ? null : response.json();
	}

	async createPendingSubscription(email) {
		this.assertMarketingConfigured();
		const normalizedEmail = email.trim().toLowerCase();
		const subscriberHash = crypto
			.createHash("md5")
			.update(normalizedEmail)
			.digest("hex");

		return this.request(
			`${this.marketingBaseUrl}/lists/${this.audienceId}/members/${subscriberHash}`,
			{
				method: "PUT",
				headers: {
					Authorization: `apikey ${this.apiKey}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email_address: normalizedEmail,
					status_if_new: "pending",
				}),
			},
		);
	}

	async sendAlertDigest(email, alerts) {
		this.assertTransactionalConfigured();
		const alertList = alerts
			.map(
				(alert) =>
					`<li><h2>${alert.title}</h2><p>${alert.description || ""}</p>${alert.source_url ? `<p><a href="${alert.source_url}">View alert details</a></p>` : ""}</li>`,
			)
			.join("");
		return this.request(
			"https://mandrillapp.com/api/1.0/messages/send.json",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					key: this.transactionalApiKey,
					message: {
						from_email: process.env.MAILCHIMP_FROM_EMAIL,
						from_name:
							process.env.MAILCHIMP_FROM_NAME ||
							"Public Safety Alerts",
						to: [{ email, type: "to" }],
						subject: `${alerts.length} new public safety alert${alerts.length === 1 ? "" : "s"}`,
						html: `<h1>New public safety alerts</h1><ul>${alertList}</ul>`,
					},
				}),
			},
		);
	}

	async sendAlertNotification(email, alert) {
		return this.sendAlertDigest(email, [alert]);
	}
}

export default new EmailService();
export { EmailService };

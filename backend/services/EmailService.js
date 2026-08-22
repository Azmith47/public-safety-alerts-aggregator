import nodemailer from "nodemailer";

class EmailService {
	constructor(options = {}) {
		this.transporter = options.transporter || null;
		this.smtpHost = options.smtpHost || process.env.SMTP_HOST;
		this.smtpPort = Number(
			options.smtpPort || process.env.SMTP_PORT || 587,
		);
		this.smtpSecure =
			options.smtpSecure ?? process.env.SMTP_SECURE === "true";
		this.smtpUser = options.smtpUser || process.env.SMTP_USER;
		this.smtpPass = options.smtpPass || process.env.SMTP_PASS;
		this.fromEmail =
			options.fromEmail || process.env.EMAIL_FROM || this.smtpUser;
		this.fromName =
			options.fromName ||
			process.env.EMAIL_FROM_NAME ||
			"Public Safety Alerts";
		this.appUrl =
			options.appUrl || process.env.APP_URL || "http://localhost:3000";
	}

	getTransporter() {
		if (this.transporter) return this.transporter;
		if (!this.smtpHost || !this.smtpUser || !this.smtpPass) {
			throw new Error(
				"SMTP is not configured: SMTP_HOST, SMTP_USER and SMTP_PASS are required",
			);
		}
		this.transporter = nodemailer.createTransport({
			host: this.smtpHost,
			port: this.smtpPort,
			secure: this.smtpSecure,
			auth: { user: this.smtpUser, pass: this.smtpPass },
		});
		return this.transporter;
	}

	async sendConfirmationEmail(email, token) {
		const confirmationUrl = `${this.appUrl}/subscriptions/confirm/${encodeURIComponent(token)}`;
		return this.getTransporter().sendMail({
			from: `"${this.fromName}" <${this.fromEmail}>`,
			to: email,
			subject: "Confirm your public safety alert subscription",
			text: `Confirm your subscription by visiting: ${confirmationUrl}`,
			html: `<p>Confirm your public safety alert subscription:</p><p><a href="${confirmationUrl}">Confirm subscription</a></p>`,
		});
	}

	async sendAlertDigest(email, alerts) {
		const alertList = alerts
			.map(
				(alert) =>
					`<li><h2>${alert.title}</h2><p>${alert.description || ""}</p>${alert.source_url ? `<p><a href="${alert.source_url}">View alert details</a></p>` : ""}</li>`,
			)
			.join("");
		return this.getTransporter().sendMail({
			from: `"${this.fromName}" <${this.fromEmail}>`,
			to: email,
			subject: `${alerts.length} new public safety alert${alerts.length === 1 ? "" : "s"}`,
			text: alerts
				.map((alert) => `${alert.title}\n${alert.description || ""}`)
				.join("\n\n"),
			html: `<h1>New public safety alerts</h1><ul>${alertList}</ul>`,
		});
	}

	async sendAlertNotification(email, alert) {
		return this.sendAlertDigest(email, [alert]);
	}
}

export default new EmailService();
export { EmailService };

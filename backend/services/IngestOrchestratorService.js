import fs from "fs";
import path from "path";

import AlertPersistenceService from "./AlertPersistenceService.js";
import SourceHealthService from "./SourceHealthService.js";
import AlertQueryService from "./AlertQueryService.js";
import { normalizeRfsFeed } from "../normalization/normalizers/rfsNormalizer.js";
import { normalizeTfnswFeed } from "../normalization/normalizers/tfnswNormalizer.js";
import SubscriptionDAO from "../database/dao/SubscriptionDAO.js";
import NotificationService from "./NotificationService.js";

import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __root = process.cwd();

const collectorNormalizers = {
	rfsCollector: normalizeRfsFeed,
	tfnswCollector: normalizeTfnswFeed,
};

export class IngestOrchestratorService {
	constructor() {
		this.collectors = new Map();
	}

	/**
	 * Register a collector function.
	 * collector: async function that returns an array of alert objects
	 * options: { sourceName, sourceWebsite }
	 */
	registerCollector(name, collectorFn, options = {}) {
		if (typeof collectorFn !== "function") {
			throw new Error("collectorFn must be a function");
		}

		this.collectors.set(name, {
			run: collectorFn,
			sourceName: options.sourceName || name,
			sourceWebsite: options.sourceWebsite || null,
			normalize: options.normalize || null,
		});
	}

	/**
	 * Load collector modules from a directory. Modules should export either:
	 * - `run` (async function) and optional `sourceName`/`sourceWebsite`, or
	 * - default export function (collector)
	 */
	async loadCollectorsFromDir(dir) {
		const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];

		for (const file of files) {
			if (!file.endsWith(".js")) continue;
			const full = path.join(dir, file);
			try {
				const mod = await import(pathToFileURL(full).href);

				let fn = null;
				let sourceName = null;
				let sourceWebsite = null;

				if (typeof mod.run === "function") {
					fn = mod.run.bind(mod);
					sourceName = mod.sourceName || path.basename(file, ".js");
					sourceWebsite = mod.sourceWebsite || null;
				} else if (typeof mod === "function") {
					fn = mod;
					sourceName = path.basename(file, ".js");
				} else if (mod && typeof mod.default === "function") {
					fn = mod.default;
					sourceName = mod.sourceName || path.basename(file, ".js");
					sourceWebsite = mod.sourceWebsite || null;
				}

				if (fn) {
					const collectorName = path.basename(file, ".js");

					this.registerCollector(collectorName, fn, {
						sourceName,
						sourceWebsite,
						normalize: collectorNormalizers[collectorName],
					});
				}
			} catch (err) {
				console.error(
					"Failed to load collector",
					full,
					err && err.message,
				);
			}
		}
	}

	/** Run a single collector by name and persist returned alerts sequentially. */
	async runCollector(name) {
		const entry = this.collectors.get(name);
		if (!entry) throw new Error(`Collector not found: ${name}`);

		const { run, sourceName, sourceWebsite, normalize } = entry;
		console.log(`Running collector: ${name}`);

		let alerts = [];
		try {
			const result = await run();
			if (!result) {
				const emptyResult = {
					source: sourceName,
					processed: 0,
					success: false,
				};
				await SourceHealthService.recordRun(
					sourceName,
					sourceWebsite,
					emptyResult,
				);
				return emptyResult;
			}
			const collectedAlerts = Array.isArray(result) ? result : [result];
			alerts =
				typeof normalize === "function"
					? normalize(collectedAlerts)
					: collectedAlerts;
		} catch (err) {
			console.error(`Collector ${name} failed:`, err && err.message);
			const failureResult = {
				source: sourceName,
				processed: 0,
				error: err.message,
				success: false,
			};
			await SourceHealthService.recordRun(
				sourceName,
				sourceWebsite,
				failureResult,
			);
			return failureResult;
		}

		let created = 0;
		let updated = 0;
		let failed = 0;

		for (const alert of alerts) {
			try {
				const res = await AlertPersistenceService.save(
					alert,
					sourceName,
					sourceWebsite,
				);
				if (res.action === "created") created++;
				if (res.action === "updated") updated++;
				if (res.action === "created") {
					const subscribers =
						await SubscriptionDAO.getMatchingForAlert(res.alertId);
					for (const subscriber of subscribers) {
						await NotificationService.enqueue(
							subscriber.user_id,
							res.alertId,
						);
					}
				}
			} catch (err) {
				console.error(
					`Failed to persist alert from ${name}:`,
					err && err.message,
				);
				failed++;
			}
		}

		const result = {
			source: sourceName,
			processed: alerts.length,
			created,
			updated,
			failed,
			success: failed === 0,
		};
		await SourceHealthService.recordRun(sourceName, sourceWebsite, result);
		return result;
	}

	/** Run all registered collectors sequentially. */
	async runAll() {
		const summary = [];

		for (const [name] of this.collectors) {
			try {
				const res = await this.runCollector(name);
				summary.push({ name, ...res });
			} catch (err) {
				summary.push({ name, error: err && err.message });
				await SourceHealthService.recordRun(name, null, {
					processed: 0,
					created: 0,
					updated: 0,
					failed: 0,
					success: false,
					error: err && err.message,
				});
			}
		}

		return summary;
	}

	/** Convenience: run collectors found in the project's data-collection folders. */
	async autodiscoverAndRun(basePath) {
		const projectRoot = basePath || __root;
		const rssDir = path.join(
			projectRoot,
			"data-collection",
			"rss_collectors",
		);
		const apiDir = path.join(
			projectRoot,
			"data-collection",
			"api_collectors",
		);

		await this.loadCollectorsFromDir(rssDir);
		await this.loadCollectorsFromDir(apiDir);

		return this.runAll();
	}

	async initialAlertDataLoad() {
		const isEmpty = await AlertQueryService.isAlertsEmpty();
		if (isEmpty) {
			console.log("Alerts table is empty, running initial data load...");
			const summary = await this.autodiscoverAndRun();
			console.log(
				"Initial data load summary:",
				JSON.stringify(summary, null, 2),
			);
		} else {
			console.log(
				"Alerts table already has data, skipping initial load.",
			);
		}
	}
}

export default new IngestOrchestratorService();

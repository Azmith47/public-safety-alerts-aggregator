import {
	beginTransaction,
	commitTransaction,
	rollbackTransaction,
} from "./db.js";

import CategoryDAO from "./dao/CategoryDAO.js";
import SeverityLevelDAO from "./dao/SeverityLevelDAO.js";
import StatusTypeDAO from "./dao/StatusTypeDAO.js";
import RegionDAO from "./dao/RegionDAO.js";
import CouncilAreaDAO from "./dao/CouncilAreaDAO.js";
import LocationDAO from "./dao/LocationDAO.js";
import {
	Categories,
	SeverityLevels,
	Statuses,
	Regions,
} from "../models/globalEnums.js";
import { normalizeRegion } from "../normalization/transformers/locationTransformer.js";

async function dedupeRegions() {
	const rows = await RegionDAO.getAll();
	const canonicalMap = new Map();
	const preferredNames = new Map(
		Object.values(Regions).map((name) => [normalizeRegion(name), name]),
	);

	for (const row of rows) {
		const rawName = String(row.name || "").trim();
		const key = normalizeRegion(rawName) || normalizeRegion(row.name);
		if (!key) continue;

		const canonicalName = preferredNames.get(key) || rawName;
		const current = canonicalMap.get(key);

		if (!current) {
			canonicalMap.set(key, { id: row.id, name: canonicalName });
			continue;
		}

		if (current.id !== row.id) {
			await RegionDAO.delete("regions", "id = ?", [row.id]);
		}
	}

	for (const [key, region] of canonicalMap.entries()) {
		const expectedName = preferredNames.get(key) || region.name;
		if (region.name !== expectedName) {
			await RegionDAO.update(
				"regions",
				{ name: expectedName },
				"id = ?",
				[region.id],
			);
		}
	}
}

async function seedCategories() {
	for (const category of Object.values(Categories)) {
		await CategoryDAO.getOrCreate(category);
	}
}

async function seedSeverityLevels() {
	for (const severity of Object.values(SeverityLevels)) {
		await SeverityLevelDAO.getOrCreate(
			severity, // TODO: Fix this to use the correct severity level value instead of the key
			severity,
		);
	}
}

async function seedStatusTypes() {
	for (const status of Object.values(Statuses)) {
		await StatusTypeDAO.getOrCreate(status);
	}
}

async function seedRegions() {
	for (const region of Object.values(Regions)) {
		await RegionDAO.getOrCreate(region);
	}
}

export async function seed() {
	await beginTransaction();

	try {
		console.log("Seeding database...");

		// -----------------------------------------
		// Categories
		// -----------------------------------------
		console.log("Seeding categories...");
		await seedCategories();
		console.log("Categories seeded.");

		// -----------------------------------------
		// Severity Levels
		// -----------------------------------------
		console.log("Seeding severity levels...");
		await seedSeverityLevels();
		console.log("Severity levels seeded.");
		// -----------------------------------------
		// Status Types
		// -----------------------------------------
		console.log("Seeding status types...");
		await seedStatusTypes();
		console.log("Status types seeded.");

		// -----------------------------------------
		// Regions
		// -----------------------------------------
		console.log("Seeding regions...");
		await dedupeRegions();
		await seedRegions();
		console.log("Regions seeded.");

		console.log("Database seeded successfully.");
		await commitTransaction();
	} catch (err) {
		console.error("Error seeding database:", err);
		await rollbackTransaction();
	}
}

export default seed;

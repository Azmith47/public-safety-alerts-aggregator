import {
	beginTransaction,
	commitTransaction,
	rollbackTransaction,
} from "./db.js";

import CouncilAreaDAO from "./dao/CouncilAreaDAO.js";
import LocationDAO from "./dao/LocationDAO.js";
import RegionDAO from "./dao/RegionDAO.js";
import {
	normalizeLGAKey,
	normalizeLGAName,
	normalizeLocationName,
	normalizeRegion,
	resolveCanonicalLGA,
	resolveRegionFromLGA,
	normalizePostcode,
	normalizeString,
} from "../normalization/transformers/locationTransformer.js";

import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { parse } from "csv-parse";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "./seeds/nsw-spatial.csv");

async function loadCsv(filePath) {
	return new Promise((resolve, reject) => {
		const rows = [];

		fs.createReadStream(filePath)
			.pipe(
				parse({
					columns: true,
					skip_empty_lines: true,
					trim: true,
				}),
			)
			.on("data", (row) => rows.push(row))
			.on("end", () => resolve(rows))
			.on("error", reject);
	});
}

function createSuburbMap(rows) {
	const suburbMap = new Map();

	for (const row of rows) {
		const suburbName = normalizeLocationName(row.suburbname);

		const councilRaw = String(row.councilname || "").trim();
		const councilName = normalizeLGAName(councilRaw);
		const councilKey = normalizeLGAKey(councilRaw);

		const postcode = normalizePostcode(row.postcode);

		const percentage = Number(row.percentage || 0);

		if (!postcode) {
			continue;
		}

		if (!suburbName || !councilName) {
			continue;
		}

		const suburbKey = `${suburbName}_${postcode}`;

		const existing = suburbMap.get(suburbKey);

		// Keep highest percentage match
		if (!existing || percentage > existing.percentage) {
			suburbMap.set(suburbKey, {
				suburbName,
				councilRaw,
				councilName,
				councilKey,
				postcode,
				percentage,
			});
		}
	}
	return suburbMap;
}

async function importCouncilAreas(suburbMap) {
	let insertedCouncils = 0;
	let unmatchedRegions = 0;

	// Map existing council areas by normalized key -> id
	const councilRows = await CouncilAreaDAO.getAll();
	const councilMap = new Map(
		councilRows.map((row) => [normalizeLGAKey(row.name), row.id]),
	);

	// Map regions by normalized name -> id for robust matching
	const regionRows = await RegionDAO.getAll();
	const regionMap = new Map(
		regionRows.map((row) => [normalizeRegion(row.name), row.id]),
	);

	if (regionMap.size === 0) {
		throw new Error(
			"No regions found in database. Please seed regions before importing spatial data.",
		);
	}

	for (const suburb of suburbMap.values()) {
		let regionId = null;

		// Use normalized key to check existing council
		const cKey = suburb.councilKey;

		if (!councilMap.has(cKey)) {
			// Try to resolve canonical seed LGA name (fuzzy)
			const canonicalLGA = resolveCanonicalLGA(suburb.councilName);

			const regionName = resolveRegionFromLGA(canonicalLGA);

			if (!regionName) {
				unmatchedRegions++;
				console.warn(
					`Unable to resolve NSW region for council area: ${suburb.councilRaw}`,
				);
			}

			regionId = regionMap.get(normalizeString(regionName));

			const canonicalNameToCreate =
				canonicalLGA || normalizeLGAKey(suburb.councilName);

			const council = await CouncilAreaDAO.getOrCreate(
				canonicalNameToCreate,
				regionId,
			);

			if (council.created) {
				insertedCouncils++;
			}

			// store using normalized key
			councilMap.set(cKey, council.id);
		}
	}
	console.log(`Unmatched regions: ${unmatchedRegions}`);
	console.log(`Inserted ${insertedCouncils} new council areas`);
	return councilMap;
}

async function importLocations(suburbMap, councilMap) {
	let insertedLocations = 0;

	for (const suburb of suburbMap.values()) {
		const councilAreaId = councilMap.get(suburb.councilKey);

		const result = await LocationDAO.getOrCreate(
			suburb.suburbName,
			suburb.postcode,
			councilAreaId,
		);
		if (result.created) {
			insertedLocations++;
		}
	}
	return insertedLocations;
}

export async function importSpatialData() {
	await beginTransaction();

	try {
		console.log("Loading nsw-spatial csv file...");

		const rows = await loadCsv(filePath);

		console.log(`Loaded ${rows.length} rows`);

		// -----------------------------------------
		// Step 1
		// -----------------------------------------

		const suburbMap = await createSuburbMap(rows);

		console.log(`Total of ${suburbMap.size} unique suburbs`);

		// -----------------------------------------
		// Step 2
		// -----------------------------------------

		const councilMap = await importCouncilAreas(suburbMap);

		console.log(
			`Total ${councilMap.size} council areas in database after import`,
		);

		// -----------------------------------------
		// Step 3
		// -----------------------------------------

		const insertedLocations = await importLocations(suburbMap, councilMap);

		console.log(`Inserted ${insertedLocations} locations`);

		// -----------------------------------------
		// COMMIT
		// -----------------------------------------

		await commitTransaction();

		console.log("Spatial import completed.");
	} catch (err) {
		// -----------------------------------------
		// ROLLBACK
		// -----------------------------------------

		await rollbackTransaction();

		console.error("Import failed. Rolled back transaction.");

		throw err;
	}
}

export default importSpatialData;

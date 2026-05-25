import XLSX from "xlsx";
import path from "path";
import { fileURLToPath } from 'url'


import {
    beginTransaction,
    commitTransaction,
    rollbackTransaction
} from "./db.js";

import CouncilAreaDAO from "./dao/CouncilAreaDAO.js";
import LocationDAO from "./dao/LocationDAO.js";
import RegionDAO from "./dao/RegionDAO.js";
import lgaRegionMap from "./seeds/lgaRegionMap.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function normalizeString(str) {
    return String(str || "")
        .trim()
        .replace(/\s+/g, " ")
        .toUpperCase();
}

function normalizeLGAName(name) {
    let s = String(name || "").trim();

    // early return for Unincorporated
    if (/^unincorporated/i.test(s)) return "";

    // Normalize common verbose forms
    s = s.replace(/^the\s+council\s+of\s+the\s+/i, "");
    s = s.replace(/^the\s+council\s+of\s+/i, "");
    s = s.replace(/^council\s+of\s+the\s+/i, "");
    s = s.replace(/^council\s+of\s+/i, "");
    s = s.replace(/^municipality\s+of\s+/i, "");
    s = s.replace(/^(city|shire|municipality|municipal|regional|council)\s+of\s+/i, "");

    // Remove trailing administrative words like 'Shire', 'City', 'Council', etc.
    s = s.replace(/\s+(shire|city|municipality|municipal|regional|council)\b/gi, "");

    // Remove stray ' of ' occurrences (e.g. 'Shire of Hornsby' -> 'Hornsby')
    s = s.replace(/\s+of\s+/gi, " ");

    // Remove punctuation and repeated whitespace
    s = s.replace(/[\,\'\`\"\:\.]/g, "");
    s = s.replace(/\s+/g, " ").trim();

    return s;
}

function findCanonicalSeedName(councilKey) {
    // exact match
    if (normalizedSeedLgaMap.has(councilKey)) return normalizedSeedLgaMap.get(councilKey);

    // try substring matches: seed contains councilKey or councilKey contains seed
    for (const [seedKeyNormalized, canonical] of normalizedSeedLgaMap.entries()) {
        if (!seedKeyNormalized) continue;
        if (seedKeyNormalized.includes(councilKey) || councilKey.includes(seedKeyNormalized)) {
            return canonical;
        }
        // also try removing common trailing words from councilKey and retry
    }

    // try removing words like VALLEY, PLAINS, HILLS and retry
    const stripped = councilKey.replace(/\b(VALLEY|PLAINS|HILLS|REGIONAL|REGION|DISTRICT)\b/g, "").replace(/\s+/g, " ").trim();
    if (stripped && normalizedSeedLgaMap.has(stripped)) return normalizedSeedLgaMap.get(stripped);
    for (const [seedKeyNormalized, canonical] of normalizedSeedLgaMap.entries()) {
        if (seedKeyNormalized.includes(stripped) || stripped.includes(seedKeyNormalized)) return canonical;
    }

    return null;
}

function normalizeLGAKey(name) {
    // Normalized key used for matching: applies LGA-specific cleaning then uppercase/spaces normalized
    return normalizeString(normalizeLGAName(String(name || "")));
}

// Build a map of normalized LGA keys -> canonical LGA name from the seed file
const normalizedSeedLgaMap = (() => {
    const map = new Map();
    for (const key of Object.keys(lgaRegionMap)) {
        const k = normalizeLGAKey(key);
        map.set(k, key);
    }
    return map;
})();

async function loadSpreadsheet() {
    const workbook = XLSX.readFile(
        path.join(__dirname, "./seeds/nsw-spatial.csv")
    );

    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(worksheet);

    return rows;
}

async function createSuburbMap(rows) {
    const suburbMap = new Map();

    for (const row of rows) {


        const suburbName = normalizeString(row.suburbname);

        const councilRaw = String(row.councilname || "").trim();
        const councilName = normalizeLGAName(councilRaw);
        const councilKey = normalizeLGAKey(councilRaw);

        const postcode = normalizeString(row.postcode);

        const percentage = Number(row.percentage || 0);

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
                percentage
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
    const councilMap = new Map(councilRows.map(row => [normalizeLGAKey(row.name), row.id]));

    // Map regions by normalized name -> id for robust matching
    const regionRows = await RegionDAO.getAll();
    const regionMap = new Map(regionRows.map(row => [normalizeString(row.name), row.id]));

    if (regionMap.size === 0) {
        throw new Error(
            "No regions found in database. Please seed regions before importing spatial data."
        );
    }

    for (const suburb of suburbMap.values()) {
        let regionId = null;

        // Use normalized key to check existing council
        const cKey = suburb.councilKey;

        if (!councilMap.has(cKey)) {

            // Try to resolve canonical seed LGA name (fuzzy)
            const canonicalSeedName = findCanonicalSeedName(cKey);
            let regionName = null;

            if (canonicalSeedName) {
                regionName = lgaRegionMap[canonicalSeedName];
            } else {
                // fallback to using the cleaned council name as present in CSV
                regionName = lgaRegionMap[suburb.councilName] || null;
                // if still not found, try using a fuzzy lookup from the cleaned councilName
                if (!regionName) {
                    const tryFromClean = findCanonicalSeedName(normalizeLGAKey(suburb.councilName));
                    if (tryFromClean) regionName = lgaRegionMap[tryFromClean];
                }
            }

            if (!regionName) {
                    unmatchedRegions++;
                    console.warn(`No region found for council: ${suburb.councilRaw}`);
                }


            regionId = regionMap.get(normalizeString(regionName));

            const canonicalNameToCreate = canonicalSeedName || suburb.councilName;

            const council = await CouncilAreaDAO.getOrCreate(canonicalNameToCreate, regionId);
            
            if (council.created) {
                insertedCouncils++;
            }
            
            // store using normalized key
            councilMap.set(cKey, council.id);
        }
    }
    console.log(
        `Unmatched regions: ${unmatchedRegions}`
    );
    console.log(
        `Inserted ${insertedCouncils} new council areas`
    );
    return councilMap;
}

async function importLocations(suburbMap, councilMap) {
    let insertedLocations = 0;

    for (const suburb of suburbMap.values()) {

        const councilAreaId = councilMap.get(suburb.councilKey);

        const result = await LocationDAO.getOrCreate(
            suburb.suburbName,
            suburb.postcode,
            councilAreaId
        );
        if (result.created) {
            insertedLocations++;
        }
        
    }
    return insertedLocations;
}


async function importSpatialData() {

    await beginTransaction();

    try {

        console.log("Loading spreadsheet...");

        const rows = await loadSpreadsheet();

        console.log(`Loaded ${rows.length} rows`);

        // -----------------------------------------
        // Step 1
        // -----------------------------------------

        const suburbMap =
            await createSuburbMap(rows);

        console.log(
            `Total of ${suburbMap.size} unique suburbs`
        );

        // -----------------------------------------
        // Step 2
        // -----------------------------------------

        const councilMap =
            await importCouncilAreas(suburbMap);

        console.log(
            `Total ${councilMap.size} council areas in database after import`
        );

        // -----------------------------------------
        // Step 3
        // -----------------------------------------

        const insertedLocations =
            await importLocations(
                suburbMap,
                councilMap
            );

        console.log(
            `Inserted ${insertedLocations} locations`
        );

        // -----------------------------------------
        // COMMIT
        // -----------------------------------------

        await commitTransaction();

        console.log(
            "Spatial import completed."
        );

    } catch (err) {

        // -----------------------------------------
        // ROLLBACK
        // -----------------------------------------

        await rollbackTransaction();

        console.error(
            "Import failed. Rolled back transaction."
        );

        throw err;
    }
}

export default { importSpatialData };


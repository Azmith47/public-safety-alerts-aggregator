const XLSX = require("xlsx");
const path = require("path");

const CouncilAreaDAO = require("./dao/CouncilAreaDAO");
const LocationDAO = require("./dao/LocationDAO");
const RegionDAO = require("./dao/RegionDAO");

const lgaRegionMap =
    require("./seeds/lgaRegionMap");
const RegionDAO = require("./dao/RegionDAO");

function normalizeString(str) {
    return String(str || "")
        .trim()
        .replace(/\s+/g, " ")
        .toUpperCase();
}

function normalizeLGAName(name) {
    return String(name || "")
        // Removes 'Unincorporated -' from the beginning
        .replace(/^Unincorporated\s*-\s*/i, "")
        // Removes 'Regional', 'Shire', or 'Council' only if they appear at the end
        .replace(/\b(Regional|Shire|Council)\b$/gi, "")
        // Cleans up extra spaces
        .replace(/\s+/g, " ")
        .trim();
}


async function importSpatialData() {

    console.log("Loading spreadsheet...");

    const workbook = XLSX.readFile(
        path.join(__dirname, "./seeds/nsw-spatial.xlsx")
    );

    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(worksheet);

    console.log(`Loaded ${rows.length} rows`);

    // -------------------------------------------------
    // Step 1:
    // Deduplicate suburbs using highest percentage
    // -------------------------------------------------

    const suburbMap = new Map();

    for (const row of rows) {

        const suburbName =
            normalizeString(row.suburbname);

        const councilName =
            normalizeLGAName(row.councilname);

        const postcode =
            normalizeString(row.postcode);

        const percentage =
            Number(row.percentage || 0);

        if (!suburbName || !councilName) {
            continue;
        }

        const suburbKey =
            `${suburbName}_${postcode}`;

        const existing =
            suburbMap.get(suburbKey);

        // Keep highest percentage match
        if (!existing || percentage > existing.percentage) {

            suburbMap.set(suburbKey, {
                suburbName,
                councilName,
                postcode,
                percentage
            });
        }
    }

    console.log(
        `Reduced to ${suburbMap.size} unique suburbs`
    );

    // -------------------------------------------------
    // Step 2:
    // Insert council areas
    // -------------------------------------------------

    const councilMap = new Map();
    const regionMap = new Map( 
        await RegionDAO.getAll().then(rows => 
            rows.map(row => [row.name, row.id])) );

    for (const suburb of suburbMap.values()) {
        let regionId = null;

        if (!councilMap.has(suburb.councilName)) {

            const regionName =
                lgaRegionMap[suburb.councilName] || null;
            
            if (!regionName) {
                console.warn(
                    `No region found for council: ${suburb.councilName}`
                );
            }

            regionId = regionMap.get(regionName);

            const councilId =
                await CouncilAreaDAO.getOrCreate(
                    suburb.councilName,
                    regionId,
                );

            councilMap.set(
                suburb.councilName,
                councilId
            );
        }
    }

    console.log(
        `Inserted ${councilMap.size} council areas`
    );

    // -------------------------------------------------
    // Step 3:
    // Insert locations
    // -------------------------------------------------

    let insertedLocations = 0;

    for (const suburb of suburbMap.values()) {

        const councilAreaId =
            councilMap.get(suburb.councilName);

        await LocationDAO.getOrCreate(
            suburb.suburbName,
            suburb.postcode,
            councilAreaId
        );

        insertedLocations++;
    }

    console.log(
        `Inserted ${insertedLocations} locations`
    );

    console.log("Spatial import completed.");
}

importSpatialData()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
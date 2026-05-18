const CategoryDAO = require("./dao/CategoryDAO");
const SeverityLevelDAO = require("./dao/SeverityLevelDAO");
const StatusTypeDAO = require("./dao/StatusTypeDAO");
const RegionDAO = require("./dao/RegionDAO");
const CouncilAreaDAO = require("./dao/CouncilAreaDAO");
const LocationDAO = require("./dao/LocationDAO");

const categories =
    require("./seeds/categories");

const severityLevels =
    require("./seeds/severityLevels");

const statusTypes =
    require("./seeds/statusTypes");

const regions =
    require("./seeds/regions");

/*
const councilAreas =
    require("./seeds/councilAreas");

const locations =
    require("./seeds/locations");
*/

async function seed() {

    console.log("Seeding database...");

    // -----------------------------------------
    // Categories
    // -----------------------------------------

    for (const category of categories) {

        await CategoryDAO.getOrCreate(
            category
        );
    }

    // -----------------------------------------
    // Severity Levels
    // -----------------------------------------

    for (const severity of severityLevels) {

        await SeverityLevelDAO.getOrCreate(
            severity.name,
            severity.description
        );
    }

    // -----------------------------------------
    // Status Types
    // -----------------------------------------

    for (const status of statusTypes) {

        await StatusTypeDAO.getOrCreate(
            status
        );
    }

    // -----------------------------------------
    // Regions
    // -----------------------------------------

    const regionMap = {};

    for (const region of regions) {

        const regionId =
            await RegionDAO.getOrCreate(
                region
            );

        regionMap[region] = regionId;
    }

    // -----------------------------------------
    // Council Areas
    // -----------------------------------------

    /* 
    const councilAreaMap = {}; 

    for (const councilArea of councilAreas) {

        const regionId =
            regionMap[councilArea.region];

        const councilAreaId =
            await CouncilAreaDAO.getOrCreate(
                councilArea.name,
                regionId
            );

        councilAreaMap[
            councilArea.name
        ] = councilAreaId;
    }

    // -----------------------------------------
    // Locations
    // -----------------------------------------

    for (const location of locations) {

        const councilAreaId =
            councilAreaMap[
                location.councilArea
            ];

        await LocationDAO.getOrCreate(
            location.name,
            location.postcode,
            councilAreaId
        );
    }
    */

    console.log("Database seeded successfully.");
}

seed()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
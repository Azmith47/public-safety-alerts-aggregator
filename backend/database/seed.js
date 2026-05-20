const {
    beginTransaction,
    commitTransaction,
    rollbackTransaction
} = require("./db");

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

async function seedCategories() {
    for (const category of categories) {

        await CategoryDAO.getOrCreate(
            category
        );
    }
}

async function seedSeverityLevels() {
    for (const severity of severityLevels) {

        await SeverityLevelDAO.getOrCreate(
            severity.name,
            severity.description
        );
    }
}

async function seedStatusTypes() {
    for (const status of statusTypes) {

        await StatusTypeDAO.getOrCreate(
            status
        );
    }
}

async function seedRegions() {
    for (const region of regions) {

        await RegionDAO.getOrCreate(
            region
        );
    }
}


async function seed() {
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
        await seedRegions();
        console.log("Regions seeded.");

        console.log("Database seeded successfully.");
        await commitTransaction();
    } catch (err) {
        console.error("Error seeding database:", err);
        await rollbackTransaction();
    }
}

module.exports = {seed};

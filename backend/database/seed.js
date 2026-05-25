import {
    beginTransaction,
    commitTransaction,
    rollbackTransaction
} from "./db.js";

import CategoryDAO from "./dao/CategoryDAO.js";
import SeverityLevelDAO from "./dao/SeverityLevelDAO.js";
import StatusTypeDAO from "./dao/StatusTypeDAO.js";
import RegionDAO from "./dao/RegionDAO.js";
import CouncilAreaDAO from "./dao/CouncilAreaDAO.js";
import LocationDAO from "./dao/LocationDAO.js";
import categories from "./seeds/categories.js";
import severityLevels from  "./seeds/severityLevels.js";
import statusTypes from "./seeds/statusTypes.js";
import regions from "./seeds/regions.js";

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

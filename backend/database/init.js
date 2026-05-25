import fs from "fs";
import path from "path";

import {
    db,
    exec,    
    beginImmediateTransaction,
    commitTransaction,
} from "./db.js";
import {seed} from "./seed.js";
import {importSpatialData} from "./importSpatialData.js";
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function initializeDatabase() {

    try {

        const sqlSchemaPath =
            path.join(__dirname, "schema/schema.sql");

        const sqlSchema =
            fs.readFileSync(sqlSchemaPath, "utf8");
        
        const sqlIndexesPath = 
            path.join(__dirname, "indexes/indexes.sql");

        const sqlIndexes = 
            fs.readFileSync(sqlIndexesPath, "utf-8");

        await exec("PRAGMA foreign_keys = OFF");
        await beginImmediateTransaction();

        await exec(sqlSchema);

        await exec(sqlIndexes);

        await commitTransaction();
        await exec("PRAGMA foreign_keys = ON");

        console.log(
            "Database schema created successfully."
        );

        await seed();
        await importSpatialData();
        
        console.log("Database initialization completed successfully.");

    } catch (err) {

        console.error(
            "Error during database initialization:",
            err.message
        );
        process.exit(1);

    } finally {

        db.close();
    }
}

initializeDatabase();
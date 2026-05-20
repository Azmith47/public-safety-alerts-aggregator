const fs = require("fs");
const path = require("path");

const {
    db,
    exec,    
    beginImmediateTransaction,
    commitTransaction,
} = require("./db");

const {seed} = require("./seed")
const {importSpatialData} = require("./importSpatialData");

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
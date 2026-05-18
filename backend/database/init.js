const fs = require("fs");
const path = require("path");
const db = require("./db");

const sqlPath = path.join(__dirname, "init.sql");

const sql = fs.readFileSync(sqlPath, "utf8");

db.exec(sql, (err) => {
    if (err) {
        console.error("Error creating tables:", err.message);
    } else {
        console.log("Database schema created successfully.");
    }

    db.close();
});
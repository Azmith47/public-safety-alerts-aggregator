import { all, db, exec } from "./db.js";

async function columnExists(tableName, columnName) {
	const columns = await all(`PRAGMA table_info(${tableName})`);
	return columns.some((column) => column.name === columnName);
}

async function addColumnIfMissing(tableName, columnName, definition) {
	if (await columnExists(tableName, columnName)) {
		return;
	}

	await exec(
		`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`,
	);
}

export async function migrateDatabase() {
	await addColumnIfMissing("alerts", "is_active", "INTEGER DEFAULT 1");

	await addColumnIfMissing(
		"alert_polygons",
		"polygon_index",
		"INTEGER DEFAULT 0",
	);
	await addColumnIfMissing(
		"alert_polygons",
		"ring_index",
		"INTEGER DEFAULT 0",
	);

	await addColumnIfMissing("alert_roads", "location_qualifier", "TEXT");
	await addColumnIfMissing("alert_roads", "condition_tendency", "TEXT");
	await addColumnIfMissing("alert_roads", "delay", "TEXT");
	await addColumnIfMissing("alert_roads", "queue_length", "REAL");
	await addColumnIfMissing("alert_roads", "traffic_volume", "TEXT");
	await addColumnIfMissing("alert_roads", "impacted_lanes", "TEXT");

	await exec(`
		CREATE TABLE IF NOT EXISTS alert_fire_details (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			alert_id INTEGER NOT NULL UNIQUE,
			fire_type TEXT,
			fire_size REAL,
			containment_status TEXT,
			responsible_agency TEXT,

			FOREIGN KEY (alert_id) REFERENCES alerts(id)
		);
	`);

	await exec(`
		CREATE TABLE IF NOT EXISTS alert_polylines (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			alert_id INTEGER NOT NULL,
			line_index INTEGER DEFAULT 0,
			point_order INTEGER,
			latitude REAL,
			longitude REAL,

			FOREIGN KEY (alert_id) REFERENCES alerts(id)
		);
	`);
}

if (process.argv[1] && process.argv[1].endsWith("migrate.js")) {
	try {
		await migrateDatabase();
		console.log("Database migration completed successfully.");
	} catch (err) {
		console.error("Database migration failed:", err.message);
		process.exitCode = 1;
	} finally {
		db.close();
	}
}

import sqlite3 from "better-sqlite3";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const db = sqlite3(path.join(__dirname, "database.sqlite"), {
	// verbose: console.log, // Comment out if logs aren't needed
});

db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");
db.pragma("synchronous = NORMAL");

export function run(sql, params = []) {
	const stmt = db.prepare(sql);
	return stmt.run(params); // Returns { changes: 1, lastInsertRowid: 1 }
}

export function get(sql, params = []) {
	const stmt = db.prepare(sql);
	return stmt.get(params); // Returns a single row object or undefined
}

export function all(sql, params = []) {
	const stmt = db.prepare(sql);
	return stmt.all(params); // Returns an array of row objects
}

export function exec(sql) {
	db.exec(sql); // Executes multi-line raw SQL strings
}

// -----------------------------------------
// Transaction Helpers
// -----------------------------------------

export function beginImmediateTransaction() {
	db.prepare("BEGIN IMMEDIATE").run();
}

export function beginTransaction() {
	db.prepare("BEGIN").run();
}

export function commitTransaction() {
	db.prepare("COMMIT").run();
}

export function rollbackTransaction() {
	db.prepare("ROLLBACK").run();
}

export default db;

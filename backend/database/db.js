import sqlite3 from "sqlite3";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

sqlite3.verbose();

export const db = new sqlite3.Database(path.join(__dirname, "database.sqlite"));

db.serialize(() => {
	db.run("PRAGMA foreign_keys = ON");
	db.run("PRAGMA journal_mode = WAL");
	db.run("PRAGMA synchronous = NORMAL");
});

export function run(sql, params = []) {
	return new Promise((resolve, reject) => {
		db.run(sql, params, function (err) {
			if (err) {
				reject(err);
			} else {
				resolve(this);
			}
		});
	});
}

export function get(sql, params = []) {
	return new Promise((resolve, reject) => {
		db.get(sql, params, (err, row) => {
			if (err) {
				reject(err);
			} else {
				resolve(row);
			}
		});
	});
}

export function all(sql, params = []) {
	return new Promise((resolve, reject) => {
		db.all(sql, params, (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
}

export function exec(sql) {
	return new Promise((resolve, reject) => {
		db.exec(sql, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

// -----------------------------------------
// Transaction Helpers
// -----------------------------------------

export async function beginImmediateTransaction() {
	await run("BEGIN IMMEDIATE TRANSACTION");
}

export async function beginTransaction() {
	await run("BEGIN TRANSACTION");
}

export async function commitTransaction() {
	await run("COMMIT");
}

export async function rollbackTransaction() {
	await run("ROLLBACK");
}

export default db;

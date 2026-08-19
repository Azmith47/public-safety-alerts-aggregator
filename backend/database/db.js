<<<<<<< Updated upstream
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(
    path.join(__dirname, "database.sqlite")
);

db.serialize(() => {
    db.run("PRAGMA foreign_keys = ON");

    db.run("PRAGMA journal_mode = WAL");

    db.run("PRAGMA synchronous = NORMAL");
});

function run(sql, params = []) {

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

function get(sql, params = []) {

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

function all(sql, params = []) {

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

function exec(sql) {

    return new Promise((resolve, reject) => {

        db.exec(sql, (err) => {

            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
=======
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
>>>>>>> Stashed changes
}

// -----------------------------------------
// Transaction Helpers
// -----------------------------------------

<<<<<<< Updated upstream
async function beginImmediateTransaction() {
    await run("BEGIN IMMEDIATE TRANSACTION");
}

async function beginTransaction() {
    await run("BEGIN TRANSACTION");
}

async function commitTransaction() {
    await run("COMMIT");
}

async function rollbackTransaction() {
    await run("ROLLBACK");
}

module.exports = {
    db,
    run,
    get,
    all,
    exec,
    beginImmediateTransaction,
    beginTransaction,
    commitTransaction,
    rollbackTransaction
};
=======
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
>>>>>>> Stashed changes

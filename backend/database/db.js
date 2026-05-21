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
}

// -----------------------------------------
// Transaction Helpers
// -----------------------------------------

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
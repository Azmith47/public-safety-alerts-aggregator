import {
	run,
	get as getRow,
	all as allRows,
	beginTransaction,
	commitTransaction,
	rollbackTransaction,
} from "../db.js";

class BaseDAO {
	constructor(tableName) {
		this.tableName = tableName;
	}

	async run(sql, params = []) {
		// 1. Call the synchronous function directly
		const result = run(sql, params);

		// 2. Return a plain object using 'lastInsertRowid'
		return {
			id: result.lastInsertRowid,
			changes: result.changes,
		};
	}

	get(sql, params = []) {
		return getRow(sql, params);
	}

	all(sql, params = []) {
		return allRows(sql, params);
	}

	findOne(table, whereClause, params = [], select = "*") {
		return this.get(
			`SELECT ${select} FROM ${table} WHERE ${whereClause}`,
			params,
		);
	}

	findAll(table, whereClause = "1=1", params = [], orderBy = "") {
		const orderClause = orderBy ? ` ORDER BY ${orderBy}` : "";
		return this.all(
			`SELECT * FROM ${table} WHERE ${whereClause}${orderClause}`,
			params,
		);
	}

	exists(table, whereClause, params = []) {
		return this.get(
			`SELECT 1 FROM ${table} WHERE ${whereClause} LIMIT 1`,
			params,
		).then((row) => !!row);
	}

	insert(table, data) {
		const columns = Object.keys(data);
		const placeholders = columns.map(() => "?").join(", ");
		const values = columns.map((column) =>
			this.serializeValue(data[column]),
		);

		return this.run(
			`INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`,
			values,
		);
	}

	update(table, data, whereClause, whereParams = []) {
		const columns = Object.keys(data);
		const setClause = columns.map((column) => `${column} = ?`).join(", ");
		const values = columns
			.map((column) => this.serializeValue(data[column]))
			.concat(whereParams);

		return this.run(
			`UPDATE ${table} SET ${setClause} WHERE ${whereClause}`,
			values,
		);
	}

	serializeValue(value) {
		if (value instanceof Date) {
			return value.toISOString();
		}

		if (typeof value === "boolean") {
			return value ? 1 : 0;
		}

		return value;
	}

	delete(table, whereClause, params = []) {
		return this.run(`DELETE FROM ${table} WHERE ${whereClause}`, params);
	}

	async transaction(callback) {
		let lastError;
		for (let attempt = 0; attempt < 3; attempt++) {
			try {
				await beginTransaction();
				lastError = null;
				break;
			} catch (error) {
				lastError = error;
				if (
					!String(error.message).includes("database is locked") ||
					attempt === 2
				) {
					throw error;
				}
				await new Promise((resolve) =>
					setTimeout(resolve, 250 * (attempt + 1)),
				);
			}
		}
		if (lastError) throw lastError;

		try {
			const result = await callback();
			await commitTransaction();
			return result;
		} catch (error) {
			await rollbackTransaction();
			throw error;
		}
	}
}

export default BaseDAO;

import { describe, expect, jest, test } from "@jest/globals";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

jest.unstable_mockModule("uuid", () => ({ v4: () => "test-uuid" }));

const baseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const skipFiles = new Set([
	path.join(baseDir, "server.js"),
	path.join(baseDir, "database", "init.js"),
]);

function collectJsFiles(directory) {
	return fs
		.readdirSync(directory, { withFileTypes: true })
		.flatMap((entry) => {
			const fullPath = path.join(directory, entry.name);
			if (entry.isDirectory()) {
				if (
					entry.name === "node_modules" ||
					entry.name === "tests" ||
					entry.name === "seeds"
				)
					return [];
				return collectJsFiles(fullPath);
			}
			if (
				entry.isFile() &&
				entry.name.endsWith(".js") &&
				!skipFiles.has(fullPath)
			) {
				return [fullPath];
			}
			return [];
		});
}

const files = collectJsFiles(baseDir);

describe("Backend modules", () => {
	test.each(files)("should import %s without throwing", async (filePath) => {
		const loaded = await import(pathToFileURL(filePath).href);
		expect(loaded).toBeDefined();
	});
});

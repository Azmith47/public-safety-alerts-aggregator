jest.mock("uuid", () => ({ v4: () => "test-uuid" }));

const fs = require("fs");
const path = require("path");

const baseDir = path.join(__dirname, "..");
const skipFiles = new Set([
    path.join(baseDir, "server.js"),
    path.join(baseDir, "database", "init.js")
]);

function collectJsFiles(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === "node_modules" || entry.name === "tests") return [];
            return collectJsFiles(fullPath);
        }
        if (entry.isFile() && entry.name.endsWith(".js") && !skipFiles.has(fullPath)) {
            return [fullPath];
        }
        return [];
    });
}

const files = collectJsFiles(baseDir);

describe("Backend modules", () => {
    test.each(files)("should require %s without throwing", (filePath) => {
        const relativePath = `./${path.relative(__dirname, filePath).replace(/\\/g, "/")}`;
        const loaded = require(relativePath);
        expect(loaded).toBeDefined();
    });
});

jest.mock("../../database/db.js", () => ({
    run: jest.fn(),
    get: jest.fn(),
    all: jest.fn(),
    beginTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn()
}));

import LocationDAO from "../../database/dao/LocationDAO.js";
import { get, run, all } from "../../database/db.js";

describe("LocationDAO", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("getOrCreate returns existing record when found", async () => {
        get.mockResolvedValue({ id: 17, name: "Test" });

        const result = await LocationDAO.getOrCreate("Test", "2000", 3);

        expect(get).toHaveBeenCalledWith(
            "SELECT * FROM locations WHERE name = ?",
            ["Test"]
        );
        expect(result).toEqual({ id: 17, created: false });
    });

    test("getOrCreate inserts new location when missing", async () => {
        get.mockResolvedValue(null);
        run.mockResolvedValue({ lastID: 22, changes: 1 });

        const result = await LocationDAO.getOrCreate("Newtown", "2042", 5);

        expect(run).toHaveBeenCalledWith(
            "INSERT INTO locations (name, postcode, council_area_id) VALUES (?, ?, ?)",
            ["Newtown", "2042", 5]
        );
        expect(result).toEqual({ id: 22, created: true });
    });

    test("getAll returns location rows ordered by name", async () => {
        all.mockResolvedValue([{ id: 1, name: "A" }, { id: 2, name: "B" }]);

        const rows = await LocationDAO.getAll();

        expect(all).toHaveBeenCalledWith(
            "SELECT * FROM locations WHERE 1=1 ORDER BY name",
            []
        );
        expect(rows).toEqual([{ id: 1, name: "A" }, { id: 2, name: "B" }]);
    });
});

jest.mock("../../database/dao/CategoryDAO.js", () => ({ getOrCreate: jest.fn() }));
jest.mock("../../database/dao/SourceDAO.js", () => ({ getOrCreate: jest.fn() }));
jest.mock("../../database/dao/StatusTypeDAO.js", () => ({ getOrCreate: jest.fn() }));
jest.mock("../../database/dao/SeverityLevelDAO.js", () => ({ getOrCreate: jest.fn() }));
jest.mock("../../database/dao/RegionDAO.js", () => ({ getOrCreate: jest.fn() }));
jest.mock("../../database/dao/CouncilAreaDAO.js", () => ({ getOrCreate: jest.fn() }));
jest.mock("../../database/dao/LocationDAO.js", () => ({ getOrCreate: jest.fn() }));

import CategoryDAO from "../../database/dao/CategoryDAO.js";
import SourceDAO from "../../database/dao/SourceDAO.js";
import StatusTypeDAO from "../../database/dao/StatusTypeDAO.js";
import SeverityLevelDAO from "../../database/dao/SeverityLevelDAO.js";
import RegionDAO from "../../database/dao/RegionDAO.js";
import CouncilAreaDAO from "../../database/dao/CouncilAreaDAO.js";
import LocationDAO from "../../database/dao/LocationDAO.js";
import LookupService from "../../services/LookupService.js";

describe("LookupService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        LookupService.clearCache();
    });

    test("getOrCreateCategory caches lookups", async () => {
        CategoryDAO.getOrCreate.mockResolvedValue({ id: 1, created: true });

        const first = await LookupService.getOrCreateCategory("Fire");
        const second = await LookupService.getOrCreateCategory("Fire");

        expect(CategoryDAO.getOrCreate).toHaveBeenCalledTimes(1);
        expect(first).toBe(1);
        expect(second).toBe(1);
    });

    test("getOrCreateSource uses normalized cache key and returns id", async () => {
        SourceDAO.getOrCreate.mockResolvedValue({ id: 5, created: true });

        const id = await LookupService.getOrCreateSource("RFS", "https://rfs.example.com");
        const id2 = await LookupService.getOrCreateSource("RFS", "https://rfs.example.com");

        expect(SourceDAO.getOrCreate).toHaveBeenCalledTimes(1);
        expect(id).toBe(5);
        expect(id2).toBe(5);
    });

    test("clearCache removes cached values", async () => {
        CategoryDAO.getOrCreate.mockResolvedValue({ id: 99, created: true });
        await LookupService.getOrCreateCategory("Test");

        LookupService.clearCache();

        await LookupService.getOrCreateCategory("Test");
        expect(CategoryDAO.getOrCreate).toHaveBeenCalledTimes(2);
    });

    test("getOrCreateLocation caches by full composite key", async () => {
        LocationDAO.getOrCreate.mockResolvedValue({ id: 12, created: true });

        const first = await LookupService.getOrCreateLocation("Sydney", "2000", 3);
        const second = await LookupService.getOrCreateLocation("Sydney", "2000", 3);

        expect(LocationDAO.getOrCreate).toHaveBeenCalledTimes(1);
        expect(first).toBe(12);
        expect(second).toBe(12);
    });
});

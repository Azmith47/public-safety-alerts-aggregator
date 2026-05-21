jest.mock("../../services/LookupService", () => ({
    getOrCreateCategory: jest.fn(),
    getOrCreateSource: jest.fn(),
    getOrCreateStatusType: jest.fn(),
    getOrCreateSeverityLevel: jest.fn(),
    getOrCreateRegion: jest.fn(),
    getOrCreateCouncilArea: jest.fn(),
    getOrCreateLocation: jest.fn()
}));
jest.mock("../../database/dao/AlertDAO", () => ({
    transaction: jest.fn(),
    exists: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
}));
jest.mock("../../database/dao/AlertMarkersDAO", () => ({ create: jest.fn(), deleteByAlert: jest.fn() }));
jest.mock("../../database/dao/AlertPolygonDAO", () => ({ create: jest.fn(), deleteByAlert: jest.fn() }));
jest.mock("../../database/dao/AlertRoadDAO", () => ({ create: jest.fn(), deleteByAlert: jest.fn() }));
jest.mock("../../database/dao/AlertAdviceDAO", () => ({ create: jest.fn(), deleteByAlert: jest.fn() }));
jest.mock("../../database/dao/AlertLinkDAO", () => ({ create: jest.fn(), deleteByAlert: jest.fn() }));

const LookupService = require("../../services/LookupService");
const AlertDAO = require("../../database/dao/AlertDAO");
const AlertMarkersDAO = require("../../database/dao/AlertMarkersDAO");
const AlertPolygonDAO = require("../../database/dao/AlertPolygonDAO");
const AlertRoadDAO = require("../../database/dao/AlertRoadDAO");
const AlertAdviceDAO = require("../../database/dao/AlertAdviceDAO");
const AlertLinkDAO = require("../../database/dao/AlertLinkDAO");
const AlertPersistenceService = require("../../services/AlertPersistenceService");

describe("AlertPersistenceService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("buildAlertData maps alert fields to database payload", () => {
        const payload = AlertPersistenceService.buildAlertData(
            { title: "Test", description: "Desc", pubDate: "2026-05-21", lastUpdated: "2026-05-21", link: "http://x", planned: true, isMajor: true, impactingNetwork: true, delay: 5, startDate: "2026-05-20", endDate: "2026-05-22", raw_payload: { foo: 1 } },
            1,
            2,
            3,
            4,
            5
        );

        expect(payload).toEqual({
            title: "Test",
            description: "Desc",
            category_id: 1,
            source_id: 2,
            location_id: 3,
            status_type_id: 4,
            severity_level_id: 5,
            issued_at: "2026-05-21",
            updated_at: "2026-05-21",
            source_url: "http://x",
            planned: true,
            is_major: true,
            impacting_network: true,
            delay: 5,
            start_date: "2026-05-20",
            end_date: "2026-05-22",
            raw_payload: expect.objectContaining({
                title: "Test",
                raw_payload: expect.objectContaining({ foo: 1 })
            })
        });
    });

    test("save creates a new alert when none exists", async () => {
        LookupService.getOrCreateCategory.mockResolvedValue(1);
        LookupService.getOrCreateSource.mockResolvedValue(2);
        LookupService.getOrCreateStatusType.mockResolvedValue(4);
        LookupService.getOrCreateSeverityLevel.mockResolvedValue(5);
        LookupService.getOrCreateRegion.mockResolvedValue(null);
        LookupService.getOrCreateCouncilArea.mockResolvedValue(null);
        LookupService.getOrCreateLocation.mockResolvedValue(null);

        AlertDAO.exists.mockResolvedValue(null);
        AlertDAO.transaction.mockImplementation(async (cb) => cb());
        AlertDAO.create.mockResolvedValue({ id: 101 });

        const alert = {
            id: "ext-1",
            title: "Test Alert",
            headline: "Headline",
            description: "Desc",
            pubDate: "2026-05-21",
            lastUpdated: "2026-05-21",
            link: "https://example.com",
            planned: false,
            isMajor: false,
            impactingNetwork: false,
            delay: 0,
            startDate: null,
            endDate: null,
            markerPoint: { lat: -33, lng: 151 },
            polygon: [{ lat: -33, lng: 151 }],
            roads: [{ mainStreet: "Main St" }],
            advice: ["Follow instructions"],
            otherLinks: [{ text: "More", url: "http://more" }]
        };

        const result = await AlertPersistenceService.save(alert, "RFS", "https://rfs.example.com");

        expect(result).toEqual({ action: "created", alertId: 101 });
        expect(AlertDAO.create).toHaveBeenCalled();
        expect(AlertMarkersDAO.create).toHaveBeenCalledWith(101, -33, 151);
        expect(AlertPolygonDAO.create).toHaveBeenCalledWith(101, 0, -33, 151);
        expect(AlertRoadDAO.create).toHaveBeenCalledWith({
            alert_id: 101,
            main_street: "Main St",
            cross_street: null,
            second_location: null,
            suburb: null,
            region: null
        });
        expect(AlertAdviceDAO.create).toHaveBeenCalledWith(101, "Follow instructions");
        expect(AlertLinkDAO.create).toHaveBeenCalledWith(101, "More", "http://more");
    });

    test("save updates an existing alert and replaces child data", async () => {
        LookupService.getOrCreateCategory.mockResolvedValue(1);
        LookupService.getOrCreateSource.mockResolvedValue(2);
        LookupService.getOrCreateStatusType.mockResolvedValue(4);
        LookupService.getOrCreateSeverityLevel.mockResolvedValue(5);
        LookupService.getOrCreateRegion.mockResolvedValue(null);
        LookupService.getOrCreateCouncilArea.mockResolvedValue(null);
        LookupService.getOrCreateLocation.mockResolvedValue(null);

        AlertDAO.exists.mockResolvedValue({ id: 202 });
        AlertDAO.transaction.mockImplementation(async (cb) => cb());
        AlertDAO.update.mockResolvedValue({ changes: 1 });

        const alert = {
            id: "ext-2",
            title: "Updated Alert",
            description: "Desc2",
            pubDate: "2026-05-21",
            lastUpdated: "2026-05-22",
            link: "https://example.com/2",
            markerPoint: { lat: -33, lng: 151 },
            polygon: [{ lat: -33, lng: 151 }],
            roads: [{ mainStreet: "Main St" }],
            advice: ["Stay safe"],
            otherLinks: [{ text: "Link", url: "http://link" }]
        };

        const result = await AlertPersistenceService.save(alert, "TFNSW", "https://tfnsw.example.com");

        expect(result).toEqual({ action: "updated", alertId: 202 });
        expect(AlertDAO.update).toHaveBeenCalledWith(202, expect.any(Object));
        expect(AlertMarkersDAO.deleteByAlert).toHaveBeenCalledWith(202);
        expect(AlertPolygonDAO.deleteByAlert).toHaveBeenCalledWith(202);
        expect(AlertRoadDAO.deleteByAlert).toHaveBeenCalledWith(202);
        expect(AlertAdviceDAO.deleteByAlert).toHaveBeenCalledWith(202);
        expect(AlertLinkDAO.deleteByAlert).toHaveBeenCalledWith(202);
    });
});

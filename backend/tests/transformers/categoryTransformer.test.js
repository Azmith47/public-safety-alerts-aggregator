import { describe, it, expect } from "@jest/globals";
import {
	normalizeString,
	transformCategory,
} from "../../normalization/transformers/categoryTransformer.js";
import { Categories } from "../../models/globalenums.js";

describe("categoryTransformer", () => {
	describe("normalizeString", () => {
		it("should return null for null/undefined", () => {
			expect(normalizeString(null)).toBeNull();
			expect(normalizeString(undefined)).toBeNull();
		});

		it("should return null for non-string values", () => {
			expect(normalizeString(123)).toBeNull();
			expect(normalizeString({})).toBeNull();
			expect(normalizeString([])).toBeNull();
		});

		it("should trim whitespace", () => {
			expect(normalizeString("  fire  ")).toBe("FIRE");
		});

		it("should convert to uppercase", () => {
			expect(normalizeString("fire")).toBe("FIRE");
		});

		it("should replace spaces with underscores", () => {
			expect(normalizeString("bush fire")).toBe("BUSH_FIRE");
		});

		it("should remove special characters", () => {
			expect(normalizeString("bush-fire!")).toBe("BUSH_FIRE");
		});

		it("should combine cleaning rules correctly", () => {
			expect(normalizeString("  bush-fire alert ")).toBe(
				"BUSH_FIRE_ALERT",
			);
		});
	});

	describe("transformCategory", () => {
		it("should return OTHER for null/undefined", () => {
			expect(transformCategory(null)).toBe(Categories.OTHER);
			expect(transformCategory(undefined)).toBe(Categories.OTHER);
		});

		it("should return OTHER for unknown categories", () => {
			expect(transformCategory("random garbage")).toBe(Categories.OTHER);
		});

		it("should map FIRE categories correctly", () => {
			expect(transformCategory("fire")).toBe(Categories.FIRE);
			expect(transformCategory("bush fire")).toBe(Categories.FIRE);
			expect(transformCategory("structure-fire")).toBe(Categories.FIRE);
		});

		it("should map PLANNED_BURN categories correctly", () => {
			expect(transformCategory("planned burn")).toBe(
				Categories.PLANNED_BURN,
			);
			expect(transformCategory("hazard reduction")).toBe(
				Categories.PLANNED_BURN,
			);
			expect(transformCategory("burn-off")).toBe(Categories.PLANNED_BURN);
		});

		it("should map STORM categories correctly", () => {
			expect(transformCategory("storm")).toBe(Categories.STORM);
			expect(transformCategory("flood storm tree down")).toBe(
				Categories.STORM,
			);
		});

		it("should map TRAFFIC categories correctly", () => {
			expect(transformCategory("traffic incident")).toBe(
				Categories.TRAFFIC_INCIDENT,
			);
			expect(transformCategory("accident")).toBe(
				Categories.TRAFFIC_INCIDENT,
			);
			expect(transformCategory("breakdown")).toBe(
				Categories.TRAFFIC_INCIDENT,
			);
			expect(transformCategory("mva transport")).toBe(
				Categories.TRAFFIC_INCIDENT,
			);
		});

		it("should map ROAD HAZARD categories correctly", () => {
			expect(transformCategory("hazard")).toBe(Categories.ROAD_HAZARD);
			expect(transformCategory("road works")).toBe(
				Categories.ROAD_HAZARD,
			);
			expect(transformCategory("road hazard")).toBe(
				Categories.ROAD_HAZARD,
			);
		});

		it("should map FLOOD categories correctly", () => {
			expect(transformCategory("flood")).toBe(Categories.FLOOD);
			expect(transformCategory("flooding")).toBe(Categories.FLOOD);
		});

		it("should map PUBLIC_EVENT categories correctly", () => {
			expect(transformCategory("special event")).toBe(
				Categories.PUBLIC_EVENT,
			);
			expect(transformCategory("public event")).toBe(
				Categories.PUBLIC_EVENT,
			);
		});

		it("should map WEATHER categories correctly", () => {
			expect(transformCategory("weather")).toBe(Categories.WEATHER);
		});
	});
});

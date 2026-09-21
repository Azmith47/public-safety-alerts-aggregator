/**
 * severityTransformer.test.js
 *
 * Unit tests for severity normalization utilities.
 */

import {
	transformSeverity,
	normalizeString,
	isHighSeverity,
	getSeverityPriority,
} from "../../normalization/transformers/severityTransformer.js";

import { SeverityLevels } from "../../models/globalEnums.js";

describe("normalizeString", () => {
	test("should normalize strings into enum-safe values", () => {
		expect(normalizeString("Emergency Warning")).toBe("EMERGENCY_WARNING");

		expect(normalizeString("Watch & Act")).toBe("WATCH_ACT");
	});

	test("should remove punctuation", () => {
		expect(normalizeString("Major!")).toBe("MAJOR");
	});

	test("should collapse whitespace", () => {
		expect(normalizeString("  Advice   Level ")).toBe("ADVICE_LEVEL");
	});

	test("should return null for invalid input", () => {
		expect(normalizeString(null)).toBeNull();

		expect(normalizeString(undefined)).toBeNull();

		expect(normalizeString(123)).toBeNull();
	});
});

describe("transformSeverity", () => {
	test("should transform RFS Emergency Warning", () => {
		expect(transformSeverity("Emergency Warning")).toBe(
			SeverityLevels.EMERGENCY_WARNING,
		);
	});

	test("should transform RFS Watch and Act", () => {
		expect(transformSeverity("Watch and Act")).toBe(
			SeverityLevels.WATCH_AND_ACT,
		);
	});

	test("should transform Advice", () => {
		expect(transformSeverity("Advice")).toBe(SeverityLevels.ADVICE);
	});

	test("should transform case-insensitive values", () => {
		expect(transformSeverity("eMeRgEnCy wArNiNg")).toBe(
			SeverityLevels.EMERGENCY_WARNING,
		);
	});

	test("should return UNKNOWN for unmapped severities", () => {
		expect(transformSeverity("Alien Threat Level")).toBe(
			SeverityLevels.UNKNOWN,
		);
	});

	test("should return UNKNOWN for invalid input", () => {
		expect(transformSeverity(null)).toBe(SeverityLevels.UNKNOWN);

		expect(transformSeverity(undefined)).toBe(SeverityLevels.UNKNOWN);
	});
});

describe("isHighSeverity", () => {
	test("should identify Emergency Warning as high severity", () => {
		expect(isHighSeverity("Emergency Warning")).toBe(true);
	});

	test("should identify Watch and Act as high severity", () => {
		expect(isHighSeverity("Watch and Act")).toBe(true);
	});

	test("should identify Major as high severity", () => {
		expect(isHighSeverity("Major")).toBe(true);
	});

	test("should identify Advice as NOT high severity", () => {
		expect(isHighSeverity("Advice")).toBe(false);
	});

	test("should identify unknown severity as NOT high severity", () => {
		expect(isHighSeverity("Unknown Thing")).toBe(false);
	});
});

describe("getSeverityPriority", () => {
	test("should return highest priority for Emergency Warning", () => {
		expect(getSeverityPriority("Emergency Warning")).toBe(100);
	});

	test("should return correct priority for Watch and Act", () => {
		expect(getSeverityPriority("Watch and Act")).toBe(80);
	});

	test("should return correct priority for Major", () => {
		expect(getSeverityPriority("Major")).toBe(70);
	});

	test("should return correct priority for Advice", () => {
		expect(getSeverityPriority("Advice")).toBe(60);
	});

	test("should return correct priority for Moderate", () => {
		expect(getSeverityPriority("Moderate")).toBe(50);
	});

	test("should return correct priority for Minor", () => {
		expect(getSeverityPriority("Minor")).toBe(40);
	});

	test("should return correct priority for Information", () => {
		expect(getSeverityPriority("Information")).toBe(20);
	});

	test("should return 0 for unknown severities", () => {
		expect(getSeverityPriority("Random Severity")).toBe(0);
	});

	test("should return 0 for invalid input", () => {
		expect(getSeverityPriority(null)).toBe(0);
	});
});

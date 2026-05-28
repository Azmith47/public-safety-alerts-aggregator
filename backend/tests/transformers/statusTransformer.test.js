/**
 * statusTransformer.test.js
 *
 * Unit tests for operational lifecycle status normalization.
 */

import {
	normalizeString,
	transformStatus,
	isActiveStatus,
	isClosedStatus,
	getStatusPriority,
} from "../../normalization/transformers/statusTransformer.js";

import { Statuses } from "../../models/enums.js";

describe("normalizeString", () => {
	test("should normalize strings into enum-safe values", () => {
		expect(normalizeString("Under Control")).toBe("UNDER_CONTROL");

		expect(normalizeString("Watch & Monitor")).toBe("WATCH_MONITOR");
	});

	test("should remove punctuation", () => {
		expect(normalizeString("Closed!")).toBe("CLOSED");
	});

	test("should collapse whitespace", () => {
		expect(normalizeString("  Active   Incident ")).toBe("ACTIVE_INCIDENT");
	});

	test("should return null for invalid input", () => {
		expect(normalizeString(null)).toBeNull();

		expect(normalizeString(undefined)).toBeNull();

		expect(normalizeString(123)).toBeNull();
	});
});

describe("transformStatus", () => {
	test("should transform Under Control", () => {
		expect(transformStatus("Under Control")).toBe(Statuses.UNDER_CONTROL);
	});

	test("should transform Active", () => {
		expect(transformStatus("Active")).toBe(Statuses.ACTIVE);
	});

	test("should transform Contained", () => {
		expect(transformStatus("Contained")).toBe(Statuses.CONTAINED);
	});

	test("should transform Planned", () => {
		expect(transformStatus("Planned")).toBe(Statuses.PLANNED);
	});

	test("should support case-insensitive matching", () => {
		expect(transformStatus("uNdEr CoNtRoL")).toBe(Statuses.UNDER_CONTROL);
	});

	test("should return UNKNOWN for unmapped statuses", () => {
		expect(transformStatus("Alien Invasion")).toBe(Statuses.UNKNOWN);
	});

	test("should return UNKNOWN for invalid input", () => {
		expect(transformStatus(null)).toBe(Statuses.UNKNOWN);

		expect(transformStatus(undefined)).toBe(Statuses.UNKNOWN);
	});
});

describe("isActiveStatus", () => {
	test("should identify ACTIVE as active", () => {
		expect(isActiveStatus("Active")).toBe(true);
	});

	test("should identify UNDER_CONTROL as active", () => {
		expect(isActiveStatus("Under Control")).toBe(true);
	});

	test("should identify PLANNED as active", () => {
		expect(isActiveStatus("Planned")).toBe(true);
	});

	test("should identify CLOSED as NOT active", () => {
		expect(isActiveStatus("Closed")).toBe(false);
	});

	test("should identify CANCELLED as NOT active", () => {
		expect(isActiveStatus("Cancelled")).toBe(false);
	});

	test("should identify UNKNOWN as NOT active", () => {
		expect(isActiveStatus("Random Status")).toBe(false);
	});
});

describe("isClosedStatus", () => {
	test("should identify COMPLETED as closed", () => {
		expect(isClosedStatus("Completed")).toBe(true);
	});

	test("should identify RESOLVED as closed", () => {
		expect(isClosedStatus("Resolved")).toBe(true);
	});

	test("should identify CLOSED as closed", () => {
		expect(isClosedStatus("Closed")).toBe(true);
	});

	test("should identify CANCELLED as closed", () => {
		expect(isClosedStatus("Cancelled")).toBe(true);
	});

	test("should identify ACTIVE as NOT closed", () => {
		expect(isClosedStatus("Active")).toBe(false);
	});

	test("should identify UNDER_CONTROL as NOT closed", () => {
		expect(isClosedStatus("Under Control")).toBe(false);
	});
});

describe("getStatusPriority", () => {
	test("should return highest priority for ACTIVE", () => {
		expect(getStatusPriority("Active")).toBe(100);
	});

	test("should return correct priority for MONITORING", () => {
		expect(getStatusPriority("Monitoring")).toBe(90);
	});

	test("should return correct priority for UNDER_CONTROL", () => {
		expect(getStatusPriority("Under Control")).toBe(80);
	});

	test("should return correct priority for CONTAINED", () => {
		expect(getStatusPriority("Contained")).toBe(70);
	});

	test("should return correct priority for CONTROLLED", () => {
		expect(getStatusPriority("Controlled")).toBe(60);
	});

	test("should return correct priority for PLANNED", () => {
		expect(getStatusPriority("Planned")).toBe(50);
	});

	test("should return correct priority for COMPLETED", () => {
		expect(getStatusPriority("Completed")).toBe(20);
	});

	test("should return correct priority for RESOLVED", () => {
		expect(getStatusPriority("Resolved")).toBe(10);
	});

	test("should return 0 for CLOSED", () => {
		expect(getStatusPriority("Closed")).toBe(0);
	});

	test("should return 0 for CANCELLED", () => {
		expect(getStatusPriority("Cancelled")).toBe(0);
	});

	test("should return 0 for unknown statuses", () => {
		expect(getStatusPriority("Random Status")).toBe(0);
	});

	test("should return 0 for invalid input", () => {
		expect(getStatusPriority(null)).toBe(0);
	});
});

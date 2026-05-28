/**
 * jest.config.js *
 * Jest configuration for ESM-based Node.js backend.
 */

export default {
	/**
	 * Use Node.js test environment.
	 */
	testEnvironment: "node",

	rootDir: ".",

	/**
	 * Test discovery.
	 */
	testMatch: ["<rootDir>/tests/**/*.test.js"],

	/**
	 * Test module file extensions.
	 */
	moduleFileExtensions: ["js", "json"],

	/**
	 * Required for ESM support.
	 */
	transform: {},

	/**
	 * Allows imports without requiring explicit .js extensions.
	 */
	moduleNameMapper: {
		"^(\\.{1,2}/.*)\\.js$": "$1",
	},

	/**
	 * Coverage exclusions.
	 */
	coveragePathIgnorePatterns: ["/node_modules/", "/logs/"],
};

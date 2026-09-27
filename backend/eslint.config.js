/**
 * eslint.config.js *
 * Lint configuration for Node.js backend.
 */

import js from "@eslint/js";
import globals from "globals";
import nodePlugin from "eslint-plugin-n";

export default [
	{
		ignores: [
			"**/test/**", // Ignores anything inside a folder named 'test'
			"**/tests/**", // Ignores anything inside a folder named 'tests'
			"**/*.test.js", // Ignores any file ending in .test.js
			"node_modules/", // Good practice to include, though usually ignored by default
		],
	},
	// Apply global Node.js environment settings to all JS files
	{
		files: ["**/*.js"],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module", // Use "commonjs" if you are using require() instead of import
			globals: {
				...globals.node, // Enables Node.js global variables like process, Buffer, etc.
			},
		},
		// Load the standard recommended ruleset
		plugins: {
			n: nodePlugin,
		},
		rules: {
			...js.configs.recommended.rules,

			// Add custom Node.js specific rule overrides
			"no-console": "off", // Server logs are standard in Node.js
			"prefer-const": "error",
			"no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
		},
	},
];

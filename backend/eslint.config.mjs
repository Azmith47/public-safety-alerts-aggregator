import js from "@eslint/js";

export default [
  {
    ignores: ["coverage/**", "logs/**", "node_modules/**"],
  },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        Buffer: "readonly",
        console: "readonly",
        crypto: "readonly",
        fetch: "readonly",
        global: "readonly",
        process: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
      },
    },
    rules: {
      "no-undef": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      globals: {
        afterAll: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        beforeEach: "readonly",
        describe: "readonly",
        expect: "readonly",
        jest: "readonly",
        it: "readonly",
        test: "readonly",
      },
    },
  },
];

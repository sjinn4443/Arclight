const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  {
    ignores: ["node_modules/**", "memory-bank/**"],
  },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "no-console": "off",
    },
  },
  {
    files: ["scoring-engine.js"],
    languageOptions: { globals: { module: "readonly" } },
  },
  {
    files: ["tests/**/*.{js,cjs,mjs}"],
    languageOptions: {
      globals: { ...globals.node, fetch: "readonly", WebSocket: "readonly" },
    },
  },
];

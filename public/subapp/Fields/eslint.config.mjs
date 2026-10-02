import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["node_modules/**", "assets/**"],
  },
  js.configs.recommended,
  {
    files: ["src/**/*.js", "analysis.js", "cup-achievement.js", "pwa-register.js", "service-worker.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
      },
    },
    rules: {
      // The browser app deliberately shares named globals across ordered classic scripts.
      "no-undef": "off",
      "no-unused-vars": "off",
    },
  },
  {
    files: ["qa-*.mjs", "tests/**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": "off",
    },
  },
];

import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["node_modules/**", "assets/**"],
  },
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
    },
    rules: {
      // This app uses classic browser-script globals across files.
      "no-undef": "off",
      "no-unused-vars": "off",
    },
  },
  {
    files: ["src/**/*.js", "analysis.js"],
    languageOptions: {
      sourceType: "script",
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ["qa-fields-audit.mjs"],
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
  },
];

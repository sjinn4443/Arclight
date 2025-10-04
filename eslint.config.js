// eslint.config.js
export default [
  {
    // Ignore the dist folder
    ignores: ["dist/**"],
    // Target JavaScript files.
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "module",
    },
    rules: {
      // Basic rules to prevent immediate errors.
      // Enable auto-fixing for warnings
      "no-unused-vars": [
        "error", // Changed from "warn" to "error" to enable auto-fixing
        {
          args: "after-used",
          ignoreRestSiblings: true,
          vars: "all",
          varsIgnorePattern: "^_",
        },
      ],
      "no-console": ["error", { allow: ["warn", "error"] }], // Changed from "warn" to "error"
    },
  },
];

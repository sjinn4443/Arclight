// eslint.config.js
import globals from "globals";
import pluginJs from "@eslint/js";
import typescriptEslintParser from "@typescript-eslint/parser";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";

export default [
  {
    // Ignore the dist folder
    ignores: ["dist/**"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "module",
      globals: globals.browser,
    },
    plugins: {
      "@eslint/js": pluginJs,
    },
    rules: {
      ...pluginJs.configs.recommended.rules, // Include recommended JS rules
      "no-unused-vars": [
        "error",
        {
          args: "after-used",
          ignoreRestSiblings: true,
          vars: "all",
          varsIgnorePattern: "^_",
        },
      ],
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        project: ["./vscode-alanui-launcher/tsconfig.json"], // Removed non-existent tsconfig.json
        ecmaVersion: 2020,
        sourceType: "module",
      },
      globals: globals.browser,
    },
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
    },
    rules: {
      ...typescriptEslintPlugin.configs.recommended.rules, // Include recommended TS rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "after-used",
          ignoreRestSiblings: true,
          vars: "all",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
  },
  {
    files: [
      "convertImage.js",
      "securitytest/rate_test_node.js",
      "vscode-alanui-launcher/out/extension.js",
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        module: true,
        require: true,
        process: true,
        exports: true,
      },
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": [
        "error",
        {
          args: "after-used",
          ignoreRestSiblings: true,
          vars: "all",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["jest.config.js", "tests/**/*.js", "tests/**/*.cjs"], // Jest config and all test files
    languageOptions: {
      globals: {
        ...globals.node, // For Node.js environment in tests
        ...globals.jest, // For Jest specific globals
        module: true,
        require: true,
        process: true,
        exports: true,
        global: true,
        describe: true,
        test: true,
        expect: true,
        jest: true,
        beforeAll: true,
        beforeEach: true,
        afterAll: true,
      },
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": [
        "error",
        {
          args: "after-used",
          ignoreRestSiblings: true,
          vars: "all",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
];

export default {
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": [
      "babel-jest",
      {
        presets: [
          [
            "@babel/preset-env",
            {
              // Allow ES modules
              targets: {
                node: "current",
              },
              // Use "commonjs" to ensure compatibility with Node.js's module system
              // and to resolve potential parsing issues with mixed module types.
              modules: "commonjs",
            },
          ],
        ],
        sourceType: "module", // Ensure ES Module syntax is parsed correctly
        plugins: [
          // Explicitly transform ES Modules to CommonJS
          "@babel/plugin-transform-modules-commonjs",
        ],
      },
    ],
  },
  testEnvironment: "node", // Use Node.js environment for tests
  setupFilesAfterEnv: ["./tests/jest.setup.js"],
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],
  testTimeout: 30000, // Increase global test timeout to 30 seconds
};

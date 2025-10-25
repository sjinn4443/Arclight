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
              // Do not transform modules, preserve ES Module syntax
              modules: false,
            },
          ],
        ],
        sourceType: "module", // Ensure ES Module syntax is parsed correctly
        // Removed: "@babel/plugin-transform-modules-commonjs",
      },
    ],
  },
  testEnvironment: "node", // Use Node.js environment for tests
  setupFilesAfterEnv: ["./tests/jest.setup.js"],
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],
  testTimeout: 30000, // Increase global test timeout to 30 seconds
};

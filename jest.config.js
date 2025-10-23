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
            },
          ],
        ],
        // sourceType: "module", // Removed to avoid conflicts with modules: "commonjs"
      },
    ],
  },
  testEnvironment: "node", // Use Node.js environment for tests
  setupFilesAfterEnv: ["./tests/jest.setup.js"],
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],
  testTimeout: 30000, // Increase global test timeout to 30 seconds
};

module.exports = {
  transform: {
    "^.+\\.(js|jsx|ts|tsx|cjs)$": ["babel-jest"],
  },
  testEnvironment: "jsdom", // Use JSDOM environment for UI tests
  transformIgnorePatterns: ["/node_modules/(?!(jsdom|parse5)/)"],
  setupFilesAfterEnv: ["./tests/jest.setup.js"],
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node", "cjs"],
  testPathIgnorePatterns: ["/node_modules/", "/tests-e2e/"], // Exclude Playwright tests
  testTimeout: 30000, // Increase global test timeout to 30 seconds
};

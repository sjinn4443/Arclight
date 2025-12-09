module.exports = {
  transform: {
    "^.+\\.(js|jsx|ts|tsx|cjs)$": ["babel-jest"],
  },
  testEnvironment: "jsdom", // Use JSDOM environment for UI tests
  transformIgnorePatterns: [
    "/node_modules/(?!(jsdom|parse5|globby|@sindresorhus/merge-streams)/)",
  ],
  setupFiles: ["<rootDir>/tests/setupEnv.cjs"],
  setupFilesAfterEnv: ["./tests/jest.setup.cjs"],
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node", "cjs"],
  moduleNameMapper: {
    // Map app ESM modules to CJS test doubles to avoid ESM loader conflicts in CJS tests
    "^\\.\\.\\/public\\/js\\/navigation\\.js$":
      "<rootDir>/tests/__mocks__/navigation.cjs",
    "^\\.\\.\\/public\\/js\\/video\\.js$":
      "<rootDir>/tests/__mocks__/video.cjs",
  },
  testPathIgnorePatterns: [
    "/node_modules/",
    "/tests-e2e/",
    "/public/html/demo/",
    "tests/renderperf.test.js",
  ], // Exclude Playwright tests, demo folder, and specific test files
  testTimeout: 30000, // Increase global test timeout to 30 seconds
};

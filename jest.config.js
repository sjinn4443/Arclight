export default {
  transform: {
    "^.+\\.(js|jsx|ts|tsx|cjs)$": ["babel-jest"],
  },
  testEnvironment: "jsdom", // Use JSDOM environment for UI tests
  setupFilesAfterEnv: ["./tests/jest.setup.js"],
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node", "cjs"],
  testTimeout: 30000, // Increase global test timeout to 30 seconds
};

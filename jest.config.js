module.exports = {
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./tests/jest.setup.js"],
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],
  transformIgnorePatterns: ["node_modules/(?!(module-to-ignore)/)"],
  testTimeout: 30000, // Increase global test timeout to 30 seconds
};

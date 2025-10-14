export default {
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./tests/jest.setup.js"],
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],
  transformIgnorePatterns: ["node_modules/(?!(module-to-ignore)/)"],
  extensionsToTreatAsEsm: [".jsx", ".ts", ".tsx"], // Removed .js
};

export default {
  transform: {
    "^.+\\.(ts|tsx)$": "babel-jest", // Only transform TypeScript with Babel
  },
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],
  transformIgnorePatterns: ["node_modules/(?!(module-to-ignore)/)"],
  extensionsToTreatAsEsm: [".jsx", ".ts", ".tsx"], // Removed .js
};

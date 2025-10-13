export default {
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],
};

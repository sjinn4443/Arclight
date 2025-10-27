export default {
  env: {
    test: {
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              node: "current",
            },
            modules: "commonjs", // Transform ES Modules to CommonJS for Jest
          },
        ],
      ],
    },
  },
};

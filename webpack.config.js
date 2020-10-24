const { webpackConfig } = require("./webpack.plugin");

module.exports = webpackConfig("checkout", (defaultConfig) => {
  return {
    ...defaultConfig,
    entry: {
      index: "./src/index.tsx",
      ...(defaultConfig.mode === "production"
        ? {}
        : { preview: "./src/preview.tsx" }),
    },
  };
});

const path = require("path");

module.exports = {
  entry: "./src/frontendFunctions/entry.tsx",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      // 其他 loader 配置
    ],
  },
  resolve: {
    extensions: [".tsx", ".jsx", ".js"],
  },
  output: {
    filename: "main.js",
    // path: "src/public/js",
    path: path.resolve(__dirname, "src/public/js"),
  },
};

const path = require("path");

module.exports = {
  entry: "./src/public/js/index.tsx",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      // 其他 loader 配置，例如样式和图片处理
    ],
  },
  resolve: {
    extensions: [".tsx", ".jsx", ".js"],
  },
  output: {
    filename: "index.js",
    // path: "src/public/js",
    path: path.resolve(__dirname, "src/public/js"),
  },
};

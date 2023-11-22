const path = require("path");

module.exports = {
  entry: {
    index: "./src/frontendFunctions/index/indexEntry.tsx", // 路徑修改為您的 indexEntry.tsx 檔案位置
    main: "./src/frontendFunctions/main/mainEntry.tsx", // 路徑修改為您的 mainEntry.tsx 檔案位置
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        include: path.resolve(__dirname, "src/frontendFunctions"),
        // exclude: /node_modules/,
      },
      // 其他 loader 配置
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  output: {
    filename: "[name].js", // 使用 [name] 以基於入口名稱生成檔案
    path: path.resolve(__dirname, "src/public/js"),
  },
};

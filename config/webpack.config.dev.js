const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: { app: path.resolve(__dirname, "../src/index.tsx") },
  output: {
    filename: "[name]_[chunkhash:8].js",
    path: path.resolve(__dirname, "./dist"),
    publicPath: "/",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(tsx|js|jsx|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(less|css)$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.svg$/,
        loader: "@svgr/webpack",
      },
      {
        test: /\.(png|jpg|jpeg|gif|bmp|webp|ico)$/,
        exclude: /node_modules/,
        type: "asset",
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    alias: {
      "@assets": path.resolve(__dirname, "../src/assets"),
      "@containers": path.resolve(__dirname, "../src/containers"),
      "@components": path.resolve(__dirname, "../src/components"),
      "@layouts": path.resolve(__dirname, "../src/layouts"),
      "@router": path.resolve(__dirname, "../src/router"),
      "@service": path.resolve(__dirname, "../src/service"),
      "@http": path.resolve(__dirname, "../src/http"),
      "@utils": path.resolve(__dirname, "../src/utils"),
      "@style": path.resolve(__dirname, "../src/style"),
      "@locales": path.resolve(__dirname, "../src/locales"),
    },
  },
  devServer: {
    hot: true,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, "../public"),
    },
  },
  devtool: "source-map",
};

import * as path from "path";
import * as webpack from "webpack";
import * as HtmlWebpackPlugin from "html-webpack-plugin";

// TODO: add types for these packages:
const WebpackCdnPlugin = require("webpack-cdn-plugin");

const isRelease = process.argv.includes("--release");

const configuration: webpack.Configuration = {
  mode: isRelease ? "production" : "development",
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build")
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      minify: isRelease
        ? {
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true
          }
        : false,
      template: "assets/template.ejs",
      favicon: "assets/favicon.png"
    }),
    new WebpackCdnPlugin({
      modules: [
        {
          name: "react",
          var: "React",
          path: isRelease
            ? "umd/react.production.min.js"
            : "umd/react.development.js"
        },
        {
          name: "react-dom",
          var: "ReactDOM",
          path: isRelease
            ? "umd/react-dom.production.min.js"
            : "umd/react-dom.development.js"
        }
      ]
    })
  ]
};

export default configuration;

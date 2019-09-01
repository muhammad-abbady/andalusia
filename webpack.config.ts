/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import * as path from "path";
import * as webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import WebpackCdnPlugin from "webpack-cdn-plugin";
import GoogleFontsPlugin from "@beyonk/google-fonts-webpack-plugin";

const isRelease = process.argv.includes("--release");

const cdnModules = [
  {
    name: "react",
    var: "React",
    path: isRelease ? "umd/react.production.min.js" : "umd/react.development.js",
  },
  {
    name: "react-dom",
    var: "ReactDOM",
    path: isRelease ? "umd/react-dom.production.min.js" : "umd/react-dom.development.js",
  },
  {
    name: "react-router-dom",
    var: "ReactRouterDOM",
    path: isRelease ? "umd/react-router-dom.min.js" : "umd/react-router-dom.js",
  },
  {
    name: "bootstrap",
    cssOnly: true,
    style: isRelease ? "dist/css/bootstrap.min.css" : "dist/css/bootstrap.css",
  },
];

const configuration: webpack.Configuration = {
  mode: isRelease ? "production" : "development",
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build"),
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new CopyWebpackPlugin(
      isRelease
        ? []
        : cdnModules.map(mod => {
            const file = `node_modules/${mod.name}/${mod.path || mod.style}`;
            return { from: file, to: file };
          }),
    ),
    new MiniCssExtractPlugin(),
    new webpack.ProvidePlugin({
      React: "react",
    }),
    new GoogleFontsPlugin({
      path: "fonts/",
      local: !isRelease,
      fonts: [{ family: "Montserrat", variants: ["400", "700", "200"] }],
    }),
    new HtmlWebpackPlugin({
      minify: isRelease
        ? {
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true,
          }
        : false,
      template: "assets/template.ejs",
      favicon: "assets/images/favicon.png",
    }),
    new WebpackCdnPlugin({
      publicPath: "/node_modules",
      prod: isRelease,
      modules: cdnModules,
    }),
  ],
};

export default configuration;

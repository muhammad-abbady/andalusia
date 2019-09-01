import * as path from "path";
import * as webpack from "webpack";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as MiniCssExtractPlugin from "mini-css-extract-plugin";

// TODO: add types for these packages:
const WebpackCdnPlugin = require("webpack-cdn-plugin");
const GoogleFontsPlugin = require("@beyonk/google-fonts-webpack-plugin");

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
        use: "ts-loader"
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts"
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new webpack.ProvidePlugin({
      React: "react"
    }),
    new GoogleFontsPlugin({
      local: false,
      fonts: [{ family: "Montserrat", variants: ["400", "700", "200"] }]
    }),
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
        },
        {
          name: "react-router-dom",
          var: "ReactRouterDOM",
          path: isRelease
            ? "umd/react-router-dom.min.js"
            : "umd/react-router-dom.js"
        },
        {
          name: "bootstrap",
          cssOnly: true,
          style: isRelease
            ? "dist/css/bootstrap.min.css"
            : "dist/css/bootstrap.css"
        }
      ]
    })
  ]
};

export default configuration;

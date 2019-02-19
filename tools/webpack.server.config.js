const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const nodeExternals = require('webpack-node-externals');

const ROOT_DIR = path.resolve(__dirname, '../');
const SRC_DIR = path.resolve(ROOT_DIR, 'src');
const reScript = /\.(js|jsx|mjs)$/;
const reStyle = /\.(css|styl|scss|sass)$/;
const reImage = /\.(bpm|gif|jpg|jpeg|png|svg)$/;
const staticAssetName = '[name].[ext]';
const BUILD_DIR = path.resolve(ROOT_DIR, 'dist');

module.exports = {
  context: ROOT_DIR,
  mode: 'development',
  devtool: 'source-map',
  name: 'server',
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    alias: {
      '~': SRC_DIR
    },
    plugins: [
      // new TsconfigPathsPlugin({ configFile: './src/server/tsconfig.json' })
    ]
  },
  entry: {
    server: [
      path.resolve(SRC_DIR, 'server/index.tsx'),
    ],
  },
  target: 'node',
  output: {
    path: path.resolve(BUILD_DIR, 'server'),
    filename: '[name].js',
    publicPath: '/',
    libraryTarget: 'commonjs2',
    chunkFilename: 'chunks/[name].js',
  },
  externals: [
    '../chunk-manifest.json',
    nodeExternals({
      whitelist: [reStyle, reImage],
    }),
  ],
  module: {
    rules: [
      {
        test: reStyle,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              sourceMap: false,
              modules: true,
              localIdentName: '[path]_[local]',
              exportOnlyLocals: false,
            }
          }, {
            loader: 'sass-loader'
          },
        ]
      },
      { test: /\.tsx?$/, loader: "ts-loader" },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
      {
        test: reImage,
        oneOf: [
          // Inline lightweight images into CSS
          {
            issuer: reStyle,
            oneOf: [
              // Inline lightweight SVGs as UTF-8 encoded DataUrl string
              {
                test: /\.svg$/,
                loader: 'svg-url-loader',
                options: {
                  name: staticAssetName,
                  limit: 4096, // 4kb
                },
              },

              // Inline lightweight images as Base64 encoded DataUrl string
              {
                loader: 'url-loader',
                options: {
                  name: staticAssetName,
                  limit: 4096, // 4kb
                },
              },
            ],
          },

          // Or return public URL to image resource
          {
            loader: 'file-loader',
            options: {
              name: staticAssetName,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __isClient__: false,
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
  ],
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
}
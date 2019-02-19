const path = require('path');
const fs = require('fs');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const ROOT_DIR = path.resolve(__dirname, '../');
const SRC_DIR = path.resolve(ROOT_DIR, 'src');
const reStyle = /\.(css|styl|scss|sass)$/;
const reImage = /\.(bpm|gif|jpg|jpeg|png|svg)$/;
const staticAssetName = '[name].[ext]';
const BUILD_DIR = path.resolve(ROOT_DIR, 'dist');

module.exports = {
  context: ROOT_DIR,
  mode: 'development',
  devtool: 'inline-source-map',
  name: 'client',
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    alias: {
      '~': SRC_DIR
    },
    plugins: [
      // new TsconfigPathsPlugin({ configFile: './src/client/tsconfig.json' })
    ]
  },
  entry: {
    client: [
      'webpack-hot-middleware/client?path=http://localhost:3001/__what',
      '@babel/polyfill',
      path.resolve(SRC_DIR, 'client/index.tsx'),
    ],
  },
  target: 'web',
  output: {
    path: path.resolve(BUILD_DIR, 'client'),
    filename: '[name].js',
    publicPath: 'http://localhost:3001/',
    chunkFilename: '[name].chunk.js',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: reStyle,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          }, {
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
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: { plugins: ['react-hot-loader/babel'] },
          },
          'ts-loader',
        ],
        // {
        //   loader: 'babel-loader',
        //   options: {
        //     cacheDirectory: true,
        //     babelrc: false,
        //     presets: [
        //       [
        //         '@babel/preset-env',
        //         {
        //           targets: { browsers: 'last 2 versions' },
        //           modules: false,
        //         },
        //       ],
        //       [
        //         '@babel/preset-typescript',
        //         {
        //           isTSX: true,
        //           allExtensions: true,
        //         },
        //       ],
        //       '@babel/preset-react',
        //     ],
        //     plugins: [
        //       'react-hot-loader/babel'
        //     ]
        //   },
        // },
      },
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
  externals: {

  },
  plugins: [
    new webpack.DefinePlugin({
      __isClient__: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new WebpackAssetsManifest({
      writeToDisk: true,
      output: 'manifest.json',
      publicPath: true,
      done: (manifest, stats) => {
        const chunkFileName = `${BUILD_DIR}/chunk-manifest.json`;
        try {
          const fileFilter = file => !file.endsWith('.map');
          const addPath = file => manifest.getPublicPath(file);
          const chunkFiles = stats.compilation.chunkGroups.reduce((acc, c) => {
            acc[c.name] = [
              ...(acc[c.name] || []),
              ...c.chunks.reduce(
                (files, cc) => [
                  ...files,
                  ...cc.files.filter(fileFilter).map(addPath),
                ],
                [],
              ),
            ];
            return acc;
          }, Object.create(null));
          fs.writeFileSync(chunkFileName, JSON.stringify(chunkFiles, null, 2));
        } catch (err) {
          console.error(`ERROR: Cannot write ${chunkFileName}: `, err);
          if (!isDebug) process.exit(1);
        }
      },
    }),
  ],
}
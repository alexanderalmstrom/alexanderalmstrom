require('dotenv').config()

const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const RevPlugin = require('./lib/RevPlugin')

const env = process.env.NODE_ENV || 'development'
const isProduction = env == 'production'
const sourceMap = !isProduction

// css-loader resolves root-relative url() references as modules. Fonts and
// static assets are copied to the build root and referenced absolutely at
// runtime, so leave those URLs untouched.
const cssLoaderOptions = {
  sourceMap,
  url: {
    filter: (url) => !url.startsWith('/'),
  },
}

const config = {
  mode: isProduction ? 'production' : 'development',

  devtool: isProduction ? false : 'eval-cheap-module-source-map',

  entry: {
    app: './src/app.js',
    site: './src/site.js',
    fonts: './src/fonts.css',
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    clean: isProduction,
  },

  devServer: {
    static: {
      directory: path.resolve(__dirname, 'src'),
      watch: true,
    },
    host: '0.0.0.0',
    allowedHosts: 'all',
    port: 5000,
    hot: true,
    historyApiFallback: true,
  },

  optimization: {
    minimizer: ['...', new CssMinimizerPlugin()],
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          name: 'vendors',
        },
      },
    },
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: cssLoaderOptions,
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: cssLoaderOptions,
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap,
              sassOptions: {
                loadPaths: ['node_modules'],
              },
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              // SVGO drops viewBox when it matches the width/height, which
              // breaks scaling for icons sized in CSS.
              svgoConfig: {
                plugins: [
                  {
                    name: 'preset-default',
                    params: { overrides: { removeViewBox: false } },
                  },
                ],
              },
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      CONTENTFUL_SPACE_ID: '',
      CONTENTFUL_ACCESS_TOKEN: '',
      CONTENTFUL_PREVIEW_ACCESS_TOKEN: '',
      CONTENTFUL_PREVIEW: '',
      CONTENTFUL_ENVIRONMENT: '',
    }),
  ],
}

if (!isProduction) {
  config.plugins.push(new ReactRefreshWebpackPlugin())
}

if (isProduction) {
  config.output.filename = '[name].[contenthash].js'

  config.plugins.push(
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/index.html', to: '' },
        { from: './src/fonts', to: 'fonts' },
        { from: './src/static', to: '' },
        { from: './src/vendor', to: '' },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new WebpackManifestPlugin({
      basePath: '/',
      filter: function (file) {
        return file.isChunk
      },
    }),
    new RevPlugin({
      manifest: path.resolve(__dirname, 'build', 'manifest.json'),
      files: [
        path.resolve(__dirname, 'build', 'index.html'),
        path.resolve(__dirname, 'build', 'sw.js'),
      ],
    }),
  )
}

module.exports = config

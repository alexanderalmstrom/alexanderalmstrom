const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const Dotenv = require('dotenv-webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const RevPlugin = require('./lib/RevPlugin')

const env = process.env.NODE_ENV

const config = {
  mode: env,

  entry: {
    app: './src/app.js',
    site: './src/site.js',
    fonts: './src/fonts.css'
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/'
  },

  devServer: {
    contentBase: path.resolve(__dirname, 'src'),
    watchContentBase: true,
    host: '0.0.0.0',
    disableHostCheck: true,
    port: 5000,
    hot: true,
    historyApiFallback: true,
    before: function(app, server) {
      app.get('/*.css', function(req, res) {
        res.set('Content-Type', 'text/css')
        res.end()
      })
    }
  },

  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin(),
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: env == 'development' ? true : false
      })
    ],
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          name: 'vendors'
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
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: env == 'development' ? 'style-loader' : MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: env == 'development' ? true : false
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: env == 'development' ? 'style-loader' : MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: env == 'development' ? true : false
            }
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: ['node_modules'],
              sourceMap: env == 'development' ? true : false
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'react-svg-loader'
          }
        ]
      }
    ]
  },

  plugins: [
    new Dotenv()
  ]
}

if (env == 'development') {
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

if (env == 'production') {
  config.output.filename = '[name].[contenthash].js'

  config.plugins.push(
    new webpack.HashedModuleIdsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
      'process.env.CONTENTFUL_SPACE_ID': JSON.stringify(process.env.CONTENTFUL_SPACE_ID),
      'process.env.CONTENTFUL_ACCESS_TOKEN': JSON.stringify(process.env.CONTENTFUL_ACCESS_TOKEN),
      'process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN': JSON.stringify(process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN),
      'process.env.CONTENTFUL_PREVIEW': JSON.stringify(process.env.CONTENTFUL_PREVIEW),
      'process.env.CONTENTFUL_ENVIRONMENT': JSON.stringify(process.env.CONTENTFUL_ENVIRONMENT)
    }),
    new CleanWebpackPlugin('build'),
    new CopyWebpackPlugin([
      {
        from: './src/index.html',
        to: ''
      },
      {
        from: './src/fonts',
        to: 'fonts'
      },
      {
        from: './src/static',
        to: 'static'
      },
      {
        from: './src/vendor',
        to: ''
      }
    ]),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
    new ManifestPlugin({
      basePath: '/',
      filter: function (file) {
        return file.isChunk
      }
    }),
    new RevPlugin({
      manifest: path.resolve(__dirname, 'build', 'manifest.json'),
      files: [
        path.resolve(__dirname, 'build', 'index.html'),
        path.resolve(__dirname, 'build', 'sw.js')
      ]
    })
  )
}

module.exports = config

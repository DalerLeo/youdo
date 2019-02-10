const webpack = require('webpack')
const path = require('path')
const packageJSON = require('./package.json')
const _ = require('lodash')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const NODE_ENV = process.env.NODE_ENV || 'development'
const API_HOST = NODE_ENV !== 'development' || process.env.API_HOST ? process.env.API_HOST : 'apimyjob.wienerdeming.com'
// Package build for compilation
const developmentPackage = _.keys(packageJSON.dependencies)
const productionPackage = _.without(_.keys(packageJSON.dependencies), 'redux-logger')
const vendorPackages = NODE_ENV === 'development' ?  developmentPackage : productionPackage

let webpackConfig;
webpackConfig = {
  mode: NODE_ENV,
  devtool: NODE_ENV === 'development' ? 'cheap-module-source-map' : false,
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 3000
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx']
  },
  entry: {
    main: path.join(__dirname, 'src/index.js'),
    vendor: vendorPackages
  },

  output: {
    filename: '[hash]-[id].[name].js',
    path: path.join(__dirname, 'dist'),
    chunkFilename: '[hash]-[name]-[id].lang.js'
  },

  module: {
    rules: [
      {test: /\.(eot|woff|woff2|svg|png|ttf)([\?]?.*)$/, loader: 'file-loader'},
      {test: /\.js?$/, loader: 'babel-loader', include: path.join(__dirname, 'src')},
      {test: /\.css$/, loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader'})}
    ]
  },
  optimization: {
    splitChunks: {
      chunks: "async",
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(NODE_ENV),
        API_HOST: JSON.stringify(API_HOST)
      }
    }),
    new HtmlWebpackPlugin({
      title: packageJSON.name,
      template: path.join(__dirname, 'src/index.hbs'),
      favicon: './src/rhythm-logo.png',
    }),
    new ExtractTextPlugin({filename: 'css/[name].css', disable: false, allChunks: true})
  ]
};

if (NODE_ENV !== 'development') {
  webpackConfig.plugins.push(new SWPrecacheWebpackPlugin({
    // By default, a cache-busting query parameter is appended to requests
    // used to populate the caches, to ensure the responses are fresh.
    // If a URL is already hashed by Webpack, then there is no concern
    // about it being stale, and the cache-busting can be skipped.
    dontCacheBustUrlsMatching: /\.\w{8}\./,
    filename: 'service-worker.js',
    logger(message) {
      if (message.indexOf('Total precache size is') === 0) {
        // This message occurs for every build and is a bit too noisy.
        return;
      }
      console.log(message);
    },
    minify: true, // minify and uglify the script
    navigateFallback: '/index.html',
    staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
  }))
  webpackConfig.plugins.push(new CopyWebpackPlugin([{ from: 'src/pwa' },]))
  webpackConfig.plugins.push(new ManifestPlugin({fileName: 'asset-manifest.json'}))
  webpackConfig.plugins.push(new webpack.NoEmitOnErrorsPlugin())
}
else {
  webpackConfig.plugins.push(new webpack.NamedModulesPlugin())
}

module.exports = webpackConfig

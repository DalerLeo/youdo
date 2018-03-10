const webpack = require('webpack')
const path = require('path')
const packageJSON = require('./package.json')
const _ = require('lodash')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const NODE_ENV = process.env.NODE_ENV || 'development'
const API_HOST = NODE_ENV !== 'development' || process.env.API_HOST ? process.env.API_HOST : 'apitest2.wienerdeming.com'

// Package build for compilation
const developmentPackage = _.keys(packageJSON.dependencies)
const productionPackage = _.without(_.keys(packageJSON.dependencies), 'redux-logger')
const vendorPackages = NODE_ENV === 'development' ?  developmentPackage : productionPackage

let webpackConfig = {
    devtool: NODE_ENV === 'development' ? 'cheap-module-source-map' : false,
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 3000
    },
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
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
        loaders: [
            { test: /\.css$/, loader: "style-loader!css-loader" },
            { test: /\.(eot|woff|woff2|svg|png|ttf)([\?]?.*)$/, loader: 'file-loader' },
            { test: /\.js?$/, loader: 'babel-loader', include: path.join(__dirname, 'src')}
        ]
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            minChunks: 3,
            name: 'vendor', // Specify the common bundle's name.
        }),
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
        })
    ]
}

if (NODE_ENV !== 'development') {
    webpackConfig.plugins.push(new webpack.NoEmitOnErrorsPlugin())
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
            unsafe: true
        }
    }))
}

module.exports = webpackConfig

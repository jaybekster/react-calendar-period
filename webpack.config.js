var path = require('path'),
    webpack = require('webpack'),
    BowerWebpackPlugin = require('bower-webpack-plugin');

module.exports = {
    entry: './src/index.es6',
    output: {
        filename: './build/bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.es6$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    presets: [
                        'babel-preset-es2015',
                        'babel-preset-react'
                    ],
                    plugins: [
                        'babel-plugin-external-helpers-2',
                        'babel-plugin-transform-runtime'
                    ]
                }
            }, {
                test: /\.styl$/,
                loader: 'style!css!stylus'
            }
        ]
    },
    plugins: [
        new BowerWebpackPlugin({
            modulesDirectories: ['bower_components'],
            manifestFiles: ['bower.json', '.bower.json'],
            includes: /.*/
        })
    ],
    resolve: {
        root: [
            path.join(__dirname, './src')
        ]
    }
}

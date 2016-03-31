var path = require('path'),
    webpack = require('webpack');

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
                        'es2015',
                        'react'
                    ],
                    plugins: [
                        'external-helpers-2',
                        'transform-class-properties',
                        'transform-decorators-legacy',
                        'transform-runtime'
                    ]
                }
            }, {
                test: /\.styl$/,
                loader: 'style!css!stylus'
            }
        ]
    },
    resolve: {
        root: [
            path.join(__dirname, './node_modules'),
            path.join(__dirname, './src')
        ],
        extensions: ['', '.js', '.es6']
    }
}

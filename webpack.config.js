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
                        'babel-preset-es2015',
                        'babel-preset-react'
                    ],
                    plugins: [
                        'babel-plugin-external-helpers-2',
                        'babel-plugin-transform-runtime',
                        'transform-class-properties'
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
            path.join(__dirname, './src')
        ]
    }
}

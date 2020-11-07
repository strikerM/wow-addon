const { merge } = require('webpack-merge');
const common = require('./webpack.config.common');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(common, {
    mode: 'development',

    devtool: 'inline-source-map',

    plugins: [
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    ],
});
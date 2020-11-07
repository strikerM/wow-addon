const { merge } = require('webpack-merge');
const common = require('./webpack.config.common');
const { DefinePlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',

    devtool: 'source-map',

    plugins: [
        new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),

        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    ],
});
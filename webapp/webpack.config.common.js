const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './src/index.tsx',

    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'build'),
    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },

    module: {
        rules: [
            { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
            //{ test: /\.css$/, use: ['style-loader', 'css-loader'], include: /node_modules/ },
            { test: /\.css$/i, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new MiniCssExtractPlugin(),
    ],

};
const webpack = require("webpack");
const path = require("path");

let config = {
    entry: "./src/search.js",
    output: {
        path: path.resolve(__dirname, "./script"),
        filename: "./search.js"
    },
    optimization: {
        minimize: true
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader"
        }]
    }
}

module.exports = config;
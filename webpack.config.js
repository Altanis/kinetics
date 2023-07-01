const webpack = require("webpack");
const path = require("path");
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: {
        ["kinetics"]: path.join(__dirname, "src", "Index.ts"),
        ["kinetics.min"]: path.join(__dirname, "src", "Index.ts"),
    },
    output: {
        filename: "[name].js", 
        path: path.join(__dirname, "build"),
    },
    module: {
        rules: [{
            test: /\.ts$/,
            use: "ts-loader"
        }]
    },
    resolve: {
        extensions: [".ts"],
        alias: {
            "src": path.resolve(__dirname, "src")
        },
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                include: /\.min\.js$/
            }),
        ],
    },
    mode: "production",
};

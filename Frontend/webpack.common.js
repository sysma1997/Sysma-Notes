const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

// Use this plugin to push backend code to servers like apache or nginx
// const CopyPlugin = require("copy-webpack-plugin")

module.exports = {
    entry: {
        index: "./src/pages/index.tsx",
        "./register/index": "./src/pages/register/index.tsx",
        "./recoverPassword/index": "./src/pages/recoverPassword/index.tsx", 
        "./updateEmail/index": "./src/pages/updateEmail/index.tsx", 

        "./dashboard/index": "./src/pages/dashboard/index.tsx", 
        "./dashboard/profile/index": "./src/pages/dashboard/profile/index.tsx"
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Login",
            filename: "index.html",
            template: "./src/pages/index.html",
            chunks: ["index"]
        }),
        new HtmlWebpackPlugin({
            title: "Register",
            filename: "register/index.html",
            template: "./src/pages/index.html",
            chunks: ["./register/index"]
        }),
        new HtmlWebpackPlugin({
            title: "RecoverPassword",
            filename: "recoverPassword/index.html",
            template: "./src/pages/index.html",
            chunks: ["./recoverPassword/index"]
        }),
        new HtmlWebpackPlugin({
            title: "UpdateEmail",
            filename: "updateEmail/index.html",
            template: "./src/pages/index.html",
            chunks: ["./updateEmail/index"]
        }),

        new HtmlWebpackPlugin({
            title: "Dashboard",
            filename: "dashboard/index.html",
            template: "./src/pages/index.html",
            chunks: ["./dashboard/index"]
        }),
        new HtmlWebpackPlugin({
            title: "Dashboard",
            filename: "dashboard/profile/index.html",
            template: "./src/pages/index.html",
            chunks: ["./dashboard/profile/index"]
        }),

        new MiniCssExtractPlugin()
    ],
    output: {
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, "../wwwroot"),
        clean: true
    },
    optimization: {
        moduleIds: "deterministic",
        runtimeChunk: "single",
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all"
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react']
                    }
                }
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: "css-loader" },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|jpeg|svg|gif)$/i,
                type: "asset/resource"
            },
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: ['*', '.ts', '.tsx', '.js', '.jsx']
    }
}
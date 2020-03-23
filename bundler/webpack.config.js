const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    devtool: 'source-map',
    devServer: {
        contentBase: './dist',
        open: 'Firefox',
        host: '0.0.0.0',
        useLocalIp: true
    },
    entry: path.resolve(__dirname, '../src/script/main.js'),
    output: {
        filename: 'bundle.[hash].js',
        path: path.resolve(__dirname,'../dist')
    },
    plugins: [
        new CopyWebpackPlugin([ { from: './static', to: 'static' } ]),
        new MiniCssExtractPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/index.html')
        })
    ],
    module: {
        rules: [
            {
                test: /\.html$/,
                use: ['html-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.styl$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'stylus-loader']
            },
            {
                test: /\.(jpg|svg|png|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'images/'
                        }
                    }
                ]
            },
            {
                test: /\.(mp3|ogg|wav)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'audios/'
                        }
                    }
                ]
            },
            {
                test: /\.(otf|woff2|woff)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'fonts/'
                        }
                    }
                ]
            }
        ]
    }
}

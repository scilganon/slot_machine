const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/app.js',
    devtool: 'inline-source-map',
    mode: 'development',
    devServer: {
        contentBase: './dist',
        hot: true,
        port: 4200
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template:'dist/index.html', // relative to project root
            filename:'index.html'         // relative to build folder
        })
    ],
};
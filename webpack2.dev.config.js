const webpack = require('webpack');
const path = require('path');

const config = {
    devtool: 'eval',
    context: __dirname,
    entry: './src/index.tsx',
    output: {
        path: path.join(__dirname, 'dist/'),
        filename: 'bundle.js',
        publicPath: 'dist/'
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            exclude: /node_modules/,
            include: /src/,
            use: ['react-hot-loader', 'ts-loader']
        }]
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    target: 'web',
    stats: 'errors-only',
    devServer: {
        contentBase: __dirname,
        compress: true,
        port: 3000,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        stats: 'errors-only',
    }
};

module.exports = config;

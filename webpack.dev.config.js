var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'eval',
    entry: [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        './src/index.tsx'
    ],
    output: {
        path: path.join(__dirname, 'dist/'),
        filename: 'bundle.js',
        publicPath: 'dist/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loaders: ['react-hot', 'ts'],
                exclude: path.resolve(__dirname, 'node_modules'),
                include: path.join(__dirname, 'src/')
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.ts', '.tsx']
    },
    devServer: {
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }
};
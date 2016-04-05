var webpack = require('webpack');

var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: __dirname,
    stats: {
        hash: true,
        version: true,
        timings: true,
        assets: false,
        chunks: false,
        modules: false,
        reasons: false,
        children: false,
        source: false,
        publicPath: false,
        colors: true,
        errors: true,
        errorDetails: true,
        warnings: true,
    },
    entry: {
      'demo': [
          './src/main.jsx'
      ]
    },
    output: {
        path: __dirname + '/build',
        filename: 'demo.js',
        publicPath: '/'
    },
    devtool: '#inline-source-map',
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015'],
                    plugins: ['transform-runtime']
                }
            },
            {
                test: /\.scss$/,
                loaders: ['style', 'css?sourceMap&modules', 'sass?sourceMap']
            },
            {
                test: /\.(png|jpe?g|gif|svg)/,
                loaders: ['url']
            }
        ]
    },
    devServer: {
        hot: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'AGDG Path Finding Workshop',
            template: './src/html/base.html',
            favicon: './src/images/agdg.ico'
        })
    ]
};
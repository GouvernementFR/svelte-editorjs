const path = require('path');

module.exports = {
    mode: 'development',
    entry: './public/main.js',
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        client: {
            overlay: {
                errors: true,
                warnings: false,
            }
        },
        hot: true,
        compress: true,
        port: 9000,
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }
}

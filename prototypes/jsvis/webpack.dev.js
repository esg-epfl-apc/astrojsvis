const path = require('path');

module.exports = {
    mode: 'development',
    entry: './main.js',
    output: {
        filename: 'astrovis.js',
        globalObject: 'this',
        library: {
            name: 'Astrovis',
            type: 'umd',
        },
        path: path.resolve(__dirname, 'dist', 'astrovis'),
    },
    devtool: 'inline-source-map',
    watch: true,
    watchOptions: {
        aggregateTimeout: 800,
        ignored: ['dist/**', '_vendors/**', '_test_files/**', '_old/**'],
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
        ],
    },
};
module.exports = {
    mode: 'development',
    entry: {
        index: './client/pages/index.js',
        home: './client/pages/home.js',
        signin: './client/pages/signin.js',
        signup: './client/pages/signup.js',
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/public/js',
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
};

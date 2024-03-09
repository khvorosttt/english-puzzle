const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, '.src/app/index.ts'),
    module: {
      rules: [
        {
            test: /\.css$/,
            use: [ 'style-loader', 'css-loader' ]
        },
        {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
        },
        {
            test: /\.(mp3|ogg)$/,
            loader: 'file-loader',
        },
        {
            test: /\.ts$/i,
            use: 'ts-loader',
        },
      ]
    },
    resolve: {
        extensions: ['.ts'],
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index_bundle.ts'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin()
    ]
  }
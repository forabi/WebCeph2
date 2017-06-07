var path = require('path');

module.exports = {
  entry: {
    bundle: ['./index.ts'],
  },
  context: path.resolve(__dirname),
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'temp'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'typings-for-css-modules-loader',
            options: {
              namedExport: true,
              module: true,
              localIdentName: '[name]_[local]_[hash:base64:5]',
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            module: 'es2015'
          }
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    modules: [
      path.join(__dirname, 'src'),
      'node_modules',
    ],
  },
};

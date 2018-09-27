const path = require('path');

module.exports = {
  entry: {
    app: [
      './client/index.js'
    ]
  },
  output: {
    path: __dirname + "dist",
    publicPath: '/',
    filename: 'bundle.js'
  },
  devtool: 'inline-source-map',
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['env', 'stage-0']
        }
      }
    }]
  },
};
module.exports = {
  entry:  './index.js',
  output: {
    path:     './build',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test:   /\.js/,
        loaders: ['babel-loader']
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  }
};

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
        loaders: ['babel']
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      }
    ]
  }
};
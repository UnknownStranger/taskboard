const withImages = require('next-images');

module.exports = withImages({
  webpack: (config, { webpack }) => {
    config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//))
    return config
  }
})
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: './',
  devServer: {
    port: 2333
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('./src'))
      .set('assets', resolve('./src/assets'))
      .set('components', resolve('./src/components'))
      .set('layout', resolve('./src/layout'))
      .set('base', resolve('./src/base'))
      .set('static', resolve('./src/static'))
      .set('plugins', resolve('./src/plugins'))
      .set('router', resolve('./src/router'))
      .set('views', resolve('./src/views'))
  },
}

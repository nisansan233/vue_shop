const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: './',
  devServer: {
    port: 2333, //端口号
    open: true
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('./src'))
      .set('utils', resolve('./src/utils'))
      .set('assets', resolve('./src/assets'))
      .set('components', resolve('./src/components'))
      .set('layout', resolve('./src/layout'))
      .set('base', resolve('./src/base'))
      .set('static', resolve('./src/static'))
      .set('plugins', resolve('./src/plugins'))
      .set('router', resolve('./src/router'))
      .set('views', resolve('./src/views'))
    config.when(process.env.NODE_ENV === 'production', cofnig => {
      // 根据当前是什么模式 来判断使用那个 入口文件
      config.entry('app').clear().add('./src/main-prod.js')

      //  打包时排除指定包 手动添加 CDN
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })
      // 在 public下的 index.html 中可以通过 以下命令拿到当前设置的值
      // <%= htmlWebpackPlugin.options.isProd ? '' : 'dev-'%>
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })
    // 开发模式
    config.when(process.env.NODE_ENV === 'development', cofnig => {
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
      config.entry('app').clear().add('./src/main-dev.js')
    })
  },
  configureWebpack: {
    // 关闭 webpack 的性能提示
    // performance: {
    //   hints:false
    // }

    // //或者

    // 警告 webpack 的性能提示
    performance: {
      hints: 'warning',
      // 入口起点的最大体积
      maxEntrypointSize: 50000000,
      // 生成文件的最大体积
      maxAssetSize: 30000000,
      // 只给出 js 文件的性能提示
      assetFilter: function (assetFilename) {
        return assetFilename.endsWith('.js')
      }
    }
  }

}

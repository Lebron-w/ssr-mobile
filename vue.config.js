const clientConfig = require('./vue.config.client')
const serverConfig = require('./vue.config.server')
const lessToJs = require('less-vars-to-js')
const fs = require('fs')
const paletteLess = fs.readFileSync('./src/styles/variables.less', 'utf8')
const globalVars = lessToJs(paletteLess, { resolveVariables: true, stripPrefix: true })
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  outputDir: 'server/public',
  assetsDir: 'assets',
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  configureWebpack: process.env.TARGET_ENV === 'server' ? serverConfig : clientConfig,

  // chainWebpack: config => {
  // const lessRule = config.module.rule('less')
  // console.log(lessRule)
  // },
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('url-loader')
      .tap(options => Object.assign(options, { limit: 1024 * 10 })) // limit 单位：B；1024B = 1KB
  },
  css: {
    requireModuleExtension: true,
    sourceMap: isProd,
    extract: isProd ? (process.env.TARGET_ENV !== 'server') : false,
    loaderOptions: {
      less: {
        globalVars,
        modules: false,
        javascriptEnabled: true
      }
    }
  },
  pwa: {
    name: 'PatPat',
    themeColor: '#ff2556',
    appleMobileWebAppStatusBarStyle: 'black-translucent',
    manifestPath: 'assets/manifest.json',
    manifestOptions: {
      start_url: '/?utm_source=direct&utm_medium=pwa',
      display: 'standalone',
      background_color: '#ffffff'
    },
    workboxOptions: {
      swDest: 'patpat-ssr-m-sw.js',
      skipWaiting: true,
      clientsClaim: true,
      include: [
        /js\/main.[0-9A-Za-z]{8,8}.js$/,
        /js\/vendor.[0-9A-Za-z]{8,8}.js$/,
        /css\/main.[0-9A-Za-z]{8,8}.css$/
      ],
      cacheId: 'patpat-sw-cache'
    }
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
}

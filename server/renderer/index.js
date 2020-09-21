/*
 * @Author: 尹锋
 * @Date: 2020-07-17 17:49:32
 * ----------
 * 创建服务端渲染
 * 渲染Vue组件
 * 处理页面Redis缓存
 * ----------
 * @Last Modified by: 尹锋
 * @Last Modified time: 2020-09-09 20:15:56
 */
const path = require('path')
const AsyncLock = require('async-lock')
const resolve = file => path.resolve(__dirname, file)
const templatePath = resolve('../../src/template/index.template.html')
const fs = require('fs')
const template = fs.readFileSync(templatePath, 'utf-8')
const { createBundleRenderer } = require('vue-server-renderer')
const redisCache = require('../tools/cache/redisCache')
const md5 = require('blueimp-md5')
const cachePages = require('../configs/cachePages')
const isDev = process.env.NODE_ENV === 'development'
const disablePageCache = process.env.DISABLE_PAGE_CACHE === 'true'
const v = process.env.npm_package_version

const lock = new AsyncLock()

let devReadyPromise
let vueRenderer
module.exports.render = (req, res) => {
  const startDate = Date.now()
  res.setHeader('Content-Type', 'text/html')
  const siteInfo = res.patpatWebInfo
  siteInfo.langCode = req.params.lang || 'en'
  const context = {
    url: req.url,
    siteInfo,
    abTestStr: req.abTestStr,
    ip: req.customersIp
  }

  const isCacheAble = req => {
    let cachePage = cachePages.find(cp => (req.path.indexOf(cp.path) >= 0 && cp.path !== '/') || cp.path === req.path ||
    cp.path + siteInfo.langCode === req.path || `${cp.path}${siteInfo.langCode}/` === req.path)

    if (cachePage) {
      const newCachePage = Object.assign({}, cachePage)
      const s = siteInfo.siteAbb
      const cou = siteInfo.countryCode.toLowerCase()
      const l = siteInfo.langCode
      const cur = siteInfo.currencyCode.toLowerCase()
      const p = md5(req.originalUrl + '#' + req.abTestStr)
      newCachePage.cacheKey = `v:${v}:s:${s}:c:${cou}:l:${l}:c:${cur}:${cachePage.cacheKey}:p:${p}`
      cachePage = newCachePage
    }
    return cachePage
  }
  const cacheAble = isCacheAble(req)
  if (cacheAble) { // 允许缓存的页面 getCache ? cache : renderToString
    redisCache.getRedisCacheData(cacheAble.cacheKey).then(redisRes => {
      if (redisRes) {
        res.send(redisRes.body)
        if (redisRes.updateTime && (Date.now() - redisRes.updateTime > 20000) && !lock.isBusy()) {
          lock.acquire(cacheAble.cacheKey, function (done) {
            RenderToRedis(req, res, context, cacheAble, startDate, false, done)
          }, function (err, ret) {
            console.log(err, ret)
          })
        }
        if (isDev) {
          console.log(`\n\x1b[42;30mREDIS\x1b[0;32m Vue html fro redis cache in \x1b[0;33m${Date.now() - startDate}ms\x1b[0m`)
        }
      } else {
        RenderToRedis(req, res, context, cacheAble, startDate, true)
      }
    }).catch(error => {
      return handleError(error, req, res)
    })
  } else { // 不允许缓存的页面直接 renderToString
    vueRenderer.renderToString(context, (err, html) => {
      if (err) {
        return handleError(err, req, res)
      }
      res.send(html)
      if (isDev) {
        console.log(`\n\x1b[43;30mRENDER\x1b[0;32m Vue html fro renderToString in \x1b[0;33m${Date.now() - startDate}ms\x1b[0m`)
      }
    })
  }
}

module.exports.createBundleRenderer = (app) => {
  const createRenderer = (bundle, options) => {
    return createBundleRenderer(bundle, Object.assign(options, {
      runInNewContext: false
    }))
  }
  if (isDev) {
    const setupDev = require('../setup-dev')
    devReadyPromise = setupDev(app, templatePath, (bundle, options) => {
      vueRenderer = createRenderer(bundle, options)
    })
  } else {
    const serverBundle = require('../public/vue-ssr-server-bundle.json')
    const clientManifest = require('../public/vue-ssr-client-manifest.json')
    vueRenderer = createRenderer(serverBundle, { template, clientManifest })
  }
}

module.exports.getDevReadyPromise = () => {
  return devReadyPromise
}

const handleError = (err, req, res) => {
  if (err.url) {
    res.redirect(err.url)
  } else if (err.code === 404) {
    res.status(404).sendFile(resolve('./error.html'))
  } else {
    // Render Error Page or Redirect
    if (isDev) {
      res.status(500).send(err.stack)
    } else {
      // res.status(500).send("500 | Internal Server Error")
      res.status(500).sendFile(resolve('./error.html'))
    }
    console.error(`error during render : ${req.url}`)
    console.error(err.stack)
  }
}

/**
 * @description Render 和 存redis 函数封装
 * @param {*} req 请求 req
 * @param {*} res 请求 res
 * @param {*} context context
 * @param {*} cacheAble 允许缓存的页面信息
 * @param {*} startDate 开始时间
 * @param {*} needSend 是否需要 Send Html
 */
const RenderToRedis = (req, res, context, cacheAble, startDate, needSend = true, done = null) => {
  context.pck = `${process.env.REDIS_PREFIX}:${cacheAble.cacheKey}` // 注入page cache key 方便页面排查问题或精准清除cache key
  vueRenderer.renderToString(context, (err, html) => {
    if (err) {
      return handleError(err, req, res)
    }
    if (needSend) res.send(html)

    // 计算缓存过期时间，避免缓存过期时间大于内容排期结束时间
    let expire = cacheAble.expire
    if (context.pageContentEndAt) {
      const endTimestamp = Date.parse(`${context.pageContentEndAt} GMT`)
      const laveTimes = parseInt((endTimestamp - Date.now()) / 1000)
      if (laveTimes <= 0) {
        expire = 0
      } else if (laveTimes < expire) {
        expire = laveTimes
      }
    }
    if (!disablePageCache) {
      redisCache.addRedisCacheData(cacheAble.cacheKey, html, expire, 'string').then(success => {
        console.log(success, 'add redis cache success')
        done && done('async lock release', cacheAble.cacheKey)
      })
    }
    if (isDev) {
      console.log(`\n\x1b[43;30mRENDER\x1b[0;32m Vue html fro ${needSend ? '' : 'Re'} renderToString in \x1b[0;33m${Date.now() - startDate}ms\x1b[0m`)
    }
  })
}

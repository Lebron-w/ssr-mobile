/*
 * @Author: 尹锋
 * @Date: 2020-07-17 17:30:22
 * ----------
 * web 中间件，处理路由跳转及服务端渲染之前的业务逻辑
 * ----------
 * @Last Modified by: 尹锋
 * @Last Modified time: 2020-09-10 15:33:26
 */
const webInfoServer = require('../api/servers/webInfoServer')
const url = require('url')
const URL = url.URL

module.exports = (req, res, next) => {
  const startDate = Date.now()
  const promiseWebInfo = webInfoServer.getWebInfo(req)
  const promiseAdLink = webInfoServer.getAdLink(req)
  Promise.all([promiseWebInfo, promiseAdLink]).then(result => {
    const webInfo = result[0]
    const adLink = result[1]
    res.patpatWebInfo = webInfo
    let redirectUrl = req.fullUrl
    // console.log('redirectUrl', req.fullUrl, req.headers, req.ips)

    // adLink重定向URL更新
    if (adLink) {
      const rootDomain = '.' + req.websiteDomain.split('.').slice(-2).join('.')
      res.cookie('adlk_id', adLink.id, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), httpOnly: false, domain: rootDomain })
      res.cookie('new_adlk_id', adLink.id, { expires: new Date(Date.now() + 1000 * 60), httpOnly: false, domain: rootDomain })
      redirectUrl = reassembleAdLink(redirectUrl, adLink.link, req, res)
    }

    // 站点重定向URL更新
    const isRootSite = /^m\./.test(req.websiteDomain)
    if (isRootSite) {
      redirectUrl = redirectUrl.replace(/m\./, `${res.patpatWebInfo.siteAbb}-m.`)
    }

    // 语言重定向URL更新
    const redirectURL = new URL(redirectUrl)
    if (!/^\/[a-z]{2,2}\/|^\/[a-z]{2,2}$/.test(redirectURL.pathname) && webInfo.currentLang !== 'en') {
      redirectURL.pathname = redirectURL.pathname === '/' ? `/${webInfo.currentLang}` : `/${webInfo.currentLang}${redirectURL.pathname}`
      redirectUrl = url.format(redirectURL)
    }

    // 设备重定向URL更新
    if (!req.isMobile) {
      redirectUrl = redirectUrl.replace(/-m/, '')
    }

    // 最终redirectUrl 跟当前url不一致就执行URL重定向
    if (redirectUrl !== req.fullUrl) {
      console.log('重定向', redirectUrl)
      res.redirect(redirectUrl.replace(/^http:|https:/, ''))
      return false
    }
    console.log(`\n\x1b[45;30m Middlewares \x1b[0;32m web中间件执行完成 in \x1b[33m${Date.now() - startDate}ms \n\x1b[32mUrl: \x1b[4m${req.url}\x1b[0m`)
    next()
  }).catch(error => {
    console.error('webMiddleware.getWebInfo', error)
    next(error)
  })
}

/**
 * 处理组装AdLinkUrl
 * @param {*} req
 * @param {*} adLinkUrl
 */
const reassembleAdLink = (currentUrl, adLinkUrl, req, res) => {
  const currentURL = new URL(currentUrl)
  const adLinkURL = new URL(adLinkUrl)
  currentURL.searchParams.delete('adlk_id')
  if (/^\/[a-z]{2,2}\/$|^\/[a-z]{2,2}$|\//.test(currentURL.pathname)) {
    currentURL.pathname = adLinkURL.pathname
  }
  adLinkURL.searchParams.forEach((value, name, searchParams) => {
    currentURL.searchParams.set(name, value)
  })

  const websiteDomainSplit = req.websiteDomain.split(/-m\.|-m_[a-z]{1,5}[0-9]\./)
  if (websiteDomainSplit.length <= 1) {
    const countriesMap = res.patpatWebInfo.countriesMap
    let countryCode = currentURL.searchParams.get('country_code')
    if (countryCode) {
      countryCode = countryCode.toUpperCase()
      const currentCountry = countriesMap.find(country => country.country_abbreviation === countryCode)
      const countryLang = currentCountry ? currentCountry.site_language.substr(0, 2) : 'en'
      res.patpatWebInfo.currentLang = req.cookies.langCode || countryLang
      res.patpatWebInfo.siteAbb = currentCountry ? currentCountry.site_abb : 'us'
    }
  }
  return url.format(currentURL)
}

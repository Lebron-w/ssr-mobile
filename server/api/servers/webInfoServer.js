const serverAPI = require('../serverApi')
const redisCache = require('../../tools/cache/redisCache')
const { AD_LINK_ID, EXPIRE_ONE_DAY, API_DATA_COUNTRIES_MAP, API_DATA_IP_USER_COUNTRY } = require('../../tools/cache/constants')
const seoAdlinkMap = require('../../configs/seoAdlinkMap')

module.exports.getWebInfo = async (req) => {
  try {
    const ppAPI = serverAPI.createPPAPI(req)
    // 获取用户IP对应国家码
    const uimRedisKey = `${API_DATA_IP_USER_COUNTRY}${req.customersIp}`
    const redisUserIpMapCountry = await redisCache.getRedisCacheData(uimRedisKey)
    const getUserIpMapCountry = new Promise((resolve, reject) => {
      if (redisUserIpMapCountry) {
        resolve(redisUserIpMapCountry)
      } else {
        ppAPI({ url: '/v2/common/get_ip_user_country' }).then(data => {
          redisCache.addRedisCacheData(uimRedisKey, data, EXPIRE_ONE_DAY)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      }
    })

    // 获取国家映射列表
    const redisCountriesMap = await redisCache.getRedisCacheData(API_DATA_COUNTRIES_MAP)
    const getCountriesMap = new Promise((resolve, reject) => {
      if (redisCountriesMap) {
        resolve(redisCountriesMap)
      } else {
        ppAPI({ url: '/v2/common/get_country_base_info' }).then(data => {
          redisCache.addRedisCacheData(API_DATA_COUNTRIES_MAP, data, EXPIRE_ONE_DAY)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      }
    })

    const data = await Promise.all([getUserIpMapCountry, getCountriesMap])
    const userIpMapCountry = data[0]
    const countriesMap = data[1]

    const siteInfo = {}
    siteInfo.countryCode = (req.query.country_code || req.cookies.countryCode || userIpMapCountry.iso_code || 'US').toUpperCase()
    let currentCountry = countriesMap.find(country => country.country_abbreviation === siteInfo.countryCode)
    if (!currentCountry) {
      siteInfo.countryCode = 'US'
      currentCountry = countriesMap.find(country => country.country_abbreviation === siteInfo.countryCode)
    }
    siteInfo.currencyCode = (req.query.currency || req.cookies.currencyCode || currentCountry ? currentCountry.iso_code : 'USD').toUpperCase()
    siteInfo.countriesMap = countriesMap
    const countryLang = currentCountry ? currentCountry.site_language.substr(0, 2) : 'en'
    siteInfo.currentLang = (!/^\/[a-z]{2,2}\/|^\/[a-z]{2,2}$/.test(req.path) && req.cookies.langCode) ? req.cookies.langCode : countryLang
    const websiteDomainSplit = req.websiteDomain.split(/-m\.|-m_[a-z]{1,5}[0-9]\./)
    siteInfo.siteAbb = websiteDomainSplit.length > 1 ? websiteDomainSplit[0] : (currentCountry ? currentCountry.site_abb : 'us')
    return siteInfo
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports.getAdLink = async (req) => {
  try {
    let adLinkId = req.query.adlk_id
    const referer = req.get('referer')
    if (referer && !adLinkId) {
      const seoAdlinkKey = Object.keys(seoAdlinkMap).find(element => referer.indexOf(element) >= 0)
      const newAdlkId = req.cookies.new_adlk_id
      if (seoAdlinkKey) {
        const seoAdlinkId = seoAdlinkMap[seoAdlinkKey]
        if (seoAdlinkId && !newAdlkId) {
          adLinkId = seoAdlinkId
        }
      }
    }
    if (!adLinkId || adLinkId.length <= 0) return null
    let adLink
    const redisAdLink = await redisCache.getRedisCacheData(`${AD_LINK_ID}${adLinkId}`, true)
    if (redisAdLink) {
      adLink = redisAdLink
    } else {
      const ppAPI = serverAPI.createPPAPI(req)
      const resData = await ppAPI({ url: `/v1/common/adlink/${adLinkId}` })
      if (resData.adlink && resData.adlink.link.length > 0) {
        adLink = resData.adlink
        redisCache.addRedisCacheData(`${AD_LINK_ID}${adLinkId}`, adLink, EXPIRE_ONE_DAY, 'json', true)
      }
    }
    return adLink
  } catch (error) {
    return Promise.reject(error)
  }
}

import md5 from 'blueimp-md5'
import { getCookie } from '../../utils/cookie'

/**
 * 获取 Criteo 广告跟踪平台对应国家AccountId
 * @siteAbb 站点信息
 */
export const getCriteoTagsAccountId = (siteAbb) => {
  const code = getCookie('countryCode')
  const countryAccountId = {
    AU: 38591,
    NZ: 38592,
    CA: 38593,
    FR: 38594,
    GB: 38595,
    ES: 38596,
    US: 38134,
    SE: 38594,
    NL: 38594,
    BE: 38594,
    GR: 38594,
    CH: 38594,
    IE: 38594,
    IL: 38594,
    BR: 38134,
    IN: 38591,
    IT: 45314,
    MX: 45315,
    DE: 45316,
    AE: 45317,
    RU: 45412
  }
  return countryAccountId[code] || 38134
}

/**
 * 获取MD5加密用户邮箱
 * @email 用户邮箱
 */
export const getUserMd5Email = () => {
  let md5Email = ''
  if (window.localStorage.getItem('userInfo')) {
    md5Email = JSON.parse(window.localStorage.getItem('userInfo')).email
    md5Email = md5(md5Email)
  }
  return md5Email
}

/**
 * 网站当前站点 site_abb
 * @param {*} state
 * @param {*} getters
 */
export const seoPatPatTdk = (siteAbb) => {
  const patpatTdk = {
    us: 'Patpat US',
    uk: 'Patpat UK',
    au: 'Patpat AU',
    es: 'Patpat ES',
    mx: 'Patpat MX',
    fr: 'Patpat FR',
    br: 'Patpat BR',
    de: 'Patpat DE',
    hk: 'Patpat HK',
    ar: 'بات بات'
  }
  return patpatTdk[siteAbb] || 'Patpat.com'
}

/**
 * 本地时间转 TUC 时间戳，返回的是一个毫秒时间戳
 * @param {*} time 时间
 */
export const uctTime = (time) => {
  const times = time.replace(/[-]/g, '/')
  const endY = new Date(times).getFullYear() // 年
  const endM = new Date(times).getMonth() // 月
  const endD = new Date(times).getDate() // 日
  const endH = new Date(times).getHours() // 小时
  const endMM = new Date(times).getMinutes() // 分钟
  const endS = new Date(times).getSeconds() // 秒钟
  return Date.UTC(endY, endM, endD, endH, endMM, endS)
}

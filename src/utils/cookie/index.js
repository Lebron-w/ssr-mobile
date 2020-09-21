import { getRootDomain } from '../base'

/**
 * 添加cookie
 * @param {String} name
 * @param {String} value
 * @param {Number} day 默认30天
 * @param {String} domain 默认子域名
 * @param {String} path 默认根目录
 */
export const setCookie = (name, value, day = 30, domain, path = '/') => {
  const exp = new Date()
  exp.addDays(day)
  domain = domain || window.location.hostname
  document.cookie = `${name}=${escape(
    value
  )};domain=${domain};expires=${exp.toUTCString()};path=${path}`
}

/**
 *  获取cookie
 * @param {String} name
 */
export const getCookie = name => {
  var arr
  var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  if ((arr = document.cookie.match(reg))) {
    return decodeURIComponent(arr[2])
  } else {
    return ''
  }
}

/**
 * 添加根域名cookie
 * @param {String} name
 * @param {String} value
 * @param {Number} day 默认30天
 * @param {String} path 默认根目录
 */
export const setRootDomainCookie = (name, value, day = 30, path = '/') => {
  const rootDomain = getRootDomain()
  setCookie(name, value, day, rootDomain, path)
}

/**
 * 删除根域名cookie
 * @param {String} name
 * @param {String} path 默认根目录
 */
export const delRootDomainCookie = (name, path = '/') => {
  const rootDomain = getRootDomain()
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=${path};domain=${rootDomain}`
}

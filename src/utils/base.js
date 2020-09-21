/**
 * 获取根电机域名
 */
export const getRootDomain = () => {
  if (window.location.hostname === 'localhost') return 'localhost'
  return '.' + window.location.hostname.split('.').slice(-2).join('.')
}

/**
 * 检查字符串是否是JSON
 * @param {*} str
 */
export const checkIsJSON = str => {
  if (typeof str === 'string') {
    try {
      var obj = JSON.parse(str)
      if (typeof obj === 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }
  return false
}

/**
 * 转CDN url
 * @param {*} url
 * @param {*} size
 */
export const cdnUrl = function (url, size = '') {
  const imaCndUrl = 'img.ppwebstatic.com'
  const protocol = 'https://'
  try {
    if (url.search('http://') !== -1) {
      url = url.replace('http://', protocol)
    }
    if (size.length > 0) {
      url = url + '/' + size
    }

    const cdnMaps = [
      { original: 'www.patpat.com', cdn: imaCndUrl },
      { original: 'patpatasset.s3.amazonaws.com', cdn: imaCndUrl },
      { original: 'patpatdev.img.patpat.com', cdn: imaCndUrl },
      { original: 'patpatdev.s3.amazonaws.com', cdn: imaCndUrl },
      { original: 'patpatdev.s3-us-west-1.amazonaws.com', cdn: imaCndUrl },
      { original: 'patpatdev.s3.us-west-1.amazonaws.com', cdn: imaCndUrl },
      { original: 's3-us-west-1.amazonaws.com', cdn: imaCndUrl },
      { original: 'patpatwebstatic.s3-us-west-2.amazonaws.com', cdn: imaCndUrl },
      { original: 'patpatwebstatic.s3.us-west-2.amazonaws.com', cdn: imaCndUrl }
    ]

    cdnMaps.forEach(function (cdnMap) {
      if (url.search(cdnMap.original) !== -1) {
        url = url.replace(cdnMap.original, cdnMap.cdn)
      }
    })
  } catch (e) {
    console.log(e)
  }
  return url
}

/* 获取url中的参数 */
export const getQueryString = (name, searchTarget) => {
  name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]')
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
  var results = regex.exec(searchTarget || location.search)
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

/**
 * 获取平台信息
 */
export const getPlatformInfo = () => {
  const u = navigator.userAgent
  const app = navigator.appVersion
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 // android
  const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios
  return {
    isIos: isiOS,
    isAndroid: isAndroid,
    appVersion: app
  }
}

export function langUrl () {

}

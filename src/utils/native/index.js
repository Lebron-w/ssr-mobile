/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// import { langUrl } from './toolFilter'
import { getPlatformInfo } from '@/utils/base'
import store from '@/store'
export const nativeFilter = function (originUrl, nativeUrl, hostEnv) {
  // originUrl = langUrl(originUrl)
  if (!hostEnv) {
    hostEnv = getPlatformInfo()
  }
  if (typeof hostEnv !== 'object') {
    return originUrl
  }
  if (hostEnv.isIos) { // ios
    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.jsCallback && typeof window.webkit.messageHandlers.jsCallback.postMessage === 'function') {
      return `javascript:window.webkit.messageHandlers.jsCallback.postMessage(${nativeUrl})`
    } else {
      return typeof jsCallback !== 'function' ? originUrl : `javascript:jsCallback(${nativeUrl})`
    }
  } else {
    if (typeof PatPat === 'undefined') {
      return originUrl
    } else {
      if (typeof PatPat.jsCallback !== 'function') {
        return originUrl
      } else {
        return `javascript:PatPat.jsCallback(${nativeUrl})`
      }
    }
  }
}

// 往app交互的回调事件
/**
 * 目前支持的三种回调方法
 * 签到方法名 checkIn
   分享方法名 share
   登陆方法名 login
 * @param typeObj  {'method' : 'share', content : {'title' : 'xxxx', imageUrl : 'xxxx'}
 * @param hostEnv
 * @param callback
 */
export const nativeCallBack = function (typeObj, hostEnv, callback) {
  window.nativeCallback = callback // app原生回调方法
  typeObj = JSON.stringify(typeObj)
  if (hostEnv.isIos) {
    window.webkit.messageHandlers.jsCallWithCallback.postMessage(typeObj)
  } else {
    PatPat.jsCallWithCallback(typeObj)
  }
}
// 判断app是否为已经登录状态
export const nativeIsLoginApp = () => {
  const u = navigator.userAgent
  const app = navigator.appVersion
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 // android
  const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios
  const hostEnv = {
    isIos: isiOS,
    isAndroid: isAndroid,
    appVersion: app
  }
  let pin = null
  let token = null
  let userId = null
  if (hostEnv.isIos) {
    pin = window.PatPat ? window.PatPat.PIN : sessionStorage.getItem('iosPin')
    token = window.PatPat ? window.PatPat.USER_TOKEN : sessionStorage.getItem('iosToken')
    userId = window.PatPat ? window.PatPat.USER_ID : sessionStorage.getItem('iosUserId')
  }
  if (hostEnv.isAndroid && window.PatPat) {
    pin = PatPat.PIN()
    token = PatPat.USER_TOKEN()
    userId = PatPat.USER_ID()
  }
  if (
    token !== 'guest' &&
    token !== '' &&
    token !== undefined &&
    token !== null
  ) {
    // 已经登陆
    store.dispatch('setUserInfo', { user_id: userId })
    store.dispatch('setTokenInfo', token)
    store.dispatch('setUserId', userId)
    return true
  } else {
    return false// 未登录
  }
}

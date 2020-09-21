import axios from 'axios'
import qs from 'qs'
import { setLocalStore, delLocalStore, getLocalStore } from '@/utils/storage'
import { delRootDomainCookie } from '@/utils/cookie'

export const createPatPatAPI = (state) => {
  window.patpatApi = axios.create({
    baseURL: '/api', // 客户端请求需要跨域代理，设置代理路径前缀，将在node代理 /api前缀路径
    headers: {
      accept: '*/*',
      'content-type': 'application/x-www-form-urlencoded'
    },
    timeout: 15000,
    withCredentials: false
  })
  window.patpatApi.interceptors.request.use(config => {
    config.headers.abb = state.langCode === 'zh' ? 'zh-tw' : state.langCode
    config.headers['patpat-platform'] = 'wap'
    config.headers['site-abb'] = state.siteAbb
    config.headers.token = state.userInfo.token || getLocalStore('token') || 'guest'
    if (config.method.toLocaleLowerCase() === 'post' || config.method.toLocaleLowerCase() === 'put' || config.method.toLocaleLowerCase() === 'delete') {
      config.data = qs.stringify(config.data)
    }
    return config
  })

  window.patpatApi.interceptors.response.use(response => {
    let data
    // IE9时response.data是undefined，因此需要使用response.request.responseText(Stringify后的字符串)
    if (response.data === undefined) {
      data = JSON.parse(response.request.responseText)
    } else {
      data = response.data
    }

    switch (data.code || data.status) {
    case 200:
      return data.data || data.content
    case 403:
      var email = state.userInfo.email
      state.loginStatus = false // 登录状态改为 false
      state.userInfo = {} // 清空 vuex 里的用户信息
      setLocalStore('loginStatus', false) // 更新 set 登录状态
      delLocalStore('userInfo') // 删除 set 用户信息
      delLocalStore('token')
      delRootDomainCookie('token')
      window.location.href = email ? `/account/login?email=${email}` : '/account/register'
      break
    default:
      var resError = new Error(data.msg || data.message)
      resError.code = data.code || data.status
      return Promise.reject(resError)
    }
  }, error => {
    if (error && error.response) {
      switch (error.response.status) {
      case 400:
        error.message = 'Bad Request'
        break
      case 403:
        error.message = 'Forbidden'
        break
      case 404:
        error.message = 'Not Found'
        break
      case 500:
        error.message = 'Internal Server Error'
        break
      default:
        error.message = `Connection error ${error.status}`
      }
    } else {
      if (error.message.indexOf('timeout') !== -1) {
        error = { status: 503, message: 'The network connection is temporarily unavailable. Please refresh the page and try again.' }
      } else if (error.message.indexOf('canceled') !== -1) {
        error.status = 400
      }
    }
    return Promise.reject(error)
  })
  return window.patpatApi
}

export const createTrackAPI = () => {
  window.trackApi = axios.create({
    baseURL: '/trackApi', // 服务端请求不需要跨域代理，直接请求api域名
    headers: {
      accept: '*/*',
      'content-type': 'application/x-www-form-urlencoded'
    },
    timeout: 65000,
    withCredentials: false
  })
  window.trackApi.interceptors.request.use(
    config => {
      if (config.method.toLocaleLowerCase() === 'post' || config.method.toLocaleLowerCase() === 'put' || config.method.toLocaleLowerCase() === 'delete') {
        config.data = qs.stringify(config.data)
      }
      return config
    }
  )
  return window.trackApi
}

export const patpatAPI = () => {
  return window.patpatApi
}

export const trackAPI = () => {
  return window.trackApi
}

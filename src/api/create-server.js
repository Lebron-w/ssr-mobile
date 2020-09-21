import axios from 'axios'
import qs from 'qs'

export const createPatPatAPI = (state) => {
  // console.log('创建PatPatAPI', store)
  const patpatApi = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL, // 服务端请求不需要跨域代理，直接请求api域名
    headers: {},
    timeout: 15000,
    withCredentials: false
  })
  patpatApi.interceptors.request.use(config => {
    // console.log(`请求 ${config.url} API`, store.state.langCode)
    config.headers.abb = state.langCode === 'zh' ? 'zh-tw' : state.langCode
    config.headers['patpat-platform'] = 'wap'
    config.headers['site-abb'] = state.siteAbb
    config.headers['customers-ip'] = state.userIp || ''
    config.headers.token = state.userInfo.token || 'guest'
    if (config.method.toLocaleLowerCase() === 'post' || config.method.toLocaleLowerCase() === 'put' || config.method.toLocaleLowerCase() === 'delete') {
      config.data = qs.stringify(config.data)
    }
    return config
  })

  patpatApi.interceptors.response.use(response => {
    const data = response.data
    switch (data.code || data.status) {
    case 200:
      return data.data || data.content
    case 403:
      // store.dispatch('signOut')
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
  return patpatApi
}

// export const patpatAPI = () => {
//   return global.patpatApi
// }

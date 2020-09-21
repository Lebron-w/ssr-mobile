const axios = require('axios')
const patpatApiConfig = require('./configs/patpatApi')

module.exports.createPPAPI = (req) => {
  const patpatApi = axios.create(patpatApiConfig)
  patpatApi.interceptors.request.use(config => {
    config.headers['x-forwarded-for'] = req.customersIp
    config.headers['customers-ip'] = req.customersIp
    return config
  })
  patpatApi.interceptors.response.use(response => {
    const data = response.data
    if (data.code === 200 || data.status === 200) {
      return data.data || data.content
    } else {
      const resError = new Error(data.msg)
      resError.code = data.code
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

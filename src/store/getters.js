/*
 * @Author: 尹锋
 * @Date: 2020-07-15 20:13:19
 * ----------
 * Vuex 根级别 getters https://vuex.vuejs.org/zh/guide/getters.html
 * ----------
 * @Last Modified by: 尹锋
 * @Last Modified time: 2020-09-11 11:27:24
 */
import createPatPaApi from '../api'

export default {
  /**
   * patpat axios Api 接口集
   */
  patpatAPI: (state) => {
    return createPatPaApi(state)
  },
  /**
   * 国家列表
   */
  countries: (state) => state.countriesMap,
  /**
   * 货币列表
   * @param {*} state
   */
  currencies (state) {
    const currencies = []
    state.countriesMap.map(item => {
      currencies[item.iso_code] = {
        isoCode: item.iso_code,
        stuExchangeRate: item.self_to_usd_exchange_rate,
        utsExchangeRate: item.usd_to_self_exchange_rate,
        symbolDisplay: item.symbol_display
      }
    })
    return Object.values(currencies)
  },
  /**
   * 语言列表
   */
  langs (state) {
    return state.langs
  },
  /**
   * 当前国家
   * @param {*} state
   */
  currentCountry (state) {
    // let country
    // if (state.countriesMap.length > 0) {
    //   country = state.countriesMap.find(country => country.country_abbreviation === state.countryCode)
    // }
    return state.countriesMap.find(country => country.country_abbreviation === state.countryCode)
  },
  /**
   * 当前货币
   * @param {*} state
   * @param {*} getters
   */
  currentCurrency (state, getters) {
    let currency = {
      isoCode: 'USD',
      stuExchangeRate: '1',
      utsExchangeRate: '1',
      symbolDisplay: '$'
    }
    if (getters.currencies.length > 0) {
      currency = getters.currencies.find(country => country.isoCode === state.currencyCode)
    }
    return currency
  },
  /**
   * 当前语言
   * @param {*} state
   * @param {*} getters
   */
  currentLang (state, getters) {
    return getters.langs.find(lang => lang.abbreviation === state.langCode)
  },
  /**
   * 当前国家站点标识符
   * @param {*} state
   * @param {*} getters
   */
  currentSite (state, getters) {
    return getters.currentCountry.site_abb
  },
  /**
   * 当前满减金额
   * @param {*} state
   * @param {*} getters
   */
  freeShippingPrice (state, getters) {
    return getters.currentCountry.free_shipping_tips
  },

  /**
  * 获取对应实验ID的ABTest实验分配变体
  * @param {*} state
  *
  * @param {string} eid 实验ID，来源于 src/config/abExperiments 配置里面的实验对象.A.id
  * @param {string} experiment 实验变体，来源于调用 getABTestExperiment 时的第二个参数，不在实验范围内才会生效。
  */
  getABTestExperiment: (state) => (eid, experiment = 'X') => {
    const abTestArr = state.abTestStr.split(',')
    const abTest = abTestArr.find(item => item.split('.')[0] === eid)
    let abTestVariation = experiment
    if (abTest) {
      abTestVariation = abTest.split('.')[1]
    }
    return abTestVariation
  },
  /**
  * 获取所有ABTest 实验及实验分配变体
  * @param {*} state
  *
  * @param {Boole} isObj 返回的JSON是字符串形式还是对象形式
  * @returns {string | array}
  */
  getABTestExperiments: (state) => (isObj = true) => {
    const abTestArr = state.abTestStr ? state.abTestStr.split(',') : []
    if (isObj) {
      const experiments = abTestArr.map(item => {
        const abTestSplit = item.split('.')
        if (abTestSplit.length >= 2) {
          return {
            experiment_id: abTestSplit[0],
            variation_id: abTestSplit[1]
          }
        }
      })
      return JSON.stringify(experiments)
    } else {
      return JSON.stringify(abTestArr)
    }
  },
  /**
   * 获取拼接好ABTest参数的当前url
   * @param {*} state
   */
  getABTestParamsUrl (state) {
    const abTestParams = state.abTestStr.replace(/\./g, '=').replace(/,/g, '&')
    const abTestParamsUrl = window.location.origin + state.route.fullPath
    const joiner = window.location.search ? '&' : '?'
    return `${abTestParamsUrl}${joiner}${abTestParams}`
  },

  /**
   * 获取lastURL
   * @param {*} state
   */
  lastUrl (state) {
    if (state.route.from.fullPath === '/' && state.route.from.name === null) {
      return document.referrer.length > 0 ? document.referrer : ''
    } else {
      return window.location.origin + state.route.from.fullPath
    }
  },
  /**
   * 侧边导航红点引导状态
   * @param {*} state
   */
  cateGuide: state => {
    const judge = state.cateGuide.split('_')
    if (!state.loginStatus && (judge[1] === '1' || (judge[1] === '0' && Date.now() - judge[0] > 7 * 24 * 60 * 60 * 1000))) {
      return true
    }
    return false
  }
}

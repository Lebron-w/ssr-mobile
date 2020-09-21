/*
 * @Author: 尹锋
 * @Date: 2020-07-15 20:16:11
 * ----------
 * Vuex 根级别 mutation https://vuex.vuejs.org/zh/guide/mutations.html
 * ----------
 * @Last Modified by: 尹锋
 * @Last Modified time: 2020-09-11 11:28:30
 */
import * as types from './mutation-types'

export default {
  [types.INIT_COUNTRIES_MAP] (state, data) {
    state.countriesMap = data
  },
  [types.INIT_ABTEST_STR] (state, data) {
    state.abTestStr = data
  },
  [types.INIT_NAV_CATEGORIES] (state, navCategories) {
    state.navCategories = navCategories
  },
  [types.INIT_USER_INFO] (state, userLoginInfo) {
    state.loginStatus = userLoginInfo.status
    state.userInfo = userLoginInfo
    state.topCartProNum = ''
  },
  [types.SHOW_SIDER_BAR] (state) {
    state.showSiderBar = true
  },
  [types.HIDE_SIDER_BAR] (state) {
    state.showSiderBar = false
  },
  [types.CHANGE_COUNTRY_CODE] (state, countryCode) {
    state.countryCode = countryCode
  },
  [types.CHANGE_CURRENCY_CODE] (state, currencyCode) {
    state.currencyCode = currencyCode
  },
  [types.CHANGE_LANG_CODE] (state, langCode) {
    const findLang = state.langs.find(lang => lang.abbreviation === langCode) || state.langs[0]
    state.langCode = findLang.abbreviation
  },
  [types.CHANGE_SITE_ABB] (state, siteAbb) {
    state.siteAbb = siteAbb
  },
  [types.CHANGE_USER_IP] (state, ip) {
    state.userIp = ip
  },
  [types.INIT_TOP_ACTIVITY] (state, data) {
    state.topActivity = data
  },
  [types.CHANGE_TOP_ICON] (state, type) {
    state.topIconType = type
  },
  [types.CHANGE_TOP_FREE] (state, type) {
    state.showFreeTips = type
  },
  [types.NAVIGATION_INFO] (state, data) {
    state.navInfo = data
  },
  [types.CHANGE_HEADER_ANIMATE] (state, type) {
    state.headerAnimate = type
  },
  [types.CHANGE_HEADER_STATE] (state, type) {
    state.showHeader = type
  },
  [types.CHANGE_FOOTER_STATE] (state, type) {
    state.showFooter = type
  },
  [types.CHANGE_ACTIVITY_STATE] (state, type) {
    state.showActivity = type
  },
  [types.SET_FAV_PRODUCT] (state, product) {
    state.collectFavProduct = product
  },
  [types.SET_USER_FAVORITES] (state, products) {
    state.userFavorites = products
  },
  [types.CHANGE_TOP_USER_COUNT] (state, data) {
    state.topCartProNum = data
  },
  [types.SET_PCK] (state, pck) {
    state.pck = pck
  },
  [types.SET_CATE_GUIDE] (state, res) {
    state.cateGuide = res
  }
}

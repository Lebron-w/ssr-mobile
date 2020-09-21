/*
 * @Author: 尹锋
 * @Date: 2020-07-15 20:12:06
 * ----------
 * Vuex 跟级别 actions https://vuex.vuejs.org/zh/guide/actions.html
 * ----------
 * @Last Modified by: 尹锋
 * @Last Modified time: 2020-09-11 11:26:15
 */
import * as types from './mutation-types'
import { loadLanguageAsync } from '@/i18n.js'
import { setL10nCurrency } from '@/l10n.js'
import { setRootDomainCookie, delRootDomainCookie } from '@/utils/cookie'
import { setLocalStore, delLocalStore, delSessionStorage } from '@/utils/storage'

import Vue from 'vue'

export default {
  async getCountriesMap ({ commit, getters }) {
    try {
      const data = await getters.patpatAPI.getCountriesMap()
      commit(types.INIT_COUNTRIES_MAP, data)
    } catch (error) {
      console.log('getCountriesMap error:', error)
    }
  },

  async getNavigation ({ commit, getters }) {
    try {
      const data = await getters.patpatAPI.getNavigation()
      commit(types.INIT_NAV_CATEGORIES, data)
    } catch (error) {
      console.log('getNavigation error:', error)
    }
  },

  async getTopConfigActivity ({ commit, getters }) {
    try {
      const data = await getters.patpatAPI.faceIndexTop()
      commit(types.INIT_TOP_ACTIVITY, data[0].floor)
    } catch (error) {
      console.log('top activity error:', error)
    }
  },

  async getRenderingAllData ({ dispatch, state }, appVM) {
    if (appVM.$ssrContext) {
      const dspNavigation = dispatch('getNavigation')
      const dspTopConfigActivity = dispatch('getTopConfigActivity')
      const allPromise = [dspNavigation, dspTopConfigActivity]
      const pageStoreModule = state.route.meta.storeModule
      if (pageStoreModule) {
        const storeModuleImport = () => import(`./modules/${pageStoreModule}`)
        const storeModule = await storeModuleImport()
        appVM.$store.registerModule(pageStoreModule, storeModule.default)
        const dspPageData = dispatch(`${pageStoreModule}/getPageData`)
        allPromise.push(dspPageData)
      }
      await Promise.all(allPromise)
    }
  },

  changeCountry ({ commit }, countryCode) {
    commit(types.CHANGE_COUNTRY_CODE, countryCode)
    if (!Vue.prototype.$isServer) {
      setRootDomainCookie('countryCode', countryCode)
    }
  },
  changeCurrency ({ commit, getters }, currencyCode) {
    commit(types.CHANGE_CURRENCY_CODE, currencyCode)
    setL10nCurrency(getters.currentCurrency)
    if (!Vue.prototype.$isServer) {
      setRootDomainCookie('currencyCode', currencyCode)
    }
  },
  changeLang ({ commit, dispatch, state }, langCode) {
    commit(types.CHANGE_LANG_CODE, langCode)
    loadLanguageAsync(state.langCode).then(lang => console.log(`success loadLanguageAsync: ${lang}`))
    if (!Vue.prototype.$isServer) {
      dispatch('getNavigation').then()
      setRootDomainCookie('langCode', state.langCode)
    }
  },
  // 登录成功 储存用户信息，（登录，注册，加购）
  setUserInfo ({ commit, dispatch }, data) {
    commit(types.INIT_USER_INFO, data)

    // 登录状态
    setLocalStore('userInfo', data)
    setLocalStore('userId', data.user_id)
    setLocalStore('token', data.token)
    setLocalStore('loginStatus', data.status)
    setRootDomainCookie('token', data.token)
    dispatch('getUserNavigation')
    delSessionStorage('cartData')
  },
  // 退出登录删除全部用户相关信息
  signOut ({ commit }) {
    const data = {
      status: false
    }
    delLocalStore('loginStatus')
    delLocalStore('userInfo')
    delLocalStore('token')
    delLocalStore('userId')
    delSessionStorage('cartData')
    delRootDomainCookie('token')
    commit(types.SET_USER_FAVORITES, [])
    commit(types.INIT_USER_INFO, data)
  },
  getUserNavigation ({ commit, getters }) {
    getters.patpatAPI.userNavigation().then(data => {
      commit(types.CHANGE_TOP_USER_COUNT, data.cartItemsCount)
      commit(types.NAVIGATION_INFO, data)
    }).catch(err => {
      console.log('error func=getUserNavigation api=userNavigation', err)
    })
  },
  setCateGuide ({ commit }, res) {
    localStorage.setItem('cateGuide', res)
    commit(types.SET_CATE_GUIDE, res)
  },
  // 通过邮箱的方式注册
  async registerByEmail ({ getters, dispatch }, params) {
    try {
      const data = await getters.patpatAPI.emailRegister(params)
      data.status = true
      dispatch('setUserInfo', data)
      return data
    } catch (error) {
      console.log('registerByEmail error:', error)
      return Promise.reject(error)
    }
  }
}
